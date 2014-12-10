package com.strategyselection;

import com.resourceallocator.ant.Ant;
import com.resourceallocator.honeybee.beeColony;
import com.resourceallocator.locationaware.LocationAware;
import com.resourceallocator.pso.pso;

public class StrategySelect extends Server{

	private ResourceAllocatorStrategy resourceAllocatorStrategy;

	public void selectStrategy(String reqMsg) {		
		int randomNum = 0 + (int)(Math.random()*(4));
		randomNum = 2;
		switch (randomNum){		
		case 0: 	resourceAllocatorStrategy = new beeColony();
					break;
		case 1: 	resourceAllocatorStrategy = new Ant();
					break;
		case 2: 	resourceAllocatorStrategy = new LocationAware();
					break;
		case 3: 	resourceAllocatorStrategy = new pso();
					break;
		default: 	resourceAllocatorStrategy = new beeColony();
					break;	
		}		
		resourceAllocatorStrategy.runResourceAllocator(reqMsg);
	}	
}
