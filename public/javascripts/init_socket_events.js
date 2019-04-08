'use strict';

function init_socket_events(socket) {
	return socket
		.on('broadcast', message => console.log(message))
		.on('client_exists', message => {
			if (!message.exists) socket.emit('add_client', {client: message.client});
			socket.emit('new_player');
			socket.myPero = message.client;
		})
		.on('map_exists', message => {
			let perso = message.perso;
			let map;
			if (message.exists) {
				map = message.map;

				document.querySelector('main').setAttribute('map', JSON.stringify(map));

				let affichage_perso = create_perso(map, perso);
				map = affichage_perso.map;
				helper_set_current_position(affichage_perso.position);

				socket.emit('update_position', affichage_perso.position);

				drow_map(socket, map, perso);
			} else {
				map = create_map(Globals.NB_ROWS, Globals.NB_COLS);

				map = create_murs(map, Globals.NB_MURS);
				socket.emit('init_map', {map: map});

				document.querySelector('main').setAttribute('map', JSON.stringify(map));

				let affichage_perso = create_perso(map, perso);
				map = affichage_perso.map;
				helper_set_current_position(affichage_perso.position);

				socket.emit('update_position', affichage_perso.position);

				drow_map(socket, map, perso);
			}

			let position = helper_get_current_position();
			let response = create_commands();

			response.top_button.addEventListener('click', () => {
				let response = mouvement_up(socket, map, perso, position, 0);
				position = response.position;
				helper_set_current_position(position);
				map = response.map;
			});

			response.left_button.addEventListener('click', () => {
				let response = mouvement_left(socket, map, perso, position, 0);
				position = response.position;
				helper_set_current_position(position);
				map = response.map;
			});

			response.right_button.addEventListener('click', () => {
				let response = mouvement_right(socket, map, perso, position, Globals.NB_COLS);
				position = response.position;
				helper_set_current_position(position);
				map = response.map;
			});

			response.bottom_button.addEventListener('click', () => {
				let response = mouvement_down(socket, map, perso, position, Globals.NB_ROWS);
				position = response.position;
				helper_set_current_position(position);
				map = response.map;
			});

			perso.marker = `P_${perso.id}_${current_direction}_${current_action}_${current_marche_step}_${perso.pseudo}`;

			socket.emit('new_player', {
				perso: perso,
				position: position
			});

			document.onkeydown = e => {
				e = (e) ? e : ((event) ? event : null);

				const KEY_DOWN = 40,
					KEY_UP = 38,
					KEY_LEFT = 37,
					KEY_RIGHT = 39;

				if (e.keyCode === KEY_LEFT || e.key === 'g' || e.key === 'G') {
					let response = mouvement_left(socket, map, perso, position, 0);
					position = response.position;
					helper_set_current_position(position);
					map = response.map;
				} else if (e.keyCode === KEY_RIGHT || e.key === 'd' || e.key === 'D') {
					let response = mouvement_right(socket, map, perso, position, Globals.NB_COLS);
					position = response.position;
					helper_set_current_position(position);
					map = response.map;
				} else if (e.keyCode === KEY_UP || e.key === 'h' || e.key === 'H') {
					let response = mouvement_up(socket, map, perso, position, 0);
					position = response.position;
					helper_set_current_position(position);
					map = response.map;
				} else if (e.keyCode === KEY_DOWN || e.key === 'b' || e.key === 'B') {
					let response = mouvement_down(socket, map, perso, position, Globals.NB_ROWS);
					position = response.position;
					helper_set_current_position(position);
					map = response.map;
				}
			};
		})
		.on('new_player', message => {
			if(message !== null) {
				console.log('new player', message);
				let map = helper_get_map();
				let new_player_position = message.position;
				let new_player_perso = message.perso;

				map[new_player_position.i][new_player_position.j] = new_player_perso.marker;

				console.log(map);

				drow_map(socket, map, perso);

				let position = helper_get_current_position();
				let response = create_commands();

				response.top_button.addEventListener('click', () => {
					let response = mouvement_up(socket, map, perso, position, 0);
					position = response.position;
					helper_set_current_position(position);
					map = response.map;
				});

				response.left_button.addEventListener('click', () => {
					let response = mouvement_left(socket, map, perso, position, 0);
					position = response.position;
					helper_set_current_position(position);
					map = response.map;
				});

				response.right_button.addEventListener('click', () => {
					let response = mouvement_right(socket, map, perso, position, Globals.NB_COLS);
					position = response.position;
					helper_set_current_position(position);
					map = response.map;
				});

				response.bottom_button.addEventListener('click', () => {
					let response = mouvement_down(socket, map, perso, position, Globals.NB_ROWS);
					position = response.position;
					helper_set_current_position(position);
					map = response.map;
				});
			}
		})
		.on('perso_positions_updated', persos => {
			let map = helper_get_map();

			console.log('perso_positions_updated', persos);

			let _perso = {};

			for(let i in persos) {
				let perso = persos[i];
				if(perso.position === helper_get_current_position()) {
					_perso = perso;
				}
				map[perso.position.i][perso.position.j] = perso.perso.marker;
			}

			drow_map(socket, map, persos);

		});
}