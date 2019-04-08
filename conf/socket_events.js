module.exports = {
	disconnect: io => {
		console.log('vous êtes déconnecté !!');
		let fs = require('fs');
		let os = require('os');

		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(os.platform().indexOf('win') !== -1) {
			path = path.replace('/', '\\');
		}

		let clients = JSON.parse(fs.readFileSync(path));
		let tmp = [];

		for(let i = 0; i < clients.length; i++) {
			if(clients[i].socket_id !== io.id) {
				tmp.push(clients[i]);
			}
		}

		clients = tmp;

		fs.writeFileSync(path, JSON.stringify(clients));

		if(clients.length === 0) {
			fs.unlinkSync(path);
			fs.unlinkSync(path.replace('clients', 'map'));
		}

	},

	map_exists: (io, message) => {
		let fs = require('fs');
		let os = require('os');
		let path = __dirname + '/server_' + require('./conf').port + '_map.json';
		if(os.platform().indexOf('win') !== -1) {
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
		if(os.platform().indexOf('win') !== -1) {
			path = path.replace('/', '\\');
		}
		fs.writeFileSync(path, JSON.stringify(message.map));
	},

	add_client: (io, message) => {
		let fs = require('fs');
		let os = require('os');
		let clients = [];
		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(os.platform().indexOf('win') !== -1) {
			path = path.replace('/', '\\');
		}
		if(fs.existsSync(path)) {
			clients = JSON.parse(fs.readFileSync(path));
		}
		clients.push({
			socket_id: io.id,
			client: message.client
		});

		console.log(clients);

		fs.writeFileSync(path, JSON.stringify(clients));
	},

	client_exists: (io, message) => {
		let fs = require('fs');
		let os = require('os');
		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(os.platform().indexOf('win') !== -1) {
			path = path.replace('/', '\\');
		}
		if(!fs.existsSync(path)) {
			io.emit('client_exists', {exists: false, client: message.client});
		}
		else {
			let clients = JSON.parse(fs.readFileSync(path));
			let exists = false;
			for(let i = 0; i < clients.length; i++) {
				let client = clients[i].client;
				if(client.pseudo === message.client.pseudo && client.id === message.client.id) {
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
	},

	perso_position_updated: (io, message) => {
		let me = message.perso;
		let my_new_position = message.position;
		let my_socket_id = io.id;

		let fs = require('fs');
		let os = require('os');

		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(os.platform().indexOf('win') !== -1) {
			path = path.replace('/', '\\');
		}
		let clients = JSON.parse(fs.readFileSync(path));
		let persos = [];

		for(let i in clients) {
			if(clients[i].socket_id === my_socket_id) {
				clients[i].client = me;
				clients[i].position = my_new_position;
			}
			if(clients[i].position !== undefined) {
				persos.push({
					perso: clients[i].client,
					position: clients[i].position
				});
			}
		}

		fs.writeFileSync(path, JSON.stringify(clients));

		io.broadcast.emit('perso_positions_updated', persos);
		io.emit('perso_positions_updated', persos);
	},

	update_position: (io, position) => {
		let fs = require('fs');
		let os = require('os');

		let path = __dirname + '/server_' + require('./conf').port + '_clients.json';
		if(os.platform().indexOf('win') !== -1) {
			path = path.replace('/', '\\');
		}
		let clients = JSON.parse(fs.readFileSync(path));

		for(let i in clients) {
			if(clients[i].socket_id === io.id) {
				clients[i].position = position;
			}
		}

		fs.writeFileSync(path, JSON.stringify(clients));
	}
};