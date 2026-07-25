// emojiquiz.js — ทายคำจากอิโมจิ (ทายกันเอง แล้วกดเฉลย)
const ITEMS = [
  { e:'🦁👑', a:'เดอะ ไลอ้อน คิง' },
  { e:'🕷️🧑', a:'สไปเดอร์แมน' },
  { e:'❄️👸', a:'โฟรเซน (เอลซ่า)' },
  { e:'🐠🔍', a:'Finding Nemo (หานีโม)' },
  { e:'🍫🏭', a:'ชาร์ลีกับโรงงานช็อกโกแลต' },
  { e:'🦖🏝️', a:'จูราสสิค พาร์ค' },
  { e:'🧙‍♂️⚡🤓', a:'แฮร์รี่ พอตเตอร์' },
  { e:'🚢🧊💔', a:'ไททานิค' },
  { e:'🐼🥋', a:'กังฟูแพนด้า' },
  { e:'🎈🏠👴', a:'Up ปู่ซ่าบ้าพลัง' },
  { e:'🤖❤️🌱', a:'วอล-อี (WALL·E)' },
  { e:'👻🚫', a:'Ghostbusters' },
  { e:'🦇🧑', a:'แบทแมน' },
  { e:'🍜🐭👨‍🍳', a:'ราตาตูย' },
  { e:'⭐⚔️', a:'สตาร์ วอร์ส' },
];
let root, el, pool = [], cur = null, revealed = false;

function refill(){ pool = [...ITEMS].sort(() => Math.random() - 0.5); }

function next(){
  if(pool.length === 0) refill();
  cur = pool.pop();
  revealed = false;
  el.emoji.textContent = cur.e;
  el.answer.textContent = '';
  el.revealBtn.textContent = 'เฉลย 👀';
  el.revealBtn.disabled = false;
}

function reveal(){
  if(revealed){ next(); return; }
  revealed = true;
  el.answer.textContent = cur.a;
  el.revealBtn.textContent = 'ข้อต่อไป ▶';
}

export function mount(c){
  root = c; refill();
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ทายคำจากอิโมจิ 🎬</h1>
        <p class="g-sub">ดูอิโมจิแล้วทายว่าคือหนัง/การ์ตูนอะไร ทายกันเองแล้วกดเฉลย</p>
      </div>
      <div class="g-card">
        <div class="emoji-clue" id="emoji">🎬</div>
        <div class="g-result" id="answer" style="font-size:clamp(20px,5.5vw,26px);"></div>
      </div>
      <button class="g-btn" id="revealBtn">เฉลย 👀</button>
    </div>`;
  el = { emoji: root.querySelector('#emoji'), answer: root.querySelector('#answer'), revealBtn: root.querySelector('#revealBtn') };
  el.revealBtn.addEventListener('click', reveal);
  next();
}
export function unmount(){ root = null; el = null; }
