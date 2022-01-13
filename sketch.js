const COUNT = 4;
const CLOSE_TO_SHAPE_RANGE = 2;
const LEFT = "LEFT";
const RIGHT = "RIGHT";
const CENTER = "CENTER";

let selected;
let shapes;

function setup() {
  createCanvas(800, 600);
  shapes = [];
  for (let i = 0; i < COUNT; i++) {
    let x1 = random(0, width / 2);
    let x2 = x1 + random(0, 10);
    let y1 = random(0, height / 2);
    let y2 = y1 + random(0, 10);
    shapes.push(new Shape(x1, x2, y1, y2, i));
  }
}

function draw() {
  background(220);
  shapes.forEach((shape) => {
    shape.draw();
  });
  if (selected) {
    let closest = selected.findClosestShape();
    if (closest) {
      let closeEnoughLoc = selected.closeToShapeSideHorizontally(closest);
      if (closeEnoughLoc) selected.drawLine(closeEnoughLoc, closest);
    }
  }
}

function mousePressed() {
  let s;
  shapes.forEach((shape) => {
    shape.selected = false;
    shape.neighbour = false;
  });
  shapes.forEach((shape) => {
    if (shape.isClicked()) {
      shape.select();
      s = shape;
    }
  });
  if (s) selected = s;
  else selected = null;
}

function mouseDragged() {
  if (selected) selected.move();
}

function keyPressed() {
  if (selected)
    switch (keyCode) {
      case 52:
        selected.alignToPage(LEFT);
        break;
      case 53:
        selected.alignToPage(CENTER);
        break;
      case 54:
        selected.alignToPage(RIGHT);
        break;
    }
}

class Shape {
  constructor(x1, y1, x2, y2, id) {
    this.x1 = min(x1, x2);
    this.y1 = min(y1, y2);
    this.x2 = max(x1, x2);
    this.y2 = max(y1, y2);
    this.id = id;
  }

  getCenter() {
    return [
      this.x1 + (this.x2 - this.x1) / 2,
      this.y1 + (this.y2 - this.y1) / 2,
    ];
  }

  findClosestShape() {
    let res, minDist;
    shapes.forEach((shape) => {
      if (this !== shape) {
        shape.neighbour = false;
        let d = Number.MAX_VALUE;
        for (let x1 of [this.x1, this.x2]) {
          for (let y1 of [this.y1, this.y2]) {
            for (let x2 of [shape.x1, shape.x2]) {
              for (let y2 of [shape.y1, shape.y2]) {
                d = min(d, dist(x1, y1, x2, y2));
              }
            }
          }
        }
        if (!res || minDist > d) {
          res = shape;
          minDist = d;
        }
      }
    });
    return res;
  }

  closeToShapeSideHorizontally(shape) {
    let res = "";
    if (abs(shape.x1 - this.x1) <= CLOSE_TO_SHAPE_RANGE) res = LEFT;
    else if (abs(shape.x2 - this.x2) <= CLOSE_TO_SHAPE_RANGE) res = RIGHT;
    else if (
      abs(this.getCenter()[0] - shape.getCenter()[0]) <= CLOSE_TO_SHAPE_RANGE
    )
      res = CENTER;
    return res;
  }

  alignToShape(location, shape) {
    let dist = 0;
    switch (location) {
      case LEFT:
        dist = shape.x1 - this.x1;
        break;
      case RIGHT:
        dist = shape.x2 - this.x2;
        break;
      case CENTER:
        dist = shape.getCenter()[0] - this.getCenter()[0];
        break;
    }
    this.x2 += dist;
    this.x1 += dist;
  }

  alignToPage(location) {
    let dist = 0;
    switch (location) {
      case LEFT:
        dist = -this.x1;
        break;
      case RIGHT:
        dist = width - this.x2;
        break;
      case CENTER:
        dist = width / 2 - this.getCenter()[0];
        break;
    }
    this.x2 += dist;
    this.x1 += dist;
  }

  isClicked() {
    let x1 = this.x1;
    let x2 = this.x2;
    let y1 = this.y1;
    let y2 = this.y2;
    return x1 <= mouseX && mouseX <= x2 && y1 <= mouseY && mouseY <= y2;
  }

  select() {
    shapes.forEach((shape) => {
      shape.selected = false;
      shape.neighbour = false;
    });
    this.selected = true;
  }

  draw() {
    let w = this.x2 - this.x1;
    let h = this.y2 - this.y1;
    let x = this.x1;
    let y = this.y1;
    strokeWeight(2);
    if (this.selected) stroke(0, 100, 0);
    else if (this.neighbour) stroke(100, 0, 100);
    else noStroke();
    rect(x, y, w, h);
  }
  move() {
    this.x1 += movedX;
    this.x2 += movedX;
    this.y1 += movedY;
    this.y2 += movedY;

    let closest = this.findClosestShape();
    if (closest) {
      closest.neighbour = true;
      let closeEnoughLoc = this.closeToShapeSideHorizontally(closest);
      if (closeEnoughLoc) {
        this.alignToShape(closeEnoughLoc, closest);
      }
    }
  }
  drawLine(location, shape) {
    let x1 = 0,
      x2 = 0,
      y1 = 0,
      y2 = 0;
    switch (location) {
      case LEFT:
        x1 = this.x1;
        x2 = this.x1;
        y1 = min(this.y1, shape.y1);
        y2 = max(this.y1, shape.y1);
        break;
      case RIGHT:
        x1 = this.x2;
        x2 = this.x2;
        y1 = min(this.y1, shape.y1);
        y2 = max(this.y1, shape.y1);
        break;
      case CENTER:
        x1 = this.getCenter()[0];
        x2 = x1;
        y1 = min(this.getCenter()[1], shape.getCenter()[1]);
        y2 = max(this.getCenter()[1], shape.getCenter()[1]);
        break;
    }
    strokeWeight(1);
    stroke(0);
    line(x1, y1, x2, y2);
  }
}
