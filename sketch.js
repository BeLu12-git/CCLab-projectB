let robot, ghost;
let noteIndex = 0;
let notes = [
  261.63,
  293.66,
  329.63, 
  349.23, 
  392.0,
  440.0, 
  493.88, 
  523.25, 
  587.33, 
  659.25,
  698.46, 
  783.99, 
  880.0, 
  987.77, 
  1046.5,
  1174.66,
  1318.51, 
  1396.91, 
  1567.98,
  1760.0, 
  1975.53, 
  2093.0];
let osc;
let oscIsPlaying = false;
let setDistance = 999;
let robotAngry = false;
let robotWar = false;
let robotcleaning = false;

function preload() {
  img = loadImage("lamp.png");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");

  osc = new p5.Oscillator("square"); 
  osc.freq(880);
  osc.amp(0);
  osc.start();

  ghost = new Ghost(width, height / 2);
  robot = new Robot(width / 2, height / 2);
}

function draw() {
  background(25);
  image(img, 0, 0, width, height);

  ghost.update();
  robot.update(ghost);

  ghost.draw();
  robot.draw();

  let distance = dist(ghost.x, ghost.y, robot.x, robot.y);
  setDistance = distance;


  let freqValue = map(distance, 0, 400, 800, 200, true); 
  let ampValue = map(distance, 0, 400, 1.0, 0.0, true); 
  if (distance > 10){ 
  osc.freq(notes[noteIndex],0.1); 
  osc.amp(ampValue, 0.1); 
  } 
  if (distance < 10) { 
  osc.freq() 
  }

  if (ghost.x > width - 100 && ghost.y > height - 100) {
      robotAngry = true;

      osc.freq(1200);
      osc.amp(0.4, 0.1);

      setTimeout(() => {
        osc.amp(0, 0.5);
      }, 500);
} else {
    robotAngry = false;  
}
if (width - 100 > ghost.x > width - 200 && 100 < ghost.y < 200) {
      robotWar = true;

      osc.freq(2000);
      osc.amp(0.6, 0.1);

} else {
    robotWar = false;  
}
if (robotWar){
        fill(255, 0, 0);
        textSize(32);
        textAlign(CENTER);
        text("Robot is in WAR mode!", width / 2, 50);
        for (let i=0; i<100; i++) {
    let clr = color(255, 0, 255);
    img.set(random(width), random(height), clr);  
  }
  img.updatePixels();
  image(img, 0, 0);

}
}



class Ghost {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;

    this.dx = 0;
    this.dy = 0;

    this.normalColor = color(255, 160);
    this.alertColor = color(199,166,120,200);
  }

  update() {
    this.prevX = this.x;
    this.prevY = this.y;

    let targetX = mouseX;
    let targetY = mouseY;

    if (targetX < width / 2 + 20) targetX = width / 2 + 20;
    if (targetX > width - 20) targetX = width - 20;

    this.x += (targetX - this.x) * 0.18;
    this.y += (targetY - this.y) * 0.18;

    this.dx = this.x - this.prevX;
    this.dy = this.y - this.prevY;
  }

  draw() {
    push();
    translate(this.x, this.y);
    noStroke();

    if (setDistance < 100) {
      fill(this.alertColor);
    } else {
      fill(this.normalColor);
    }
    ellipse(0, 0, 210, 270);

    fill(0);
    ellipse(-45, -15, 36, 36);
    ellipse(45, -15, 36, 36);
    
  
    pop();
  }
}

class Robot {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.normalColor = color(180);
    this.alertBody = color(92, 114, 125);
  }

  update(ghost) {
    this.x += -ghost.dx;
    this.y += ghost.dy;

    if (this.x < 20) this.x = 20;
    if (this.x > width / 2 - 20) this.x = width / 2 - 20;
  }

  draw() {
    push();
    translate(this.x, this.y);
    noStroke();
    rectMode(CENTER);

    if (robotAngry) {
      fill(255, 60, 60);
    } else if (setDistance < 100) {
      fill(this.alertBody);
    } else {
      fill(this.normalColor);
    }
    rect(0, 0, 180, 210, 30);

    fill(0);
    ellipse(-45, -30, 45, 45);
    ellipse(45, -30, 45, 45);

    if (robotAngry) {
      stroke(0);
      strokeWeight(6);
      line(-75, -75, -30, -45);
      line(75, -75, 30, -45);
      triangle(-40, 40, 0, 10, 40, 40);

      fill(255,20,20);
      ellipse(-40,-30,30,30);
      ellipse(40,-30,30,30);
      
    }
    
    

    pop();
  }
}

function mousePressed() {
  if (!oscIsPlaying) {
    osc.start();
    osc.amp(0.4, 0.2);
    oscIsPlaying = true;
  }

  noteIndex++;
  if (noteIndex >= notes.length) noteIndex = 0;

  if (oscIsPlaying) {
    osc.freq(notes[noteIndex], 0.1);
  }
}


