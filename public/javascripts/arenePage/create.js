'use strict';

// i = lignes
// j = colonnes

let helpers = {
	random: (max) => Math.floor(Math.random() * Math.floor(max)) + 1
};

let mouvement = {
	left: (socket, map, perso, current_position, min_position) => {
		let i = current_position.i;
		let j = current_position.j;

		let next_j = j - 1;

		let response = mouvement.perso(map, {i: i, j: j}, {i: i, j: next_j}, next_j >= min_position, perso);

		return {map: response.map, position: response.position};
	},
	right: (socket, map, perso, current_position, max_position) => {
		let i = current_position.i;
		let j = current_position.j;

		let next_j = j + 1;

		let response = mouvement.perso(map, {i: i, j: j}, {i: i, j: next_j}, next_j <= max_position, perso);

		return {map: response.map, position: response.position};
	},
	up: (socket, map, perso, current_position, min_position) => {
		let i = current_position.i;
		let j = current_position.j;

		let next_i = i - 1;

		let response = mouvement.perso(map, {i: i, j: j}, {i: next_i, j: j}, next_i >= min_position, perso);

		return {map: response.map, position: response.position};
	},
	down: (socket, map, perso, current_position, max_position) => {
		let i = current_position.i;
		let j = current_position.j;

		let next_i = i + 1;

		let response = mouvement.perso(map, {i: i, j: j}, {i: next_i, j: j}, next_i <= max_position, perso);

		return {map: response.map, position: response.position};
	},
	perso: (socket, map, current, next, cond, perso) => {
		let valid_mouvement = false;
		console.log(next, current);
		if(cond && map[next.i][next.j] !== 'M') {
			map[current.i][current.j] = '.';
			map[next.i][next.j] = `P_${perso.id}_${perso.pseudo}`;
			valid_mouvement = true;
		}
		else {
			map[current.i][current.j] = `P_${perso.id}_${perso.pseudo}`;
			valid_mouvement = false;
		}
		drow_map(map);
		socket.emit('message', {
			type: 'broadcast',
			message: {
				position: (valid_mouvement ? next : current)
			}
		});
		return { map: map, position: (valid_mouvement ? next : current) };
	}
};

let create = {
	map: (max_rows, max_lines) => {
		let map = [];
		for(let i = 0; i < max_rows; i++) {
			let line = [];
			for(let j = 0; j < max_lines; j++) {
				line.push('.');
			}
			map.push(line);
		}
		return map;
	},
	murs: (map, nb_murs) => {
		for(let i = 0; i <= nb_murs; i++) {
			let index_i = helpers.random(8);
			let index_j = helpers.random(11);
			map[index_i][index_j] = 'M';
		}
		return map;
	},
	cel: (image = null, debug = false) => {
		let elem = document.createElement('arena');
		elem.style.width = '70px';
		elem.style.height = '70px';
		elem.style.backgroundSize = 'cover';
		elem.style.display = 'inline-block';
		if(debug) elem.style.border = '1px solid red';
		if(image !== null && typeof image === 'string') {
			elem.style.backgroundImage = `url('${image}')`;
		}
		return elem;
	},
	arena: () => {
		let arena = document.createElement('div');
		arena.style.width = '1000px';
		arena.style.height = '750px';
		arena.style.backgroundImage = "url('/images/fonds/fondarene.jpg')";
		arena.style.backgroundSize = 'cover';
		arena.style.display = 'inline-block';
		arena.style.border = '1px solid black';

		let map_container = document.createElement('div');
		map_container.style.display = 'block';
		map_container.style.border = '1px solid red';
		map_container.style.width = parseInt(arena.style.width.replace('px', '')) - (2 * 35) + 'px';
		map_container.style.height = parseInt(arena.style.height.replace('px', '')) - (2 * 25) + 'px';
		map_container.style.marginLeft = '35px';
		map_container.style.marginTop = '25px';

		return { arena, map_container};
	},
	perso: (map, perso) => {
		let index_i = helpers.random(8);
		let index_j = helpers.random(12);
		if(map[index_i][index_j] === 'M') {
			return create.perso(map, perso);
		}
		map[index_i][index_j] = `P_${perso.id}_${perso.pseudo}`;
		return { map: map, position: {i: index_i, j: index_j} };
	}
};

