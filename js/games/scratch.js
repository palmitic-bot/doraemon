// scratch.js — ขูดดวง (ลากนิ้วขูดเพื่อเปิดผล)
const PRIZES = [
  { e:'🍀', t:'โชคดี! รอดตัวรอบนี้' },
  { e:'🍺', t:'ดื่ม 1 จิบ' },
  { e:'🎉', t:'สั่งใครก็ได้ 1 คนดื่ม' },
  { e:'😈', t:'โดนบทลงโทษ! เต้น 10 วิ' },
  { e:'💰', t:'รอบหน้าข้ามได้ 1 ตา' },
  { e:'🤝', t:'จับคู่ดื่มกับคนขวามือ' },
  { e:'📸', t:'ถ่ายรูปหน้าตลก 1 รูป' },
  { e:'🎤', t:'ร้องเพลง 1 ท่อน' },
  { e:'👑', t:'เป็นราชารอบนี้ สั่งได้ 1 อย่าง' },
  { e:'🔄', t:'สลับที่นั่งกับคนตรงข้าม' },
];
let root, el, moves = 0, revealed = false, down = false;

function newCard(){
  moves = 0; revealed = false; down = false;
  const p = PRIZES[Math.floor(Math.random() * PRIZES.length)];
  el.emoji.textContent = p.e;
  el.text.textContent = p.t;
  el.cover.style.opacity = '1';
  el.cover.style.display = 'flex';
  el.status.textContent = 'ลากนิ้วขูดบนการ์ดเพื่อเปิดผล';
}

function scratch(){
  if(revealed) return;
  moves++;
  el.cover.style.opacity = String(Math.max(0, 1 - moves / 32));
  if(moves > 30){
    revealed = true;
    el.cover.style.display = 'none';
    el.status.textContent = 'เปิดผลแล้ว! กด "ใบใหม่" เพื่อเล่นต่อ';
  }
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ขูดดวง 🍀</h1>
        <p class="g-sub">ลากนิ้วขูดการ์ดเพื่อเปิดดวง/บทลงโทษ ผลัดกันขูดคนละใบ</p>
      </div>
      <div class="scratch-card" id="card">
        <div class="scratch-inner">
          <div class="fortune-emoji" id="emoji">🎁</div>
          <div class="g-prompt" id="text" style="font-size:clamp(18px,5vw,24px);">—</div>
        </div>
        <div class="scratch-cover" id="cover">✨ ขูดตรงนี้ ✨</div>
      </div>
      <button class="g-btn" id="btn">ใบใหม่ 🍀</button>
      <div class="g-prompt-sub" id="status">ลากนิ้วขูดบนการ์ดเพื่อเปิดผล</div>
    </div>`;
  el = { emoji: root.querySelector('#emoji'), text: root.querySelector('#text'),
    cover: root.querySelector('#cover'), status: root.querySelector('#status') };
  el.cover.addEventListener('pointerdown', () => { down = true; scratch(); });
  el.cover.addEventListener('pointermove', () => { if(down) scratch(); });
  el.cover.addEventListener('pointerup', () => { down = false; });
  el.cover.addEventListener('pointerleave', () => { down = false; });
  root.querySelector('#btn').addEventListener('click', newCard);
  newCard();
}
export function unmount(){ root = null; el = null; }
