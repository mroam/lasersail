"use strict";
// Thanks to Jascha Narveson for showing Mike how to use p5, Feb-Mar 2017

// globals:
//   user interface...
var canv;

// fool around test
var xSlider, ySlider;
var diameterField;
var diameter;

// mission setup
var laserFrequencySlider; // range is laserFrequencyMin&Max
var laserIntensitySlider; // range is laserIntensityMin&Max

// mission controls
var launchButton;

// results
var estTravelTimeField;
var missTargetByField;


// constants, from wolframalpha.com
var cMmPerSec = 299.792; // in Mm/sec, = 299,792km/s = 299792000m/s.
var cKmPerSec = 299792; 
// hmmm, is javascript going to be able to handle the precision??
var distToAlphaCentauri = 41530000000; // in Mm =  4.39 lightyears = 41,530,000,000,000 km

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
var laserFrequencyMin = 0.4289; // in terahertz
     // = 428 900 000 000 Hertz.
var laserFrequencyMax = 1909.506; // in terahertz
     // = 1 909 506 000 000 000 hertz

var laserIntensityMin =  0.0; // in W/m^2
var laserIntensityMax =  1000.0;  // in exaWatt = 10^18 Watt/m^2,
// so 1.0 = petaWatt = 10^15
// entering era of zettawatt (10^21 W/cm^2) = 10^17 W/m^2
    // Laser Intensity or Brightness aka "Intensity" (approx power?)
    // see https://en.wikipedia.org/wiki/Laser  for chart of laser power

    // "Laser-Induced Damage Threshold" LIDT ... at
    // http://lidaris.com/glossary-2/fluence/
    
    // e.g. "A small helium neon laser emits red visible light with a 
    // power of 3.2 mW in a beam that has a diameter of 2.5mm" from
    // https://www.physicsforums.com/threads/intensity-of-laser-beam-inverse-square-law.37462/


// simulation model
var ship1; // gets created in "setup()"
var locations = []; // will be a history of the step-by-step locations of the ship
var moneyAvail = 1000.0; // for sailsize, onboard fuel, laser-burn-fuel (choose vertex angle and power and burnDuration)
var laserFrequency = 1.0; // in teraHertz aka 10^12 hertz (cycles/sec)
var laserIntensity = 1.0; // in meters (?)




// our "SailCraft" object, being created using JN demo "technique 1" (prototype object
// to which methods are added later, has no constructor since we're only going to have 1)
var SailCraft = {
    massGrams: 100.0, // changes as user buys sailsize and onboard nav fuel, perhaps load up with equipment
    surfaceAreaM2: 1.0, // square meters, variable
    temperatureC: 0.0, // in celsius. We need to know radiation rate
    maxTemperatureToleranceC: 200.0,
    minTemperatureToleranceC: -100.0,
    dTemperatureCSec: 0.1, // radiation, is factor of temp

    x: 0.0, // loc of ctr of mass, km fr Earth to A.C. along travel path
    y: 0.0, // loc of ctr of mass, off of path to A.C

    speedX: 10.0, // km/sec straight toward alpha centauri
    speedY: 0.0, // km/sec off path to alpha c.

    angleOfCraft: 0, // aka theta, craft's turn in degrees with 0
    // being directly on path to AC
    // for 3D use matrix or angles, no?
    dTheta: 0.0, // turn per second in degrees
    dOmega: 0.0, // dTheta/dtime

    // might remember bend of two elbows e1,e2 of sail, equidistant from center, --E--c--E-- sometime: 
    // user specifies length -- "L"
    // 1g of equipment
    laserFakePowerPerSec: 1.0 // what units?
};


SailCraft.sayStuff = function () {
    console.log("ship1's distance from earth is " + this.x + ", and my speedX toward Alpha C. is: " + this.speedX + " km/sec");
};


SailCraft.flyALittle = function (secondsSincePrevMove) {
    // this method will belong to ship1 aka "this"
    // speedX and speedY are in km/sec
    this.x = this.x + (this.speedX * secondsSincePrevMove);
    // use set/get so speed limits are enforced!
    this.setSpeedX(this.speedX + (this.laserFakePowerPerSec * secondsSincePrevMove)); 
    // can I call other functions, e.g. 
    //     this.speedX += (this.laser() * secondsSincePrevMove);
};


SailCraft.crossSection = function () {
    // this method will belong to ship1 aka "this"
    return 1.0; // m^2   fake answer, should use this.elbow1 and elbow2
};


SailCraft.setSpeedX = function ( newSpeedX ) {
	// speedX and newSpeedX should be in Km/sec, and (absolute value) should be less than light speed!
	if (Math.abs(newSpeedX) > cKmPerSec) {
		console.log("Ship1 wants newSpeed " + newSpeedX + "Km/Sec which is faster than light (" + cKmPerSec + " Km/Sec). Denied.");
	} else {
		this.speedX = newSpeedX;
	}
}; // SailCraft.setSpeedX( )

