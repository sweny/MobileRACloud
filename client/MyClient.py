'''
Created on Nov 1, 2014

@author: sweny
'''
import random
from random import randint
import multiprocessing
import logging
import urllib2,json

user_id = 0

def getRandomCPU():
 randCPU = randint(1, 2)
 if randCPU == 1:
    cpuType = "T1"
 elif randCPU == 2:
    cpuType = "T2"
 return cpuType


def getRandomStorage():
 randStorage = randint(8, 32)
 return randStorage

def getRandomMem():
 randMem = randint(1, 4)
 if randMem == 1:
    memVal = 2
 elif randMem == 2:
    memVal = 4
 elif randMem == 3:
    memVal = 8
 elif randMem == 4:
    memVal = 16
 return memVal
 

def getDevice():
 randDevice = randint(1,3)   
 if randDevice == 1:
    DeviceVal = "Iphone6"
 elif randDevice == 2:
    DeviceVal = "Nexus6"
 elif randDevice == 3:
    DeviceVal = "Nokia Lumia 520"
    return DeviceVal
 
def getRandomLocation():
  randomLat = random.uniform(-90.00,90.00)
  randomLong = random.uniform(-180.00,180.00)
  #upto 7 decimals originally
  return round(randomLat,7),round(randomLong,7)


def generateRequest():
    memResource = getRandomMem()
    storageResource = getRandomStorage()
    cpuResource = getRandomCPU()
    location = ""+str(getRandomLocation()[0])+","+str(getRandomLocation()[1])
    device = getDevice()
    network = "100Kbps"
    user_id = 1
    print "Memory :"+str(memResource)+" Storage : "+str(storageResource)+" CPUREsource: "+cpuResource
    #location = "37.335187,-121.881072"
    url = 'http://localhost:8081/requestHandler.js'
    postdata = {'request':{'UserId': str(user_id), 'location': location,'RAM':memResource,'Storage':storageResource,'Device':str(device), 'Network':str(network)}} 
    req = urllib2.Request(url)
    req.add_header('Content-Type','application/json')
    data = json.dumps(postdata)

    response = urllib2.urlopen(req,data)
    data = response.read()
    print data
    
    

if __name__ == '__main__':
    
    for i in range(25):
        
        multiprocessing.log_to_stderr(logging.INFO)
        p = multiprocessing.Process(target=generateRequest)
        p.start()
        p.join()





