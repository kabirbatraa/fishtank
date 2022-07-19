
let boids = [];

let boid2;

function setup() {
  createCanvas(600, 600);

  noStroke()

  for (let i = 0; i < 5; i++) {
    boids.push(new Boid(width/2, height/2, random(0, 2*PI)));
  }

  boid2 = new Boid(width/2, height/2);
  boids.push(boid2);

}

function draw() {
  background(220);

  // boid2.pos.x = moruseX; boid2.pos.y = mouseY;
  // boid2.socialDistance(boids);

  for (let boid of boids) {
    boid.applyWallForce();
    boid.socialDistance(boids);
    boid.draw(boids);
    boid.update()
  }

  

}




function drawArrow(base, vec, myColor) {
  // return;
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