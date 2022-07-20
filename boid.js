
const maxRotationVel = 0.07;
const boidVel = 3;
const turningFriction = 0.008;

const wallForce = 0.0085;
const socialDistanceForce = 0.01;

const socialDistanceSize = 100;
const wallDistance = 150;

class Boid {
  constructor(x = width/2, y = height/2, r = 0) {
    this.pos = createVector(x, y);

    this.vel = boidVel;
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
    // circle(0,0,socialDistanceSize*2);
    pop()
  }

  goToGoalVector(goalVectorDir, rotationalForce) {

    if (((this.rotation - goalVectorDir) + 2*PI) % (2*PI) > PI) { 
      this.applyRotationForce(rotationalForce); // turn right
    } 
    else {
      this.applyRotationForce(-rotationalForce);
    }
  }

  applyRotationForce(changeRotationVelocity) {
    this.rotationVel += changeRotationVelocity;
  }

  applyWallForce() {
    let nearWall = false;
    let forces = []
    if (this.pos.x < wallDistance) {
      nearWall = true;
      forces.push(0) // right
    }
    if (this.pos.y < wallDistance) {
      nearWall = true;
      forces.push(PI/2)
    }
    if (this.pos.x > width - wallDistance) {
      nearWall = true;
      forces.push(PI) // right
    }
    if (this.pos.y > height - wallDistance) {
      nearWall = true;
      forces.push(3*PI/2)
    }

    if (!nearWall) {
      this.color = 'white';
    }
    else {
      // this formula does not work :c
      // let sum = forces.reduce((partialSum, num) => (partialSum + num), 0)
      // let avg = sum / forces.length;

      let sums = forces.reduce((partialSums, angle) => {
        partialSums.y += sin(angle);
        partialSums.x += cos(angle);
        return partialSums;
      }, createVector(0, 0))
      // dividing by forces.length for y and x component is redundant
      // let avg = atan2(sums[0] / forces.length, sums[1] / forces.length)
      let avg = atan2(sums.y, sums.x);

      drawArrow(this.pos, createVector(100*cos(avg), 100*sin(avg)), 'purple')
      this.goToGoalVector(avg, wallForce);
    }
  }

  socialDistance(boid) {
    // if (boid == this) continue;
    let deltaX = abs(this.pos.x - boid.pos.x);
    let deltaY = abs(this.pos.y - boid.pos.y);
    if (socialDistanceSize*socialDistanceSize >= deltaX*deltaX + deltaY*deltaY) {

      // let boidDirectionVector = boid.rotation;
      let boidToThisVector = createVector(this.pos.x - boid.pos.x, this.pos.y - boid.pos.y)
      
      let goalVector = boidToThisVector;

      drawArrow(boid.pos, boidToThisVector, 'green');
      this.goToGoalVector(goalVector.heading(), socialDistanceForce);

    }

  }


  assimilate(boid) {

  }

  update(allBoids) {

    this.applyWallForce();

    for (let boid of allBoids) {
      if (boid == this) continue;
      this.socialDistance(boid);
      this.assimilate(boid);
    }

    // this.rotationVel = (mouseX / width - 0.5)/5;

    // rotate by rotation velocity
    if (this.rotationVel > maxRotationVel) this.rotationVel = maxRotationVel
    if (this.rotationVel < -maxRotationVel) this.rotationVel = -maxRotationVel
    this.rotation += this.rotationVel;
    if (abs(this.rotationVel) < turningFriction) this.rotationVel = 0;
    if (this.rotationVel > turningFriction) this.rotationVel -= turningFriction;
    if (this.rotationVel < -turningFriction) this.rotationVel += turningFriction;

    // move position by velocity
    this.pos.x += this.vel * cos(this.rotation)
    this.pos.y += this.vel * sin(this.rotation)
    
    /*
    // if pos off the screen, then wrap around
    if (this.pos.x > width) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = height;
    */
    
    if (this.pos.x > width) this.pos.x = width
    if (this.pos.x < 0) this.pos.x = 0;
    if (this.pos.y > height) this.pos.y = height
    if (this.pos.y < 0) this.pos.y = 0;
    

    // if rotation greater than 2pi, then wrap around
    this.rotation = this.rotation % (2*PI);
  }











  
  // OLDsocialDistance(allBoids) {
  //   const maxDistanceSq = socialDistanceSize*socialDistanceSize;

  //   let isNearBoid = false;

  //   for (let boid of allBoids) {
  //     if (boid == this) continue;
  //     let deltaX = abs(this.pos.x - boid.pos.x);
  //     let deltaY = abs(this.pos.y - boid.pos.y);
  //     if (maxDistanceSq >= deltaX*deltaX + deltaY*deltaY) {
  //       isNearBoid = true;

  //       // let boidDirectionVector = boid.rotation;
  //       let boidToThisVector = createVector(this.pos.x - boid.pos.x, this.pos.y - boid.pos.y)
  //       let thetaBetween = (boid.rotation - boidToThisVector.heading()) % (2*PI);
  //       let projectionOntoBoidDirectionVectorMag = boidToThisVector.mag() * cos(thetaBetween);
  //       let projectionOntoBoidDirectionVector = createVector(
  //         projectionOntoBoidDirectionVectorMag * cos(boid.rotation), 
  //         projectionOntoBoidDirectionVectorMag * sin(boid.rotation)
  //       )
  //       let goalVector = p5.Vector.sub(boidToThisVector, projectionOntoBoidDirectionVector);
  //       let goalVectorDir = goalVector.heading();
  //       // drawArrow()
  //       drawArrow(boid.pos, boidToThisVector, 'yellow');
  //       drawArrow(boid.pos, projectionOntoBoidDirectionVector, 'blue');
  //       drawArrow(boid.pos, goalVector, 'green');
        
  //       if (((this.rotation - goalVectorDir) + 2*PI) % (2*PI) > PI) { 
  //         this.applyRotationForce(0.01); // turn right
  //         console.log('right')
  //       } 
  //       else {
  //         this.applyRotationForce(-0.01);
  //         console.log('left')
  //       }
  //     }
  //   }
  //   if (isNearBoid) {
  //     this.color = 'red';
  //     // this.applyRotationForce(random([-1, 1]) * 0.01);
  //   }
  //   else {
  //     this.color = 'white'
  //   }
  // }


}


