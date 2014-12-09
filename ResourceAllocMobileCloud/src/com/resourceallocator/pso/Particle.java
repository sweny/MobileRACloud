package com.resourceallocator.pso;
public class Particle {

	int velocity;
	int position;
	int index;
	double[] resource;
	double pBest;
	int vm;
	int exemplarVector;
	Particle(double[] resource,int position,int velocity,int vm,int index)
	{
		this.resource = resource;
		this.velocity = velocity;
		this.position = position;
		this.index = index;
		this.vm = vm;
		pBest = position;
		exemplarVector = 0;
	}
	
	public double getIndex() {
		return index;
	}
	
	public double getpBest() {
		return pBest;
	}

	public void setpBest(double pBest) {
		this.pBest = pBest;
	}


	public int getVelocity() {
		return velocity;
	}
	
	
	

	public void setVelocity(int velocity) {
		this.velocity = velocity;
	}


	public int getPosition() {
		return position;
	}


	public void setPosition(int position) {
		this.position = position;
	}


	public int getExemplarVector() {
		return exemplarVector;
	}


	public void setExemplarVector(int exemplarVector) {
		this.exemplarVector = exemplarVector;
	}


	


}
