// timeguess.js — ทายเวลา (กดหยุดให้ใกล้ 10.00 วิ โดยไม่เห็นตัวเลข)
let root, el, startT = 0, running = false, best = null, raf = null;

function toggle(){
  if(!running){
    running = true; startT = performance.now();
    el.timer.textContent = '···';
    el.timer.className = 'timer-ring';
    el.status.textContent = 'เพ่งสมาธิ… กด "หยุด" ตอนคิดว่าครบ 10 วิ';
    el.btn.textContent = 'หยุด! ✋';
  } else {
    running = false;
    const sec = (performance.now() - startT) / 1000;
    const diff = Math.abs(sec - 10);
    el.timer.textContent = sec.toFixed(2) + ' วิ';
    el.timer.classList.toggle('low', diff > 1.2);
    if(best === null || diff < best) best = diff;
    let grade = diff < 0.15 ? 'เทพมาก! 🎯' : diff < 0.5 ? 'เยี่ยม!' : diff < 1 ? 'ใกล้เคียง' : 'ห่างไปหน่อย 😅';
    el.status.textContent = `${grade} ห่าง ${diff.toFixed(2)} วิ (ดีสุด ${best.toFixed(2)}) — ห่างสุดดื่ม!`;
    el.btn.textContent = 'ลองใหม่ ▶';
  }
}

export function mount(c){
  root = c; running = false; best = null;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ทายเวลา 10 วิ ⏲️</h1>
        <p class="g-sub">กดเริ่มแล้วกดหยุดให้ใกล้ 10.00 วินาทีที่สุด โดยไม่มีตัวเลขให้ดู!</p>
      </div>
      <div class="timer-ring" id="timer" style="font-size:44px;">10.00</div>
      <button class="g-btn" id="btn">เริ่มจับเวลา ▶</button>
      <div class="g-prompt-sub" id="status">ห้ามนับออกเสียงให้คนอื่นได้ยินนะ 😜</div>
    </div>`;
  el = { timer: root.querySelector('#timer'), btn: root.querySelector('#btn'), status: root.querySelector('#status') };
  el.btn.addEventListener('click', toggle);
}
export function unmount(){ if(raf){ cancelAnimationFrame(raf); raf = null; } running = false; root = null; el = null; }
