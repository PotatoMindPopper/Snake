// Snake game

// Start game elements
const game_start_container = document.getElementById("game-start-container");
const start_button = document.getElementById("game-start");

// Game over elements
const game_over_container = document.getElementById("game-over-container");
const restart_button = document.getElementById("game-restart");
// set container to display none
game_over_container.style.display = "none";

// Canvas setup
const canvas = document.getElementById("game-canvas");
canvas.width = 400;
canvas.height = 400;
const context = canvas.getContext("2d");

// Canvas variables
const gridSize = 10;
// TODO: turn this into a real image, with a snake head and a snake body (to be original)
const snakeColor = "#33cc33";
// TODO: turn this into a real image, with a fruit (to be original)
const foodColor = "#ff3333";

// Game variables
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = "right";
let score = 0;

// Game state variables
let game_running = false;

function drawSnake() {
  snake.forEach((segment) => {
    context.fillStyle = snakeColor;
    context.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

function drawFood() {
  context.fillStyle = foodColor;
  context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  switch (direction) {
    case "up":
      headY--;
      break;
    case "down":
      headY++;
      break;
    case "left":
      headX--;
      break;
    case "right":
      headX++;
      break;
  }

  const newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  } else {
    snake.pop();
  }

  snake.unshift(newHead);

  if (checkCollision()) {
    game_over();
  }
}

function checkCollision() {
  const headX = snake[0].x;
  const headY = snake[0].y;

  // TODO: Implement the go through walls feature
  return (
    headX < 0 ||
    headX >= canvas.width / gridSize ||
    headY < 0 ||
    headY >= canvas.height / gridSize ||
    snake.slice(1).some((segment) => segment.x === headX && segment.y === headY)
  );
}

function changeDirection(event) {
  const key = event.keyCode;
  switch (key) {
    case 37: // left (37 is the key code for the left arrow key)
    case 65: // a (65 is the key code for the a key)
      if (direction !== "right") direction = "left";
      break;
    case 38: // up (38 is the key code for the up arrow key)
    case 87: // w (87 is the key code for the w key)
      if (direction !== "down") direction = "up";
      break;
    case 39: // right (39 is the key code for the right arrow key)
    case 68: // d (68 is the key code for the d key)
      if (direction !== "left") direction = "right";
      break;
    case 40: // down (40 is the key code for the down arrow key)
    case 83: // s (83 is the key code for the s key)
      if (direction !== "up") direction = "down";
      break;
  }
}

function gameLoop() {
  // TODO: Implement an fps cap
  // Check if game is running
  if (game_running) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    update();
    requestAnimationFrame(gameLoop);
  }
}

function start() {
  // set container to display none
  game_start_container.style.display = "none";
  game_running = true;
  gameLoop();
}

function game_over() {
  // Display game over message
  // alert("Game Over! Your score: " + score);

  // Display game over container
  const score_element = document.getElementById("game-over-score");
  score_element.innerHTML = "Score: " + score;
  game_over_container.style.display = "block";

  // Clear keyboard event listener
  document.removeEventListener("keydown", changeDirection);

  // Reset game loop (wait till restart button is clicked)
  game_running = false;
}

function restart() {
  // Reset game variables
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  direction = "right";
  score = 0;

  // Reset game over container
  game_over_container.style.display = "none";

  // Reset keyboard event listener
  document.addEventListener("keydown", changeDirection);

  // Start game loop
  game_running = true;
  gameLoop();
}

// Set event listeners
start_button.addEventListener("click", start);
restart_button.addEventListener("click", restart);
document.addEventListener("keydown", changeDirection);
