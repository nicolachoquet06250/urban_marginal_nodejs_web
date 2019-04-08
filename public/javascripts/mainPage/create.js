'use strict';

function createMainPage() {
	let server_ip = document.createElement('input');
	server_ip.setAttribute('type', 'text');
	server_ip.setAttribute('id', 'server_ip');
	server_ip.setAttribute('placeholder', 'IP Server');
	server_ip.value = '127.0.0.1';

	let href = window.location.href;

	let port = '80';
	if(href.indexOf(':') !== -1) {
		port = href.split(':')[2].replace('/', '');
	}

	let server_port = document.createElement('input');
	server_port.setAttribute('type', 'number');
	server_port.setAttribute('id', 'server_port');
	server_port.setAttribute('placeholder', 'Port Server');
	server_port.value = port;

	let start_btn = document.createElement('input');
	start_btn.setAttribute('type', 'button');
	start_btn.setAttribute('id', 'start');
	start_btn.value = 'Start';

	let logs = document.createElement('div');
	logs.setAttribute('id', 'logs');

	let main = document.querySelector('main');
	main.style.textAlign = 'left';

	main.innerHTML = '';
	main.append(server_ip);
	main.append(server_port);
	main.append(start_btn);
	main.append(logs);

	document.querySelector('#start').addEventListener('click', () => {
		let socket = io(server_ip.value + ':' + server_port.value);
		createChoixPersoPage(init_socket_events(socket));
	});
}