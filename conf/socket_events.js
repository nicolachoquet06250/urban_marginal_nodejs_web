module.exports = {
	disconnect: io => {
		console.log('vous êtes déconnecté !!');
	},

	map_exists: (io, message) => {
		let fs = require('fs');
		let os = require('os');
		let path = __dirname + '/server_' + require('./conf').port + '_map.json';
		if(os.platform().toLocaleString().indexOf('win')) {
			path = path.replace('/', '\\');
		}
		if(fs.existsSync(path)) {
			io.emit('map_exists', {
				exists: true,
				map: JSON.parse(fs.readFileSync(path)),
				perso: message.perso
			});
		}
		else {
			io.emit('map_exists', {
				exists: false,
				perso: message.perso
			});
		}
	},

	init_map: (io, message) => {
		let fs = require('fs');
		let os = require('os');
		let path = __dirname + '/server_' + require('./conf').port + '_map.json';
		if(os.platform().toLocaleString().indexOf('win')) {
			path = path.replace('/', '\\');
		}
		fs.writeFileSync(path, JSON.stringify(message.map));
	},

	add_client: (io, message) => {
		let fs = require('fs');
		let os = require('os');
		let clients = [];
		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(os.platform().toLocaleString().indexOf('win')) {
			path = path.replace('/', '\\');
		}
		if(fs.existsSync(path)) {
			clients = JSON.parse(fs.readFileSync(path));
		}
		clients.push(message.client);

		fs.writeFileSync(path, JSON.stringify(clients));
	},

	client_exists: (io, message) => {
		let fs = require('fs');
		let os = require('os');
		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(os.platform().toLocaleString().indexOf('win')) {
			path = path.replace('/', '\\');
		}
		if(!fs.existsSync(path)) {
			io.emit('client_exists', {exists: false, client: message.client});
		}
		else {
			let clients = JSON.parse(fs.readFileSync(path));
			let exists = false;
			for(let i=0; i<clients.length; i++) {
				if(clients[i].pseudo === message.client.pseudo && clients[i].id === message.client.id) {
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
	},

	new_player: (io, message) => {
		io.broadcast.emit('new_player', message);
		// TODO: Do the 'new player' feature. ( when a new player is connected, his avatar must be forthcoming )
	}
};