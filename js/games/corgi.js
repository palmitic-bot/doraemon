// corgi.js — คอร์กี้งับ
// สุ่มฟัน 8–10 ซี่ ซ่อน "ซี่ที่งับ" ไว้ 1 ซี่ — ผลัดกันแตะ ใครโดนซี่นั้น ปากคอร์กี้งับทันที
let root, el, teeth = 10, biter = 0, over = false, timer = null;

const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

function startRound(){
  clearTimeout(timer);
  over = false;
  teeth = rand(8, 10);                          // ฟัน 8–10 ซี่ สุ่มใหม่ทุกรอบ
  biter = Math.floor(Math.random() * teeth);    // ซี่ที่งับ 1 ซี่
  render();
}

function render(){
  const mk = i => `<button class="ctooth" data-i="${i}" aria-label="ฟันซี่ที่ ${i + 1}"></button>`;
  const topN = Math.ceil(teeth / 2);            // จำนวนคี่ -> ฟันบนมากกว่าล่าง 1 ซี่
  const topRow = Array.from({ length: topN }, (_, i) => mk(i)).join('');
  const botRow = Array.from({ length: teeth - topN }, (_, i) => mk(topN + i)).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">คอร์กี้ 🐶</h1>
        <p class="g-sub">ผลัดกันแตะฟัน 1 ซี่ต่อคน โดนซี่ที่งับ = โดนงับ ดื่มเลย!</p>
      </div>
      <span class="g-tag" id="status">🦷 ${teeth} ซี่ · ซ่อนซี่ที่งับไว้ 1 ซี่</span>
      <div class="corgi" id="corgi">
        <div class="corgi-head">
          <span class="corgi-ear l"></span>
          <span class="corgi-ear r"></span>
          <span class="corgi-eye l"></span>
          <span class="corgi-eye r"></span>
          <span class="corgi-cheek l"></span>
          <span class="corgi-cheek r"></span>
          <span class="corgi-snout"><span class="corgi-nose"></span></span>
        </div>
        <div class="corgi-mouth">
          <div class="corgi-teeth top">${topRow}</div>
          <span class="corgi-tongue"></span>
          <div class="corgi-teeth bottom">${botRow}</div>
        </div>
        <div class="corgi-chin"></div>
      </div>
      <p class="g-result" id="shout"></p>
      <button class="g-btn" id="againBtn">เริ่มใหม่ 🔄</button>
      <p class="g-note">แตะฟันทีละซี่ · กด “เริ่มใหม่” เพื่อสุ่มซี่ที่งับใหม่</p>
    </div>`;

  el = {
    corgi: root.querySelector('#corgi'),
    status: root.querySelector('#status'),
    shout: root.querySelector('#shout'),
  };
  el.corgi.querySelectorAll('.ctooth').forEach(b =>
    b.addEventListener('click', () => press(Number(b.dataset.i), b)));
  root.querySelector('#againBtn').addEventListener('click', startRound);
}

function press(i, btn){
  if(over || btn.disabled) return;

  if(i === biter){
    over = true;
    btn.classList.add('bite');
    el.corgi.classList.add('chomp', 'shake');
    timer = setTimeout(() => { if(el && el.corgi) el.corgi.classList.remove('shake'); }, 500);
    el.corgi.querySelectorAll('.ctooth').forEach(t => { t.disabled = true; });
    el.status.textContent = 'งับ! ดื่มเลย 🍺';
    el.status.style.color = 'var(--pink)';
    el.status.style.borderColor = 'rgba(255,93,143,0.4)';
    el.status.style.background = 'rgba(255,93,143,0.10)';
    el.shout.textContent = 'งับ! ดื่มเลย 🍺';
    return;
  }

  btn.classList.add('down');
  btn.disabled = true;
  const left = teeth - 1 - el.corgi.querySelectorAll('.ctooth.down').length;
  el.status.textContent = left > 0
    ? `รอด! เหลือซี่ปลอดภัยอีก ${left} ซี่`
    : 'เหลือซี่สุดท้าย — ซี่ที่งับแน่นอน! 😱';
}

export function mount(container){ root = container; startRound(); }
export function unmount(){ clearTimeout(timer); timer = null; root = null; el = null; over = true; }
