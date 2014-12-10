/**
 * Created by sunny on 12/9/14.
 */
/**
 * New node file
 */

//var util = require('date-utils');
var express = require('express');
var mysql = require('mysql');
var moment = require('moment');

var app = express();

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

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'mobilecloud',
    port : 3305
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
        connection.end();
    });
});

app.listen(8081);

//console.log("server started");
/*
connection.connect();
var date = moment().format('L');
console.log(date);

//var getUserDetails = "insert into UtilizationInfo(UserId,StartDate) values('"+2+"','"+date+"')";
//connection.query(getUserDetails, function(err, rows, fields)
//{
//	console.log(JSON.stringify(err));
//});

var getUserDetails = "select * from utilizationinfo where UserId=1";
connection.query(getUserDetails, function(err, rows, fields)
{
    if (err) throw err;

    if(rows.length==0)
    {
        console.log("No Record");
    }
    if(rows.length!=0)
    {
        console.log(""+JSON.stringify(rows));
        var fullDate = rows[0].StartDate;
        var a = moment(date);
        var b = moment(fullDate);
        console.log(a.diff(b,"days"));
        if(a.diff(b)!=0)
        {
            try{
                var main = "select storage, memory, device, network from UserData where userID=1";
                connection.query(main, function(err, result, fields)
                {
                    if(err) throw err;
                    else{
                        for(var i in result){
                            var resource = result[i];
                            var cost = a.diff(b)*((perstorage*resource.storage)+(permemory*resource.memory)+(perdevice*resource.device)+(pernetwork*resource.network));
                            console.log("abcd"+JSON.stringify(result));
                            console.log("efgh"+JSON.stringify(cost));

                            var totalstorage = a.diff(b)*(perstorage*resource.storage);
                            var totalmemory = a.diff(b)*(permemory*resource.memory);
                            var totaldevice = a.diff(b)*(perdevice*resource.device);
                            var totalnetwork = a.diff(b)*(pernetwork*resource.network);
                        }
                    }
                });
            }
            catch(err){
            }
        }
        else{
            var main = "select storage, memory, device, network from UserData where userID=(?)";
            connection.query(main, function(err, result, fields)
            {
                if(err) throw err;
                else{
                    for(var i in result){
                        var resource = result[i];
                        var cost = (perstorage*resource.storage)+(permemory*resource.memory)+(perdevice*resource.device)+(pernetwork*resource.network);
                        var totalstorage = perstorage*resource.storage;
                        var totalmemory = permemory*resource.memory;
                        var totaldevice = perdevice*resource.device;
                        var totalnetwork = pernetwork*resource.network;
                    }
                }
            });
        }
    }
});

//console.log(moment().format('LL'));

connection.end();*/
