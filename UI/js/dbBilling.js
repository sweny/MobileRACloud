





var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root'
});
 
var sql = 'SELECT InstanceId, UserId, ServerId, RAM, Storage, Device, Network, Location, startDate, EndDate from mobilecloud.utilizationinfo where userId = "1" ';
connection.connect();
 
connection.query(sql, function(err, rows, fields) {
  if (err) throw err;
  res.render('users', { title: 'Users', rows: rows });
});
 
connection.end();

