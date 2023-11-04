// Snake game


// Log variables (for debugging)
// TODO: Remove this when the game is finished
const print_log_message_on_keypress = false;


// Score elements
const score_container = document.getElementById("game-score-container");
const score_element = document.getElementById("game-score");
const high_score_element = document.getElementById("game-high-score");

// Start game elements
const game_start_container = document.getElementById("game-start-container");
const start_button = document.getElementById("game-start");

// Pause game elements (container to pause the game)
const pause_container = document.getElementById("game-pause-container");
const pause_button = document.getElementById("game-pause");
// set container to display none
pause_container.style.display = "none";

// Resume game elements (container to resume the game after it has been paused)
const resume_container = document.getElementById("game-resume-container");
const resume_button = document.getElementById("game-resume");
// set container to display none
resume_container.style.display = "none";

// Stop game elements
const stop_container = document.getElementById("game-stop-container");
const stop_button = document.getElementById("game-stop");
// set container to display none
stop_container.style.display = "none";

// Game over elements
const game_over_container = document.getElementById("game-over-container");
const restart_button = document.getElementById("game-restart");
// set container to display none
game_over_container.style.display = "none";

// Canvas variables
let user_screen_width = window.innerWidth;
const gridSize = 10; // TODO: Maybe create a settings menu to change this value
// TODO: turn this into a real image, with a snake head and a snake body (to be original)
const snakeColor = "#33cc33";
const snakeHeadColor = "#00ff00";
// TODO: turn this into a real image, with a fruit (to be original)
const foodColor = "#ff3333";

// Canvas setup
const canvas = document.getElementById("game-canvas");
const element_width = document.getElementById("game-container").offsetWidth;
canvas.width = Math.max(400, element_width - (element_width % gridSize));
canvas.height = 400;
const context = canvas.getContext("2d");

// Game variables
let snake = [{ x: 10, y: 10 }]; // TODO: make this a random number between 5 and 15
let food = { x: 5, y: 5 }; // TODO: make this a random number between 5 and 15
let direction = "right";
let direction_queue = [];
let score = 0;
let high_score = 0;

// Game state variables
let game_running = false;
const normal_fps_limit = 10; // TODO: Maybe create a settings menu to change this value
const sprint_fps_limit = 20; // TODO: Maybe create a settings menu to change this value
let fps_limit = normal_fps_limit;
let fps_sprint = false;
let last_frame_time = performance.now();

// Handle resize event
function resize_function() {
  const element_width = document.getElementById("game-container").offsetWidth;

  // Get the new screen width
  const screen_width = window.innerWidth;

  // Detect if the screen width has changed
  if (screen_width <= user_screen_width) {
    // TODO: Might want to check how much the screen width has changed, and
    // then update the canvas width accordingly.

    // Update the user screen width
    user_screen_width = screen_width;

    // Get the width of the info elements (surrounding the canvas)
    const info_element_widths =
      document.getElementById("snake-game").scrollWidth +
      document.getElementById("settings-info").scrollWidth;
    // Get the max canvas width (the max width the canvas can be, without
    // overlapping the info elements). Also deduct 100px from the max canvas
    // width, to prevent the canvas from getting too big.
    const max_canvas_width = screen_width - info_element_widths - 100;

    // Check the screen width, and set the canvas width accordingly
    if (screen_width > 1200) {
      canvas.width = Math.max(
        400,
        Math.min(element_width, max_canvas_width) -
          (Math.min(element_width, max_canvas_width) % gridSize)
      );
    } else if (screen_width > 800) {
      canvas.width = Math.min(
        400,
        Math.min(element_width, max_canvas_width) -
          (Math.min(element_width, max_canvas_width) % gridSize)
      );
    } else {
      canvas.width = Math.min(
        400,
        max_canvas_width - (max_canvas_width % gridSize)
      );
    }
  } else {
    // Update the user screen width
    user_screen_width = screen_width;

    // Get the width of the info elements (surrounding the canvas)
    const info_element_widths =
      document.getElementById("snake-game").scrollWidth +
      document.getElementById("settings-info").scrollWidth;
    const max_canvas_width = screen_width - info_element_widths;

    // Check if the element width is greater than 400px, if it is, set the
    // canvas width to the element width, if not, set the canvas width to
    // 400px. Also check if the width is 10 based, if it is, set the canvas
    // width to the element width, if not, set the canvas width to the closest
    // 10 based number (this is to prevent the canvas from getting out of grid
    // shape)
    canvas.width = Math.max(
      400,
      Math.min(element_width, max_canvas_width) -
        (Math.min(element_width, max_canvas_width) % gridSize)
    );
  }

  // Load the game, to update the canvas. (draw one frame)
  load();
}

