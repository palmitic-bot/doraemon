// liedetector.js — เครื่องจับโกหก (มุกปาร์ตี้ สุ่มผลจริง/โกหก)
let root, el, holdT = null, prog = 0, progT = null, busy = false;

function reset(){
  clearAll();
  busy = false; prog = 0;
  el.ring.style.setProperty('--p', '0%');
  el.emoji.textContent = '🖐️';
  el.verdict.textContent = '';
  el.status.textContent = 'ถามคำถาม แล้วให้ผู้ตอบแตะค้างที่สแกนเนอร์';
  el.pad.className = 'scanner';
}
function clearAll(){ if(holdT){ clearTimeout(holdT); holdT = null; } if(progT){ clearInterval(progT); progT = null; } }

function down(){
  if(busy) return;
  busy = true; prog = 0;
  el.pad.className = 'scanner scanning';
  el.emoji.textContent = '👆';
  el.status.textContent = 'กำลังสแกน… แตะค้างไว้';
  progT = setInterval(() => { prog = Math.min(100, prog + 4); el.ring.style.setProperty('--p', prog + '%'); }, 60);
  holdT = setTimeout(finish, 1600);
}
function up(){
  if(!busy) return;
  if(prog < 100){   // ปล่อยก่อน = ยกเลิก
    clearAll(); busy = false;
    el.pad.className = 'scanner';
    el.emoji.textContent = '🖐️';
    el.status.textContent = 'ยังไม่เสร็จ! แตะค้างจนกว่าจะสแกนครบ';
    el.ring.style.setProperty('--p', '0%');
  }
}
function finish(){
  clearAll();
  const lie = Math.random() < 0.5;
  const pct = 60 + Math.floor(Math.random() * 39);
  el.pad.className = 'scanner ' + (lie ? 'lie' : 'truth');
  el.emoji.textContent = lie ? '❌' : '✅';
  el.verdict.textContent = lie ? `โกหก! (${pct}%)` : `พูดจริง (${pct}%)`;
  el.status.textContent = lie ? 'เครื่องบอกว่า… โกหก 😏 ดื่ม!' : 'เครื่องยืนยัน… พูดความจริง 😇';
  busy = false;
  el.ring.style.setProperty('--p', '100%');
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">เครื่องจับโกหก 🔍</h1>
        <p class="g-sub">ถามคำถาม ผู้ตอบตอบแล้วแตะค้างที่สแกนเนอร์ รอผลตัดสิน (สนุกๆ นะ 😜)</p>
      </div>
      <div class="scanner" id="pad">
        <div class="scan-ring" id="ring"><div class="scan-emoji" id="emoji">🖐️</div></div>
      </div>
      <div class="g-result" id="verdict"></div>
      <div class="g-prompt-sub" id="status">ถามคำถาม แล้วให้ผู้ตอบแตะค้างที่สแกนเนอร์</div>
      <button class="g-btn ghost sm" id="resetBtn">รีเซ็ต 🔄</button>
    </div>`;
  el = { pad: root.querySelector('#pad'), ring: root.querySelector('#ring'),
    emoji: root.querySelector('#emoji'), verdict: root.querySelector('#verdict'),
    status: root.querySelector('#status') };
  el.pad.addEventListener('pointerdown', down);
  el.pad.addEventListener('pointerup', up);
  el.pad.addEventListener('pointerleave', up);
  root.querySelector('#resetBtn').addEventListener('click', reset);
  reset();
}
export function unmount(){ clearAll(); root = null; el = null; }
