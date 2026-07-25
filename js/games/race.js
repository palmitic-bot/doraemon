// race.js — สัตว์วิ่งแข่ง
// เลือกสัตว์ (>=2) กดเริ่ม -> จำลองการวิ่ง แซงกันไปมา แต่เข้าเส้นชัยตามลำดับที่สุ่มไว้
const ANIMALS = [
  { id:'horse',    emoji:'🐎', name:'ม้า' },
  { id:'giraffe',  emoji:'🦒', name:'ยีราฟ' },
  { id:'rabbit',   emoji:'🐇', name:'กระต่าย' },
  { id:'turtle',   emoji:'🐢', name:'เต่า' },
  { id:'cheetah',  emoji:'🐆', name:'เสือชีตาห์' },
  { id:'elephant', emoji:'🐘', name:'ช้าง' },
  { id:'zebra',    emoji:'🦓', name:'ม้าลาย' },
  { id:'camel',    emoji:'🐫', name:'อูฐ' },
  { id:'dog',      emoji:'🐕', name:'สุนัข' },
  { id:'pig',      emoji:'🐖', name:'หมู' },
  { id:'cat',      emoji:'🐈', name:'แมว' },
  { id:'tiger',    emoji:'🐅', name:'เสือโคร่ง' },
  { id:'lion',     emoji:'🦁', name:'สิงโต' },
  { id:'monkey',   emoji:'🐒', name:'ลิง' },
  { id:'deer',     emoji:'🦌', name:'กวาง' },
  { id:'fox',      emoji:'🦊', name:'จิ้งจอก' },
  { id:'wolf',     emoji:'🐺', name:'หมาป่า' },
  { id:'bear',     emoji:'🐻', name:'หมี' },
  { id:'kangaroo', emoji:'🦘', name:'จิงโจ้' },
  { id:'snail',    emoji:'🐌', name:'หอยทาก' },
];
const MEDAL = ['🥇','🥈','🥉'];
const MAX_RACERS = 10;

let root, el, selected = new Set(), raf = null, running = false;

