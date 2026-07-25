// stopbar.js — หยุดให้ตรง (แตะหยุดตัววิ่งให้อยู่ในโซนเป้า)
let root, el, raf = null, pos = 0, dir = 1, speed = 1.1, level = 1, running = false;

function place(){
  const zoneW = Math.max(10, 32 - level * 2.2);       // โซนแคบลงทุกเลเวล
  const zoneL = 8 + Math.random() * (84 - zoneW);
  el.zone.style.left = zoneL + '%';
  el.zone.style.width = zoneW + '%';
  el.zone.dataset.l = zoneL;
  el.zone.dataset.w = zoneW;
}

function loop(){
  pos += dir * speed;
  if(pos >= 100){ pos = 100; dir = -1; }
  if(pos <= 0){ pos = 0; dir = 1; }
  el.marker.style.left = pos + '%';
  raf = requestAnimationFrame(loop);
}

function startLevel(){
  running = true;
  speed = 1.0 + level * 0.35;
  pos = 0; dir = 1;
  place();
  el.level.textContent = 'เลเวล ' + level;
  el.status.textContent = 'แตะ "หยุด!" ให้ตัวชี้อยู่ในแถบทอง';
  el.btn.textContent = 'หยุด! ✋';
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
}

function stopTap(){
  if(!running){ level = 1; startLevel(); return; }
  running = false;
  cancelAnimationFrame(raf); raf = null;
  const l = parseFloat(el.zone.dataset.l), w = parseFloat(el.zone.dataset.w);
  const hit = pos >= l && pos <= l + w;
  if(hit){
    level++;
    el.status.textContent = '🎯 เข้าเป้า! ไปเลเวล ' + level;
    el.marker.classList.add('good');
    setTimeout(() => { el.marker.classList.remove('good'); startLevel(); }, 700);
  } else {
    el.status.textContent = `พลาด! ❌ ไปได้ถึงเลเวล ${level} — ดื่ม! แตะเพื่อเริ่มใหม่`;
    el.marker.classList.add('bad');
    el.btn.textContent = 'เริ่มใหม่ 🔄';
    setTimeout(() => el.marker && el.marker.classList.remove('bad'), 400);
  }
}

export function mount(c){
  root = c; level = 1;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">หยุดให้ตรง 🎯</h1>
        <p class="g-sub">แตะปุ่มหยุดให้ตัวชี้อยู่ในแถบสีทอง ผ่านแล้วโซนจะแคบลง พลาด = ดื่ม</p>
      </div>
      <span class="g-tag" id="level">เลเวล 1</span>
      <div class="bar-track">
        <div class="bar-zone" id="zone"></div>
        <div class="bar-marker" id="marker"></div>
      </div>
      <button class="g-btn" id="btn">หยุด! ✋</button>
      <div class="g-prompt-sub" id="status">แตะ "หยุด!" ให้ตัวชี้อยู่ในแถบทอง</div>
    </div>`;
  el = { zone: root.querySelector('#zone'), marker: root.querySelector('#marker'),
    level: root.querySelector('#level'), status: root.querySelector('#status'), btn: root.querySelector('#btn') };
  el.btn.addEventListener('click', stopTap);
  startLevel();
}
export function unmount(){ if(raf){ cancelAnimationFrame(raf); raf = null; } running = false; root = null; el = null; }
