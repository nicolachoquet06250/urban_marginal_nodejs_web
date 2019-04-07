'use strict';

function createMainPage() {
	let server_ip = document.createElement('input');
	server_ip.setAttribute('type', 'text');
	server_ip.setAttribute('id', 'server_ip');
	server_ip.setAttribute('placeholder', 'IP Server');
	server_ip.value = '127.0.0.1';

	let server_port = document.createElement('input');
	server_port.setAttribute('type', 'number');
	server_port.setAttribute('id', 'server_port');
	server_port.setAttribute('placeholder', 'Port Server');
	server_port.value = '3000';

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
		let socket = io($('#server_ip').val() + ':' + $('#server_port').val());
		socket.emit('message', 'coucou');

		socket.on('broadcast', message => {
			console.log(message);
		});

		socket.on('message', message => {
			if(message.exists) {
				socket.emit('add_client', {
					client: message.client
				});
			}
		});

		createChoixPersoPage(socket);
	});
}