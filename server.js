var net = require('net');
var Express = require('express');
var SocketIO = require('socket.io');
var client = new net.Socket();

var app = Express();


app.use(Express.static(__dirname ));


var io = SocketIO.listen(app.listen(9999));



var totalBuffer = Buffer.from([]);

function receiver(data) {
	totalBuffer = Buffer.concat([totalBuffer, data]);
	var index = totalBuffer.indexOf('$');
	if (index === -1) return;
	if (index !== 0) totalBuffer = totalBuffer.slice(index);
	var channel = totalBuffer[1];
	var packetLen = totalBuffer.readUInt16BE(2);
	if (totalBuffer.length >= packetLen + 4) {

		if (channel === 2) {
			io.emit('data', Array.from(totalBuffer.slice(16, packetLen + 4)));
		}

		totalBuffer = totalBuffer.slice(packetLen + 4);
	}

	else {
		throw '1';
	}
}


client.connect(554, '192.168.0.15', function() {


	client.write('SETUP rtsp://127.0.0.1:554/user=admin_password=tlJwpbo6_channel=1_stream=1.sdp/trackID=3 RTSP/1.0\r\nTransport: RTP/AVP/TCP;unicast;interleaved=0-1\r\nx-Dynamic-Rate: 0\r\n\r\n');
	client.once('data', function(data) {
		console.info(data.toString('utf8'))
		client.write('SETUP rtsp://127.0.0.1:554/user=admin_password=tlJwpbo6_channel=1_stream=1.sdp/trackID=4 RTSP/1.0\r\nTransport: RTP/AVP/TCP;unicast;interleaved=2-3\r\nx-Dynamic-Rate: 0\r\n\r\n');
		client.once('data', function(data) {
			console.info(data.toString('utf8'))

			var sessionId = /Session: (.+);/g.exec(data.toString('utf8'))[1];
			console.info('sessionId', sessionId)

			client.write(`PLAY rtsp://127.0.0.1:554/user=admin_password=MrjRtPod_channel=1_stream=1.sdp/ RTSP/1.0\r\nRange: npt=0.000-\r\nSession: ${sessionId}\r\n\r\n`);

			client.once('data', function(data) {
				client.on('data', receiver);



			});


		});
	});
});






