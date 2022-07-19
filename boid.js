
const maxRotationVel = 0.04;

const socialDistanceSize = 100;

class Boid {
  constructor(x = width/2, y = height/2, r = 0) {
    this.pos = createVector(x, y);

    this.vel = 2;
    // this.vel = 0;

    this.rotation = r
    this.rotationVel = 0

    this.color = 'white';
  }
  


  draw() {
    push()
    translate(this.pos.x, this.pos.y)
    rotate(this.rotation);
    stroke(0);
    fill(this.color);
    beginShape();
    vertex(15, 0);
    vertex(-15, -15);
    vertex(-10, 0);
    vertex(-15, 15);
    endShape(CLOSE);
    noFill();
    circle(0,0,socialDistanceSize*2);
    pop()
  }

  applyRotationForce(changeRotationVelocity) {
    this.rotationVel += changeRotationVelocity;
  }

  socialDistance(allBoids) {
    const maxDistanceSq = socialDistanceSize*socialDistanceSize;

    let isNearBoid = false;

    for (let boid of allBoids) {
      if (boid == this) continue;
      let deltaX = abs(this.pos.x - boid.pos.x);
      let deltaY = abs(this.pos.y - boid.pos.y);
      if (maxDistanceSq >= deltaX*deltaX + deltaY*deltaY) {
        isNearBoid = true;

        // let boidDirectionVector = boid.rotation;
        let boidToThisVector = createVector(this.pos.x - boid.pos.x, this.pos.y - boid.pos.y)
        
        let goalVector = boidToThisVector;
        let goalVectorDir = goalVector.heading();
        // drawArrow()
        drawArrow(boid.pos, boidToThisVector, 'green');
        
        if (((this.rotation - goalVectorDir) + 2*PI) % (2*PI) > PI) { 
          this.applyRotationForce(0.005); // turn right
          // console.log('right')
        } 
        else {
          this.applyRotationForce(-0.005);
          // console.log('left')
        }
      }
    }
    if (isNearBoid) {
      this.color = 'red';
      // this.applyRotationForce(random([-1, 1]) * 0.01);
    }
    else {
      this.color = 'white'
    }
  }

  OLDsocialDistance(allBoids) {
    const maxDistanceSq = socialDistanceSize*socialDistanceSize;

    let isNearBoid = false;

    for (let boid of allBoids) {
      if (boid == this) continue;
      let deltaX = abs(this.pos.x - boid.pos.x);
      let deltaY = abs(this.pos.y - boid.pos.y);
      if (maxDistanceSq >= deltaX*deltaX + deltaY*deltaY) {
        isNearBoid = true;

        // let boidDirectionVector = boid.rotation;
        let boidToThisVector = createVector(this.pos.x - boid.pos.x, this.pos.y - boid.pos.y)
        let thetaBetween = (boid.rotation - boidToThisVector.heading()) % (2*PI);
        let projectionOntoBoidDirectionVectorMag = boidToThisVector.mag() * cos(thetaBetween);
        let projectionOntoBoidDirectionVector = createVector(
          projectionOntoBoidDirectionVectorMag * cos(boid.rotation), 
          projectionOntoBoidDirectionVectorMag * sin(boid.rotation)
        )
        let goalVector = p5.Vector.sub(boidToThisVector, projectionOntoBoidDirectionVector);
        let goalVectorDir = goalVector.heading();
        // drawArrow()
        drawArrow(boid.pos, boidToThisVector, 'yellow');
        drawArrow(boid.pos, projectionOntoBoidDirectionVector, 'blue');
        drawArrow(boid.pos, goalVector, 'green');
        
        if (((this.rotation - goalVectorDir) + 2*PI) % (2*PI) > PI) { 
          this.applyRotationForce(0.01); // turn right
          console.log('right')
        } 
        else {
          this.applyRotationForce(-0.01);
          console.log('left')
        }
      }
    }
    if (isNearBoid) {
      this.color = 'red';
      // this.applyRotationForce(random([-1, 1]) * 0.01);
    }
    else {
      this.color = 'white'
    }
  }

  update() {

    // this.rotationVel = (mouseX / width - 0.5)/5;

    // rotate by rotation velocity
    if (this.rotationVel > maxRotationVel) this.rotationVel = maxRotationVel
    if (this.rotationVel < -maxRotationVel) this.rotationVel = -maxRotationVel
    this.rotation += this.rotationVel;
    if (abs(this.rotationVel) < 0.001) this.rotationVel = 0;
    if (this.rotationVel > 0.001) this.rotationVel -= 0.001;
    if (this.rotationVel < -0.001) this.rotationVel += 0.001;

    // move position by velocity
    this.pos.x += this.vel * cos(this.rotation)
    this.pos.y += this.vel * sin(this.rotation)
    
    // if pos off the screen, then wrap around
    if (this.pos.x > width) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = height;

    // if rotation greater than 2pi, then wrap around
    this.rotation = this.rotation % (2*PI);
  }


}


