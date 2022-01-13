# Vennage Alignment Technical Challenge

[Live Demo](https://salmansharif.me/Venngage-Tech-Challenge/)

[Video Demo](https://github.com/floatingkernal/Venngage-Tech-Challenge/blob/master/VideoDemo.mov)

### What I have done

- Implemented the alignment code using P5.js with the following features:
  - User can select and Drag shape around the page
  - User can align selected shape to allign horizontally Left, Center and Right
    - press `4` for Left align to page
    - press `5` for Center align to page
    - press `6` for Right align to page
  - User can see closest neigbour shape when moving selected shape
  - When user is close to left, right or center of neighbour in horrizontal direction, shape will automatically align and user will see a line showing the allignment

### Deleverable

Here is the code for the following assigments

1. find the closest node to node X, as node X moves around the page

```js
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
```

2. align node X to the whole page left, right and center.

```js
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
```

Feel free to look through sketch.js for full implementation of the algorithms above
