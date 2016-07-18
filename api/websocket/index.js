var socketio 			= require('socket.io'),
		redisio 			= require('socket.io-redis'),
		jsontoken 		= require('jsonwebtoken'),
		cookieParser 	= require('socket.io-cookie-parser');

var namespace = 'manager';

var WebSocket = function(server){
  var io = socketio(server);
  //io.adapter(redis({ host: '127.0.0.1', port: 6379 }));


	io.use(cookieParser());
  var ns = io.of(namespace); //Create namespace for managersocket

  ns.on('connection', function(client){
    console.log('connected to manager namespace');
    client.emit('connection', {});
  })
  this.io = io;
	return this;
};

module.exports = WebSocket;
