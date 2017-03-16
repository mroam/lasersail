// Thanks to Jascha Narveson for showing me how to use p5, Feb-Mar 2017

// globals:
//   user interface...
var canv;
var xSlider, ySlider;
var diameterField;
var diameter;
var launchButton;


// constants, from wolframalpha.com
var c = 299792000; // 299,792 km/second
var distToAlphaCentauri = 41530000000; //  4.39 lightyears = 41,530,000,000,000 km


// simulation model
var locations = [];
var moneyAvail = 1000.0; // for sailsize, onboard fuel, laser-burn-fuel (choose vertex angle and power and burnDuration)


// our "SailCraft" object, being created using JN demo "technique 1" (prototype object
// to which methods are added later, has no constructor since we're only going to have 1)
var SailCraft = {
    massGrams: 100, // changes as user buys sailsize and onboard nav fuel, perhaps load up with equipment
    surfaceAreaM2: 1.0, // square meters, variable
    temperatureC: 0, // in celsius. We need to know radiation rate
    maxTemperatureToleranceC: 200,
    minTemperatureToleranceC: -100, 
    dTemperatureCSec: 0.1, // radiation, is factor of temp
    
    x: 0, // loc of ctr of mass, km to right of travel path
    y: 0, // km forward of travel path (looking down onto craft from Alpha Centauri)
    z: 0, // km distance from earth to Alpha Centauri
    
    dx: 0, // km/sec
    dy: 0, // km/sec
    dz: 10, // km/sec straight toward alpha centauri
    
    angleOfCraft: 0,  // this has to be specified in some matrix way, no?
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
    diameterField.input(myFieldListener);
    diameterField.parent("diamField");  // "diamField" is html ID

    launchButton = createButton('Launch!');
    launchButton.parent("launchButton");
    // launchButton.position(19, 19);
    launchButton.mouseReleased(flyToAlphaCentauri);
    diameter = 30;  // part of original test, not part of lasersail
    
    var ship1 = Object.create(SailCraft);
    // adding a method to SailCraft
    SailCraft.sayStuff = function() {
      console.log('my distance from earth is ' + this.z + ', and my vel is: ' + this.dz);
    }
} // setup( )


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
} // flyToAlphaCentauri


function myFieldListener( ) {
    // can also coerce "this.value( )" from string to number by multiplying by 1
    diameter = Number(this.value( )); // "this" is the field that owns this listener 
    // gotta validate!!
} // myFieldListener


function test( ) {
    console.log("the myFieldListener isn't checking for numerical input!!");
}
