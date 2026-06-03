const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// SCORE
let score1 = 0;
let score2 = 0;

// PLAYERS
let p1 = { x:200, y:250, color:"cyan" };
let p2 = { x:700, y:250, color:"orange" };

// BALL
let ball = { x:450, y:250, vx:0, vy:0 };

// DIRECTION CONTROL (default kanan)
let dir1 = { x:1, y:0 };
let dir2 = { x:-1, y:0 };

// GAMEPAD
function pad(i){
  return navigator.getGamepads()[i];
}

// DIST
function dist(a,b){
  return Math.hypot(a.x-b.x, a.y-b.y);
}

// RESET BALL
function resetBall(){
  ball.x = 450;
  ball.y = 250;
  ball.vx = 0;
  ball.vy = 0;
}

// LIMIT FIELD (BIAR BOLA GAK HILANG)
function clampBall(){

  // kiri kanan = GOAL
  if(ball.x < 0){
    score2++;
    updateScore();
    resetBall();
  }

  if(ball.x > 900){
    score1++;
    updateScore();
    resetBall();
  }

  // atas bawah = MANTUL
  if(ball.y < 10){
    ball.y = 10;
    ball.vy *= -0.6;
  }

  if(ball.y > 490){
    ball.y = 490;
    ball.vy *= -0.6;
  }
}

function updateScore(){
  document.getElementById("ui").innerText = score1 + " : " + score2;
}

// DRAW PLAYER (simple human)
function drawPlayer(p){
  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.arc(p.x, p.y-10, 6, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle=p.color;
  ctx.fillRect(p.x-5,p.y-5,10,20);

  ctx.strokeStyle="black";
  ctx.beginPath();
  ctx.moveTo(p.x-5,p.y+15);
  ctx.lineTo(p.x-10,p.y+25);
  ctx.moveTo(p.x+5,p.y+15);
  ctx.lineTo(p.x+10,p.y+25);
  ctx.stroke();
}

// INPUT BUTTON MAP PS
function handleDirection(pad, dir){

  if(!pad) return dir;

  // △ UP = buttons[3]
  if(pad.buttons[3].pressed) dir = {x:0, y:-1};

  // ○ RIGHT = buttons[1]
  if(pad.buttons[1].pressed) dir = {x:1, y:0};

  // ✕ DOWN = buttons[0]
  if(pad.buttons[0].pressed) dir = {x:0, y:1};

  // □ LEFT = buttons[2]
  if(pad.buttons[2].pressed) dir = {x:-1, y:0};

  return dir;
}

// UPDATE GAME
function update(){

  let p1pad = pad(0);
  let p2pad = pad(1);

  // ===== PLAYER 1 =====
  if(p1pad){

    // arah dari tombol
    dir1 = handleDirection(p1pad, dir1);

    // R1 SHOOT = buttons[5]
    if(p1pad.buttons[5].pressed && dist(p1,ball)<40){
      ball.vx = dir1.x * 8;
      ball.vy = dir1.y * 8;
    }
  }

  // ===== PLAYER 2 =====
  if(p2pad){

    dir2 = handleDirection(p2pad, dir2);

    if(p2pad.buttons[5].pressed && dist(p2,ball)<40){
      ball.vx = dir2.x * 8;
      ball.vy = dir2.y * 8;
    }
  }

  // BALL MOVE
  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vx *= 0.98;
  ball.vy *= 0.98;

  // BORDER + GOAL LOGIC
  clampBall();

  // LIMIT PLAYER FIELD
  [p1,p2].forEach(p=>{
    p.x = Math.max(20,Math.min(880,p.x));
    p.y = Math.max(20,Math.min(480,p.y));
  });
}

// DRAW FIELD
function draw(){

  ctx.clearRect(0,0,900,500);

  // FIELD
  ctx.fillStyle="#0b7a3d";
  ctx.fillRect(0,0,900,500);

  // MID LINE
  ctx.strokeStyle="white";
  ctx.beginPath();
  ctx.moveTo(450,0);
  ctx.lineTo(450,500);
  ctx.stroke();

  // BORDER VISUAL
  ctx.strokeStyle="rgba(255,255,255,0.2)";
  ctx.strokeRect(0,0,900,500);

  // PLAYERS
  drawPlayer(p1);
  drawPlayer(p2);

  // BALL
  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,8,0,Math.PI*2);
  ctx.fill();
}

// LOOP
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
