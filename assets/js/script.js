// Snake game

// Start game elements
const game_start_container = document.getElementById("game-start-container");
const start_button = document.getElementById("game-start");

// Score elements
const score_container = document.getElementById("game-score-container");
const score_element = document.getElementById("game-score");
const high_score_element = document.getElementById("game-high-score");
// set container to display none
// score_container.style.display = "none";

// Game over elements
const game_over_container = document.getElementById("game-over-container");
const restart_button = document.getElementById("game-restart");
// set container to display none
game_over_container.style.display = "none";

// Canvas setup
const canvas = document.getElementById("game-canvas");
canvas.width = 400; // TODO: Create a method to auto detect the screen size and set the canvas size accordingly
canvas.height = 400;
const context = canvas.getContext("2d");

// Canvas variables
const gridSize = 10; // TODO: Maybe create a settings menu to change this value
// TODO: turn this into a real image, with a snake head and a snake body (to be original)
const snakeColor = "#33cc33";
// TODO: turn this into a real image, with a fruit (to be original)
const foodColor = "#ff3333";

// Game variables
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = "right";
let direction_queue = [];
let score = 0;
let high_score = 0;

// Game state variables
let game_running = false;
let fps_limit = 10; // TODO: Maybe create a settings menu to change this value
// let last_frame_time = Date.now();
let last_frame_time = performance.now();

// Draw the snake
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

// Draw the food
function drawFood() {
  context.fillStyle = foodColor;
  context.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Update the game
function update() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  updateDirection();

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
    score_element.innerHTML = "Score: " + score;
    if (score > high_score) {
      high_score = score;
      high_score_element.innerHTML = "High Score: " + high_score;
    }
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

// Check for collision
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

// Change direction
function changeDirection(event) {
  const key = event.keyCode;
  switch (key) {
    case 37: // left (37 is the key code for the left arrow key)
    case 65: // a (65 is the key code for the a key)
      // if (direction !== "right") direction = "left";
      if (direction !== "right") direction_queue.push("left");
      break;
    case 38: // up (38 is the key code for the up arrow key)
    case 87: // w (87 is the key code for the w key)
      // if (direction !== "down") direction = "up";
      if (direction !== "down") direction_queue.push("up");
      break;
    case 39: // right (39 is the key code for the right arrow key)
    case 68: // d (68 is the key code for the d key)
      // if (direction !== "left") direction = "right";
      if (direction !== "left") direction_queue.push("right");
      break;
    case 40: // down (40 is the key code for the down arrow key)
    case 83: // s (83 is the key code for the s key)
      // if (direction !== "up") direction = "down";
      if (direction !== "up") direction_queue.push("down");
      break;
  }
}

// Update direction
function updateDirection() {
  if (direction_queue.length > 0) {
    direction = direction_queue.shift();
  }
}

function handleKeyDown(event) {
  /*
    // TODO: Check if these keys are placed correctly
    case 13: // enter (13 is the key code for the enter key)
      if (game_running) game_over();
      break;
    case 82: // r (82 is the key code for the r key)
      if (!game_running) restart();
      break;
    case 27: // esc (27 is the key code for the esc key)
      if (!game_running) reset();
      break;
    case 16: // shift (16 is the key code for the shift key)
      // TODO: Make this a keyhold event instead of a keydown event
      fps_limit = 20;
      break;
  */
}

// Game loop
function gameLoop() {
  // TODO: Implement an fps cap
  // Calculate time elapsed since last frame
  // let current_time = Date.now();
  let current_time = performance.now();
  let time_elapsed = current_time - last_frame_time;

  // Check if game is running
  if (game_running) {
    // Check if enough time has passed since last frame
    if (time_elapsed >= 1000 / fps_limit) {
      // Update last frame time
      last_frame_time = current_time;

      // Render frame
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawSnake();
      drawFood();
      update();
    }

    // Request next frame
    requestAnimationFrame(gameLoop);
  }
}

// Load the game
function load() {
  // Render one frame
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

// Start the game
function start(event) {
  // Check event type (if it's a keydown event, check if it's the enter key)
  if (event.type === "keydown" && event.keyCode !== 13) return; // 13 is the key code for the enter key
  //   // Check the key pressed
  //   const key = event.keyCode;
  //   if (key !== 13) return; // 13 is the key code for the enter key
  // }
  if (event.type === "keypress" && event.keyCode !== 13) return; // 13 is the key code for the enter key

  game_start_container.style.display = "none";

  // Clear keyboard event listener
  document.removeEventListener("keydown", start);

  document.addEventListener("keydown", changeDirection);
  game_running = true;
  gameLoop();
}

// Game over
function game_over() {
  // Display game over message
  // alert("Game Over! Your score: " + score);

  // Display game over container
  const game_over_score_element = document.getElementById("game-over-score");
  const game_over_high_score_element = document.getElementById(
    "game-over-high-score"
  );
  game_over_score_element.innerHTML = "Score: " + score;
  game_over_high_score_element.innerHTML = "High Score: " + high_score;
  game_over_container.style.display = "block";

  // Clear keyboard event listener
  document.removeEventListener("keydown", changeDirection);

  // Reset game loop (wait till restart button is clicked)
  game_running = false;
}

// Restart the game
function restart() {
  // Reset game variables
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  direction = "right";
  score = 0;
  score_element.innerHTML = "Score: " + score;

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
document.addEventListener("keypress", start);

// Load the game
load();