function create_arena() {
	let arena = document.createElement('div');
	arena.style.width = '1000px';
	arena.style.height = '750px';
	arena.style.backgroundImage = "url('/images/fonds/fondarene.jpg')";
	arena.style.backgroundSize = 'cover';
	arena.style.display = 'inline-block';
	arena.style.border = '1px solid black';

	let map_container = document.createElement('div');
	map_container.style.display = 'block';
	map_container.style.border = '1px solid red';
	map_container.style.width = parseInt(arena.style.width.replace('px', '')) - (2 * 35) + 'px';
	map_container.style.height = parseInt(arena.style.height.replace('px', '')) - (2 * 25) + 'px';
	map_container.style.marginLeft = '35px';
	map_container.style.marginTop = '25px';

	return { arena, map_container};
}

function drow_map(map) {
	let { arena, map_container } = create_arena();

	for(let i in map) {
		let line = map[i];
		for(let j in line) {
			let cel = line[j];
			switch (cel) {
				case 'M':
					map_container.append(create.cel('/images/murs/mur.gif'));
					break;
				case '.':
					map_container.append(create.cel());
					break;
				default:
					let perso_found = cel.match(/P_([0-9]+)_([a-zA-Z0-9\_\-\@\~\#\$\!\*]+)/);
					if(perso_found.length !== 0) {
						let perso_cel = create.cel(`/images/personnages/perso${perso_found[1]}marche1d1.gif`);
						let perso_pseudo = perso_found[2];
						perso_cel.setAttribute('title', perso_pseudo);

						let perso_pseudo_append = document.createElement('span');
						if(perso_pseudo.length >= 8) {
							perso_pseudo = perso_pseudo.substr(0, 8) + '...';
						}
						perso_pseudo_append.innerHTML = perso_pseudo;
						perso_pseudo_append.style.color = 'white';
						perso_pseudo_append.style.position = 'absolute';
						perso_pseudo_append.style.display = 'inline-block';
						perso_pseudo_append.style.marginLeft = '-30px';
						perso_pseudo_append.style.marginTop = '-10px';

						perso_cel.append(perso_pseudo_append);
						map_container.append(perso_cel);
					}
			}
		}
		map_container.append(document.createElement('br'));
	}

	arena.append(map_container);

	let main = document.querySelector('main');
	main.style.textAlign = 'center';

	main.innerHTML = '';

	main.append(arena);
}

function drow_arena(socket, perso) {
	let nb_murs = 5;
	let nb_rows = 9;
	let nb_cols = 12;

	let map = create.map(nb_rows, nb_cols);

	map = create.murs(map, nb_murs);
	let affichage_perso = create.perso(map, perso);
	map = affichage_perso.map;
	let position = affichage_perso.position;

	socket.emit('init_map', {
		map: map
	});

	drow_map(map);

	document.onkeypress = e => {
		e.preventDefault();

		const   KEY_DOWN = 40,
				KEY_UP = 38,
				KEY_LEFT = 37,
				KEY_RIGHT = 39;

		if(e.keyCode === KEY_LEFT || e.key === 'g' || e.key === 'G') {
			let response = mouvement.left(socket, map, perso, position, 0);
			position = response.position;
			map = response.map;
		}
		else if(e.keyCode === KEY_RIGHT || e.key === 'd' || e.key === 'D') {
			let response = mouvement.right(socket, map, perso, position, nb_cols);
			position = response.position;
			map = response.map;
		}
		else if(e.keyCode === KEY_UP || e.key === 'h' || e.key === 'H') {
			let response = mouvement.up(socket, map, perso, position, 0);
			position = response.position;
			map = response.map;
		}
		else if(e.keyCode === KEY_DOWN || e.key === 'b' || e.key === 'B') {
			let response = mouvement.down(socket, map, perso, position, nb_rows);
			position = response.position;
			map = response.map;
		}
	};
}