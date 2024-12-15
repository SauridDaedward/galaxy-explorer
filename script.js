const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");

canvas.width = 800;
canvas.height = 600;

let spaceship = { x: 370, y: 500, width: 60, height: 60 };
let asteroids = [];
let bullets = [];
let score = 0;
let gameRunning = false;

// Load assets with error handling
const spaceshipImg = new Image();
spaceshipImg.src = "./assets/spaceship.png";
spaceshipImg.onload = () => console.log("Spaceship image loaded successfully");
spaceshipImg.onerror = () => console.error("Failed to load spaceship.png - Check the file path!");

const asteroidImg = new Image();
asteroidImg.src = "./assets/asteroid.png";
asteroidImg.onload = () => console.log("Asteroid image loaded successfully");
asteroidImg.onerror = () => console.error("Failed to load asteroid.png - Check the file path!");

const bgMusic = new Audio("./assets/bg-music.mp3");
bgMusic.onloadeddata = () => console.log("Background music loaded successfully");
bgMusic.onerror = () => console.error("Failed to load bg-music.mp3 - Check the file path or format!");

const shootSound = new Audio("./assets/shoot.wav");
shootSound.onloadeddata = () => console.log("Shoot sound loaded successfully");
shootSound.onerror = () => console.error("Failed to load shoot.wav - Check the file path or format!");

// Draw spaceship
function drawSpaceship() {
  ctx.drawImage(spaceshipImg, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// Move spaceship with arrow keys
window.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" && spaceship.x > 0) spaceship.x -= 15;
  if (e.key === "ArrowRight" && spaceship.x < canvas.width - spaceship.width) spaceship.x += 15;
  if (e.key === "ArrowUp" && spaceship.y > 0) spaceship.y -= 15;
  if (e.key === "ArrowDown" && spaceship.y < canvas.height - spaceship.height) spaceship.y += 15;
  if (e.key === " ") shootBullet();
});

// Shoot bullet
function shootBullet() {
  bullets.push({ x: spaceship.x + spaceship.width / 2 - 5, y: spaceship.y - 10, width: 10, height: 20 });
  shootSound.play().catch((error) => console.error("Failed to play shoot sound:", error));
}

// Draw bullets
function drawBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= 10;
    if (bullet.y < 0) bullets.splice(index, 1);
    ctx.fillStyle = "yellow";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Spawn asteroids at a lower frequency
function spawnAsteroids() {
  if (Math.random() < 0.01) { // 1% chance per frame
    asteroids.push({
      x: Math.random() * (canvas.width - 50), // Random X position
      y: -50, // Start above the canvas
      width: 50,
      height: 50,
      speed: Math.random() * 2 + 1 // Random speed between 1 and 3
    });
  }
}

// Draw and move asteroids
function drawAsteroids() {
  asteroids.forEach((asteroid, index) => {
    asteroid.y += asteroid.speed; // Move asteroid down at its speed

    // Remove asteroid if it goes out of bounds
    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1);
    }

    // Draw the asteroid
    ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  });
}

// Check collision
function checkCollision() {
  bullets.forEach((bullet, bIndex) => {
    asteroids.forEach((asteroid, aIndex) => {
      if (
        bullet.x < asteroid.x + asteroid.width &&
        bullet.x + bullet.width > asteroid.x &&
        bullet.y < asteroid.y + asteroid.height &&
        bullet.y + bullet.height > asteroid.y
      ) {
        bullets.splice(bIndex, 1);
        asteroids.splice(aIndex, 1);
        score += 10;
        scoreDisplay.textContent = score;
      }
    });
  });
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  drawBullets();
  spawnAsteroids();
  drawAsteroids();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

// Start game
startBtn.addEventListener("click", () => {
  console.log("Start button clicked");
  gameRunning = true;
  try {
    bgMusic.play().catch((error) => console.error("Failed to play background music:", error));
  } catch (error) {
    console.error("Audio playback error:", error);
  }
  score = 0;
  scoreDisplay.textContent = score;
  spaceship.x = 370;
  spaceship.y = 500;
  asteroids = [];
  bullets = [];
  gameLoop();
});
