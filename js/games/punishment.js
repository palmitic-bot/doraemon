// punishment.js — สุ่มบทลงโทษ (คนแพ้จั่วบทลงโทษ)
const P = [
  { e:'💃', t:'เต้นท่าสุ่ม 15 วินาที' },
  { e:'🎤', t:'ร้องเพลงท่อนฮุก 1 เพลง' },
  { e:'📸', t:'โพสต์สตอรี่รูปตัวเองหน้าตลก' },
  { e:'🐒', t:'เลียนเสียงสัตว์ 3 ชนิดให้เพื่อนทาย' },
  { e:'🏷️', t:'ให้คนข้างๆ ตั้งฉายาให้ 1 ชื่อ' },
  { e:'🍺', t:'ดื่มรวด 1 แก้ว' },
  { e:'📞', t:'โทรหาคนล่าสุดแล้วพูดว่า "คิดถึง"' },
  { e:'🏋️', t:'ทำท่ากายบริหาร 10 ครั้ง นับเสียงดัง' },
  { e:'🥰', t:'พูดคำชมทุกคนในวง คนละ 1 ประโยค' },
  { e:'🙈', t:'เล่าเรื่องน่าอายของตัวเอง 1 เรื่อง' },
  { e:'🤪', t:'ยอมให้ถ่ายรูปหน้าตลก 1 รูป' },
  { e:'🕺', t:'เต้นแบบไม่มีเพลง 20 วินาที' },
  { e:'🗣️', t:'พูดสำเนียงแปลกๆ จนจบตาถัดไป' },
  { e:'🎭', t:'ทำหน้าตามที่เพื่อนสั่ง 3 อารมณ์' },
];
let root, el, spinning = false, t = null;

function draw(){
  if(spinning) return;
  spinning = true;
  el.btn.disabled = true;
  el.text.textContent = 'กำลังสุ่ม…';
  el.card.classList.add('spin');
  let n = 0;
  const iv = setInterval(() => { el.emoji.textContent = P[n % P.length].e; n++; }, 80);
  t = setTimeout(() => {
    clearInterval(iv);
    const p = P[Math.floor(Math.random() * P.length)];
    el.emoji.textContent = p.e;
    el.text.textContent = p.t;
    el.card.classList.remove('spin');
    el.btn.disabled = false;
    el.btn.textContent = 'จั่วใหม่ 🎁';
    spinning = false;
  }, 850);
}

export function mount(c){
  root = c; spinning = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">สุ่มบทลงโทษ 🎁</h1>
        <p class="g-sub">คนแพ้กดจั่วบทลงโทษ แล้วทำตามที่ได้!</p>
      </div>
      <div class="g-card spin-card" id="card" style="min-height:190px;">
        <div class="fortune-emoji" id="emoji">🎁</div>
        <div class="g-prompt" id="text" style="font-size:clamp(18px,5vw,24px);">กดปุ่มเพื่อจั่ว</div>
      </div>
      <button class="g-btn" id="btn">จั่วบทลงโทษ 🎁</button>
    </div>`;
  el = { card: root.querySelector('#card'), emoji: root.querySelector('#emoji'), text: root.querySelector('#text'), btn: root.querySelector('#btn') };
  el.btn.addEventListener('click', draw);
}
export function unmount(){ if(t){ clearTimeout(t); t = null; } root = null; el = null; }
