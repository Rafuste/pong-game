const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const paddleWidth = 15;
const paddleHeight = 90;
const ballRadius = 10;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let playerSpeed = 0;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
let playerScore = 0;
let aiScore = 0;

canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
});

window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
        playerSpeed = -7;
    } else if (e.key === 'ArrowDown') {
        playerSpeed = 7;
    }
});

window.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        playerSpeed = 0;
    }
});

function draw() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#666';
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fff';
    ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth - 10, aiY, paddleWidth, paddleHeight);
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f5d300';
    ctx.fill();
}

function update() {
    playerY += playerSpeed;
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 10) {
        aiY += 5;
    } else if (aiCenter > ballY + 10) {
        aiY -= 5;
    }
    if (aiY < 0) aiY = 0;
    if (aiY + paddleHeight > canvas.height) aiY = canvas.height - paddleHeight;
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballY - ballRadius < 0) {
        ballY = ballRadius;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + ballRadius > canvas.height) {
        ballY = canvas.height - ballRadius;
        ballSpeedY = -ballSpeedY;
    }
    if (ballX - ballRadius < 10 + paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
        ballX = 10 + paddleWidth + ballRadius;
        ballSpeedX = -ballSpeedX;
        let collidePoint = ballY - (playerY + paddleHeight / 2);
        ballSpeedY += collidePoint * 0.15;
    }
    if (ballX + ballRadius > canvas.width - 10 - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
        ballX = canvas.width - 10 - paddleWidth - ballRadius;
        ballSpeedX = -ballSpeedX;
        let collidePoint = ballY - (aiY + paddleHeight / 2);
        ballSpeedY += collidePoint * 0.15;
    }
    if (ballX + ballRadius > canvas.width) {
        playerScore++;
        resetBall(-1);
        updateScore();
    }
    if (ballX - ballRadius < 0) {
        aiScore++;
        resetBall(1);
        updateScore();
    }
}

function resetBall(dir) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5 * dir;
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function updateScore() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('ai-score').textContent = aiScore;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

updateScore();
gameLoop();