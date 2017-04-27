import graphics
import math
#Constants:
c = 299792458 #m/s
laserFrequency = input('Enter a laser freqeuncy between 400-3*10^16 Hz:')
laserPower = input('Enter a laser power:') # watts = ( newton * m) /sec  # or calculate power = k * (amp^2) * freq
# note: "intensity" is power/area of the spread out laser
sailArea = input('Enter a size for the sail:')  # m^2
thrusterFuel = input('Enter amount of thruster fuel: ')
wSpot = #we might be able to get rid of this
# 
laserWavelength = c/laserFrequency
laserDivergence = laserWavelength/(pi * wSpot) #angle # might just need some constant instead of pi*wSPOT
distanceFromSol =     # m
equilibriumTemp =       # celsius
#Mylar specs:
mylarDensity = 1.39 #g/cm^3
meltingPoint = 254 #Celsius
tensileStrength = 24 #kg/mm^2

forceApplied =         #newtons = kg m/sec/sec    
##Will be a function of laserPower (- waste including heat), laserDivergence, and distanceFromSol

sailMass =          #kg          ##Will be a function of area
totalMass = thrusterFuel + sailMass  #kg
critMass =       #kg             ##Will be the maximum mass the sail can have to be pushed by light. WIll find later
sailAccel = forceApplied * totalMass  # m/sec/sec ###Acceleration of sail
finalV = (2*sailAccel*distanceFromSol)^1/2  # m/sec  ##Final velocity after laser stops firing
if totalMass > critMass:
    print "You are too heavy!"

if meltingPoint > equilibriumTemp:
    print "You're dead!"

if forceApplied > tensileStrength:
    print "You're dead!"

