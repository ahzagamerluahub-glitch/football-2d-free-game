const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// SCORE
let s1 = 0;
let s2 = 0;

// PLAYERS
let p1 = { x:200, y:250 };
let p2 = { x:700, y:250 };

// BALL
let ball = { x:450, y:250, vx:0, vy:0 };

// GAMEPAD CACHE (BIAR STABIL)
let pads = [];

// UPDATE GAMEPAD LIST
function updatePads(){
  pads = navigator.getGamepads();
  requestAnimationFrame(updatePads);
}
updatePads();

// CHECK DIST
function dist(a,b){
  return Math.hypot(a.x-b.x, a.y-b.y);
}

// RESET BALL
function resetBall(dir){
  ball.x = 450;
  ball.y = 250;
  ball.vx = dir * 5;
  ball.vy = 0;
}

// DRAW PLAYER (orang simple)
function drawPlayer(p,color){
  ctx.fillStyle=color;
  ctx.fillRect(p.x-5,p.y-5,10,20);

  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.arc(p.x,p.y-10,6,0,Math.PI*2);
  ctx.fill();
}

// INPUT SAFE (ANTI BUG)
function getPad(i){
  return pads && pads[i] ? pads[i] : null;
}

// UPDATE
function update(){

  let p1pad = getPad(0);
  let p2pad = getPad(1);

  // ===== PLAYER 1 =====
  if(p1pad){

    let x = p1pad.axes[0];
    let y = p1pad.axes[1];

    if(Math.abs(x)>0.2) p1.x += x*5;
    if(Math.abs(y)>0.2) p1.y += y*5;

    // SHOOT = R1 (fallback aman)
    if(p1pad.buttons[5] && p1pad.buttons[5].pressed){
      if(dist(p1,ball)<40){
        ball.vx = 6;
        ball.vy = 0;
      }
    }
  }

  // ===== PLAYER 2 =====
  if(p2pad){

    let x = p2pad.axes[0];
    let y = p2pad.axes[1];

    if(Math.abs(x)>0.2) p2.x += x*5;
    if(Math.abs(y)>0.2) p2.y += y*5;

    if(p2pad.buttons[5] && p2pad.buttons[5].pressed){
      if(dist(p2,ball)<40){
        ball.vx = -6;
        ball.vy = 0;
      }
    }
  }

  // BALL MOVE
  ball.x += ball.vx;
  ball.y += ball.vy;

  ball.vx *= 0.98;

  // ===== BOUNDARY (BIAR GAK HILANG) =====
  if(ball.y < 10){ ball.y = 10; ball.vy *= -0.6; }
  if(ball.y > 490){ ball.y = 490; ball.vy *= -0.6; }

  // ===== GOAL LEFT =====
  if(ball.x < 10 && ball.y > 180 && ball.y < 320){
    s2++;
    document.getElementById("ui").innerText = s1+" : "+s2;
    resetBall(1);
  }

  // ===== GOAL RIGHT =====
  if(ball.x > 890 && ball.y > 180 && ball.y < 320){
    s1++;
    document.getElementById("ui").innerText = s1+" : "+s2;
    resetBall(-1);
  }

  // LIMIT PLAYER
  [p1,p2].forEach(p=>{
    p.x = Math.max(20,Math.min(880,p.x));
    p.y = Math.max(20,Math.min(480,p.y));
  });
}

// DRAW FIELD + GOAL
function draw(){

  ctx.clearRect(0,0,900,500);

  // FIELD
  ctx.fillStyle="#0b7a3d";
  ctx.fillRect(0,0,900,500);

  // CENTER LINE
  ctx.strokeStyle="white";
  ctx.beginPath();
  ctx.moveTo(450,0);
  ctx.lineTo(450,500);
  ctx.stroke();

  // 🥅 GOAL LEFT
  ctx.fillStyle="white";
  ctx.fillRect(0,180,10,140);

  // 🥅 GOAL RIGHT
  ctx.fillRect(890,180,10,140);

  // PLAYERS
  drawPlayer(p1,"cyan");
  drawPlayer(p2,"orange");

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
