"use strict";
// Thanks to Jascha Narveson for showing Mike how to use p5, Feb-Mar 2017
// future plans: costs for power, saved presets, some sliders should be logarithmic

// globals:
//   user interface...
var canv;

// fool around test
var xSlider, ySlider;
var diameterField;
var diameter;

// mission setup
var laserFrequencySlider; // range is laserFrequencyMin&Max
// var laserIntensitySlider; // range is laserIntensityMin&Max
var laserPowerSlider; // range is laserPowerMin&MaxMw

// mission controls
var launchButton;

// results
var estTravelTimeField;
var missTargetByField;
var speedXKmPerSecFieldField;


// constants, 
var kmPerMm = 0.001; // 1 thousandth
var secondsPerYear = 31557600.0; // with year = 365.25 days

// constants from wolframalpha.com
var cMmPerSec = 299.792; // in Mm/sec, = 299,792km/s = 299792000m/s.
var cKmPerSec = 299792;
// hmmm, is javascript going to be able to handle the precision??
var distEarthToAlphaCentauriMm = 41530000000; // in Mm =  4.39 lightyears = 41,530,000,000,000 km

// for metric prefixes see http://www.nanotech-now.com/metric-prefix-table.htm
/* Known laser wavelengths range from exciplex "excimer" laser (lasik!) for power & pulsing, 
see https://en.wikipedia.org/wiki/Excimer_laser
with 157nm (nanometer = 0.000 000 001m = 0.157µm) (ultraviolet) 
up to 699µm (micrometer = micron = 0.000 001m) (far infra-red) 
from methanol laser, see https://en.wikipedia.org/wiki/Dye_laser

Wavelengths have corresponding frequencies:
     157nm = 1909506 GHz (with energy 7.9eV)
     699µm = 428.9 GHz (with energy=0.00177eV)
( see https://en.wikipedia.org/wiki/List_of_laser_types
 and wolframalpha.com/input?i=551.58+terahertz
and laser wavelength to frequency conversion www.photonics.byu.edu/fwnomograph.phtml
*/
var laserPowerMWattMin = 450.0 ; // in MWatts
var laserPowerMWattMax = 65000.0; // in MWatts, so = 65 G Watts 

var laserFrequencyTHzMin = 0.4289; // in terahertz, tera means 10^12
     // = 428 900 000 000 Hertz.
var laserFrequencyTHzMax = 1909.506; // in terahertz
     // = 1 909 506 000 000 000 hertz

/*
var laserIntensityMin =  0.0; // in W/m^2
var laserIntensityMax =  1000.0;  // in exaWatt = 10^18 Watt/m^2,
// so 1.0 = petaWatt = 10^15
// entering era of zettawatt (10^21 W/cm^2) = 10^17 W/m^2
    // Laser Intensity or Brightness aka "Intensity" ( power per area )
    // see https://en.wikipedia.org/wiki/Laser  for chart of laser power

    // "Laser-Induced Damage Threshold" LIDT ... at
    // http://lidaris.com/glossary-2/fluence/
    
    // e.g. "A small helium neon laser emits red visible light with a 
    // power of 3.2 mW in a beam that has a diameter of 2.5mm" from
    // https://www.physicsforums.com/threads/intensity-of-laser-beam-inverse-square-law.37462/
*/
var laserCostPerWatt = 1.0; // ?? for game

// simulation model
var ship1; // gets created in "setup()"
var shipStartingSpeedXKmPerSec = 10; // assume we give ships a starting shove
var locations = []; // will be a history of the step-by-step locations of the ship
var moneyAvail = 1000.0; // for sailsize, onboard fuel, laser-burn-fuel (choose vertex angle and power and burnDuration)

var laserFrequencyTHz = 1.0; // in teraHertz aka 10^12 hertz (cycles/sec)
//var laserIntensity = 1.0; // in what units?  intensity= power/(areaOfTheSpreadOutLaser) so 
//var laserAmplitude =  1.0;  // units? values?? 
var laserArraySizem2 = 12.0;  // ????? totally fake number
var laserPowerMWatt = 450.0; // in MWatts
var laserPowerConstant = 1.0; // ??     // # watts = ( newton * m) /sec  # or calculate power = k * (amp^2) * freq





