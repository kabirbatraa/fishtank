
let boids = [];

// let boid2;

let drawArrows = false;
let drawArrowsButton;
let debugLines = false;
let drawDebugLinesButton;

function setup() {
  createCanvas(windowWidth, windowHeight);

  noStroke()

  for (let i = 0; i < 30; i++) {
    boids.push(new Boid(width/2, height/2, random(0, 2*PI)));
  }

  // boid2 = new Boid(width/2, height/2);
  // boids.push(boid2);

  drawArrowsButton = new Button('toggle arrows', 5, 5, 100, 20, 5, 'white', 'black');
  drawDebugLinesButton = new Button('toggle debug lines', 110, 5, 125, 20, 5, 'white', 'black');

}

function draw() {
  background(220);
  // background('#005EB8');

  // boid2.pos.x = moruseX; boid2.pos.y = mouseY;
  // boid2.socialDistance(boids);

  for (let boid of boids) {
    boid.update(boids)
    boid.draw();
  }

  if (debugLines) {
    stroke('black')
    line(wallDistance, 0, wallDistance, height)
    line(width - wallDistance, 0, width - wallDistance, height)
    line(0, wallDistance, width, wallDistance)
    line(0, height - wallDistance, width, height - wallDistance)
  }
  
  
  if (drawArrowsButton.checkHover()) drawArrowsButton.color = '#cccccc';
  else drawArrowsButton.color = 'white';
  drawArrowsButton.draw();

  if (drawDebugLinesButton.checkHover()) drawDebugLinesButton.color = '#cccccc';
  else drawDebugLinesButton.color = 'white';
  drawDebugLinesButton.draw();
  
}




function drawArrow(base, vec, myColor) {
  if (!drawArrows)
    return;
  // vec = p5.Vector.sub(vec, base);

  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor); 
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function mouseClicked() {
  if (drawArrowsButton.checkHover()) drawArrows = !drawArrows;
  if (drawDebugLinesButton.checkHover()) debugLines = !debugLines;
}