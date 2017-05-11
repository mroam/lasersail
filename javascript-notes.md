notes: old sample javascript "for" loop
```javascript
var count;
for(count = 0; count < 10; count++){
     //document.write("Current Count : " + count + "<br />");
}
```

==========
Here are examples from https://www.w3schools.com/js/js_objects.asp

example object creation:
```javascript
var car = {type:"Fiat", model:"500", color:"white"};
var person = {firstName:"John", lastName:"Doe", age:50, eyeColor:"blue"};
```
"You can access object properties in two ways:"
```javascript
objectName.propertyName or objectName["propertyName"]
examples: person.firstName;  or fiat["color"];
```
Assign functions (called "methods" in Java) to objects somehow, when creating them:
   var skydiver = { firstName:"Jane", lastName:"Doe", fullName: function( ) { return this.firstName + " " + this.lastName;}, age:55 };
   
(You add functions later:
```javascript
person.fullName = function( ) { return this.firstName + " " + this.lastName; }  
```
See csv example for assigning one copy of the method to an object's prototype rather than installing the method onto every instance of an object.) 
access functions by   
```javascript
person.fullName( )   // if you omit the parentheses, you get the code!
```
see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
about how we can put 
```javascript
'use strict';
```
at the top of a javascript file, or at the top of a function. Example:
```javascript
function wahoo( ) {
  // Function-level strict mode syntax
  'use strict';
  // …
}
```

===============
```javascript
// ps: the following was all demonstrated and tested using http://repl.it
// JN samples of class definition, constructors, and instantiation

// Technique 1: create a prototype object (without functions, for storage efficiency)
// and then add methods and create instances. Later we'll add functions (methods).
var Ship = {
  angle: 0,
  velocity: 30
}

// adding a method to Ship
Ship.sayStuff = function() {
  console.log('my angle is ' + this.angle + ', and my vel is: ' + this.velocity);
}

// Instantiating some ships, using the "create( )" command.
// Note: the instances do NOT have a "sayStuff( )" method stored within but can 
// use any methods (such as "sayStuff( )") that are attached to their prototype
// (".__proto__" is the link to the thing from which they were copied).
var ship1 = Object.create(Ship);
ship1.angle = 90;
ship1.velocity= 45;

var ship2 = Object.create(Ship);
ship1.angle = 88;
ship1.velocity= 33;

// examples of calling methods...
console.log('Ship objects saying stuff');
ship1.sayStuff();
ship2.sayStuff();

// adding another function, just for fun.
Ship.sayBoo = function() {
  console.log('boo');
}


// Technique 2: create a loose, free-floating constructor function thing: it will 
// act as a constructor and create fields in "new" objects.
var OtherShip = function(angle, velocity) {
  this.angle = angle
  this.velocity = velocity;
}

// Adding a method to constructor's __proto__ 
// Note: we're using the ".prototype." command to talk to existing constructor.
OtherShip.prototype.sayStuff = function( ) {
  console.log('my angle is ' + this.angle + ', and my vel is: ' + this.velocity);
}

// Instantiating ships using technique 2, with "new"
var otherShip1 = new OtherShip(23, 100);
var otherShip2 = new OtherShip(33, 200);

// Calling methods
console.log('OtherShip objects saying stuff');
otherShip1.sayStuff();
otherShip2.sayStuff();

// big fun, looking at prototypes and instances...
 console.log('logging stuff');
// console.log(Ship);
// console.log(ship1);
// console.log(ship1.__proto__)
console.log(OtherShip);
console.log(otherShip1);
console.log(otherShip1.__proto__);
//ship1.sayBoo();
```
