package com.strategyselection;

public class IDC {
	private String location;
	private int RAM;
	private int Storage;
	private int ServerId;
	private String Device;
	
	public String getDevice() {
		return Device;
	}
	public void setDevice(String device) {
		Device = device;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public int getRAM() {
		return RAM;
	}
	public void setRAM(int rAM) {
		RAM = rAM;
	}
	public int getStorage() {
		return Storage;
	}
	public void setStorage(int storage) {
		Storage = storage;
	}
	public int getServerId() {
		return ServerId;
	}
	public void setServerId(int serverId) {
		ServerId = serverId;
	}


}
