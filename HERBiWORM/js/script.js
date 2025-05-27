var canvas = document.getElementById("canvasSnake");
var ctxSnake = canvas.getContext("2d");
var ctxFood = document.getElementById("canvasFood").getContext("2d");
var ctxHex = document.getElementById("canvasHex").getContext("2d");
var ut = new Util();
var mouseDown = false,
    cursor = new Point(0, 0);
var game = new Game(ctxSnake, ctxFood, ctxHex);

const restartBtn = document.getElementById("restartBtn");  // declare early

// Resize all canvases to fill the window (fullscreen)
function resizeCanvases() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.width = w;
  canvas.height = h;

  document.getElementById("canvasFood").width = w;
  document.getElementById("canvasFood").height = h;

  document.getElementById("canvasHex").width = w;
  document.getElementById("canvasHex").height = h;
}

// Resize on load
resizeCanvases();

// Resize on window resize
window.addEventListener('resize', () => {
  resizeCanvases();
  // Also update game sizes if you want:
  game.updateSizes && game.updateSizes(); // if you implement updateSizes in Game class
});

canvas.onmousemove = function (e) {
  if (mouseDown) {
    cursor = ut.getMousePos(canvas, e);
    var ang = ut.getAngle(game.snakes[0].arr[0], cursor);
    game.snakes[0].changeAngle(ang);
  }
};

canvas.onmousedown = function (e) {
  mouseDown = true;
};

canvas.onmouseup = function (e) {
  mouseDown = false;
};

function start() {
  game.init();
  update();
}

var previousDelta = 0,
  fpsLimit = 20;

function update(currentDelta) {
  requestAnimationFrame(update);

  var delta = currentDelta - previousDelta;
  if (fpsLimit && delta < 1000 / fpsLimit) return;
  previousDelta = currentDelta;

  // Clear all canvases
  ctxFood.clearRect(0, 0, canvas.width, canvas.height);
  ctxSnake.clearRect(0, 0, canvas.width, canvas.height);
  ctxHex.clearRect(0, 0, canvas.width, canvas.height);

  // Draw game
  game.draw();

  // Show or hide restart button based on game state
  if (game.state === "dead") {
    restartBtn.style.display = "block";
  } else {
    restartBtn.style.display = "none";
  }
}

restartBtn.addEventListener("click", () => {
  game.init();
  restartBtn.style.display = "none"; // hide after restart
});

start();
