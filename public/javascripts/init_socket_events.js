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

				let affichage_perso = create_perso(map, perso);
				map = affichage_perso.map;
				document.querySelector('main')
					.setAttribute('myposition', JSON.stringify(affichage_perso.position));

				drow_map(map);
			} else {
				map = create_map(Globals.NB_ROWS, Globals.NB_COLS);

				map = create_murs(map, Globals.NB_MURS);
				let myMap = map;

				let affichage_perso = create_perso(map, perso);
				map = affichage_perso.map;
				document.querySelector('main')
					.setAttribute('myposition', JSON.stringify(affichage_perso.position));

				socket.emit('init_map', {map: myMap});

				drow_map(map);
			}

			let position = JSON.parse(document.querySelector('main').getAttribute('myposition'));
			let response = create_commands();

			response.top_button.addEventListener('click', () => {
				let response = mouvement_up(socket, map, perso, position, 0);
				position = response.position;
				map = response.map;
			});

			response.left_button.addEventListener('click', () => {
				let response = mouvement_left(socket, map, perso, position, 0);
				position = response.position;
				map = response.map;
			});

			response.right_button.addEventListener('click', () => {
				let response = mouvement_right(socket, map, perso, position, Globals.NB_COLS);
				position = response.position;
				map = response.map;
			});

			response.bottom_button.addEventListener('click', () => {
				let response = mouvement_down(socket, map, perso, position, Globals.NB_ROWS);
				position = response.position;
				map = response.map;
			});

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
					map = response.map;
				} else if (e.keyCode === KEY_RIGHT || e.key === 'd' || e.key === 'D') {
					let response = mouvement_right(socket, map, perso, position, Globals.NB_COLS);
					position = response.position;
					map = response.map;
				} else if (e.keyCode === KEY_UP || e.key === 'h' || e.key === 'H') {
					let response = mouvement_up(socket, map, perso, position, 0);
					position = response.position;
					map = response.map;
				} else if (e.keyCode === KEY_DOWN || e.key === 'b' || e.key === 'B') {
					let response = mouvement_down(socket, map, perso, position, Globals.NB_ROWS);
					position = response.position;
					map = response.map;
				}
			};
		})
		.on('new_player', message => {
			console.log('new player', message);
		});
}