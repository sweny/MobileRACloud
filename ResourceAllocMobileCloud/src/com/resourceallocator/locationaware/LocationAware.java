package com.resourceallocator.locationaware;

import com.database.connection.MyDBConnection;
import com.database.connection.SQLQueries;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Channel;
import com.strategyselection.IDC;
import com.strategyselection.ResourceAllocatorStrategy;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import org.json.JSONException;
import org.json.JSONObject;

public class LocationAware implements ResourceAllocatorStrategy {

	private String reqUserId;
	private String reqLocation;
	private int reqRAM;
	private int reqStorage;
	private String reqDevice;
	private String reqNetwork;
	private Connection conn;
	private final static String QUEUE_NAME = "281rabbitResponse";
	private int theResponse;

	@Override
	public void runResourceAllocator(String reqMsg) {

		Map<String, Double> hm = new HashMap<String, Double>();
		ValueComparator bvc =  new ValueComparator(hm);
		TreeMap<String,Double> sortedByDist = new TreeMap<String,Double>(bvc);
		try {
			System.out.println("Inside location aware"+reqMsg);
			this.conn = MyDBConnection.getConnection();
			System.out.println("REqMesg"+reqMsg);
			JSONObject jObject = new JSONObject(reqMsg);
			JSONObject data = jObject.getJSONObject("request"); // get data object

			reqUserId = data.getString("UserId");
			reqLocation = data.getString("location");
			reqRAM = data.getInt("RAM");
			reqStorage = data.getInt("Storage");
			reqDevice = data.getString("Device");
			reqNetwork = data.getString("Network");

			PreparedStatement ps = conn.prepareStatement(SQLQueries.SQL_GET_SERVERINFO);
			ResultSet rs = ps.executeQuery();
			ArrayList<IDC> IdcList = new ArrayList<IDC>();
			IDC serverObj;
			int index = 0;
			while(rs.next()){
				serverObj = new IDC();
				serverObj.setServerId(rs.getInt("ServerId"));
				serverObj.setRAM(rs.getInt("RAM"));
				serverObj.setStorage(rs.getInt("Storage"));
				serverObj.setLocation(rs.getString("location"));
				IdcList.add(index++, serverObj);
				System.out.println("Inside while");
			}
			System.out.println("IdcList.size()"+IdcList.size());
			for (int j = 0; j < IdcList.size(); j++) {
				IDC IdcObj = IdcList.get(j);
				if( IdcObj.getRAM() >= reqRAM && IdcObj.getStorage() >= reqStorage){
					String[] serverLocation = IdcObj.getLocation().split(",");
					String[] userLocation = reqLocation.split(",");
					hm.put(j+":"+IdcObj.getServerId() , LocationAware.calculateDistance(Double.parseDouble(serverLocation[0]), Double.parseDouble(serverLocation[1]), Double.parseDouble(userLocation[0]), Double.parseDouble(userLocation[1]) ) );
				}
			}
			System.out.println("hm.size()"+hm.size());
			if (hm.size()>0){
				sortedByDist.putAll(hm);
				String[] resultServer = sortedByDist.firstKey().split(":");
				String instanceId = resultServer[1];
				System.out.println("InstanceId: "+instanceId);
				IDC instObj = new IDC();
				for(int j = 0; j<IdcList.size(); j++ ){
					if (IdcList.get(j).getServerId() == Integer.parseInt(instanceId)){
						instObj = IdcList.get(j);
					}
				}			
				PreparedStatement ps1;
				ps1 = conn.prepareStatement(SQLQueries.SQL_Update_ServerInfo);
				ps1.setInt(1, (instObj.getRAM() - reqRAM));
				ps1.setInt(2, (instObj.getStorage()-reqStorage));
				ps1.setInt(3, instObj.getServerId());
				ps1.executeUpdate();

				//insert a row with instance id, serverid, userId and resources allocated to user info into utilization database.
				//return ack response with instance id to client
				System.out.println("Coming here");
				PreparedStatement ps2 = conn.prepareStatement(SQLQueries.SQL_Insert_Utilization, PreparedStatement.RETURN_GENERATED_KEYS);
				ps2.setInt(1, Integer.parseInt(reqUserId));
				ps2.setInt(2, instObj.getServerId());
				ps2.setInt(3, reqRAM);
				ps2.setInt(4, reqStorage);
				ps2.setString(5, reqLocation);
				ps2.setString(6, reqDevice);
				ps2.setString(7, reqNetwork);
				ps2.executeUpdate();
				ResultSet rs2 = ps2.getGeneratedKeys();
				if(rs2!=null && rs2.next()){
					System.out.println("instId"+rs2.getInt(1));
					theResponse = rs2.getInt(1);
				}				
			} else {
				PreparedStatement ps2 = conn.prepareStatement(SQLQueries.SQL_Update_ServerInfoResource);
				ps2.executeUpdate();
				System.out.println("Resources auto refilled!");
			}
		} catch (SQLException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 


		//sending to response rabbit
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("localhost");
		com.rabbitmq.client.Connection connection1;
		try {
			connection1 = factory.newConnection();

			Channel channel = connection1.createChannel();
			channel.queueDeclare(QUEUE_NAME, false, false, false, null);
			//String message = "instance is created!!!!! ";

			org.json.simple.JSONObject obj = new org.json.simple.JSONObject();
			obj.put("instanceId", ""+theResponse);  
			//obj.put("age", new Integer(37));

			channel.basicPublish("", QUEUE_NAME, null, obj.toJSONString().getBytes());
			System.out.println(" [x] Sent '" + obj.toJSONString() + "'");
			channel.close();
			connection1.close();
			//rabbit ends here
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	}


	public static double calculateDistance(double array1, double array2, double array3, double array4)
	{
		double Sum = 0.0;
		Sum = Sum + Math.pow((array1-array3),2.0)+ Math.pow((array2-array4),2.0);
		return Math.sqrt(Sum);
	}
}

class ValueComparator implements Comparator<String> {

	Map<String, Double> base;
	public ValueComparator(Map<String, Double> base) {
		this.base = base;
	}

	// Note: this comparator imposes orderings that are inconsistent with equals.    
	public int compare(String a, String b) {
		if (base.get(a) >= base.get(b)) {
			return -1;
		} else {
			return 1;
		} // returning 0 would merge keys
	}
}