// our "SailCraft" object, being created using JN demo "technique 1" (prototype object
// to which methods are added later, has no constructor since we're only going to have 1)
var SailCraft = {
    massGrams: 100.0, // changes as user buys sailsize and onboard nav fuel, perhaps load up with equipment
    thrusterFuel: 1.0, // unit? perhaps cc, then we need mass and dV
	
    surfaceAreaM2: 50.0, // square meters, variable
	
    temperatureC: 0.0, // in celsius. We need to know radiation rate
    maxTemperatureToleranceC: 200.0,
    minTemperatureToleranceC: -100.0,
    dTemperatureCSec: 0.1, // radiation, is factor of temp
	
    reflectivity: 0.9, // percent, approx (40 year mission article by ? uses ~0.87 (87%))

    xKm: 0.0, // loc of ctr of mass, km fr Earth to A.C. along travel path
    yKm: 0.0, // loc of ctr of mass, off of path to A.C

    speedXKmPerSec: shipStartingSpeedXKmPerSec, // starting speed, km/sec straight toward alpha centauri
	// note: iss is orbiting at 7.6 km/sec, so sailcraft launched from orbit could be a bit faster.
    speedYKmPerSec: 0.0, // km/sec off path to alpha c.

    angleOfCraft: 0, // aka theta, craft's turn in degrees with 0
    // being directly on path to AC
    // for 3D use matrix or angles, no?
    dTheta: 0.0, // turn per second in degrees
    dOmega: 0.0, // dTheta/dtime

    // might remember bend of two elbows e1,e2 of sail, equidistant from center, --E--c--E-- sometime: 
    // user specifies length -- "L"
    // 1g of equipment
    laserFakePowerPerSec: 1.0, // watts = ( newton * m) /sec  # or calculate power = k * (amp^2) * freq
};


SailCraft.sayStuff = function () {
    console.log("ship1's distance from earth is " + this.xKm + "Km, and my speedXKmPerSec toward Alpha C. is: " + this.speedXKmPerSec + " km/sec");
};


SailCraft.flyALittle = function (secondsSincePrevMove) {
    // this method will belong to ship1 aka "this"
    // speedXKmPerSec and speedYKmPerSec are in km/sec
    this.xKm = this.xKm + (this.speedXKmPerSec * secondsSincePrevMove);
    // use set/get so speed limits are enforced!
    
    // var laserPowerMw = setByUser 
    // note: laserPowerConstant * laserAmplitude * laserAmplitude * laserFrequency;  // lot of unknowns here!
    var currDistKm = this.distanceFromLaserKm( );
       // 
    // var laserPowerAppliedMw = laserPowerMw / (currDistKm * currDistKm) ; // units??
    var laserWavelengthnm = cKmPerSec / laserFrequencyTHz;  // in "n"anometer
    
       // ?? have to check units (and their prefixes!) from here onward

    var laserSpotSizem2 = (2.44 * currDistKm * laserWavelengthnm ) / laserArraySizem2;  // ?? check units!! m? km?
    var laserIntensity = laserPowerMWatt / laserSpotSizem2;
    var laserPressure = (2 * laserIntensity) / cKmPerSec;  // yes, that speed of light c
      // laser causes pressure in pascals (newton/sqMeter) 
      //  (as Force / area ), units: kg / (m * sec^2).
      // Newtons are 1kg * 1m / sec^2
	
    var laserForce = laserPressure * this.surfaceAreaM2;
       // The metric unit of force is the newton (abbreviated N) AKA force/area
       // Newton = 1 kg * m/sec^2  (The force necessary to accelerate one kg at rate of 1 m/sec^2. 
    var accell = laserForce / this.massGrams;
    
// Power is expressed as W (watt), equiv to "1 joule/sec" [meaning "energy/time"] units: kg * m^2/sec^3
// Joule is unit of energy, when force of 1 Newton acts on a body for one meter. units: kg * m^2 / sec^2
// Newton = 1 kg * m/sec^2  (The force necessary to accelerate one kg at rate of 1 m/sec^2. 
// Note: force = m * a, "m" is in kg, "a" is m/sec^2
// "Work" is done when a force is applied through a distance

    this.setspeedXKmPerSec(this.speedXKmPerSec + accell);
		   // was this.speedXKmPerSec + (this.laserFakePowerPerSec * secondsSincePrevMove)); 
    // can I call other functions, e.g. 
    //     this.speedXKmPerSec += (this.laser() * secondsSincePrevMove);
};

//

SailCraft.setspeedXKmPerSec = function ( newspeedXKmPerSec ) {
	// speedX and newSpeedX should be in Km/sec, and (absolute value) should be less than light speed!
	if (Math.abs(newspeedXKmPerSec) > cKmPerSec) {
		console.log("Ship1 wants newSpeed " + newspeedXKmPerSec + "Km/Sec which is faster than light (" + cKmPerSec + " Km/Sec). Denied.");
	} else {
		this.speedXKmPerSec = newspeedXKmPerSec;
	}
}; // SailCraft.setspeedXKmPerSec( )



SailCraft.crossSection = function () {
    // this method will belong to ship1 aka "this"
    return 1.0; // m^2   fake answer, should use this.elbow1 and elbow2
};

