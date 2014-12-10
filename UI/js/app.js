/**
 * Created by sunny on 12/8/14.
 */

var express = require('express');
var mysql = require('mysql');
var moment = require('moment');
var app = express();

//billings
var perdevice =15;
var perstorage = 10;
var permemory = 25;
var pernetwork = 5;

function getDeviceValue(device){

    if (device = "Iphone iOS"){
        return 20;
    }
    else if(device = "Android OS"){
        return 15;
    }
    else if(device = "Windows OS"){
        return 10;
    }
    else{
        return 0;
    }
}

function getNetworkValue(network){

    if (network = "2G"){
        return 20;
    }
    else if(network = "3G"){
        return 15;
    }
    else if(network = "4G"){
        return 10;
    }
    else{
        return 0;
    }
}
//billings

var connection = mysql.createConnection({
    host: 'localhost',
                     user: 'root', 
                     password: 'root', 
                     port: 3305, 
                     database: 'test'
});

app.get('/:userId/my_instances', function(req, res) {
	//res.sendfile('./views/index.html');
    var user_id = req.params.userId;
    console.log("inside api");
    connection.connect();
    //var customer_id = 4;
    //var custName = 'gauri';
    //var da = moment().format('YYYY-MM-DD hh:mm:ss');
    //console.log(da);
    connection.query('select InstanceId, RAM, Storage, Device, Network from utilizationInfo where userId = ?',[user_id], function(err, rows) {
        if (err) throw err;
        console.log('From utilizationInfo table : ', rows);


        //console.log(typeof rows);
        //res.writeHead(200,{'Content-Type': 'text/plain'});
        //res.end("successful I guess");
        //res.(200, { 'Content-Type': 'application/json' });
        res.send(rows);
    });
});

app.get('/:userId/my_bill', function(req, res) {

    var user_id = req.params.userId;
    console.log("inside api");
    connection.connect();
    //var customer_id = 4;
    //var custName = 'gauri';
    //var da = moment().format('YYYY-MM-DD hh:mm:ss');
    //console.log(da);
    connection.query('select RAM, Storage, Device, Network,startDate from utilizationInfo where userId = ?',[user_id], function(err, rows) {
        if (err) throw err;
        console.log('From utilizationInfo table : ', rows);
        //console.log(typeof rows);
        //res.writeHead(200,{'Content-Type': 'text/plain'});
        //res.end("successful I guess");
        //res.(200, { 'Content-Type': 'application/json' });
        var cost = 0;
        for (i in rows){
            console.log("in for loop");
            //console.log(typeof String(rows[i].startDate);
            //da = String(rows[i].startDate);
            //console.log(da);
            startD = rows[i].startDate;

            var curD = new Date();
            var difference = curD.getTime() - startD.getTime();
            console.log(difference);
            var hoursDifference = Math.floor(difference/1000/60/60);
            //difference -= hoursDifference*1000*60*60

            console.log("in hours: "+hoursDifference)
            //console.log(rows[i].RAM);
            //console.log("ram cost:"+(hoursDifference*rows[i].Ram));
            var perInstance = ((hoursDifference*rows[i].RAM)+(hoursDifference*rows[i].Storage)+(hoursDifference*getDeviceValue(rows[i].Device))+(hoursDifference*getNetworkValue(rows[i].Network)));
            //console.log(typeof perInstance);
            cost += perInstance;
        }
        console.log("cost of ur instances: " +cost+"$");
        res.send(JSON.stringify({instance_cost : cost} ));
    });
});

app.listen(3000);

console.log("server started");