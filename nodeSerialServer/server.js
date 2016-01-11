/**
 * SerialSocket Example
 */

//server initlatization

var express  	= require('express');
	io           = require('socket.io'),
	app          = express(),
	server       = app.listen(8080),
	socketServer = io(server);

//Serial port initalization

var serialport = require('serialport');
	SerialPort = serialport.SerialPort,
	portName   = process.argv[2],
	portConfig = {
		baudRate : 9600,
		parser: serialport.parsers.readline('\n')
	};

//open the serial port

var myPort = new SerialPort(portName, portConfig);

// setup server and socketserver listener function
// ngeset server sama socket server

app.use(express.static('public'));
app.get('/:name', serveFiles);
socketServer.on('connection', openSocket);

function serveFiles(request, respone) {
	var fileName = request.params.name;
	respone.sendFile(fileName);
}

function openSocket(socket) {
	console.log('new user address :' + socket.handshake.address);
	socket.emit('message', 'Hello, ' + socket.handshake.address);
  	// this function runs if there's input from the client:
	socket.on('message', function(data) {
		myPort.write(data);							// send the data to the serial device
	});

	// this function runs if there's input from the serialport:
	myPort.on('data', function(data) {
		socket.emit('message', data);		// send the data to the client
	});
}



