module.exports = {
	disconnect: io => {
		console.log('vous êtes déconnecté !!');
	},

	init_map: (io, message) => {
		map = message;
	},

	add_client: (io, message) => {
		let fs = require('fs');
		let clients = [];
		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(fs.existsSync(path)) {
			clients = JSON.parse(fs.readFileSync(path));
		}
		clients.push(message.client);

		fs.writeFileSync(path, JSON.stringify(clients));
	},

	client_exists: (io, message) => {
		let fs = require('fs');
		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(!fs.existsSync(path)) {
			io.emit('client_exists', {exists: false, client: message.client});
		}
		else {
			let clients = JSON.parse(fs.readFileSync(path));
			let exists = false;
			for(let i=0; i<clients.length; i++) {
				if(clients[i].pseudo === message.client.pseudo) {
					exists = true;
				}
			}
			io.emit('client_exists', {exists: exists, client: message.client});
		}
	},

	message: (io, message) => {
		if(typeof message === 'object') {
			if(message.type !== undefined) {
				if(message.type === 'broadcast') {
					io.broadcast.emit('broadcast', message.message);
				}
			}
		}
		else {
			console.log('vous avez reçu le message: ' + message);
		}
	}
};