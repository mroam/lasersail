import graphics
import math
#Constants:
c = 299792458 #m/s
laserFrequency = input('Enter a laser freqeuncy between 400-3*10^16 Hz:')
laserPower = input('Enter a laser power:')
sailArea = input('Enter a size for the sail:')
thrusterFuel = input('Enter amount of thruster fuel: ')
wSpot = 
laserWavelength = c/laserFrequency
laserDivergence = laserWavelength/(pi * wSpot)
distanceFromSol = 
equilibriumTemp = 
#Mylar specs:
mylarDensity = 1.39 #g/cm^3
meltingPoint = 254 #Celsius
tensileStrength = 24 #kg/mm^2
forceApplied =                ##Will be a function of laserFrequency, laserPower, and distanceFromSol
sailMass =                    ##Will be a function of area
totalMass = thrusterFuel + sailMass
critMass =                    ##Will be the maximum mass the sail can have to be pushed by light. WIll find later
sailAccel = forceApplied * totalMass ##Acceleration of sail
finalV = (2*sailAccel*distanceFromSol)^1/2 ##Final velocity after laser stops firing
if totalMass > critMass:
    print "You are too heavy!"

if meltingPoint > equilibriumTemp:
    print "You're dead!"

if forceApplied > tensileStrength:
    print "You're dead!"

