module.exports = {
	port: 3000,
	socket: true,
	routes: {
		'/': './routes/index',
		'/js': './routes/javascript',
		'/users': './routes/users',
		sockets: {
			connection_message: 'Vous êtes connecté !!',
			connection_callback: io => {

			},
			broadcast_connection_message: 'Un nouveau user s\'est connecté !!',
			events: {
				'message': {
					controller: '../conf/socket_events',
					action: 'message'
				},
				'add_client': {
					controller: '../conf/socket_events',
					action: 'add_client'
				},
				'init_map': {
					controller: '../conf/socket_events',
					action: 'init_map'
				},
				'disconnect': {
					controller: '../conf/socket_events',
					action: 'disconnect'
				}
			}
		}
	}
};