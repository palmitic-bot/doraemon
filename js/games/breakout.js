// breakout.js — ทุบบล็อก (ลากนิ้วรับลูกบอล ทุบบล็อกให้หมดด่าน)
const COLORS = ['#eab949', '#ff5d8f', '#5ec4e0', '#7fe07a', '#c08bff'];
const COLS = 6, ROWS = 5, PAD = 6, TOP = 26, BH = 17;
let root, el, cv, ctx, raf = null, W = 0, H = 0;
let bricks = [], paddle = null, ball = null;
let score = 0, lives = 3, level = 1, state = 'ready';   // ready | play | over

function rr(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

function hud(){
  el.score.textContent = 'คะแนน: ' + score;
  el.lives.textContent = '❤️ ' + lives + ' · ด่าน ' + level;
}

function makeBricks(){
  bricks = [];
  const bw = (W - PAD * (COLS + 1)) / COLS;
  for(let r = 0; r < ROWS; r++){
    for(let c = 0; c < COLS; c++){
      bricks.push({ x: PAD + c * (bw + PAD), y: TOP + r * (BH + PAD), w: bw, h: BH,
        color: COLORS[r % COLORS.length], alive: true });
    }
  }
}

function resetBall(){
  const sp = 3.0 + level * 0.3;
  ball = { x: W / 2, y: H - 52, r: 6, vx: (Math.random() < 0.5 ? -1 : 1) * sp * 0.6, vy: -sp };
  state = 'ready';
}

function start(full){
  if(full){ score = 0; lives = 3; level = 1; }
  paddle = { x: W / 2, w: Math.max(58, W * 0.26), h: 11 };
  makeBricks();
  resetBall();
  hud();
  el.status.textContent = 'แตะจอเพื่อปล่อยลูกบอล แล้วลากนิ้วรับ';
}

function movePaddle(clientX){
  const rect = cv.getBoundingClientRect();
  const x = clientX - rect.left;
  paddle.x = Math.min(W - paddle.w / 2, Math.max(paddle.w / 2, x));
  if(state === 'ready') ball.x = paddle.x;
}

function launch(){
  if(state === 'over'){ start(true); return; }
  if(state === 'ready'){ state = 'play'; el.status.textContent = 'ลากนิ้วรับลูกบอล อย่าให้ตก!'; }
}

function loseLife(){
  lives--;
  hud();
  if(lives <= 0){
    state = 'over';
    el.status.textContent = `จบเกม! ได้ ${score} คะแนน (ด่าน ${level}) — คนคะแนนน้อยสุดดื่ม! แตะเพื่อเล่นใหม่`;
  } else {
    resetBall();
    ball.x = paddle.x;
    el.status.textContent = `ลูกตก! เหลือ ${lives} ชีวิต — แตะเพื่อปล่อยลูกใหม่`;
  }
}

function hitBricks(){
  for(const b of bricks){
    if(!b.alive) continue;
    if(ball.x + ball.r < b.x || ball.x - ball.r > b.x + b.w) continue;
    if(ball.y + ball.r < b.y || ball.y - ball.r > b.y + b.h) continue;
    b.alive = false;
    score += 10;
    hud();
    const ox = Math.min(ball.x + ball.r - b.x, b.x + b.w - (ball.x - ball.r));
    const oy = Math.min(ball.y + ball.r - b.y, b.y + b.h - (ball.y - ball.r));
    if(ox < oy) ball.vx = -ball.vx; else ball.vy = -ball.vy;
    break;
  }
  if(bricks.every(b => !b.alive)){
    level++;
    score += 50;
    makeBricks();
    resetBall();
    ball.x = paddle.x;
    hud();
    el.status.textContent = `🎉 เคลียร์ด่าน! ไปด่าน ${level} (บอลเร็วขึ้น) — แตะเพื่อไปต่อ`;
  }
}

function update(){
  ball.x += ball.vx;
  ball.y += ball.vy;
  if(ball.x < ball.r){ ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
  if(ball.x > W - ball.r){ ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }
  if(ball.y < ball.r){ ball.y = ball.r; ball.vy = Math.abs(ball.vy); }

  const py = H - 26;
  if(ball.vy > 0 && ball.y + ball.r >= py && ball.y - ball.r <= py + paddle.h &&
     Math.abs(ball.x - paddle.x) <= paddle.w / 2 + ball.r){
    ball.y = py - ball.r;
    ball.vy = -Math.abs(ball.vy);
    ball.vx += ((ball.x - paddle.x) / (paddle.w / 2)) * 1.3;
    ball.vx = Math.max(-6.5, Math.min(6.5, ball.vx));
  }

  hitBricks();
  if(ball.y - ball.r > H) loseLife();
}

function draw(){
  ctx.clearRect(0, 0, W, H);
  bricks.forEach(b => { if(b.alive){ ctx.fillStyle = b.color; rr(b.x, b.y, b.w, b.h, 5); } });
  ctx.fillStyle = '#f7efe1';
  rr(paddle.x - paddle.w / 2, H - 26, paddle.w, paddle.h, 6);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = '#eab949';
  ctx.fill();
}

function loop(){
  raf = requestAnimationFrame(loop);
  if(state === 'play') update();
  draw();
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ทุบบล็อก 🧱</h1>
        <p class="g-sub">ลากนิ้วเลื่อนแป้นรับลูกบอล ทุบบล็อกให้หมดด่าน มี 3 ชีวิต หมดชีวิต = ดื่ม!</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:360px;">
        <span class="g-tag" id="score">คะแนน: 0</span>
        <span class="g-tag" id="lives">❤️ 3 · ด่าน 1</span>
      </div>
      <div class="cv-box" id="box"><canvas class="cv" id="cv"></canvas></div>
      <button class="g-btn" id="againBtn">เริ่มใหม่ 🔄</button>
      <div class="g-prompt-sub" id="status">แตะจอเพื่อปล่อยลูกบอล แล้วลากนิ้วรับ</div>
    </div>`;
  el = { score: root.querySelector('#score'), lives: root.querySelector('#lives'),
    status: root.querySelector('#status') };
  cv = root.querySelector('#cv');

  const boxW = root.querySelector('#box').clientWidth || 320;
  W = Math.round(Math.min(Math.max(boxW, 260), 360));
  H = Math.round(W * 1.32);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr; cv.height = H * dpr;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  cv.addEventListener('pointerdown', (e) => { e.preventDefault(); movePaddle(e.clientX); launch(); });
  cv.addEventListener('pointermove', (e) => { e.preventDefault(); movePaddle(e.clientX); });
  root.querySelector('#againBtn').addEventListener('click', () => start(true));

  start(true);
  loop();
}
export function unmount(){
  if(raf){ cancelAnimationFrame(raf); raf = null; }
  state = 'over'; root = null; el = null; cv = null; ctx = null;
}
