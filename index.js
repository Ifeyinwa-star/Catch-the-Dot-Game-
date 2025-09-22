const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');


let score = 0;
let gameInterval;
let gameTime = 30; // Game duration in seconds
let timeLeft = gameTime;
let dotmoveInterval;
let gameActive = false; // Start with game inactive
let gameStarted = false; // Track if game has been started
let dot = { x: 100, y: 100, radius: 20 };

function randomPosition() {
    dot.x = Math.random() * (canvas.width - dot.radius * 2) + dot.radius;
    dot.y = Math.random() * (canvas.height - dot.radius * 2) + dot.radius;
}

function drawDot() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Add a glow effect to the dot
    ctx.shadowColor = '#e74c3c';
    ctx.shadowBlur = 10;

    // Draw the dot
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();

    // Reset shadow
    ctx.shadowBlur = 0;
}
function updateTimer() {
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    timeLeft--;
    if (timeLeft < 0) {
        endGame();
    }
}
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(dotmoveInterval);

    restartButton.style.display = 'inline-block';
    startButton.style.display = 'none';

    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function restartGame() {
    score = 0;
    timeLeft = gameTime;
    gameActive = false;
    gameStarted = false;

    scoreElement.textContent = 'Score: 0';
    restartButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    timerDisplay.textContent = 'Time: 30s';

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startGameHandler() {
    gameStarted = true;
    gameActive = true;
    startButton.style.display = 'none';
    startGame();
}

function startGame() {
    randomPosition();
    drawDot();

    //Timer countdown
    gameInterval = setInterval(updateTimer, 1000);

    //Move the dot 1.5 seconds
    dotmoveInterval = setInterval(() => {
    if (gameActive) {
        randomPosition();
        drawDot();
    }
    }, 1500);
}
canvas.addEventListener('click', (e) => {
    if (!gameActive || !gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const dist = Math.sqrt((mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2);

    if (dist < dot.radius) {
        score++;
        scoreElement.textContent = `Score: ${score}`;

        // Create a hit effect
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Move dot immediately when clicked
        randomPosition();
        setTimeout(() => {
            if (gameActive) {
                drawDot();
            }
        }, 100);
    }
});

// Event listeners
startButton.addEventListener('click', startGameHandler);
restartButton.addEventListener('click', restartGame);

// Initialize the game - show the red dot on load
randomPosition();
drawDot();