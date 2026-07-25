// balloon.js — สูบลูกโป่ง (ผลัดกันสูบ ใครทำแตกแพ้)
let root, el, pumps = 0, limit = 10, popped = false;

function reset(){
  pumps = 0;
  popped = false;
  limit = 8 + Math.floor(Math.random() * 15);   // แตกที่ 8–22 ครั้ง (สุ่ม ซ่อนไว้)
  el.balloon.textContent = '🎈';
  el.balloon.className = 'balloon';
  el.balloon.style.transform = 'scale(1)';
  el.status.textContent = 'ผลัดกันสูบคนละ 1 ที แล้วส่งต่อ';
  el.count.textContent = 'สูบไปแล้ว 0 ครั้ง';
  el.pumpBtn.disabled = false;
  el.pumpBtn.textContent = 'สูบ 💨';
}

function pump(){
  if(popped) return;
  pumps++;
  el.count.textContent = 'สูบไปแล้ว ' + pumps + ' ครั้ง';
  const scale = 1 + pumps * 0.16;
  el.balloon.style.transform = 'scale(' + scale.toFixed(2) + ')';
  if(pumps >= limit){
    popped = true;
    el.balloon.textContent = '💥';
    el.balloon.className = 'balloon pop';
    el.balloon.style.transform = 'scale(1.4)';
    el.status.textContent = 'ปั้ง! 💥 ลูกโป่งแตก — คนสูบล่าสุดแพ้ ดื่ม!';
    el.pumpBtn.disabled = true;
    el.pumpBtn.textContent = 'แตกแล้ว';
  } else {
    el.balloon.className = 'balloon shake';
    setTimeout(() => { if(!popped && el) el.balloon.className = 'balloon'; }, 160);
  }
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">สูบลูกโป่ง 🎈</h1>
        <p class="g-sub">ผลัดกันกดสูบคนละ 1 ที ลูกโป่งจะใหญ่ขึ้นเรื่อยๆ ใครทำแตก = แพ้!</p>
      </div>
      <div class="balloon-stage"><div class="balloon" id="balloon">🎈</div></div>
      <div class="g-tag" id="count">สูบไปแล้ว 0 ครั้ง</div>
      <div class="g-prompt-sub" id="status">ผลัดกันสูบคนละ 1 ที แล้วส่งต่อ</div>
      <div class="g-row">
        <button class="g-btn" id="pumpBtn">สูบ 💨</button>
        <button class="g-btn ghost sm" id="resetBtn">ลูกใหม่ 🔄</button>
      </div>
    </div>`;
  el = { balloon: root.querySelector('#balloon'), count: root.querySelector('#count'),
    status: root.querySelector('#status'), pumpBtn: root.querySelector('#pumpBtn') };
  el.pumpBtn.addEventListener('click', pump);
  root.querySelector('#resetBtn').addEventListener('click', reset);
  reset();
}
export function unmount(){ root = null; el = null; }
