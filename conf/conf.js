module.exports = {
	port: 3000,
	socket: true,
	routes: {
		'/': './routes/index',
		'/js': './routes/javascript',
		'/users': './routes/users',
		sockets: {
			connection_message: 'Vous êtes connecté !!',
			connection_callback: io => {},
			broadcast_connection_message: 'Un nouveau user s\'est connecté !!',
			events: {
				'message': {
					controller: '../conf/socket_events',
					action: 'message'
				},
				'client_exists': {
					controller: '../conf/socket_events',
					action: 'client_exists'
				},
				'add_client': {
					controller: '../conf/socket_events',
					action: 'add_client'
				},
				'map_exists': {
					controller: '../conf/socket_events',
					action: 'map_exists'
				},
				'init_map': {
					controller: '../conf/socket_events',
					action: 'init_map'
				},
				'new_player': {
					controller: '../conf/socket_events',
					action: 'new_player'
				},
				'disconnect': {
					controller: '../conf/socket_events',
					action: 'disconnect'
				},
				'perso_position_updated': {
					controller: '../conf/socket_events',
					action: 'perso_position_updated'
				},
				'update_position': {
					controller: '../conf/socket_events',
					action: 'update_position'
				}
			}
		}
	}
};