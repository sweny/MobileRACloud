package com.strategyselection;
import java.io.IOException;

import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.ConsumerCancelledException;
import com.rabbitmq.client.QueueingConsumer;
import com.rabbitmq.client.ShutdownSignalException;
import com.rabbitmq.tools.json.JSONReader;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * @author sweny
 *	Server will receive request from the node.js via. rabbitMQ and will select a strategy for allocating resources.
 */
public class Server {


	private final static String QUEUE_NAME = "281rabbitmqRequest";
	private static int count = 0;

	public static void runStrategy(String reqMsg){

		StrategySelect ss = new StrategySelect();
		ss.selectStrategy(reqMsg);		
	}

	public static void main(String[] args) throws ShutdownSignalException, ConsumerCancelledException, InterruptedException, ParseException {
		// TODO Auto-generated method stub
		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("localhost");
		Connection connection;
		try {
			connection = factory.newConnection();

			Channel channel = connection.createChannel();
			channel.queueDeclare(QUEUE_NAME, false, false, false, null);
			System.out.println(" [*] Waiting for messages. To exit press CTRL+C");
			QueueingConsumer consumer = new QueueingConsumer(channel);
			channel.basicConsume(QUEUE_NAME, true, consumer);
			//ends here

			while (true) {
				QueueingConsumer.Delivery delivery = consumer.nextDelivery();
				String message = new String(delivery.getBody());
				count++;
				if (message != null){
					System.out.println(" My message Received '" + message + "' count :"+ count);
					runStrategy(message);
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
