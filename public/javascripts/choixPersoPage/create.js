'use strict';

function createChoixPersoPage(socket) {
	let current_perso = 1;

	let div = document.createElement('div');
	div.style.width = '700px';
	div.style.height = '500px';
	div.style.backgroundImage = "url('/images/fonds/fondchoix.jpg')";
	div.style.backgroundSize = 'cover';
	div.style.display = 'inline-block';

	let pseudo = document.createElement('input');
	pseudo.setAttribute('placeholder', 'Pseudo');
	pseudo.style.border = 'none';
	pseudo.style.position = 'absolute';
	pseudo.style.marginTop = '450px';
	pseudo.style.marginLeft = '238px';
	pseudo.style.width = '200px';
	pseudo.style.height = '30px';

	let go_btn = document.createElement('div');
	go_btn.style.height = '100px';
	go_btn.style.width = '100px';
	go_btn.style.display = 'inline-block';
	go_btn.style.marginLeft = '550px';
	go_btn.style.marginTop = '365px';
	go_btn.style.cursor = 'pointer';

	let right_btn = document.createElement('div');
	right_btn.style.position = 'absolute';
	right_btn.style.height = '100px';
	right_btn.style.width = '50px';
	right_btn.style.marginTop = '-225px';
	right_btn.style.marginLeft = '550px';
	right_btn.style.cursor = 'pointer';

	let left_btn = document.createElement('div');
	left_btn.style.position = 'absolute';
	left_btn.style.height = '100px';
	left_btn.style.width = '50px';
	left_btn.style.marginTop = '-225px';
	left_btn.style.marginLeft = '120px';
	left_btn.style.cursor = 'pointer';

	let perso_img = document.createElement('div');
	perso_img.style.width = '100px';
	perso_img.style.height = '100px';
	perso_img.style.position = 'absolute';
	perso_img.style.marginTop = '-200px';
	perso_img.style.marginLeft = '310px';
	perso_img.style.backgroundImage = `url('/images/personnages/perso${current_perso}marche1d0.gif')`;
	perso_img.style.backgroundSize = 'cover';

	div.append(pseudo);
	div.append(go_btn);
	div.append(left_btn);
	div.append(right_btn);
	div.append(perso_img);

	let main = document.querySelector('main');
	main.style.textAlign = 'center';

	main.innerHTML = '';

	main.append(div);

	left_btn.addEventListener('click', () => {
		current_perso--;
		if(current_perso === 0) {
			current_perso = Globals.NBPERSOS;
		}
		perso_img.style.backgroundImage = `url('/images/personnages/perso${current_perso}marche1d0.gif')`;
	});

	right_btn.addEventListener('click', () => {
		current_perso++;
		if(current_perso === Globals.NBPERSOS + 1) {
			current_perso = 1;
		}
		perso_img.style.backgroundImage = `url('/images/personnages/perso${current_perso}marche1d0.gif')`;
	});

	go_btn.addEventListener('click', () => {
		if(pseudo.value.replace(' ', '') !== '') {
			socket.emit('client_exists', {
				client: {
					pseudo: pseudo.value,
					id: current_perso
				}
			});
			drow_arena(socket, {
				pseudo: pseudo.value,
				id: current_perso
			});
		}
	});
}