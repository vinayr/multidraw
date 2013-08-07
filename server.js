
var http = require('http');
var io = require('socket.io');	

var httpserver = http.createServer(function(req,res) {
	res.writeHeader(200, {'Content-Type':'text/plain'});
	res.write('DrawTV Server\n');
	res.end();
});

//httpserver.listen(process.env['app_port'] || 3000);
httpserver.listen(8080);

var socketio = io.listen(httpserver);

function onMessage(msg)
{
	console.log(msg);
}

function onDrawStart(data)
{
	console.log("x:"+data.x+" y:"+data.y);
	socketio.sockets.emit('tv_drawStart', {
    				x: data.x,
    				y: data.y
    			});
}

function onDraw(data)
{
	socketio.sockets.emit('tv_draw', { 
    				x: data.x,
    				y: data.y
    			});
}

function onDrawEnd()
{
	socketio.sockets.emit('tv_drawEnd', {msg:'end'}); 
}

function onConnect(socket)
{
  //socket.on('message', onMessage);
  socket.on('drawStart', onDrawStart);
  socket.on('draw', onDraw);
  socket.on('drawEnd', onDrawEnd);
  //socket.on('disconnect', onDisconnect);
}

socketio.sockets.on('connection', onConnect);
