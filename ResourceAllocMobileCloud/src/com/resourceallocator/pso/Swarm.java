package com.resourceallocator.pso;
import java.util.*;

//import algorithm.ant.AntConstants;
public class Swarm {

	int gBest;
	
	ArrayList<Particle> particles;
	Swarm(ArrayList<Particle> particles)
	{
		
		this.particles = particles;
		gBest = 0;
		System.out.println("------Swarm Created------");
		System.out.println("------No. of Particles in Swarm <"+particles.size()+">");
	}
	
	public int getgBest() {
		return gBest;
	}
	public void setgBest(int gBest) {
		this.gBest = gBest;
	}
	
}