/* ---------- หน้าเลือกสัตว์ ---------- */
function renderSetup(){
  stop();
  selected.clear();   // ค่าเริ่มต้น: ยังไม่เลือกสักตัว (ผู้เล่นแต่ละรอบไม่เท่ากัน)
  const chips = ANIMALS.map(a =>
    `<button class="race-pick${selected.has(a.id) ? ' on' : ''}" data-id="${a.id}">
       <span class="rp-emoji">${a.emoji}</span><span>${a.name}</span>
     </button>`).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">สัตว์วิ่งแข่ง 🏁</h1>
        <p class="g-sub">เลือกสัตว์ที่จะลงแข่ง (2–${MAX_RACERS} ตัว) แล้วกดเริ่ม</p>
      </div>
      <div class="race-picker">${chips}</div>
      <button class="g-btn" id="startBtn">เริ่มแข่ง! 🏁</button>
      <p class="g-note" id="pickNote">เลือกแล้ว ${selected.size}/${MAX_RACERS} ตัว</p>
    </div>`;
  el = { note: root.querySelector('#pickNote') };
  root.querySelectorAll('.race-pick').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.id;
    if(selected.has(id)){
      selected.delete(id);
    } else if(selected.size >= MAX_RACERS){
      el.note.textContent = `⚠️ เล่นได้ไม่เกิน ${MAX_RACERS} ตัว`;
      return;
    } else {
      selected.add(id);
    }
    b.classList.toggle('on', selected.has(id));
    el.note.textContent = `เลือกแล้ว ${selected.size}/${MAX_RACERS} ตัว`;
  }));
  root.querySelector('#startBtn').addEventListener('click', () => {
    if(selected.size < 2){ el.note.textContent = '⚠️ ต้องเลือกอย่างน้อย 2 ตัว'; return; }
    startRace();
  });
}

/* ---------- แข่ง ---------- */
function startRace(){
  const runners = ANIMALS.filter(a => selected.has(a.id));
  // สุ่มลำดับเข้าเส้นชัย (index 0 = ชนะ)
  const order = [...runners].sort(() => Math.random() - 0.5);
  const finishAt = new Map();   // id -> เวลาถึงเส้นชัย (ms)
  const BASE = 3200, GAP = 380; // รอบไม่นาน (~3.2– ตามจำนวนตัว)
  order.forEach((a, i) => finishAt.set(a.id, BASE + i * GAP + Math.random() * 160));

  // พารามิเตอร์การแกว่ง (ทำให้แซงกันไปมา)
  const wig = new Map();
  runners.forEach(a => wig.set(a.id, {
    amp: 0.10 + Math.random() * 0.12,          // ความแรงการแกว่ง
    w: 2.2 + Math.random() * 2.6,               // ความถี่
    ph: Math.random() * Math.PI * 2,            // เฟส
  }));

  const lanes = runners.map(a =>
    `<div class="race-lane">
       <div class="race-runner" data-id="${a.id}"><span class="rr-emoji">${a.emoji}</span></div>
       <div class="race-finishline">🏁</div>
     </div>`).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">สัตว์วิ่งแข่ง 🏁</h1>
        <p class="g-sub" id="raceStatus">เตรียมตัว…</p>
      </div>
      <div class="race-track">${lanes}</div>
      <div class="race-result" id="result"></div>
      <div class="g-row" id="raceBtns" style="display:none;">
        <button class="g-btn" id="againBtn">แข่งอีกรอบ 🔄</button>
        <button class="g-btn ghost sm" id="pickBtn">เลือกสัตว์ใหม่</button>
      </div>
    </div>`;
  const status = root.querySelector('#raceStatus');
  const result = root.querySelector('#result');
  const btns = root.querySelector('#raceBtns');
  const runnerEls = new Map();
  runners.forEach(a => runnerEls.set(a.id, root.querySelector(`.race-runner[data-id="${a.id}"]`)));

  const finished = [];
  const finishedSet = new Set();

  // นับถอยหลังสั้นๆ แล้วเริ่ม
  let go = 3;
  status.textContent = '3';
  const cd = setInterval(() => {
    go--;
    if(go > 0){ status.textContent = String(go); }
    else if(go === 0){ status.textContent = 'ไป! 🏁'; }
    else { clearInterval(cd); beginLoop(); }
  }, 500);

  function beginLoop(){
    running = true;
    status.textContent = '🏃 กำลังแข่ง…';
    const t0 = performance.now();
    const step = (now) => {
      const t = now - t0;
      runners.forEach(a => {
        const T = finishAt.get(a.id);
        const rn = runnerEls.get(a.id);
        if(finishedSet.has(a.id)) return;
        let base = t / T;                       // ความคืบหน้าเชิงเส้น
        const w = wig.get(a.id);
        // แกว่งให้แซงกัน แต่ลดลงเมื่อใกล้เส้นชัย (order คงที่ตอนจบ)
        let p = base + w.amp * Math.sin(w.w * (t / 1000) + w.ph) * (1 - base);
        if(p >= 1 || t >= T){
          p = 1;
          finishedSet.add(a.id);
          finished.push(a);
          rn.classList.add('done');
          announce(finished.length, a);
        }
        p = Math.max(0, Math.min(1, p));
        rn.style.left = `calc(${(p * 100).toFixed(2)}% - ${(p * 30).toFixed(1)}px)`;
      });
      if(finishedSet.size < runners.length){
        raf = requestAnimationFrame(step);
      } else {
        running = false;
        status.textContent = '🎉 จบการแข่งขัน!';
        btns.style.display = 'flex';
        root.querySelector('#againBtn').addEventListener('click', startRace);
        root.querySelector('#pickBtn').addEventListener('click', renderSetup);
      }
    };
    raf = requestAnimationFrame(step);
  }

  function announce(place, a){
    const medal = MEDAL[place - 1] || `${place}.`;
    const line = document.createElement('div');
    line.className = 'race-rank' + (place === 1 ? ' win' : '');
    line.innerHTML = `${medal} ${a.emoji} ${a.name}`;
    result.appendChild(line);
    if(place === 1) root.querySelector('#raceStatus').textContent = `🏆 ${a.name} เข้าเส้นชัยเป็นที่ 1!`;
  }
}

function stop(){
  if(raf){ cancelAnimationFrame(raf); raf = null; }
  running = false;
}

export function mount(container){ root = container; renderSetup(); }
export function unmount(){ stop(); root = null; el = null; }
