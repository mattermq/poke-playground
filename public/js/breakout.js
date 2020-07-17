const canvas = document.getElementById('breakout');
const gameStartBtn = document.getElementById('game-start');
const ctx = canvas.getContext('2d');

// Buttons
let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Ball Radius
const ballRadius = 10;

// Координаты и смещение
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = -3;
let dy = -1;

// Paddle
const paddleHeight = 7;
const paddleWidth = 50;
let paddleX = (canvas.width - paddleWidth) / 2;

// Bricks
const brickRowCount = 2;
const brickColumnCount = 7;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 17;

const bricks = [];
for (let i = 0; i < brickColumnCount; i += 1) {
  bricks[i] = [];

  for (let j = 0; j < brickRowCount; j += 1) {
    bricks[i][j] = { x: 0, y: 0 };
  }
}

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let i = 0; i < brickColumnCount; i += 1) {
    for (let j = 0; j < brickRowCount; j += 1) {
      const brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
      const brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
      bricks[i][j].x = brickX;
      bricks[i][j].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillStyle = '#0095DD';
      ctx.fill();
      ctx.closePath();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();

  if (y + dy < ballRadius) {
    dy = -dy;
    ctx.fillStyle = getRandomColor();
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      dy -= 1;
    } else {
      ctx.clearRect(0, 0, 480, 320);

      ctx.fillStyle = 'green';
      ctx.font = '24px Lucida Console';
      ctx.fillText('Game Over!', 180, canvas.height / 2);
      // ctx.fillText(`Score: ${score}`, 99, (canvas.height / 2) + 50);
      return;
    }
  }

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
    ctx.fillStyle = getRandomColor();
  }

  x += dx;
  y += dy;

  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  requestAnimationFrame(draw);
}

gameStartBtn.addEventListener('click', (e) => {
  e.preventDefault();

  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = -3;
  dy = -1;

  draw();
});

function drawStartText() {
  ctx.fillStyle = 'green';
  ctx.font = '24px Lucida Console';
  ctx.fillText('Press Play Button!', 150, canvas.height / 2);
}

document.onload = drawStartText();
