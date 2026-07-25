// fortune.js — ดวงวันนี้ (เสี่ยงทายสนุกๆ)
const FORTUNES = [
  { e:'🍜', t:'วันนี้ดวงปัง! จะมีคนเลี้ยงข้าวโดยไม่คาดคิด' },
  { e:'😵', t:'ระวังของหาย โดยเฉพาะสติ ตั้งใจหน่อยนะ' },
  { e:'💰', t:'มีเกณฑ์ได้เงินก้อน... จากการหาเจอในกระเป๋าเก่า' },
  { e:'💘', t:'จะได้เจอคนถูกใจ แต่เขาอาจมีเจ้าของแล้ว' },
  { e:'😴', t:'วันนี้เหมาะแก่การพักผ่อน อย่าฝืนสังขาร' },
  { e:'🎯', t:'ทำอะไรก็สำเร็จ! รีบใช้ดวงตอนนี้เลย' },
  { e:'🌧️', t:'อาจเจอเรื่องกวนใจเล็กน้อย ใจเย็นๆ เดี๋ยวก็ผ่าน' },
  { e:'🤝', t:'มิตรภาพเบ่งบาน วันนี้เหมาะชวนเพื่อนออกไปเที่ยว' },
  { e:'📵', t:'ลองวางมือถือสักพัก แล้วจะเจอความสุขที่มองข้าม' },
  { e:'🏆', t:'ความพยายามจะเห็นผล เก่งมากอดทนอีกนิด' },
  { e:'🍀', t:'โชคดีเข้าข้าง เลขนำโชควันนี้อยู่รอบตัวคุณ' },
  { e:'🙊', t:'วันนี้พูดน้อยหน่อยจะดี ระวังพลั้งปาก' },
  { e:'🔥', t:'พลังล้นเหลือ! เหมาะเริ่มสิ่งใหม่ที่ดองไว้นาน' },
  { e:'🧋', t:'รางวัลชีวิตวันนี้คือชานมไข่มุกสักแก้ว จัดไป!' },
  { e:'✨', t:'มีคนแอบชื่นชมคุณอยู่ ยิ้มไว้เข้าไว้' },
];
let root, el, spinning = false, t = null;

function draw(){
  if(spinning) return;
  spinning = true;
  el.btn.disabled = true;
  el.card.classList.add('spin');
  let n = 0;
  const iv = setInterval(() => { el.emoji.textContent = FORTUNES[n % FORTUNES.length].e; n++; }, 80);
  t = setTimeout(() => {
    clearInterval(iv);
    const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    el.emoji.textContent = f.e;
    el.text.textContent = f.t;
    el.card.classList.remove('spin');
    el.btn.disabled = false;
    el.btn.textContent = 'เสี่ยงใหม่ 🔮';
    spinning = false;
  }, 900);
}

export function mount(c){
  root = c; spinning = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ดวงวันนี้ 🔮</h1>
        <p class="g-sub">แตะเพื่อเสี่ยงทายดวงประจำวัน (สนุกๆ นะ)</p>
      </div>
      <div class="g-card" id="card" style="min-height:190px;">
        <div class="fortune-emoji" id="emoji">🔮</div>
        <div class="g-prompt-sub" id="text" style="font-size:16px;">กดปุ่มเพื่อเปิดดวง</div>
      </div>
      <button class="g-btn" id="btn">เสี่ยงทาย 🔮</button>
    </div>`;
  el = { card: root.querySelector('#card'), emoji: root.querySelector('#emoji'), text: root.querySelector('#text'), btn: root.querySelector('#btn') };
  el.btn.addEventListener('click', draw);
}
export function unmount(){ if(t){ clearTimeout(t); t = null; } root = null; el = null; }
