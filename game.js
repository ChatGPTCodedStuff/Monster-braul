// Setup canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const playerWidth = 50;
const playerHeight = 100;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 50;
let playerSpeed = 5;
let keys = {};
let score = 0;
let ball = { x: playerX + playerWidth / 2, y: playerY, radius: 10, speed: 7, angle: 0, thrown: false };
let enemies = [];

// Enemy variables
const enemyWidth = 50;
const enemyHeight = 50;
const enemyCount = 5;

// Setup player movement
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Create random enemies on the screen
function createEnemies() {
  for (let i = 0; i < enemyCount; i++) {
    const x = Math.random() * (canvas.width - enemyWidth);
    const y = Math.random() * (canvas.height - enemyHeight);
    enemies.push({ x, y });
  }
}

// Draw player and enemies
function drawGame() {
  // Draw player
  ctx.fillStyle = '#FF5733';  // Player color
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

  // Draw football
  if (ball.thrown) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#F1C232'; // Ball color
    ctx.fill();
  }

  // Draw enemies
  ctx.fillStyle = '#00FF00'; // Enemy color
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
  });

  // Draw score
  ctx.fillStyle = '#000';
  ctx.font = '30px Arial';
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// Update game state (move player, ball, and enemies)
function updateGame() {
  // Move player
  if (keys['ArrowLeft'] && playerX > 0) {
    playerX -= playerSpeed;
    ball.angle = Math.PI;  // Ball will be thrown to the left
  }
  if (keys['ArrowRight'] && playerX < canvas.width - playerWidth) {
    playerX += playerSpeed;
    ball.angle = 0;  // Ball will be thrown to the right
  }
  if (keys['ArrowUp'] && playerY > 0) {
    playerY -= playerSpeed;
    ball.angle = -Math.PI / 2;  // Ball will be thrown upwards
  }
  if (keys['ArrowDown'] && playerY < canvas.height - playerHeight) {
    playerY += playerSpeed;
    ball.angle = Math.PI / 2;  // Ball will be thrown downwards
  }

  // Throw the ball
  if (keys['Space'] && !ball.thrown) {
    ball.thrown = true;
    ball.x = playerX + playerWidth / 2;
    ball.y = playerY;
  }

  // Update ball position when thrown
  if (ball.thrown) {
    ball.x += ball.speed * Math.cos(ball.angle);
    ball.y += ball.speed * Math.sin(ball.angle);

    // Reset ball when it goes off-screen
    if (ball.x < 0 || ball.x > canvas.width || ball.y < 0 || ball.y > canvas.height) {
      ball.thrown = false;
      score++; // Increase score when ball goes out of bounds
    }

    // Check for collision with enemies
    enemies.forEach((enemy, index) => {
      const distance = Math.sqrt(Math.pow(ball.x - enemy.x, 2) + Math.pow(ball.y - enemy.y, 2));
      if (distance < ball.radius + enemyWidth / 2) {
        // Ball hits enemy
        enemies.splice(index, 1); // Remove enemy
        ball.thrown = false; // Stop the ball
        score += 10; // Increase score
      }
    });
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw updated game elements
  drawGame();

  // Request next animation frame
  requestAnimationFrame(updateGame);
}

// Start the game
createEnemies();  // Create initial enemies
updateGame();  // Start game loop