// Draw the snake
function drawSnake() {
  snake.forEach((segment, index) => {
    // Use snakeHeadColor for the first segment (snake's head), and snakeColor
    // for the rest
    context.fillStyle = index === 0 ? snakeHeadColor : snakeColor;
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

// Change direction and handle other keydown events
function handleKeyDown(event) {
  const key = event.keyCode;
  switch (key) {
    // DIRECTION KEYDOWN EVENTS
    // Left arrow key: go left
    // A key: go left
    // Up arrow key: go up
    // W key: go up
    // Right arrow key: go right
    // D key: go right
    // Down arrow key: go down
    // S key: go down
    case 37: // left (37 is the key code for the left arrow key)
    case 65: // a (65 is the key code for the a key)
      event.preventDefault();
      if (direction !== "right") direction_queue.push("left");
      break;
    case 38: // up (38 is the key code for the up arrow key)
    case 87: // w (87 is the key code for the w key)
      event.preventDefault();
      if (direction !== "down") direction_queue.push("up");
      break;
    case 39: // right (39 is the key code for the right arrow key)
    case 68: // d (68 is the key code for the d key)
      event.preventDefault();
      if (direction !== "left") direction_queue.push("right");
      break;
    case 40: // down (40 is the key code for the down arrow key)
    case 83: // s (83 is the key code for the s key)
      event.preventDefault();
      if (direction !== "up") direction_queue.push("down");
      break;

    // OTHER KEYDOWN EVENTS
    // Space key: pause the game
    // Enter key: resume the game
    // Esc key: stop the game
    // R key: restart the game
    // Shift key: sprint
    case 13: // enter (13 is the key code for the enter key)
    case 32: // space (32 is the key code for the space key)
      event.preventDefault();
      pause(game_running);
      break;
    case 27: // esc (27 is the key code for the esc key)
      event.preventDefault();
      game_running = false;
      pause(true); // stop();
      break;
    case 82: // r (82 is the key code for the r key)
      event.preventDefault();
      restart();
      break;
    case 16: // shift (16 is the key code for the shift key)
      event.preventDefault();
      fps_sprint = true;
      // TODO: Check when the key is released, and set fps_sprint to false
      document.addEventListener("keyup", handleKeyUp);
      break;
  }

  // Log the key code
  logKey(key, "keydown");
}

// Handle keyup events
function handleKeyUp(event) {
  const key = event.keyCode;
  switch (key) {
    case 16: // shift (16 is the key code for the shift key)
      event.preventDefault();
      fps_sprint = false;
      document.removeEventListener("keyup", handleKeyUp);
      break;
  }

  // Log the key code
  logKey(key, "keyup");
}

// Log the key code with timestamp
function logKey(keyCode, type) {
  if (!print_log_message_on_keypress) return;

  // Get the log element
  const loggerElement = document.getElementById("log-message");

  // Create a new log entry with a timestamp
  const timestamp = new Date().toLocaleTimeString();
  const keyInfo = `${timestamp} - Key code: ${keyCode} (${type})<br>`;

  // Append the new entry to the log
  loggerElement.innerHTML += keyInfo;
}

// Update direction
function updateDirection() {
  if (direction_queue.length > 0) {
    direction = direction_queue.shift();
  }
}

// Game loop
function gameLoop() {
  // Calculate time elapsed since last frame
  let current_time = performance.now();
  let time_elapsed = current_time - last_frame_time;

  // Check if game is running
  if (game_running) {
    // Set fps limit
    fps_limit = fps_sprint ? sprint_fps_limit : normal_fps_limit;

    // Check if enough time has passed since last frame (fps limit)
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
  if (event.type === "keydown" && event.keyCode !== 13) return;
  if (event.type === "keypress" && event.keyCode !== 13) return;

  game_start_container.style.display = "none";
  pause_container.style.display = "block";
  stop_container.style.display = "block";

  // Clear keyboard event listener
  document.removeEventListener("keydown", start);

  document.addEventListener("keydown", handleKeyDown);
  game_running = true;
  gameLoop();
}

// Pause the game
function pause(pause) {
  if (pause && game_running) {
    // Display pause container
    pause_container.style.display = "none";
    resume_container.style.display = "block";
    
    // Clear keyboard event listener
    // TODO: Check if this is needed, we still want to be able to unpause the game
    document.removeEventListener("keydown", handleKeyDown);
    
    // Stop game loop
    game_running = false;
  } else if (!pause && !game_running) {
    // Hide pause container
    pause_container.style.display = "block";
    resume_container.style.display = "none";
    
    // Set keyboard event listener
    document.addEventListener("keydown", handleKeyDown);

    // Start game loop
    game_running = true;
    gameLoop();
  } else {
    console.log("Game is already paused or running");
  }
}

// Game over
function game_over() {
  // Hide pause container
  pause_container.style.display = "none";
  stop_container.style.display = "none";

  // Display game over container
  const game_over_score_element = document.getElementById("game-over-score");
  const game_over_high_score_element = document.getElementById(
    "game-over-high-score"
  );
  game_over_score_element.innerHTML = "Score: " + score;
  game_over_high_score_element.innerHTML = "High Score: " + high_score;
  game_over_container.style.display = "block";

  // Clear keyboard event listener
  document.removeEventListener("keydown", handleKeyDown);

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
  pause_container.style.display = "block";
  stop_container.style.display = "block";

  // Reset keyboard event listener
  document.addEventListener("keydown", handleKeyDown);

  // Start game loop
  game_running = true;
  gameLoop();
}

// Set event listeners
start_button.addEventListener("click", start);
pause_button.addEventListener("click", () => pause(true));
resume_button.addEventListener("click", () => pause(false));
restart_button.addEventListener("click", restart);
document.addEventListener("keypress", start);
window.addEventListener("resize", resize_function);

// Load the game
load();
