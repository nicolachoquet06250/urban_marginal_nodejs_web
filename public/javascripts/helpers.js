const DROITE = 'd1';
const GAUCHE = 'd0';
const DEFAULT_DIRECTION = DROITE;

const NB_MARCHE_STEPS = 4;
const NB_TOUCHE_STEPS = 2;
const NB_MORT_STEPS = 2;

const MARCHE = 'marche';
const TOUCHE = 'touche';
const MORT = 'mort';
const DEFAULT_ACTION = MARCHE;

let current_marche_step = 1;
let current_action = DEFAULT_ACTION;
let current_direction = DEFAULT_DIRECTION;

function helper_random(max) {
	return Math.floor(Math.random() * Math.floor(max)) + 1;
}

function helper_increment_marche_step() {
	current_marche_step++;
	if (current_marche_step > NB_MARCHE_STEPS) {
		current_marche_step = 1;
	}
}

function helper_action_right() {
	current_direction = DROITE;
}

function helper_action_left() {
	current_direction = GAUCHE;
}

function helper_marche() {
	current_action = MARCHE;
}

function helper_touche() {
	current_action = TOUCHE;
}

function helper_mort() {
	current_action = MORT;
}

function helper_get_current_position() {
	return JSON.parse(document.querySelector('main').getAttribute('myposition'));
}

function helper_set_current_position(object) {
	document.querySelector('main').setAttribute('myposition', JSON.stringify(object));
}

function helper_get_map() {
	return JSON.parse(document.querySelector('main').getAttribute('map'));
}

function mouvement_left(socket, map, perso, current_position, min_position) {
	current_position = helper_get_current_position();
	let i = current_position.i;
	let j = current_position.j;

	let next_j = j - 1;

	helper_increment_marche_step();
	helper_action_left();

	perso.marker = `P_${perso.id}_${current_direction}_${current_action}_${current_marche_step}_${perso.pseudo}`;

	let response = mouvement_perso(socket, map, {i: i, j: j}, {i: i, j: next_j}, next_j >= min_position, perso);

	return {map: response.map, position: response.position};
}

function mouvement_right(socket, map, perso, current_position, max_position) {
	current_position = helper_get_current_position();
	let i = current_position.i;
	let j = current_position.j;

	let next_j = j + 1;

	helper_increment_marche_step();
	helper_action_right();

	perso.marker = `P_${perso.id}_${current_direction}_${current_action}_${current_marche_step}_${perso.pseudo}`;

	let response = mouvement_perso(socket, map, {i: i, j: j}, {i: i, j: next_j}, next_j <= max_position, perso);

	return {map: response.map, position: response.position};
}

function mouvement_up(socket, map, perso, current_position, min_position) {
	current_position = helper_get_current_position();
	let i = current_position.i;
	let j = current_position.j;

	let next_i = i - 1;

	helper_increment_marche_step();

	perso.marker = `P_${perso.id}_${current_direction}_${current_action}_${current_marche_step}_${perso.pseudo}`;

	let response = mouvement_perso(socket, map, {i: i, j: j}, {i: next_i, j: j}, next_i >= min_position, perso);

	return {map: response.map, position: response.position};
}

function mouvement_down(socket, map, perso, current_position, max_position) {
	current_position = helper_get_current_position();
	let i = current_position.i;
	let j = current_position.j;

	let next_i = i + 1;

	helper_increment_marche_step();

	perso.marker = `P_${perso.id}_${current_direction}_${current_action}_${current_marche_step}_${perso.pseudo}`;

	let response = mouvement_perso(socket, map, {i: i, j: j}, {i: next_i, j: j}, next_i <= max_position, perso);

	return {map: response.map, position: response.position};
}

function mouvement_perso(socket, map, current, next, cond, perso) {
	let valid_mouvement = false;
	if (cond && map[next.i][next.j] === '.') {
		map[current.i][current.j] = '.';
		map[next.i][next.j] = perso.marker;
		valid_mouvement = true;
	} else {
		map[current.i][current.j] = perso.marker;
		valid_mouvement = false;
	}
	drow_map(socket, map, perso);

	socket.emit('new_player', {
		perso: perso,
		position: position
	});
	socket.emit('perso_position_updated', {
		perso: perso,
		position: position
	});
	socket.emit('message', {
		type: 'broadcast',
		message: {
			position: (valid_mouvement ? next : current)
		}
	});
	return {map: map, position: (valid_mouvement ? next : current)};
}

function create_map(max_rows, max_lines) {
	let map = [];
	for (let i = 0; i < max_rows; i++) {
		let line = [];
		for (let j = 0; j < max_lines; j++) {
			line.push('.');
		}
		map.push(line);
	}
	return map;
}

function create_murs(map, nb_murs) {
	for (let i = 0; i <= nb_murs; i++) {
		let index_i = helper_random(8);
		let index_j = helper_random(11);
		map[index_i][index_j] = 'M';
	}
	return map;
}

function create_cel(image = null, debug = false) {
	let elem = document.createElement('div');
	elem.style.width = '70px';
	elem.style.height = '70px';
	elem.style.backgroundSize = 'cover';
	elem.style.display = 'inline-block';
	if (debug) elem.style.border = '1px solid red';
	if (image !== null && typeof image === 'string') {
		elem.style.backgroundImage = `url('${image}')`;
	}
	return elem;
}

function create_arena(debug = false) {
	let arena = document.createElement('div');
	arena.style.width = '1000px';
	arena.style.height = '750px';
	arena.style.backgroundImage = "url('/images/fonds/fondarene.jpg')";
	arena.style.backgroundSize = 'cover';
	arena.style.display = 'inline-block';
	arena.style.border = '1px solid black';

	let map_container = document.createElement('div');
	map_container.style.display = 'block';
	if (debug) map_container.style.border = '1px solid red';
	map_container.style.width = parseInt(arena.style.width.replace('px', '')) - (2 * 35) + 'px';
	map_container.style.height = parseInt(arena.style.height.replace('px', '')) - (2 * 25) + 'px';
	map_container.style.marginLeft = '35px';
	map_container.style.marginTop = '25px';

	return {arena, map_container};
}

function create_perso(map, perso) {
	let index_i = helper_random(8);
	let index_j = helper_random(12);
	if (map[index_i][index_j] === 'M') {
		return create_perso(map, perso);
	}
	map[index_i][index_j] = `P_${perso.id}_${current_direction}_${current_action}_${current_marche_step}_${perso.pseudo}`;
	return {map: map, position: {i: index_i, j: index_j}};
}

function create_commands() {
	let commands = document.createElement('div');

	let top_button = document.createElement('button');
	top_button.innerHTML = '^';
	commands.append(top_button);

	commands.append(document.createElement('br'));

	let left_button = document.createElement('button');
	left_button.innerHTML = '<';
	commands.append(left_button);

	let right_button = document.createElement('button');
	right_button.innerHTML = '>';
	commands.append(right_button);

	commands.append(document.createElement('br'));

	let bottom_button = document.createElement('button');
	bottom_button.innerHTML = 'v';
	commands.append(bottom_button);

	let main = document.querySelector('main');

	main.append(commands);

	return {
		bottom_button: bottom_button,
		left_button: left_button,
		right_button: right_button,
		top_button: top_button
	};
}
