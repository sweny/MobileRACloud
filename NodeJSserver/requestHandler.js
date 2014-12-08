var http = require('http');
var amqp = require('amqplib');

http.createServer(function (request, response) {
	console.log('request starting...');

	var reqData = '';

    // should implement the msg queuing as a callback function
    function rabbitSending(msg){

    	amqp.connect('amqp://localhost').then(function(conn) {
            return when(conn.createChannel().then(function(ch) {
                var queueName = '281rabbitmq';

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
        var requestmsg = "location = "+location+" memory = "+memory+" storage = "+storage+" CPU = "+CPU;
		console.log("Request recieved: " +requestmsg);
		rabbitSending(JSON.stringify(objDet));
		console.log('successfully added to queue');		
        // rabbit code
		response.writeHead(200, {
			'Content-Type': 'text/plain',
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods': 'GET,POST'
		});
		//Note here we are listening to port 8081 while client runs on port 8080, hence in order to avoid Cross Domain Security Issue CORS is used.
		//Due to this reason, response header must contain Access-Control-Allow-Origin
		response.end("Instance id: 1");
	});
			
}).listen(8081);
console.log('Server running at http://localhost');

