var http = require('http');
var amqp = require('amqplib');

var theFinalResponse = "";
http.createServer(function (request, response) {
	console.log('request starting...');

	var reqData = '';


	request.on('data', function(data) {
		reqData += data;
		//If the size of formData is too large i.e. in case of buffer overflow attack kill the connection.
		if(reqData.length > 1e6) {
			reqData = "";
			response.writeHead(413, {'Content-Type': 'text/plain'}).end();
			request.connection.destroy();
		}
	});

	request.on('end', function() {

		var dataObj = JSON.parse(reqData);
		var reqMessage = JSON.stringify(dataObj.request);
		console.log("request "+reqMessage);
		var storage = JSON.stringify(dataObj.Storage);
		var memory = JSON.stringify(dataObj.RAM);
		var device = JSON.stringify(dataObj.Device);
		var network = JSON.stringify(dataObj.Network);
		var userID = JSON.stringify(dataObj.UserId);
		var location = JSON.stringify(dataObj.location);
		var requestmsg = "userId = "+userID+"location = "+location+" memory = "+memory+" storage = "+storage+" device = "+device;
		console.log("Request received: " +requestmsg);
		//rabbitSending(JSON.stringify(objDet));
		amqp.connect('amqp://localhost').then(function(conn) {
			return when(conn.createChannel().then(function(ch) {
				var queueName = '281rabbitmqRequest';

				//should be able to send json objects - TO-DO
				//var jsonObj = JSON.parse(msg);
				//console.log(typeof jsonObj);
				var ok = ch.assertQueue(queueName, {durable: false});

				return ok.then(function(_qok) {
					ch.sendToQueue(queueName, new Buffer(JSON.stringify({request :dataObj.request})));
					console.log(" [x] Sent '%s'", JSON.stringify({request :dataObj.request}));
					return ch.close();
				});
			})).ensure(function() { conn.close(); });;
		}).then(null, console.warn);




		amqp.connect('amqp://localhost').then(function (conn) {
			process.once('SIGINT', function () {
				conn.close();
			});
			return conn.createChannel().then(function (ch) {

				var ok = ch.assertQueue('281rabbitResponse', {durable: false});

				ok = ok.then(function (_qok) {
					return ch.consume('281rabbitResponse', function (msg) {
						console.log(" [x] Received '%s'", msg.content.toString());
						if (msg.content.toString() != null) {
							response.writeHead(200, {
								'Content-Type': 'text/plain',
								'Access-Control-Allow-Origin' : '*',
								'Access-Control-Allow-Methods': 'GET,POST'
							});
							console.log("successfully got response: "+msg.content.toString());
							var responseText = JSON.parse(msg.content.toString());

							response.end("Your instance is created successfully. Your Instance Id is:" +responseText.instanceId);
							process.exit(1);
							if (conn) conn.close(function () {
								theFinalResponse = msg.content.toString();
								console.log("successfully got response but still in function: "+theFinalResponse);
								console.log('successfully added to queue');		
								// rabbit code
								response.writeHead(200, {
									'Content-Type': 'text/plain',
									'Access-Control-Allow-Origin' : '*',
									'Access-Control-Allow-Methods': 'GET,POST'
								});
								console.log("successfully got response: "+msg.content.toString());
								response.end("Instance Id is:" +msg.content.toString());
								process.exit(1);
							});
						}
					}, {noAck: true});
				});

				return ok.then(function (_consumeOk) {
					console.log(' [*] Waiting for messages. To exit press CTRL+C');
				});
			});
		}).then(null, console.warn);
	});
}).listen(8081);
console.log('Server running at http://localhost');
