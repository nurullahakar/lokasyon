var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


server.listen(3000, function(){
	console.log('Dinlenen port: 3000');
});
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
	app.use(express.static('.'));
});

var kullanici = {};
io.on('connection', function(socket){
	socket.on('new_user', function(data){
		if(parseInt(Object.keys(kullanici).length) > 0)
			socket.emit('already', {kullanici: kullanici});
		kullanici[socket.id] = data.pos;
		io.emit('connected', { pos: data.pos, users_count: Object.keys(kullanici).length });
		console.log('Kullanıcı Bağlandı:');
		console.log(kullanici);
	});
		socket.on('yenikonum', function(data){
		if(parseInt(Object.keys(kullanici).length) > 0)
			if (data !=data.pos)
		kullanici[socket.id] = data.pos;
		io.emit('yenikonum', { pos: data.pos, users_count: Object.keys(kullanici).length });
		console.log('Kullanıcı Hareket etti:');
		console.log(kullanici);
	});
	
	
	socket.on('disconnect', function(){
		if(kullanici[socket.id]){
			var todel = kullanici[socket.id];
			delete kullanici[socket.id];
			io.emit('disconnected', { del: todel, users_count: Object.keys(kullanici).length }); 	
		}
		console.log('Kullanıcı Çıkış Yaptı:');
		console.log(kullanici);
	});
}); 