// laser causes pressure in pascals (newton/sqMeter) 
//  (as force/area ), units: kg / (m * sec^2).
//
// Newtons are 1kg * 1m / sec^2
// 
// Power is expressed as W (watt), equiv to "1 joule/sec" [meaning "energy/time"] units: kg * m^2/sec^3
// Joule is unit of energy, when force of 1 Newton acts on a body for one meter. units: kg * m^2 / sec^2
// Newton = 1 kg * m/sec^2  (The force necessary to accelerate one kg at rate of 1 m/sec^2. Note: force = m * a, "m" is in kg, "a" is m/sec^2)


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
    laserFrequencySlider = createSlider(laserFrequencyMin, laserFrequencyMax, laserFrequency, /*step*/1);
    laserFrequencySlider.parent("laserFrequencySlider");
    laserFrequencySlider.size(100);/*length*/ 
    laserFrequencyField = createInput('');
    laserFrequencyField.value(laserFrequency);
    laserFrequencyField.input(myLaserFrequencyFieldListener);
    laserFrequencyField.parent("laserFrequencyField");
    laserFrequencyField.size(40);/* length (in pix?)*/

    laserIntensitySlider = createSlider(laserIntensityMin, laserIntensityMax, laserIntensity, /*step*/1);
    laserIntensitySlider.parent("laserIntensitySlider");
    laserIntensitySlider.size(100);/*length*/ 
    laserIntensityField = createInput('');
    laserIntensityField.value(laserIntensity);
    laserIntensityField.input(myLaserIntensityFieldListener);
    laserIntensityField.parent("laserIntensityField");
    laserIntensityField.size(40);/* length (in pix?)*/


    // mission control
    launchButton = createButton('Launch!');
    launchButton.parent("launchButton");
    // launchButton.position(19, 19);
    launchButton.mouseReleased(flyToAlphaCentauri);
    diameter = 30; // part of original test, not part of lasersail
    
    // results
    estTravelTimeField = createInput('');
    estTravelTimeField.parent("estTravelTimeField");
    estTravelTimeField.size(70);/* length (in pix?)*/
    missTargetByField = createInput('');
    missTargetByField.parent("missTargetByField");
    missTargetByField.size(70);/* length (in pix?)*/

    ship1 = setupSailCraft(0, 0);/*startloc*/
} // setup()


function setupSailCraft(inx, iny) {
    var temp = Object.create(SailCraft);
    // do stuff
    temp.x = inx;
    temp.y = iny;
    return temp;
} // setupSailCraft()


function draw() {
    background( /*canvas color, can rgb*/ bgColor);
    noStroke( /* hides outline */ );
    fill( /*rgb*/ 255, 0, 0);
    ellipse( /*x*/ width / 3, /*y*/ height / 3, /*w and h*/ diameter);
    fill(200, 255, 0);
    ellipse( /*x*/xSlider.value(), /*y*/ySlider.value(), /*w and h*/ diameter);
    
    laserFrequencyField.value(laserFrequencySlider.value());
    laserIntensityField.value(laserIntensitySlider.value());
} // draw()


// This will 
// 
function flyToAlphaCentauri() {
    // we start at position 0, and alpha centauri is at pos (4.7 light years in meters)
    var pos = 0; // []eventually this will be x,y,z triple
    locations.push(pos);
    // for 
    bgColor = color(random(255), random(255), random(255)); // just to see if button worked

    var secsBetweenMoves = 1;
    ship1.sayStuff(); // goes to console
    var count;
    for (count = 0; count < 10; ++count) {
        //document.write("Current Count : " + count + "<br />");
        ship1.flyALittle(secsBetweenMoves);
        ship1.sayStuff(); // goes to browser console (in safari activate menu Develop:ShowWebInspector)
    }
    // distToAlphaCentauri is in Mm (megameters = million meters)
    // ship1 speedX is in km/sec so km is 1000 times smaller than Mm)
    // and 31,558,150 seconds per year
    var kmPerMm = 0.001; // 1 thousandth
    var secondsPerYear = 31557600.0; // with year = 365.25 days
    estTravelTimeField.value( distToAlphaCentauri / (ship1.speedX * secondsPerYear * kmPerMm));
    missTargetByField.value( ship1.speedY  * secondsPerYear * kmPerMm );

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
function myLaserFrequencyFieldListener() {
    // can also coerce "this.value()" from string to number by multiplying by 1
    var newLaserFrequency = Number(this.value());
    console.log("new laserFreq=" + newLaserFrequency);
    // "this" is the field that owns this listener 
    // gotta validate!!
    if ((newLaserFrequency >= laserFrequencyMin) && (newLaserFrequency <= laserFrequencyMax)) {
        laserFrequency = newLaserFrequency;
        laserFrequencySlider.value(newLaserFrequency);
    }
} // myLaserFrequencyFieldListener


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