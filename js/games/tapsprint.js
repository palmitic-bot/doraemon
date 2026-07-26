// tapsprint.js — รัวปุ่ม (แตะให้ได้มากที่สุดใน 5 วินาที)
let root, el, count = 0, running = false, t = null;

function start(){
  if(running) return;
  running = true; count = 0;
  el.count.textContent = '0';
  el.status.textContent = 'รัวเลย! 👆';
  el.pad.classList.add('live');
  el.btn.disabled = true;
  const t0 = performance.now();
  t = setInterval(() => {
    const rem = Math.max(0, 5 - (performance.now() - t0) / 1000);
    el.time.textContent = '⏱ ' + rem.toFixed(1);
    if(rem <= 0) end();
  }, 80);
}
function tap(){ if(running){ count++; el.count.textContent = count; } }
function end(){
  clearInterval(t); t = null; running = false;
  el.pad.classList.remove('live');
  el.time.textContent = '⏱ 0.0';
  el.status.textContent = `ได้ ${count} ครั้ง (${(count / 5).toFixed(1)}/วิ) — น้อยสุดในวงดื่ม!`;
  el.btn.textContent = 'เล่นอีกครั้ง 🔄';
  el.btn.disabled = false;
}

export function mount(c){
  root = c; running = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">รัวปุ่ม 👆</h1>
        <p class="g-sub">กดเริ่มแล้วแตะแป้นให้รัวที่สุดใน 5 วินาที ผลัดกันเล่นแล้วเทียบกัน</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:300px;">
        <span class="g-tag" id="time">⏱ 5.0</span>
      </div>
      <div class="tap-pad" id="pad"><span class="tap-count" id="count">0</span></div>
      <button class="g-btn" id="btn">เริ่ม! 👆</button>
      <div class="g-prompt-sub" id="status">กดเริ่มแล้วแตะแป้นรัวๆ</div>
    </div>`;
  el = { pad: root.querySelector('#pad'), count: root.querySelector('#count'),
    time: root.querySelector('#time'), btn: root.querySelector('#btn'), status: root.querySelector('#status') };
  el.pad.addEventListener('click', tap);
  el.btn.addEventListener('click', start);
}
export function unmount(){ if(t){ clearInterval(t); t = null; } running = false; root = null; el = null; }
