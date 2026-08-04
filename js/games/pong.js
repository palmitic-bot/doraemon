// pong.js — ปิงปองคู่ (2 คนบนมือถือเครื่องเดียว คนบนคุมแป้นบน คนล่างคุมแป้นล่าง)
const WIN = 5;
let root, el, cv, ctx, raf = null, W = 0, H = 0;
let top = null, bot = null, ball = null;
let sTop = 0, sBot = 0, state = 'ready';   // ready | play | point | over
const grabbed = {};                        // pointerId -> 'top' | 'bot' (รองรับสองนิ้วพร้อมกัน)

function hud(){
  el.top.textContent = 'บน ' + sTop;
  el.bot.textContent = 'ล่าง ' + sBot;
}

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

function centerBall(dirDown){
  const sp = 3.4;
  ball = { x: W / 2, y: H / 2, r: 6,
    vx: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random()) * 1.1,
    vy: dirDown ? sp : -sp };
}

function reset(full){
  if(full){ sTop = 0; sBot = 0; }
  const pw = Math.max(64, W * 0.3);
  top = { x: W / 2, w: pw };
  bot = { x: W / 2, w: pw };
  centerBall(Math.random() < 0.5);
  state = 'ready';
  hud();
  el.status.textContent = 'แตะจอเพื่อเริ่ม — คนบนลากครึ่งบน คนล่างลากครึ่งล่าง';
}

function point(who){
  if(who === 'top') sTop++; else sBot++;
  hud();
  if(sTop >= WIN || sBot >= WIN){
    state = 'over';
    const win = sTop >= WIN ? 'คนบน' : 'คนล่าง';
    const lose = sTop >= WIN ? 'คนล่าง' : 'คนบน';
    el.status.textContent = `🎉 ${win} ชนะ ${Math.max(sTop, sBot)}-${Math.min(sTop, sBot)} — ${lose} ดื่ม! แตะเพื่อเล่นใหม่`;
  } else {
    state = 'point';
    centerBall(who === 'top');
    el.status.textContent = `ได้แต้ม! ${sTop} - ${sBot} · แตะเพื่อเสิร์ฟต่อ`;
  }
}

function tap(){
  if(state === 'over'){ reset(true); return; }
  if(state === 'ready' || state === 'point'){
    state = 'play';
    el.status.textContent = `ถึง ${WIN} แต้มก่อนชนะ · ${sTop} - ${sBot}`;
  }
}

function movePaddle(clientX, clientY){
  const rect = cv.getBoundingClientRect();
  const x = Math.min(W, Math.max(0, clientX - rect.left));
  const y = clientY - rect.top;
  const p = y < H / 2 ? top : bot;
  p.x = Math.min(W - p.w / 2, Math.max(p.w / 2, x));
  return y < H / 2 ? 'top' : 'bot';
}

function bounce(p, py, down){
  ball.y = down ? py - ball.r : py + ball.r;
  ball.vy = down ? -Math.abs(ball.vy) : Math.abs(ball.vy);
  ball.vx += ((ball.x - p.x) / (p.w / 2)) * 1.4;
  ball.vx = Math.max(-6, Math.min(6, ball.vx));
  const sp = Math.abs(ball.vy) * 1.03;
  ball.vy = ball.vy < 0 ? -Math.min(sp, 8) : Math.min(sp, 8);
}

function update(){
  ball.x += ball.vx;
  ball.y += ball.vy;
  if(ball.x < ball.r){ ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
  if(ball.x > W - ball.r){ ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); }

  const ty = 26, by = H - 26, ph = 11;
  if(ball.vy < 0 && ball.y - ball.r <= ty + ph && ball.y + ball.r >= ty &&
     Math.abs(ball.x - top.x) <= top.w / 2 + ball.r){
    bounce(top, ty + ph, false);
  }
  if(ball.vy > 0 && ball.y + ball.r >= by && ball.y - ball.r <= by + ph &&
     Math.abs(ball.x - bot.x) <= bot.w / 2 + ball.r){
    bounce(bot, by, true);
  }
  if(ball.y + ball.r < 0) point('bot');
  else if(ball.y - ball.r > H) point('top');
}

function draw(){
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(247,239,225,0.16)';
  ctx.setLineDash([7, 7]);
  ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#5ec4e0';
  rr(top.x - top.w / 2, 26, top.w, 11, 6);
  ctx.fillStyle = '#ff5d8f';
  rr(bot.x - bot.w / 2, H - 26, bot.w, 11, 6);

  ctx.fillStyle = '#eab949';
  ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
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
        <h1 class="g-title">ปิงปองคู่ 🏓</h1>
        <p class="g-sub">เล่น 2 คนบนเครื่องเดียว วางมือถือกลางโต๊ะ คนบนลากครึ่งบน คนล่างลากครึ่งล่าง ถึง ${WIN} แต้มก่อนชนะ</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:340px;">
        <span class="g-tag" id="top">บน 0</span>
        <span class="g-tag" id="bot">ล่าง 0</span>
      </div>
      <div class="cv-box" id="box"><canvas class="cv" id="cv"></canvas></div>
      <button class="g-btn" id="againBtn">เริ่มใหม่ 🔄</button>
      <div class="g-prompt-sub" id="status">แตะจอเพื่อเริ่ม — คนบนลากครึ่งบน คนล่างลากครึ่งล่าง</div>
    </div>`;
  el = { top: root.querySelector('#top'), bot: root.querySelector('#bot'),
    status: root.querySelector('#status') };
  cv = root.querySelector('#cv');

  const boxW = root.querySelector('#box').clientWidth || 320;
  W = Math.round(Math.min(Math.max(boxW, 260), 350));
  H = Math.round(W * 1.45);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr; cv.height = H * dpr;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  cv.addEventListener('pointerdown', e => {
    e.preventDefault();
    grabbed[e.pointerId] = movePaddle(e.clientX, e.clientY);
    tap();
  });
  cv.addEventListener('pointermove', e => {
    e.preventDefault();
    const side = grabbed[e.pointerId];
    if(!side) return;
    // ล็อกไว้ที่แป้นเดิมที่จับตอนแรก จะได้ไม่แย่งแป้นกันเวลานิ้วเลยกลางจอ
    const rect = cv.getBoundingClientRect();
    const p = side === 'top' ? top : bot;
    const x = Math.min(W, Math.max(0, e.clientX - rect.left));
    p.x = Math.min(W - p.w / 2, Math.max(p.w / 2, x));
  });
  const release = e => { delete grabbed[e.pointerId]; };
  cv.addEventListener('pointerup', release);
  cv.addEventListener('pointercancel', release);
  root.querySelector('#againBtn').addEventListener('click', () => reset(true));

  reset(true);
  loop();
}

export function unmount(){
  if(raf){ cancelAnimationFrame(raf); raf = null; }
  Object.keys(grabbed).forEach(k => delete grabbed[k]);
  state = 'over';
  root = null; el = null; cv = null; ctx = null;
}
