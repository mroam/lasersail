/*
Data taken from:

https://vincentarelbundock.github.io/Rdatasets/datasets

"Waiting time between eruptions and the duration of the eruption for the Old Faithful geyser in Yellowstone National Park, Wyoming, USA."
*/


// vars for our table and our canvas
var table, canv;

// stats about the data
var numRows;
var durationMin = null; // a JS primitive that means "nothing." Used by programmers to initialize vars that will be set later.
var durationMax = null;
var waitTimeTotal = 0;

// an array to hold the Datapoint objects (defined below)
var dataset = [];


var graph = {};  // make an empty object for the graph!


// create a constructor function for a Datapoint object
// capitalization is just a convention - JavaScript doesn't treat capitalized variables differently

var Datapoint = function (observationNumber, duration, timeToNext) {
    this.observationNumber = observationNumber; // add a property 'observationNumber' to the object
    this.duration = duration; // add a property called 'duration' to the object
    this.timeToNext = timeToNext; // add a property 'timeToNext' to the obejct
}

// adding a method.  We could do this in the function constructor above, but
// adding it to the Object's prototype means we can create one shared function for all
// instances of Datapoint, rather than a fresh copy of the function for each instance = memory saving.

Datapoint.prototype.printMeOut = function () {
    console.log("datapoint number: " + this.observationNumber);
    console.log("duration time, in minutes: " + this.duration);
    console.log("time to next eruption, in min: " + this.timeToNext);
}

function preload() {
    // read in the csv
    
    // this line reads the local file - not happy-making for running the sketch unless it's over a proper server
    // with HTTP requests
    //table = loadTable("old-faithful.csv", "csv", "header");
    
    //...so we go to  the source!
    table = loadTable("https://vincentarelbundock.github.io/Rdatasets/csv/datasets/faithful.csv", "csv", "header");
    
    /*
    NOTE: this .csv is in the local folder for this sketch, but because it's running as a web page you'll need to have a server serving it to you
    (because of sandboxed file i/o in browsers, for security reasons).
    Best way to do this: run the sketch in Brackets and push the lightning-bolt symbol in the upper-right-corner (sets up a temporary local server).
    Or you could view it over Montana.
    */
}

function setup() {
    canv = createCanvas(800, 600);
    canv.parent("canvDiv");

    numRows = table.getRowCount();

    //loop through the table and make a bunch of Datapoint objects
    // i know there are only 3 columns, so i'm not worried about looping through those

    for (var row = 0; row < numRows; row++) {
        var obsNum = table.getString(row, 0) * 1; // type coercion!
        var eDur = table.getString(row, 1) * 1; // type coercion!
        var toNext = table.getString(row, 2) * 1; // type coercion!

        // check to see if we've hit a new minimum in the dataset
        if (durationMin === null) { // have we set this var yet?
            durationMin = eDur;    // if not, fill it with our first value
        } else {
            if(eDur < durationMin) {
                durationMin = eDur;  // otherwise, compare and change if needed
            }
        }
        
        // ...or maximum
        if (durationMax === null) {
            durationMax = eDur;
        } else {
            if(eDur > durationMax) {
                durationMax = eDur;
            }
        }
        
        // keep a running tally of the total wait time:
        waitTimeTotal += toNext;
        
        
        // make a new Datapoint object
        var temp = new Datapoint(obsNum, eDur, toNext);

        // add it to the array:
        dataset.push(temp);

//        console.log("I just made a new Datapoint object");
//        console.log(temp);
//        console.log("- - - - - - ");
    }

    // set up how big the graph should be on the canvas:
    // this involves adding properties to the Object on the fly (a very JS thing to do)

    graph.left = width / 8; // graph will start 1/8th of the way across
    graph.w = (width / 8) * 6; // graph is 6/8 the width of the canvas
    graph.right = graph.left + graph.w; // graph.right edge if 7/8th of the way across

    // ditto
    graph.top = height / 8;
    graph.h = (height / 8) * 6;
    graph.bottom = graph.top + graph.h;
    
    console.log(graph.left, graph.right, graph.top, graph.bottom);
    
    
    // drawing stuff: no stroke
    noStroke();
}

function draw() {
    background(123);

    // draw graph box:
    fill(255);
    rect(graph.left, graph.top, graph.w, graph.h);
    
    var runningTotal = 0; // keep track of elapsed 'time' in the dataset
    
    textAlign(LEFT);
    
    // plot the points:
    for(var pt = 0; pt < dataset.length; pt++) {
        
        // map the duration time from the original range to the graph's y-axis range:
        // map(input, in min, in max, out min, out max);
        
        var yAxis = map(dataset[pt].duration, durationMin, durationMax, graph.bottom, graph.top);
        
        // map the x-axis:
        var xAxis = map(runningTotal, 0, waitTimeTotal, graph.left, graph.right);
        
        // draw the dot
        fill(200, 0, 0);  // red fill
        ellipse(xAxis, yAxis, 2, 2); // little dot
        
        runningTotal += dataset[pt].timeToNext;
        
        // show data if mouse is near the point:
        var mouseDist = dist(mouseX, mouseY, xAxis, yAxis);
        if(mouseDist < 3) {
            var readout = "eruption #: " + dataset[pt].observationNumber + ', dur: ' + dataset[pt].duration; 
            fill(0, 0, 255); // blue text
            text(readout, xAxis + 3, yAxis);
        }
    }
    
    fill(0); // black text
    
    textAlign(CENTER);
    
    // label x-axis:
    text("time (in minutes:)", width/2, graph.bottom + 20);
    
    // add numbers to the x-axis
    text("0", graph.left, graph.bottom + 20);
    text(waitTimeTotal, graph.right, graph.bottom + 20);
    
    // label y-axis:
    push(); // temporarily move the (0,0) point
    translate(graph.left - 20, height/2);
    rotate(radians(-90)); // rotate the grid 1/4 turn to the graph.left 
    text("eruption duration (in minutes)", 0, 0); // draw at the newly shifted origin
    pop(); // put (0,0) back in the upper graph.left
    
    // add numbers to the y-axis:
    text(durationMin, graph.left - 20, graph.bottom);
    text(durationMax, graph.left - 20, graph.top);

}
