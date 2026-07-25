// crocodile.js — ฟันจรเข้ (กดฟันทีละซี่ ใครกดโดนซี่ที่งับ = แพ้)
const TEETH = 10;
let root, el, biteIndex = -1, over = false;

function newRound(){
  over = false;
  biteIndex = Math.floor(Math.random() * TEETH);
  el.face.textContent = '🐊';
  el.face.classList.remove('chomp');
  el.status.textContent = 'ผลัดกันกดฟันทีละซี่ ระวังโดนงับ!';
  el.status.style.color = 'var(--cream-dim)';
  el.grid.querySelectorAll('.tooth').forEach((t, i) => {
    t.className = 'tooth';
    t.disabled = false;
    t.textContent = '🦷';
  });
}

function press(i, btn){
  if(over || btn.classList.contains('pressed')) return;
  if(i === biteIndex){
    over = true;
    btn.classList.add('bite');
    btn.textContent = '😱';
    el.face.textContent = '🐊💥';
    el.face.classList.add('chomp');
    el.status.textContent = 'งับ! 😱 คนนี้แพ้ — ดื่มเลย!';
    el.status.style.color = 'var(--pink)';
    el.grid.querySelectorAll('.tooth').forEach(t => { t.disabled = true; });
  } else {
    btn.classList.add('pressed');
    btn.textContent = '✓';
    btn.disabled = true;
    const left = [...el.grid.querySelectorAll('.tooth')].filter(t => !t.classList.contains('pressed')).length - 1;
    el.status.textContent = `รอด! เหลือฟันปลอดภัยอีก ${left} ซี่ ส่งต่อคนถัดไป`;
    el.status.style.color = 'var(--cream-dim)';
  }
}

export function mount(container){
  root = container;
  const teeth = Array.from({ length: TEETH }, (_, i) =>
    `<button class="tooth" data-i="${i}">🦷</button>`).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ฟันจรเข้ 🐊</h1>
        <p class="g-sub">ผลัดกันกดฟัน 1 ซี่ต่อคน ใครกดโดนซี่ที่จระเข้งับ = แพ้!</p>
      </div>
      <div class="croc-face" id="face">🐊</div>
      <div class="g-tag" id="status">ผลัดกันกดฟันทีละซี่ ระวังโดนงับ!</div>
      <div class="teeth-grid" id="grid">${teeth}</div>
      <button class="g-btn" id="resetBtn">เริ่มรอบใหม่ 🔄</button>
    </div>`;
  el = {
    face: root.querySelector('#face'),
    status: root.querySelector('#status'),
    grid: root.querySelector('#grid'),
  };
  el.grid.querySelectorAll('.tooth').forEach(btn =>
    btn.addEventListener('click', () => press(Number(btn.dataset.i), btn)));
  root.querySelector('#resetBtn').addEventListener('click', newRound);
  newRound();
}

export function unmount(){ root = null; el = null; }
