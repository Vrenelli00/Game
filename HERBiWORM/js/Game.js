class Game {
  constructor(ctxSnake, ctxFood, ctxHex) {
    this.ctxSnake = ctxSnake;
    this.ctxFood = ctxFood;
    this.ctxHex = ctxHex;

    // 🖼️ Logos
    this.logoLeft = new Image();
    this.logoLeft.src = "assets/veggies/isu.png";

    this.logoRight = new Image();
    this.logoRight.src = "assets/veggies/ccsict.png";

    // Screen and world sizes
    this.SCREEN_SIZE = new Point(window.innerWidth, window.innerHeight);
    this.WORLD_SIZE = new Point(window.innerWidth * 5, window.innerHeight * 5);
    this.world = new Point(-this.SCREEN_SIZE.x / 2, -this.SCREEN_SIZE.y / 2);

    this.snakes = [];
    this.foods = [];
    this.bricks = [];
    this.state = "playing";
  }

  init() {
    this.snakes = [];
    this.foods = [];
    this.bricks = [];

    this.world = new Point(-1200, -600);

    this.snakes[0] = new Snake(this.ctxSnake, "YOU", 0);
    for (var i = 0; i < 10; i++) this.addSnake(ut.randomName(), 100);
    this.generateFoods(1000);

    this.state = "playing";
  }

  draw() {
    this.drawWorld();

    if (!this.snakes[0]) return;

    if (this.snakes[0].state === 0) {
      this.snakes[0].move();
      this.state = "playing";
    } else {
      this.state = "dead";
    }

    for (let i = 1; i < this.snakes.length; i++) {
      if (this.snakes[i].state === 0) {
        this.snakes[i].move(this.snakes[0]);
      }
    }

    for (let i = 0; i < this.foods.length; i++) {
      this.foods[i].draw(this.snakes[0]);
    }

    this.drawScore();
    this.drawMap();

    if (this.state === "dead") {
      this.drawLeaderboard();
    }
  }

  drawWorld() {
    this.ctxHex.fillStyle = "white";
    this.ctxHex.fillRect(this.world.x - 2, this.world.y - 2, this.WORLD_SIZE.x + 4, this.WORLD_SIZE.y + 4);

    this.ctxHex.fillStyle = "#17202A";
    this.ctxHex.fillRect(this.world.x, this.world.y, this.WORLD_SIZE.x, this.WORLD_SIZE.y);

    if (this.state === "playing") {
      this.world.x -= this.snakes[0].velocity.x;
      this.world.y -= this.snakes[0].velocity.y;
    }
  }

  drawScore() {
    let start = new Point(20, 20);
    for (let i = 0; i < this.snakes.length; i++) {
      this.ctxSnake.fillStyle = this.snakes[i].mainColor;
      this.ctxSnake.font = "bold 10px Arial";
      this.ctxSnake.fillText(`${this.snakes[i].name}:${this.snakes[i].score}`, start.x - 5, start.y + i * 15);
    }
  }

  drawMap() {
    this.ctxSnake.globalAlpha = 0.5;

    let mapSize = new Point(150, 75);
    let start = new Point(20, this.SCREEN_SIZE.y - mapSize.y - 10);
    this.ctxSnake.fillStyle = "white";
    this.ctxSnake.fillRect(start.x, start.y, mapSize.x, mapSize.y);
    this.ctxSnake.globalAlpha = 1;

    for (let i = 0; i < this.snakes.length; i++) {
      let playerInMap = new Point(
        (start.x + (mapSize.x / this.WORLD_SIZE.x) * this.snakes[i].pos.x),
        (start.y + (mapSize.y / this.WORLD_SIZE.y) * this.snakes[i].pos.y)
      );

      this.ctxSnake.fillStyle = this.snakes[i].mainColor;
      this.ctxSnake.beginPath();
      this.ctxSnake.arc(playerInMap.x, playerInMap.y, 2, 0, 2 * Math.PI);
      this.ctxSnake.fill();
    }
  }

drawLeaderboard() {
  let sortedSnakes = [...this.snakes].sort((a, b) => b.score - a.score);
  let visibleScores = Math.min(sortedSnakes.length, 10);

  const padding = 30;
  const lineHeight = 28;
  const titleHeight = 60;
  const logoSize = 50;

  const boxWidth = 500;
  const boxHeight = titleHeight + padding + visibleScores * lineHeight + padding;

  const boxX = (this.SCREEN_SIZE.x - boxWidth) / 2;
  const boxY = (this.SCREEN_SIZE.y - boxHeight) / 2;

  // 🟪 Draw background with rounded corners
  const radius = 20;
  this.ctxSnake.beginPath();
  this.ctxSnake.moveTo(boxX + radius, boxY);
  this.ctxSnake.lineTo(boxX + boxWidth - radius, boxY);
  this.ctxSnake.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
  this.ctxSnake.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
  this.ctxSnake.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
  this.ctxSnake.lineTo(boxX + radius, boxY + boxHeight);
  this.ctxSnake.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
  this.ctxSnake.lineTo(boxX, boxY + radius);
  this.ctxSnake.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
  this.ctxSnake.closePath();

  this.ctxSnake.fillStyle = "#D8B7FF"; // 💜 Lavender background
  this.ctxSnake.fill();

  // 🖼️ Logos
  if (this.logoLeft.complete && this.logoLeft.naturalWidth !== 0) {
    this.ctxSnake.drawImage(this.logoLeft, boxX + 10, boxY + 10, logoSize, logoSize);
  }
  if (this.logoRight.complete && this.logoRight.naturalWidth !== 0) {
    this.ctxSnake.drawImage(this.logoRight, boxX + boxWidth - logoSize - 10, boxY + 10, logoSize, logoSize);
  }

  // 🏆 Title
  this.ctxSnake.fillStyle = "black";
  this.ctxSnake.font = "bold 26px Arial";
  this.ctxSnake.textAlign = "center";
  this.ctxSnake.fillText("Game Over - Leaderboard", boxX + boxWidth / 2, boxY + 50);

  // 📋 Score List
  this.ctxSnake.font = "20px Arial";
  const rankX = boxX + 50;
  const nameX = boxX + boxWidth / 2;
  const scoreX = boxX + boxWidth - 80;

  for (let i = 0; i < visibleScores; i++) {
    let s = sortedSnakes[i];
    const y = boxY + titleHeight + padding + i * lineHeight;

    this.ctxSnake.fillStyle = "black";
    this.ctxSnake.textAlign = "left";
    this.ctxSnake.fillText(`${i + 1}.`, rankX, y);

    this.ctxSnake.textAlign = "center";
    this.ctxSnake.fillText(s.name, nameX, y);

    this.ctxSnake.textAlign = "right";
    this.ctxSnake.fillText(s.score, scoreX, y);
  }

  this.ctxSnake.textAlign = "left"; // Reset
}


  addSnake(name, id) {
    this.snakes.push(new SnakeAi(this.ctxSnake, name, id));
  }

  generateFoods(n) {
    for (let i = 0; i < n; i++) {
      this.foods.push(
        new Food(this.ctxFood,
          ut.random(-1200 + 50, 2800 - 50),
          ut.random(-600 + 50, 1400 - 50))
      );
    }
  }
}

// 👇 Your instance and reset handler
var game = new Game(ctxSnake, ctxFood, ctxHex);

canvas.addEventListener("click", () => {
  if (game.state === "dead") {
    game.init();
  }
});
