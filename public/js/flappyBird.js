const nickname = document.getElementById('username').innerText;
const gameStartBtn = document.getElementById('game-start');
const canvas = document.getElementById('flappy-bird');
const context = canvas.getContext('2d');

const bird = new Image();
bird.src = './img/bird_bird.png';

const bg = new Image();
bg.src = './img/bird_backg.png';

const fg = new Image();
fg.src = './img/bird_foreg.png';

const pipeUp = new Image();
pipeUp.src = './img/bird_uppipe.png';

const pipeBottom = new Image();
pipeBottom.src = './img/bird_botpipe.png';

const scoreSound = new Audio();
scoreSound.src = './audio/score.mp3';

let score = 0;

// bird Position
let xPos = 10;
let yPos = 100;
let gravity = 1.7;

// Controls
document.addEventListener('mousedown', () => {
  yPos -= 25;
});

document.addEventListener('touchstart', () => {
  yPos -= 25;
});

// Pipes Array
let pipes = [];
pipes[0] = {
  x: canvas.width,
  y: 0,
};

function draw() {
  context.drawImage(bg, 0, 0);

  const gap = 90;

  for (let i = 0; i < pipes.length; i++) {
    context.drawImage(pipeUp, pipes[i].x, pipes[i].y);
    context.drawImage(pipeBottom, pipes[i].x, pipes[i].y + pipeUp.height + gap);

    pipes[i].x -= 1;

    if (pipes[i].x === 75) {
      pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
      });
    }

    if (xPos + bird.width >= pipes[i].x
      && xPos <= pipes[i].x + pipeUp.width
      && (yPos <= pipes[i].y + pipeUp.height
      || yPos + bird.height >= pipes[i].y + pipeUp.height + gap)
      || yPos + bird.height >= canvas.height - fg.height) {
      // location.reload();
      context.clearRect(0, 0, 288, 512);

      context.fillStyle = 'green';
      context.font = '24px Lucida Console';
      context.fillText('Game Over!', 83, canvas.height / 2);
      context.fillText(`Score: ${score}`, 99, (canvas.height / 2) + 50);

      fetch('/api/scores/fb', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
      });

      return;
    }

    if (pipes[i].x === 5) {
      score += 1;
      scoreSound.play();
    }
  }

  context.drawImage(fg, 0, canvas.height - fg.height);
  context.drawImage(bird, xPos, yPos);

  context.fillStyle = 'green';
  context.font = '24px Roboto';
  context.fillText(`Score: ${score}`, 10, canvas.height - 20);

  yPos += gravity;

  requestAnimationFrame(draw);
}

gameStartBtn.addEventListener('click', (e) => {
  e.preventDefault();

  pipes = [];
  pipes[0] = {
    x: canvas.width,
    y: 0,
  };

  yPos = 100;
  score = 0;

  draw();
});

pipeBottom.onload = draw;
