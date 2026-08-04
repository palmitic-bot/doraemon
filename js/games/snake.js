// snake.js — งูงับ (ปัดนิ้วเลี้ยว เก็บอาหารให้ตัวยาว ชนกำแพงหรือชนตัวเอง = จบ)
const COLS = 15, ROWS = 19;
let root, el, cv, ctx, cell = 18, W = 0, H = 0;
let snake = [], dir = null, next = null, food = null;
let score = 0, best = 0, timer = null, state = 'ready';   // ready | play | over
let touch = null;

function stop(){ if(timer){ clearInterval(timer); timer = null; } }

// สี่เหลี่ยมมุมมน — ใช้ arcTo แทน ctx.roundRect เพราะ roundRect ต้อง Safari 16.4+
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

function speedMs(){ return Math.max(90, 200 - Math.floor(score / 3) * 12); }

function placeFood(){
  const free = [];
  for(let y = 0; y < ROWS; y++){
    for(let x = 0; x < COLS; x++){
      if(!snake.some(s => s.x === x && s.y === y)) free.push({ x, y });
    }
  }
  food = free.length ? free[Math.floor(Math.random() * free.length)] : null;
}

function reset(){
  stop();
  const cy = Math.floor(ROWS / 2);
  snake = [{ x: 4, y: cy }, { x: 3, y: cy }, { x: 2, y: cy }];
  dir = { x: 1, y: 0 };
  next = dir;
  score = 0;
  state = 'ready';
  placeFood();
  hud();
  el.status.textContent = 'ปัดนิ้วบนจอเพื่อเริ่ม แล้วปัดเพื่อเลี้ยว';
  draw();
}

function hud(){
  el.score.textContent = 'คะแนน: ' + score;
  el.best.textContent = '🏆 สูงสุด ' + best;
}

function gameOver(){
  stop();
  state = 'over';
  if(score > best) best = score;
  hud();
  el.status.textContent = `จบเกม! ได้ ${score} คะแนน — คนคะแนนน้อยสุดดื่ม! กดเริ่มใหม่`;
  draw();
}

function step(){
  dir = next;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  if(head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS){ gameOver(); return; }
  // ชนตัวเอง — ไม่นับหางท้ายสุดเพราะมันจะขยับออกพอดีถ้าไม่ได้กินอาหาร
  const body = snake.slice(0, snake.length - 1);
  if(body.some(s => s.x === head.x && s.y === head.y)){ gameOver(); return; }

  snake.unshift(head);
  if(food && head.x === food.x && head.y === food.y){
    score++;
    hud();
    placeFood();
    stop();
    timer = setInterval(step, speedMs());   // กินแล้วเร็วขึ้น
    if(!food){ gameOver(); return; }        // เต็มกระดาน = ชนะ
  } else {
    snake.pop();
  }
  draw();
}

function play(){
  if(state === 'over') return;
  if(state === 'ready'){
    state = 'play';
    el.status.textContent = 'ปัดนิ้วเพื่อเลี้ยว อย่าชนกำแพงหรือตัวเอง';
    timer = setInterval(step, speedMs());
  }
}

function turn(nx, ny){
  if(state === 'over') return;
  if(dir.x === -nx && dir.y === -ny) return;   // ห้ามกลับหลังทันที
  next = { x: nx, y: ny };
  play();
}

function draw(){
  ctx.clearRect(0, 0, W, H);
  // ตาราง
  ctx.strokeStyle = 'rgba(247,239,225,0.05)';
  ctx.lineWidth = 1;
  for(let x = 1; x < COLS; x++){
    ctx.beginPath(); ctx.moveTo(x * cell, 0); ctx.lineTo(x * cell, H); ctx.stroke();
  }
  for(let y = 1; y < ROWS; y++){
    ctx.beginPath(); ctx.moveTo(0, y * cell); ctx.lineTo(W, y * cell); ctx.stroke();
  }
  if(food){
    ctx.fillStyle = '#ff5d8f';
    ctx.beginPath();
    ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? '#eab949' : `rgba(122,200,120,${Math.max(0.35, 1 - i * 0.045)})`;
    const p = 2;
    rr(s.x * cell + p, s.y * cell + p, cell - p * 2, cell - p * 2, 4);
  });
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">งูงับ 🐍</h1>
        <p class="g-sub">ปัดนิ้วเลี้ยว เก็บอาหารให้ตัวยาวขึ้น ยิ่งกินยิ่งเร็ว ชนกำแพงหรือชนตัวเอง = จบ</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:340px;">
        <span class="g-tag" id="score">คะแนน: 0</span>
        <span class="g-tag" id="best">🏆 สูงสุด 0</span>
      </div>
      <div class="cv-box" id="box"><canvas class="cv" id="cv"></canvas></div>
      <button class="g-btn" id="againBtn">เริ่มใหม่ 🔄</button>
      <div class="g-prompt-sub" id="status">ปัดนิ้วบนจอเพื่อเริ่ม แล้วปัดเพื่อเลี้ยว</div>
    </div>`;
  el = { score: root.querySelector('#score'), best: root.querySelector('#best'),
    status: root.querySelector('#status') };
  cv = root.querySelector('#cv');

  const boxW = root.querySelector('#box').clientWidth || 300;
  cell = Math.floor(Math.min(Math.max(boxW, 240), 330) / COLS);
  W = cell * COLS; H = cell * ROWS;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr; cv.height = H * dpr;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // ปัดนิ้ว: จับทิศจากแกนที่ขยับมากกว่า ต้องเกิน 18px กันปัดพลาด
  cv.addEventListener('pointerdown', e => { e.preventDefault(); touch = { x: e.clientX, y: e.clientY }; });
  cv.addEventListener('pointerup', e => {
    e.preventDefault();
    if(!touch) return;
    const dx = e.clientX - touch.x, dy = e.clientY - touch.y;
    touch = null;
    if(Math.abs(dx) < 18 && Math.abs(dy) < 18){ play(); return; }   // แตะเฉยๆ = เริ่ม
    if(Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0);
    else turn(0, dy > 0 ? 1 : -1);
  });
  root.querySelector('#againBtn').addEventListener('click', reset);

  reset();
}

export function unmount(){
  stop();
  state = 'over'; touch = null;
  root = null; el = null; cv = null; ctx = null;
}
