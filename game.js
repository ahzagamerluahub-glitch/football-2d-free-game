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

// AIM
let aim1 = { x:1, y:0 };
let aim2 = { x:-1, y:0 };

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

// LIMIT FIELD
function clampBall(){
  if(ball.y < 10){ ball.y = 10; ball.vy *= -0.5; }
  if(ball.y > 490){ ball.y = 490; ball.vy *= -0.5; }
}

// DRAW PLAYER
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

// 🔥 FIX: AUTO DETECT RIGHT STICK (INI YANG MEMPERBAIKI BUG KAMU)
function getRightStick(pad){

  const pairs = [
    [2,3],
    [3,4],
    [4,5]
  ];

  for(let p of pairs){
    let x = pad.axes[p[0]];
    let y = pad.axes[p[1]];

    if(x !== undefined && y !== undefined){
      if(Math.abs(x) > 0.15 || Math.abs(y) > 0.15){
        return {x,y};
      }
    }
  }

  return {x:0,y:0};
}

// UPDATE GAME
function update(){

  let p1pad = pad(0);
  let p2pad = pad(1);

  // ===== PLAYER 1 =====
  if(p1pad){

    let lx = p1pad.axes[0];
    let ly = p1pad.axes[1];

    // MOVE
    if(Math.abs(lx)>0.2) p1.x += lx*5;
    if(Math.abs(ly)>0.2) p1.y += ly*5;

    // AIM RIGHT STICK FIX
    let rs = getRightStick(p1pad);
    let len = Math.hypot(rs.x,rs.y);
    if(len > 0.1){
      aim1.x = rs.x/len;
      aim1.y = rs.y/len;
    }

    // SHOOT ✕
    if(p1pad.buttons[0].pressed && dist(p1,ball)<40){
      ball.vx = aim1.x * 8;
      ball.vy = aim1.y * 8;
    }
  }

  // ===== PLAYER 2 =====
  if(p2pad){

    let lx = p2pad.axes[0];
    let ly = p2pad.axes[1];

    if(Math.abs(lx)>0.2) p2.x += lx*5;
    if(Math.abs(ly)>0.2) p2.y += ly*5;

    let rs = getRightStick(p2pad);
    let len = Math.hypot(rs.x,rs.y);
    if(len > 0.1){
      aim2.x = rs.x/len;
      aim2.y = rs.y/len;
    }

    if(p2pad.buttons[0].pressed && dist(p2,ball)<40){
      ball.vx = aim2.x * 8;
      ball.vy = aim2.y * 8;
    }
  }

  // BALL PHYSICS
  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vx *= 0.98;
  ball.vy *= 0.98;

  clampBall();

  // GOAL LEFT
  if(ball.x < 10){
    score2++;
    document.getElementById("ui").innerText = score1+" : "+score2;
    resetBall();
  }

  // GOAL RIGHT
  if(ball.x > 890){
    score1++;
    document.getElementById("ui").innerText = score1+" : "+score2;
    resetBall();
  }

  // LIMIT PLAYER
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

  // LINE
  ctx.strokeStyle="white";
  ctx.beginPath();
  ctx.moveTo(450,0);
  ctx.lineTo(450,500);
  ctx.stroke();

  // GOAL ZONE
  ctx.fillStyle="rgba(255,255,255,0.2)";
  ctx.fillRect(0,180,20,140);
  ctx.fillRect(880,180,20,140);

  // PLAYERS
  drawPlayer(p1);
  drawPlayer(p2);

  // BALL
  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.arc(ball.x,ball.y,8,0,Math.PI*2);
  ctx.fill();

  // AIM LINE P1
  ctx.strokeStyle="yellow";
  ctx.beginPath();
  ctx.moveTo(ball.x,ball.y);
  ctx.lineTo(ball.x + aim1.x*30, ball.y + aim1.y*30);
  ctx.stroke();
}

// LOOP
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