SailCraft.distanceFromLaserKm = function () {
	return this.xKm;  // ??
	// cheap first attempt, inaccurate if laser moves and if "y" is non zero
};

// charts
var chartMilliseconds = {};
var chartSeconds = {};
var chartHours = {};
var chartDays = {};
var chartYears = {};

var bgColor; // can't use "color()" creator until p5 is running, so init this in setup()


// extra factors to add in later: expansion of universe, relativistic effects, etc

function setup() {
    canv = createCanvas(800, 600);
    // naming our canvas so we can talk to it, put it into div, etc.
    canv.parent("p5pix");
    // "p5pix" is the html id for the div that holds the canvas
    // see http://p5js.org/reference/#/libraries/p5.dom
    // and http://p5js.org/reference/
    // and http://p5js.org/reference/#/p5/createSlider
    //  createSlider(min,max,[value],[step])
    bgColor = color(77, 23, 255);

    xSlider = createSlider(/*min*/0, /*max*/800, /*startVal*/400, /*step*/5);
    xSlider.parent("xslider");
    // "xslider" is the html id for the div that will contain slider
    xSlider.size(100);/* length (in pix?)*/

    ySlider = createSlider(0, 600, 300, 5);
    ySlider.parent("yslider");
    ySlider.size(100);/* length (in pix?)*/

    diameterField = createInput(''); // and Input is a live field
    diameterField.value(560);
    diameterField.input(myDiameterFieldListener);
    diameterField.parent("diamField"); // "diamField" is html ID
    diameterField.size(40);/* length (in pix?)*/

    // mission setup
    laserPowerMWattSlider = createSlider(laserPowerMWattMin, laserPowerMWattMax, laserPowerMWatt, /* step*/ 1);
    laserPowerMWattSlider.parent("laserPowerMWattSlider");
    laserPowerMWattSlider.size(100);/*length*/ 
    laserPowerMWattField = createInput('');
    laserPowerMWattField.value(laserPowerMWatt);
    laserPowerMWattField.input(myLaserPowerMWattFieldListener);
    laserPowerMWattField.parent("laserPowerMWattField");
    laserPowerMWattField.size(40);/* length (in pix?)*/
    
    laserFrequencyTHzSlider = createSlider(laserFrequencyTHzMin, laserFrequencyTHzMax, laserFrequencyTHz, /*step*/1);
    laserFrequencyTHzSlider.parent("laserFrequencyTHzSlider");
    laserFrequencyTHzSlider.size(100);/*length*/ 
    laserFrequencyTHzField = createInput('');
    laserFrequencyTHzField.value(laserFrequencyTHz);
    laserFrequencyTHzField.input(myLaserFrequencyTHzFieldListener);
    laserFrequencyTHzField.parent("laserFrequencyTHzField");
    laserFrequencyTHzField.size(40);/* length (in pix?)*/

//    laserIntensitySlider = createSlider(laserIntensityMin, laserIntensityMax, laserIntensity, /*step*/1);
//    laserIntensitySlider.parent("laserIntensitySlider");
//    laserIntensitySlider.size(100);/*length*/ 
//    laserIntensityField = createInput('');
//    laserIntensityField.value(laserIntensity);
//    laserIntensityField.input(myLaserIntensityFieldListener);
//    laserIntensityField.parent("laserIntensityField");
//    laserIntensityField.size(40);/* length (in pix?)*/


    // mission control
    launchButton = createButton('Launch!');
    launchButton.parent("launchButton");
    // launchButton.position(19, 19);
    launchButton.mouseReleased(flyToAlphaCentauri);
    diameter = 30; // part of original test, not part of lasersail
    
    // results
    estTravelTimeField = createInput('');
    estTravelTimeField.parent("estTravelTimeField");
    estTravelTimeField.size(140);/* length (in pix?) */
    
    missTargetByField = createInput('');
    missTargetByField.parent("missTargetByField");
    missTargetByField.size(140);/* length (in pix?) */
    
    speedXKmPerSecField = createInput('');
    speedXKmPerSecField.parent("speedXKmPerSecField");
    speedXKmPerSecField.size(140); /* length (in pix?) */

    ship1 = setupSailCraft(0, 0);/*startloc*/
} // setup()


function setupSailCraft(inxKm, inyKm) {
    var temp = Object.create(SailCraft);
    // do stuff
    temp.xKm = inxKm;
    temp.yKm = inyKm;
    return temp;
} // setupSailCraft()


