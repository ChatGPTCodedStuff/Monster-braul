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

// Setup player movement
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Function to draw game elements (player, ball, score)
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

  // Draw score
  ctx.fillStyle = '#000';
  ctx.font = '30px Arial';
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// Function to update game state (player movement, ball throwing)
function updateGame() {
  // Move player
  if (keys['ArrowLeft'] && playerX > 0) {
    playerX -= playerSpeed;
  }
  if (keys['ArrowRight'] && playerX < canvas.width - playerWidth) {
    playerX += playerSpeed;
  }
  if (keys['ArrowUp'] && playerY > 0) {
    playerY -= playerSpeed;
  }
  if (keys['ArrowDown'] && playerY < canvas.height - playerHeight) {
    playerY += playerSpeed;
  }

  // Throw the ball
  if (keys['Space'] && !ball.thrown) {
    ball.thrown = true;
    ball.x = playerX + playerWidth / 2;
    ball.y = playerY;
    ball.angle = Math.random() * Math.PI - Math.PI / 2;  // Random angle
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
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw updated game elements
  drawGame();

  // Request next animation frame
  requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();
