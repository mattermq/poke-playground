const canvas = document.getElementById('breakout');
const gameStartBtn = document.getElementById('game-start');
const ctx = canvas.getContext('2d');

const bounceSound = new Audio();
bounceSound.src = './audio/bounce.mp3';

// Buttons
let rightPressed = false;
let leftPressed = false;

// Score
let score = 0;

// Win Flag
let winFlag = 0;

// Lives
let lives = 3;

// Ball Radius
const ballRadius = 10;

// Координаты и смещение
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = -3;
let dy = -1;

// Paddle
const paddleHeight = 14;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Bricks
const brickRowCount = 4;
const brickColumnCount = 7;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 17;

const bricks = [];

function addBricks() {
  for (let i = 0; i < brickColumnCount; i += 1) {
    bricks[i] = [];

    for (let j = 0; j < brickRowCount; j += 1) {
      bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
  }
}

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

function collisionDetection() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      const brick = bricks[i][j];
      if (brick.status === 1) {
        if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
          bounceSound.play();
          dy = -dy;
          brick.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            winFlag = 1;
          }
        }
      }
    }
  }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = 'rgb(139,195,74)';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let i = 0; i < brickColumnCount; i += 1) {
    for (let j = 0; j < brickRowCount; j += 1) {
      if (bricks[i][j].status === 1) {
        const brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = 'rgb(139,195,74)';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = '20px Lucida Console';
  ctx.fillStyle = 'rgb(139,195,74)';
  ctx.fillText(`Score:${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '20px Lucida Console';
  ctx.fillStyle = 'rgb(139,195,74)';
  ctx.fillText(`Your Lives:${lives}`, canvas.width - 125, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (winFlag === 1) {
    ctx.clearRect(0, 0, 480, 320);

    ctx.fillStyle = 'rgb(139,195,74)';
    ctx.font = '24px Lucida Console';
    ctx.fillText('Congratulations! You Win!', 100, canvas.height / 2);
    ctx.fillText(`Score: ${score}`, 150, (canvas.height / 2) + 50);

    fetch('/api/scores/ark', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score }),
    });

    return;
  }

  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      dy -= 1;
    } else {
      lives -= 1;

      if (lives === 0) {
        ctx.clearRect(0, 0, 480, 320);

        ctx.fillStyle = 'green';
        ctx.font = '24px Lucida Console';
        ctx.fillText('Game Over!', 180, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, 198, (canvas.height / 2) + 50);

        fetch('/api/scores/ark', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ score }),
        });

        return;
      }

      x = canvas.width / 2;
      y = canvas.height - 30;
      dx = -3;
      dy = -1;
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  }

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
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

  score = 0;
  lives = 3;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = -3;
  dy = -1;
  addBricks();

  draw();
});

function drawStartText() {
  ctx.fillStyle = 'green';
  ctx.font = '24px Lucida Console';
  ctx.fillText('Press Play Button!', 150, canvas.height / 2);
}

document.onload = drawStartText();
