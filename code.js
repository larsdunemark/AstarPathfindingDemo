var cols=100;
var rows=100;

var grid_width=8;
var grid_height=8;

// Refresh rate for UI, update graph speedUp number of times before redraw grid
var speedUp = 20;

var grid=[];

var openSet = [];
var closedSet = [];
var path = [];

var start;
var end;

function Spot(x, y) {
  this.x = x;
  this.y = y;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.4) {
    this.wall = true;
  }

  this.show = function(col) {
    noStroke();
    if(this.wall) {
      fill(0);
      ellipse(this.x*grid_width + grid_width/2, this.y*grid_height + grid_height/2, grid_width/2, grid_height/2);
    } else {
      if (col === undefined) {
        return;
      }
      fill(col)
      rect(this.x*grid_width, this.y*grid_height, grid_width, grid_height);
    }
  }
}

function heuristics(a, b){
  return dist(a.x, a.y, b.x, b.y);
}

function setup() {
  createCanvas(grid_width*cols, grid_height*rows);

  for (var i = 0; i < cols*rows; i++) {
    x = (i % cols);
    y = floor(i / cols);

    grid[i] = new Spot(x, y);
  }

  start = grid[0];
  end = grid[cols*rows - cols];
  start.wall = false;
  end.wall = false;
  
  openSet.push(start);

  start.h = heuristics(start, end);
  start.f = heuristics(start, end);
}


function draw() {
  for(var s = 0; s < speedUp; s++) {
    if (openSet.length > 0) {
      // keep going
      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if(openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }

      var current = openSet[winner];

      if (current == end) {
        console.log("DONE");
        noLoop();
        break;
      }

      openSet.splice(winner, 1);
      closedSet.push(current);

      // Get neighbors
      neighbors=[];
      if (current.x > 0) {
        // To the left
        neighbors.push(grid[(current.x + cols * current.y) - 1]);
      }
      if (current.x < cols-1) {
        // To the right
        neighbors.push(grid[(current.x + cols * current.y) + 1]);
      }
      if (current.y > 0) {
        // Above
        neighbors.push(grid[(current.x + cols * current.y) - cols]);
        if (current.x > 0) {
          // Up to the left
          neighbors.push(grid[(current.x + cols * current.y) - cols - 1]);
        }
        if (current.x < cols-1) {
          // Up to the right
          neighbors.push(grid[(current.x + cols * current.y) - cols + 1]);
        }
      }
      if (current.y < rows-1) {
        // Belove
        neighbors.push(grid[(current.x + cols * current.y) + cols]);
        if (current.x > 0) {
          // Belove to the left
          neighbors.push(grid[(current.x + cols * current.y) + cols - 1]);
        }
        if (current.x < cols-1 ) {
          // Belove to the right
          neighbors.push(grid[(current.x + cols * current.y) + cols + 1])
        }
      }

      for (var j = 0; j < neighbors.length; j++) {
        var neighbor = neighbors[j];
        if (closedSet.includes(neighbor) || neighbor.wall) {
          continue;
        }

        t_gScore = current.g+1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (t_gScore >= neighbor.g) {
            continue;
        }

        neighbor.g = t_gScore;
        neighbor.h = heuristics(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;

        neighbor.previous = current;

      }
    } else {
      // No solution
      console.log("No solution!");
      noLoop();
      break;
    }
  }

  background(255);
  for (var i = 0; i < grid.length; i++) {
    grid[i].show(undefined);
  }

//  for (var i = 0; i < openSet.length; i++) {
//    openSet[i].show(color(0,255,0));
//  }
//  for (var i = 0; i < closedSet.length; i++) {
//    closedSet[i].show(color(255,0,0));
//  }

  // Find the path
  var path = [];
  var temp = current;
  path.push(temp);
  while (temp && temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  beginShape();
  noFill();
  stroke(color(200,0,255));
  strokeWeight(grid_width/2);
  for (var i = 0; i< path.length; i++) {
    vertex(path[i].x * grid_width + grid_width/2, path[i].y * grid_height + grid_height/2);
  }
  endShape();
}
