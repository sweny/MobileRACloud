var http = require('http');
var amqp = require('amqplib');

var theFinalResponse = "";
http.createServer(function (request, response) {
	console.log('request starting...');

	var reqData = '';

    // should implement the msg queuing as a callback function
    function rabbitSending(msg){

    	amqp.connect('amqp://localhost').then(function(conn) {
            return when(conn.createChannel().then(function(ch) {
                var queueName = '281rabbitmqRequest';

                //should be able to send json objects - TO-DO
                //var jsonObj = JSON.parse(msg);
                //console.log(typeof jsonObj);
                var ok = ch.assertQueue(queueName, {durable: false});

                return ok.then(function(_qok) {
                    ch.sendToQueue(queueName, new Buffer(msg));
                    console.log(" [x] Sent '%s'", msg);
                    return ch.close();
                });
            })).ensure(function() { conn.close(); });;
        }).then(null, console.warn);
    }

	function rabbitReceiving() {
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
							if (conn) conn.close(function () {
								theFinalResponse = msg.content.toString();
								console.log("successfully got response but still in function: "+theFinalResponse);
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
	}

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

		var objDet = JSON.parse(reqData);
		var userId = JSON.stringify(objDet.UserId);
		var location = JSON.stringify(objDet.location);
		var memory = JSON.stringify(objDet.memory);
		var storage = JSON.stringify(objDet.storage);
		var CPU = JSON.stringify(objDet.Device);
        var requestmsg = "userId = "+userId+"location = "+location+" memory = "+memory+" storage = "+storage+" CPU = "+CPU;
		console.log("Request received: " +requestmsg);
		rabbitSending(JSON.stringify(objDet));
		rabbitReceiving()
		console.log('successfully added to queue');		
        // rabbit code
		response.writeHead(200, {
			'Content-Type': 'text/plain',
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods': 'GET,POST'
		});
		//Note here we are listening to port 8081 while client runs on port 8080, hence in order to avoid Cross Domain Security Issue CORS is used.
		//Due to this reason, response header must contain Access-Control-Allow-Origin
		console.log("successfully got response: "+theFinalResponse);
		response.end("successfully got response: "+theFinalResponse);
	});
			
}).listen(8081);
console.log('Server running at http://localhost');

