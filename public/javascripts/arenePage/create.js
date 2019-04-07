'use strict';

// i = lignes
// j = colonnes

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
	if(debug) map_container.style.border = '1px solid red';
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
					map_container.append(create_cel('/images/murs/mur.gif'));
					break;
				case '.':
					map_container.append(create_cel());
					break;
				default:
					let perso_found = cel.match(/P_([0-9]+)_(d0|d1)_(marche|touche|mort)_([0-9]+)_([a-zA-Z0-9\_\-\@\~\#\$\!\*]+)/);
					if(perso_found.length !== 0) {
						let perso_cel = create_cel(`/images/personnages/perso${perso_found[1]}${perso_found[3]}${perso_found[4]}${perso_found[2]}.gif`);
						let perso_pseudo = perso_found[5];
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
	socket.emit('map_exists', {
		perso: perso
	});
}