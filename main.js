let paddle1 = 10;
let paddle2 = 10;
let paddle1X = 10;
let paddle1Y;
let paddle2Y = 685;
let paddle1Height = 110;
let paddle2Height = 70;
let score1 = 0;
let score2 = 0;
let playerscore = 0;
let pcscore = 0;
let ball_touch_paddel;
let missed;
let rightWristY;
let gameOver = false;

let ball = {
    x: 350 / 2,
    y: 480 / 2,
    r: 20,
    dx: 3,
    dy: 3
};

function preload() {
    ball_touch_paddel = loadSound("ball_touch_paddel.wav");
    missed = loadSound("missed.wav");
}

function setup() {
    canvas = createCanvas(700, 550);
    canvas.parent('gameContainer');
    video = createCapture(VIDEO);
    video.size(700, 550);
    video.hide();

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
}

function modelLoaded() {
    console.log("Modelo Carregado!");
}

function gotPoses(poses) {
    if (poses.length > 0) {
        rightWristY = poses[0].pose.rightWrist.y;
    }
}

function draw() {
    background(0);

    image(video, 0, 0, 700, 550);

    fill("black");
    stroke("black");
    rect(680, 0, 20, 700);

    fill("black");
    stroke("black");
    rect(0, 0, 20, 700);

    paddleInCanvas();

    fill(250, 0, 0);
    stroke(0, 0, 250);
    strokeWeight(0.5);
    paddle1Y = rightWristY;
    rect(paddle1X, paddle1Y, paddle1, paddle1Height, 100);

    fill("#FFA500");
    stroke("#FFA500");
    paddle2y = ball.y - paddle2Height / 2;
    rect(paddle2Y, paddle2y, paddle2, paddle2Height, 100);

    midline();
    drawScore();
    models();
    move();
}

function reset() {
    ball.x = width / 2 + 100;
    ball.y = height / 2 + 100;
    ball.dx = 3;
    ball.dy = 3;
}

function midline() {
    for (let i = 0; i < 480; i += 10) {
        y = 0;
        fill("white");
        stroke(0);
        rect(width / 2, y + i, 10, 480);
    }
}

function drawScore() {
    textAlign(CENTER);
    textSize(20);
    fill("red");
    stroke(250, 0, 0);
    text("Jogador:", 100, 50);
    text(playerscore, 180, 50);
    text("Computador:", 500, 50);
    text(pcscore, 595, 50);
}

function move() {
    fill(50, 350, 0);
    stroke(255, 0, 0);
    strokeWeight(0.5);
    ellipse(ball.x, ball.y, ball.r, 20);
    ball.x = ball.x + ball.dx;
    ball.y = ball.y + ball.dy;

    if (ball.x + ball.r > width - ball.r / 2) {
        ball.dx = -ball.dx - 0.5;
    }

    if (ball.x - 2.5 * ball.r / 2 < 0) {
        if (ball.y >= paddle1Y && ball.y <= paddle1Y + paddle1Height) {
            ball.dx = -ball.dx + 0.5;
            ball_touch_paddel.play();
            playerscore++;
        } else {
            missed.play();
            pcscore++;
            reset();
            navigator.vibrate(100);
        }
    }

    if (pcscore === 4) {
        fill("#FFA500");
        stroke(0);
        rect(0, 0, width, height - 1);
        fill("white");
        stroke("white");
        textSize(25);
        text("Game Over!☹☹", width / 2, height / 2);
        text("Clique em 'Reiniciar' para recomeçar!", width / 2, height / 2 + 30);
        noLoop();
        gameOver = true;
        pcscore = 0;
    }

    if (ball.y + ball.r > height || ball.y - ball.r < 0) {
        ball.dy = -ball.dy;
    }
}

function models() {
    textSize(18);
    fill('red');
    noStroke();
    text("Largura:" + width, 195, 15);
    text("Velocidade:" + abs(ball.dx), 65, 15);
    text("Altura:" + height, 300, 15);
}

function paddleInCanvas() {
    if (rightWristY + paddle1Height > height) {
        rightWristY = height - paddle1Height;
    }
    if (rightWristY < 0) {
        rightWristY = 0;
    }
}

function restart() {
    if (gameOver) {
        pcscore = 0;
        playerscore = 0;
        loop();
        gameOver = false;
    }
}