var mysql = require('mysql');
var mysql = require('mysql');
var util = require('date-utils');
var moment = require('moment');

var perdevice =15;
var perstorage = 10;
var permemory = 10;
var pernetwork = 5;

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password :'root',
	port : '3305',
	database : 'test'
});

connection.connect();
var date = moment().format('L');
console.log(date);

//var getUserDetails = "insert into UtilizationInfo(UserId,StartDate) values('"+2+"','"+date+"')";	
//connection.query(getUserDetails, function(err, rows, fields)
//{
//	console.log(JSON.stringify(err));
//});

var getUserDetails = "select * from UtilizationInfo where UserId=(?)";	
connection.query(getUserDetails, function(err, rows, fields)
{
	if (err) throw err;

	if(rows.length==0)
	{
		console.log("No Record");
	}
	if(rows.length!=0)
	{
		console.log("Vishal"+JSON.stringify(rows));
		var fullDate = rows[0].StartDate;
		
		var a = moment(date);
		var b = moment(fullDate);
		console.log(a.diff(b,'days'));
		if(a.diff(b)!=0)
			{
			try{
				var main = "select storage, memory, device, network from UserData where userID=?";
				
				connection.query(main, function(err, result, fields)
				{
					if(err) throw err;
					else{
					for(var i in result){
						var resource = result[i];
						var cost = a.diff(b)*((perstorage*resource.storage)+(permemory*resource.memory)+(perdevice*resource.device)+(pernetwork*resource.network));
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
				}
				}
				
			});
			
		}
		
	}		
});	

//console.log(moment().format('LL'));

connection.end();