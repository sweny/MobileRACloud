package com.database.connection;

public class SQLQueries {

	public static final String SQL_GET_RESOURCES = "SELECT * FROM customer_resources WHERE instance_id =?";
	public static final String SQL_GET_SERVERINFO = "SELECT * FROM serverInfo";
	public static final String SQL_Update_ServerInfo = "Update ServerInfo set RAM = ?, Storage = ? where serverId =?";
	public static final String SQL_Insert_Utilization = "INSERT into utilizationInfo (UserId, ServerId, RAM, Storage, Location, Device, Network, StartDate) values (?,?,?,?,?,?,?, Sysdate())";
	public static final String SQL_Update_ServerInfoResource = "Update serverInfo set RAM = 10000";
}
