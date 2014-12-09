package com.resourceallocator.pso;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

public class PSOAlgorithm {


	/*
	 *Algorithm Steps
	 *1)Initialization
	 *  Randomly generate each particle's velocity and position
	 *  Repair infeasible positions into feasible positions
	 *  Evaluate the fitness value of each particle
	 *  Fill the pBest of each particle with its current position
	 *  Update the exemplar vector of each particle
	 *  
	 *2) Optimization
	 *	 Repeat
	 *    For each particle 
	 *     if particle ceases improving rg iterations 
	 *      update its exemplar vector;
	 *     end if
	 *      Update particle's velocity and position;
	 *     if particle position is feasible 
	 *      Evaluate the fitness value of the particle
	 *    	Update the pBest
	 *     end if
	 *     End for
	 */ 

	private double cpu;
	private double hd;
	private double ram;
	private static PSOAlgorithm PSOAlgorithm;
	int numOfVm;
	int range;
	int numOfParticles;
	ArrayList<Particle> particle;
	Random random;
	Swarm swarm;
	int req;
	int location;
	HashMap<Integer, Double> currentCPUState;
	HashMap<Integer, Double> currentStorageState;
	HashMap<Integer, Double> currentRAMState;
	HashMap<Integer, Integer> currentNoOfRequests;


	private PSOAlgorithm()
	{
		numOfVm = PSOConstants.getInstance().getNoOfLocations();
		range = 10;
		numOfParticles = range * numOfVm;
		random = new Random();
		particle = new ArrayList<Particle>();
		currentCPUState = new HashMap<Integer,Double>();
		currentStorageState = new HashMap<Integer,Double>();
		currentRAMState = new HashMap<Integer,Double>();
		currentNoOfRequests = new HashMap<Integer,Integer>();
		init();
		//init(double cpu, double storage, double ram, double time);
	}

	public static synchronized PSOAlgorithm getInstance() {
		if(PSOAlgorithm == null) {
			PSOAlgorithm = new PSOAlgorithm();
		}
		return PSOAlgorithm;
	}


	public double getCpu() {
		return cpu;
	}


	public void setCpu(double cpu) {
		this.cpu = cpu;
	}


	public double getHd() {
		return hd;
	}


	public void setHd(double hd) {
		this.hd = hd;
	}


	public double getRam() {
		return ram;
	}


	public void setRam(double ram) {
		this.ram = ram;
	}

	public int runPSOAlgorithm(double cpu, double storage, double ram, double time,int request)
	{
		location = randomInt(0, numOfVm);
		System.out.println("In runPSOAlgorithm");

		optimize(cpu,storage,ram,time);


		return location;
	}

	public double randomDouble(double min, double max) {

		double randomDoubleValue = min + (max - min) * random.nextDouble();
		return randomDoubleValue;
	}

	public int randomInt(int min, int max) {

		int randomIntValue = random.nextInt((max - min) + 1) + min;
		return randomIntValue;
	}

	public void evaluateFitness(Particle p)
	{

		System.out.println("Evaluating fitness for Particle<"+p.getIndex()+">");
		int loc = location;
		p.setpBest(loc);
	}

	public void updateExemplarVecor(Particle p)
	{
		System.out.println("Updating Exemplar Vector.....");
		p.setPosition(randomInt(1, 10));
		p.setVelocity(randomInt(1, 10));
		p.setExemplarVector(p.getVelocity());
	}

	public void insertIntoBlackBoard(int vm,double cpu,double hd,double ram)
	{
		System.out.println("InsertIntoBlackBoard....CPU<"+cpu+"> hd<"+hd+"> ram<"+ram+">");
		currentCPUState.put(vm, cpu);
		currentStorageState.put(vm, hd);
		currentRAMState.put(vm, ram);
	}

	public void updateBlackBoard(int vm,double cpu,double hd,double ram)
	{
		System.out.println("BlackBoard Updated After Request Allocated.."+vm+" cpu"+cpu);
		System.out.println("Before Updating: "+currentCPUState.get(vm)+" "+currentCPUState.get(vm)+" "+currentCPUState.get(vm));
		currentCPUState.put(vm, currentCPUState.get(vm)- cpu);
		currentStorageState.put(vm, currentStorageState.get(vm)-hd);
		currentRAMState.put(vm, currentRAMState.get(vm)- ram);
		System.out.println("After Updating: "+currentCPUState.get(vm)+" "+currentCPUState.get(vm)+" "+currentCPUState.get(vm));
	
	}
	
	public void decreaseLocationDetails(int location, double currentCPUState, double currentStorageState, double currentRAMState) {
		this.currentCPUState.put(location, this.currentCPUState.get(location) - currentCPUState);
		this.currentStorageState.put(location, this.currentStorageState.get(location) - currentStorageState);
		this.currentRAMState.put(location, this.currentRAMState.get(location) - currentRAMState);
	}
	
	public void init()
	{
		System.out.println("Init Called");
		double[] resource = new double[3];
		int j = 0;
		int n=1;
		req = 0;
		
		//int countOfVm = 0;
		for(int i=1; i<=numOfVm; i++)
		{
			currentNoOfRequests.put(i,0);
			insertIntoBlackBoard(i, PSOConstants.getInstance().getLocationMaxCPU().get(i), PSOConstants.getInstance().getLocationMaxHD().get(i),PSOConstants.getInstance().getLocationMaxRAM().get(i));
			for(int k=0;k<range;k++)
			{
				j=0;
				resource[j] = randomDouble(0.0,PSOConstants.getInstance().getLocationMaxCPU().get(i));
				resource[j+1] = randomDouble(0.0,PSOConstants.getInstance().getLocationMaxHD().get(i));
				resource[j+2] = randomDouble(0.0,PSOConstants.getInstance().getLocationMaxRAM().get(i));
				particle.add(new Particle(resource, randomInt(0, 20), randomInt(0, 20), i,n));

				System.out.println("Particle < "+n+" >"+" : "+"<CPU>:"+resource[j]+"| <HD>:"+resource[j+1]+"| <RAM>"+resource[j+2]);
				n++;
			}
		}


			for(Particle p : particle)
		{
			evaluateFitness(p);
			updateExemplarVecor(p);
		}

		swarm = new Swarm(particle);
		swarm.setgBest(1);

	}

	public void optimize(double cpu, double storage, double ram, double time)
	{
		//int[] tempArr;
		System.out.println("In Optimize.....");
		ArrayList<Integer> tempArr = new ArrayList<Integer>();
		for(int i=1;i<=numOfVm;i++)
		{
			if(cpu < currentCPUState.get(i) && storage < currentStorageState.get(i) && ram <currentRAMState.get(i))
			{
				tempArr.add(i);
			}

		}
		
		location = tempArr.get(random.nextInt(tempArr.size()));

		for(Particle p : particle)
		{
			evaluateFitness(p);
			updateExemplarVecor(p);
		}
		System.out.println("Location:"+location);
		updateBlackBoard(location, cpu, storage, ram);
	}
	


}
