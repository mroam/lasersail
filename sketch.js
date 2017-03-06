// Thanks to Jascha Narveson for showing me how to use p5, Feb-Mar 2017

// globals:
//   user interface...
var canv;
var xSlider, ySlider;
var diameterField;
var diameter;

// simulation model
var locations = [];

// charts
var chartMilliseconds = {};
var chartSeconds = {};


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

    diameter = 30;
}

function draw( ) {
    background( /*canvas color, can rgb*/ 77, 23, 255);
    noStroke( /* hides outline */ );
    fill( /*rgb*/ 255, 0, 0);
    ellipse( /*x*/ width / 3, /*y*/ height / 3, /*w and h*/ diameter);
    fill(200, 255, 0);
    ellipse( /*x*/ xSlider.value(), /*y*/ ySlider.value(), /*w and h*/ diameter)
}


// This will 
function flyToAlphaCentauri( ) {
    // we start at position 0, and alpha centauri is at pos (7 light years in meters)
    var pos = 0;
    locations.push(pos);
    // for 
}


function myFieldListener( ) {
    // can also coerce "this.value( )" from string to number by multiplying by 1
    diameter = Number(this.value( )); // "this" is the field that owns this listener 
    // gotta validate!!
}


function test( ) {
    console.log("the myFieldListener isn't checking for numerical input!!")
}
