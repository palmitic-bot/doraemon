// magic8.js — ลูกแก้ววิเศษ (ถามคำถามใช่/ไม่ใช่ แล้วเขย่าหาคำตอบ)
const ANS = [
  'แน่นอน! ✅','ใช่เลย 👍','ก็เป็นไปได้','ดวงบอกว่าใช่','ลองดูเลย!',
  'ยังไม่แน่นะ 🤔','ถามใหม่อีกที','สัญญาณไม่ชัด…','ไม่น่าจะใช่','ไม่เลย ❌','อย่าไปหวังเลย 😅','ไม่มีทาง!',
];
let root, el, busy = false, t = null;

function shake(){
  if(busy) return;
  busy = true;
  el.ball.classList.add('shake8');
  el.ans.textContent = '…';
  el.btn.disabled = true;
  t = setTimeout(() => {
    el.ball.classList.remove('shake8');
    el.ans.textContent = ANS[Math.floor(Math.random() * ANS.length)];
    el.btn.disabled = false;
    el.btn.textContent = 'ถามอีกครั้ง 🎱';
    busy = false;
  }, 800);
}

export function mount(c){
  root = c; busy = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ลูกแก้ววิเศษ 🎱</h1>
        <p class="g-sub">ถามคำถามที่ตอบ ใช่/ไม่ใช่ ในใจ แล้วกดเขย่าหาคำตอบ</p>
      </div>
      <div class="magic8" id="ball"><div class="magic8-window"><span id="ans">8</span></div></div>
      <button class="g-btn" id="btn">เขย่า! 🎱</button>
      <div class="g-note">คำตอบของลูกแก้วถือเป็นเด็ดขาด 😜</div>
    </div>`;
  el = { ball: root.querySelector('#ball'), ans: root.querySelector('#ans'), btn: root.querySelector('#btn') };
  el.btn.addEventListener('click', shake);
  el.ball.addEventListener('click', shake);
}
export function unmount(){ if(t){ clearTimeout(t); t = null; } root = null; el = null; }
