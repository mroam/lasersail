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
    diameter = 30;
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
    console.log("the myFieldListener isn't checking for numerical input!!")
}
