// crocodile.js — ฟันจรเข้ (หมอฟันจระเข้)
// เลือกจำนวนฟัน + จำนวนซี่ระเบิด — กดโดนซี่ระเบิด = ปากงับลงมา แพ้!
let root, el, teeth = 10, bombs = 1, bombSet = new Set(), over = false;

function renderConfig(){
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ฟันจรเข้ 🐊</h1>
        <p class="g-sub">ตั้งค่าก่อนเริ่ม แล้วผลัดกันกดฟัน</p>
      </div>
      <div class="cfg-row">
        <span class="cfg-label">🦷 จำนวนฟัน</span>
        <div class="stepper">
          <button data-t="-1" aria-label="ลด">−</button>
          <span class="val" id="teethVal">${teeth}</span>
          <button data-t="1" aria-label="เพิ่ม">+</button>
        </div>
      </div>
      <div class="cfg-row">
        <span class="cfg-label">💣 ซี่ระเบิด</span>
        <div class="stepper">
          <button data-b="-1" aria-label="ลด">−</button>
          <span class="val" id="bombVal">${bombs}</span>
          <button data-b="1" aria-label="เพิ่ม">+</button>
        </div>
      </div>
      <button class="g-btn" id="startBtn">เริ่มเกม 🐊</button>
      <p class="g-note">ฟัน 6–14 ซี่ · ระเบิด 1 ถึง (ฟัน − 1)</p>
    </div>`;
  const teethVal = root.querySelector('#teethVal');
  const bombVal = root.querySelector('#bombVal');
  root.querySelectorAll('[data-t]').forEach(b => b.addEventListener('click', () => {
    teeth = Math.min(14, Math.max(6, teeth + Number(b.dataset.t)));
    if(bombs > teeth - 1) bombs = teeth - 1;
    teethVal.textContent = teeth; bombVal.textContent = bombs;
  }));
  root.querySelectorAll('[data-b]').forEach(b => b.addEventListener('click', () => {
    bombs = Math.min(teeth - 1, Math.max(1, bombs + Number(b.dataset.b)));
    bombVal.textContent = bombs;
  }));
  root.querySelector('#startBtn').addEventListener('click', startRound);
}

function startRound(){
  over = false;
  bombSet = new Set();
  while(bombSet.size < bombs){ bombSet.add(Math.floor(Math.random() * teeth)); }
  renderPlay();
}

function renderPlay(){
  const topN = Math.ceil(teeth / 2);   // จำนวนคี่ -> ฟันบนมากกว่าล่าง 1 ซี่
  const mk = i => `<button class="c2tooth" data-i="${i}"></button>`;
  const topRow = Array.from({ length: topN }, (_, i) => mk(i)).join('');
  const botRow = Array.from({ length: teeth - topN }, (_, i) => mk(topN + i)).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ฟันจรเข้ 🐊</h1>
        <p class="g-sub">ผลัดกันกดฟัน 1 ซี่ต่อคน โดนซี่ระเบิด = ปากงับ แพ้!</p>
      </div>
      <span class="g-tag" id="status">🦷 ${teeth} · 💣 ${bombs}</span>
      <div class="croc2" id="croc">
        <div class="croc2-eyes">
          <div class="croc2-eye"><span class="brow"></span></div>
          <div class="croc2-eye"><span class="brow"></span></div>
        </div>
        <div class="croc2-upper">
          <span class="croc2-nostril l"></span><span class="croc2-nostril r"></span>
        </div>
        <div class="croc2-mouth">
          <div class="croc2-teeth top">${topRow}</div>
          <div class="croc2-teeth bottom">${botRow}</div>
        </div>
        <div class="croc2-lower"></div>
      </div>
      <div class="g-row">
        <button class="g-btn" id="againBtn">รอบใหม่ 🔄</button>
        <button class="g-btn ghost sm" id="cfgBtn">ตั้งค่า ⚙️</button>
      </div>
    </div>`;
  el = {
    croc: root.querySelector('#croc'),
    status: root.querySelector('#status'),
  };
  el.croc.querySelectorAll('.c2tooth').forEach(b =>
    b.addEventListener('click', () => press(Number(b.dataset.i), b)));
  root.querySelector('#againBtn').addEventListener('click', startRound);
  root.querySelector('#cfgBtn').addEventListener('click', renderConfig);
}

function press(i, btn){
  if(over || btn.classList.contains('safe') || btn.classList.contains('boom')) return;
  if(bombSet.has(i)){
    over = true;
    const crocEl = el.croc;
    crocEl.classList.add('chomp', 'shake');
    setTimeout(() => { if(crocEl) crocEl.classList.remove('shake'); }, 460);
    el.status.textContent = '💥 งับ! คนนี้แพ้ — ดื่มเลย!';
    el.status.style.color = 'var(--pink)';
    el.status.style.borderColor = 'rgba(255,93,143,0.4)';
    el.croc.querySelectorAll('.c2tooth').forEach(t => {
      t.disabled = true;
      if(bombSet.has(Number(t.dataset.i))){ t.classList.add('boom'); t.textContent = '💥'; }
    });
  } else {
    btn.classList.add('safe'); btn.textContent = '✓'; btn.disabled = true;
    const safeLeft = teeth - bombs - el.croc.querySelectorAll('.c2tooth.safe').length;
    el.status.textContent = `รอด! เหลือซี่ปลอดภัย ${safeLeft} ซี่ · ระวัง 💣 ${bombs}`;
  }
}

export function mount(container){ root = container; renderConfig(); }
export function unmount(){ root = null; el = null; over = true; }