function draw() {
    background( /*canvas color, can rgb*/ bgColor);
    noStroke( /* hides outline */ );
    fill( /*rgb*/ 255, 0, 0);
    ellipse( /*x*/ width / 3, /*y*/ height / 3, /*w and h*/ diameter);
    fill(200, 255, 0);
    ellipse( /*x*/xSlider.value(), /*y*/ySlider.value(), /*w and h*/ diameter);
    
    laserFrequencyTHzField.value(laserFrequencyTHzSlider.value( ));
    laserPowerMWattField.value(laserPowerMWattSlider.value( ));
    // laserIntensityField.value(laserIntensitySlider.value());
} // draw()


// This will 
// 
function flyToAlphaCentauri() {
    // this should reset ALL starter values
    ship1.speedXKmPerSec = shipStartingSpeedXKmPerSec;
    // we start at position 0, and alpha centauri is at pos (4.7 light years in meters)
    var pos = 0; // []eventually this will be x,y,z triple
    locations.push(pos);
    // for 
    bgColor = color(random(255), random(255), random(255)); // just to see if button worked

    var secsBetweenMoves = 0.01;
    ship1.sayStuff(); // goes to console
    var count;
    for (count = 0; count < 100; ++count) {
        //document.write("Current Count : " + count + "<br />");
        ship1.flyALittle(secsBetweenMoves);
        ship1.sayStuff(); // goes to browser console (in safari activate menu Develop:ShowWebInspector)
    }
    // distToAlphaCentauri is in Mm (megameters = million meters)
    // ship1 speedXKmPerSec note km is 1000 times smaller than Mm)
    // and 31,558,150 seconds per year
    estTravelTimeField.value( distEarthToAlphaCentauriMm / (ship1.speedXKmPerSec * secondsPerYear * kmPerMm));
    missTargetByField.value( ship1.speedYKmPerSec  * secondsPerYear * kmPerMm );
    speedXKmPerSecField.value( ship1.speedXKmPerSec );

} // flyToAlphaCentauri




function myDiameterFieldListener() {
    // can also coerce "this.value()" from string to number by multiplying by 1
    diameter = Number(this.value()); // "this" is the field that owns this listener 
    // gotta validate!!
} // myDiameterFieldListener


// following is a bit useless because the field isn't really typable
// now that the slider value gets constantly drawn into field.
// The validation code in here should get put somewhere useful, I 
// suppose, though the slider is restricted to proper values, no?
function myLaserFrequencyTHzFieldListener() {
    // can also coerce "this.value()" from string to number by multiplying by 1
    var newLaserFrequencyTHz = Number(this.value());
    console.log("new laserFreqTHz=" + newLaserFrequencyTHz);
    // "this" is the field that owns this listener 
    // gotta validate!!
    if ((newLaserFrequencyTHz >= laserFrequencyTHzMin) && (newLaserFrequencyTHz <= laserFrequencyTHzMax)) {
        laserFrequencyTHz = newLaserFrequencyTHz;
        laserFrequencyTHzSlider.value(newLaserFrequencyTHz);
    }
} // myLaserFrequencyFieldListener



// following is a bit useless because the field isn't really typable
// now that the slider value gets constantly drawn into field.
// The validation code in here should get put somewhere useful, I 
// suppose, though the slider is restricted to proper values, no?
function myLaserPowerMWattFieldListener() {
    // can also coerce "this.value()" from string to number by multiplying by 1
    var newLaserPowerMWatt = Number(this.value());
    console.log("new laserPowMWatt=" + newLaserPowerMWatt);
    // "this" is the field that owns this listener 
    // gotta validate!!
    if ((newLaserPowerMWatt >= laserPowerMWattMin) && (newLaserPowerMWatt <= laserPowerMWattMax)) {
        laserPowerMWatt = newLaserPowerMWatt;
        laserPowerMWattSlider.value(newLaserPowerMWatt);
    }
} // myLaserPowerMWattFieldListener


// following is a bit useless because the field isn't really typable
// now that the slider value gets constantly drawn into field.
// The validation code in here should get put somewhere useful, I 
// suppose, though the slider is restricted to proper values, no?
function myLaserIntensityFieldListener() {
    // can also coerce "this.value()" from string to number by multiplying by 1
    var newLaserIntensity = Number(this.value());
    // "this" is the field that owns this listener 
    // gotta validate!!
    if ((newLaserIntensity >= laserIntensityMin) && (newLaserIntensity <= laserIntensityMax)) {
        console.log("new wannabe laserIntensity=" + newLaserIntensity);
        laserIntensity = newLaserIntensity;
        laserIntensitySlider.value(newLaserIntensity);
    } else {
        console.log("rejected laserIntensity '" + this.value() + "'");
    }
} // myLaserIntensityFieldListener


function test() {
    console.log("the myFieldListener isn't checking for numerical input!!");
}
