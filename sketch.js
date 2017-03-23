// Thanks to Jascha Narveson for showing me how to use p5, Feb-Mar 2017

// globals:
//   user interface...
var canv;

// fool around test
var xSlider, ySlider;
var diameterField;
var diameter;

// mission setup
var laserStrengthSlider;

// mission controls
var launchButton;


// constants, from wolframalpha.com
var c = 299792000; // 299,792 km/second
var distToAlphaCentauri = 41530000000; //  4.39 lightyears = 41,530,000,000,000 km


// simulation model
var ship1;  // gets created in "setup()"
var locations = [];
var moneyAvail = 1000.0; // for sailsize, onboard fuel, laser-burn-fuel (choose vertex angle and power and burnDuration)
var laserStrength = 1.0; // units??



// our "SailCraft" object, being created using JN demo "technique 1" (prototype object
// to which methods are added later, has no constructor since we're only going to have 1)
var SailCraft = {
    massGrams: 100, // changes as user buys sailsize and onboard nav fuel, perhaps load up with equipment
    surfaceAreaM2: 1.0, // square meters, variable
    temperatureC: 0, // in celsius. We need to know radiation rate
    maxTemperatureToleranceC: 200,
    minTemperatureToleranceC: -100, 
    dTemperatureCSec: 0.1, // radiation, is factor of temp
    
    x: 0, // loc of ctr of mass, km fr Earth to A.C. along travel path
    y: 0, // loc of ctr of mass, off of path to A.C
    
    dx: 10, // km/sec straight toward alpha centauri
    dy: 0.0, // km/sec off path to alpha c.
    
    angleOfCraft: 0,  // aka theta, craft's turn in degrees with 0
    // being directly on path to AC
    // for 3D use matrix or angles, no?
    dTheta: 0, // turn per second in degrees
    dOmega: 0  // dTheta/dtime
    //dxyRot: 0, // degrees/sec relative to spacecraft's axes, not to travel planes
    //dxzRot: 0, // degrees/sec relative to spacecraft's axes, not to travel planes
   // dzyRot: 0 // degrees/sec relative to spacecraft's axes, not to travel planes
    
    // might remember bend of two elbows e1,e2 of sail, equidistant from center, --E--c--E-- sometime: 
    // user specifies length -- "L"
    // 1g of equipment
};


// laser supplies pressure as pascal (newton/sqMeter) [newton = 1kg * 1m/sec^2] (as force/area )
// force 


// charts
var chartMilliseconds = {};
var chartSeconds = {};
var chartHours = {};
var chartDays = {};
var chartYears = {};

var bgColor;  // can't use "color( )" until p5 is running, so init this in setup( )


// extra factors to add in later: expansion of universe, relativistic effects, etc

function setup( ) {
    canv = createCanvas(800, 600);
    // naming our canvas so we can talk to it, put it into div, etc.
    canv.parent("p5pix");
    // "p5pix" is the html id for the div that holds the canvas
    // see http://p5js.org/reference/#/libraries/p5.dom
    // and http://p5js.org/reference/
    // and  http://p5js.org/reference/#/p5/createSlider
    //  createSlider(min,max,[value],[step])
    bgColor = color(77, 23, 255);

    xSlider = createSlider(0, 800, 400, 5);
    xSlider.parent("xslider");
    // "xslider" is the html id for the div that will contain slider
    xSlider.size(/*length*/ 100);

    ySlider = createSlider(0, 600, 300, 5);
    ySlider.parent("yslider");

    diameterField = createInput(''); // and Input is a live field
    diameterField.value(560);
    diameterField.input(myDiameterFieldListener);
    diameterField.parent("diamField");  // "diamField" is html ID
    
    // mission setup
    laserStrengthSlider = createSlider(0, 800, 400, 5);
    laserStrengthSlider.parent("laserStrengthSlider");
    laserStrengthSlider.size(/*length*/ 100);
     
    laserStrengthField = createInput('');
    laserStrengthField.value(laserStrength);
    laserStrengthField.input(myLaserStrengthFieldListener);
    laserStrengthField.parent("laserStrengthField");


    // mission control
    launchButton = createButton('Launch!');
    launchButton.parent("launchButton");
    // launchButton.position(19, 19);
    launchButton.mouseReleased(flyToAlphaCentauri);
    diameter = 30;  // part of original test, not part of lasersail
    
    setupSailCraft( );
} // setup( )


function setupSailCraft( ) {
    ship1 = Object.create(SailCraft);
    // adding a method to SailCraft in general
    SailCraft.sayStuff = function() {
      console.log('my distance from earth is ' + this.x + ', and my vel toward Alpha C. is: ' + this.dx);
    }
    SailCraft.flyALittle = function flyALittle( secondsSincePrevMove ) {
        // this method will belong to ship1 aka "this"
        this.x = this.x + 5; // fake
    }
} // setupSailCraft( )


function draw( ) {
    background( /*canvas color, can rgb*/ bgColor);
    noStroke( /* hides outline */ );
    fill( /*rgb*/ 255, 0, 0);
    ellipse( /*x*/ width / 3, /*y*/ height / 3, /*w and h*/ diameter);
    fill(200, 255, 0);
    ellipse( /*x*/ xSlider.value(), /*y*/ ySlider.value(), /*w and h*/ diameter)
} // draw( )


// This will 
// 
function flyToAlphaCentauri( ) {
    // we start at position 0, and alpha centauri is at pos (4.7 light years in meters)
    var pos = 0;   // []eventually this will be x,y,z triple
    locations.push(pos);
    // for 
    bgColor = color(random(255), random(255), random(255));  // just to see if button worked
    
    var secsBetweenMoves = 1; 
    var count;
    for(count = 0; count < 10; count++){
         //document.write("Current Count : " + count + "<br />");
        ship1.flyALittle( secsBetweenMoves );
    }

} // flyToAlphaCentauri




function myDiameterFieldListener( ) {
    // can also coerce "this.value( )" from string to number by multiplying by 1
    diameter = Number(this.value( )); // "this" is the field that owns this listener 
    // gotta validate!!
} // myDiameterFieldListener

function myLaserStrengthFieldListener( ) {
    // can also coerce "this.value( )" from string to number by multiplying by 1
    var newLaserStrength = Number(this.value( )); 
    // "this" is the field that owns this listener 
    // gotta validate!!
    if ((newLaserStrength >= laserStrengthMin) && 
        (newLaserStrength <= laserStrengthMax)) {
        laserStrength = newLaserStrength;
        laserStrengthSlider.value(newLaserStrength);
    }
} // myLaserStrengthFieldListener


function test( ) {
    console.log("the myFieldListener isn't checking for numerical input!!");
}
