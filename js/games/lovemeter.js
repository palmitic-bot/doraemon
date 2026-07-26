// lovemeter.js — วัดความเข้ากัน (ใส่ 2 ชื่อ สุ่ม % ความเข้ากัน — สนุกๆ)
let root, el, t = null;

function hashPct(a, b){
  const s = (a.trim() + '❤' + b.trim()).toLowerCase();
  let h = 0;
  for(let i = 0; i < s.length; i++){ h = (h * 31 + s.charCodeAt(i)) >>> 0; }
  return h % 101;   // 0–100 (คงที่สำหรับชื่อคู่เดิม)
}
function comment(p){
  if(p >= 90) return 'เนื้อคู่ฟ้าประทาน! 💞';
  if(p >= 75) return 'เข้ากันสุดๆ ไปกันได้ไกล 😍';
  if(p >= 55) return 'มีเคมีต่อกันนะ 😊';
  if(p >= 35) return 'พอไปได้ ต้องปรับจูนกันหน่อย 🙂';
  if(p >= 15) return 'เป็นเพื่อนกันดีกว่า 😅';
  return 'คนละโลกกันเลย 🤣';
}

function measure(){
  const a = el.a.value, b = el.b.value;
  if(!a.trim() || !b.trim()){ el.result.textContent = 'ใส่ชื่อให้ครบ 2 ช่อง'; return; }
  if(t) clearInterval(t);
  const target = hashPct(a, b);
  el.btn.disabled = true;
  let cur = 0;
  el.bar.style.width = '0%';
  el.pct.textContent = '0%';
  el.comment.textContent = '';
  t = setInterval(() => {
    cur += 3;
    if(cur >= target){ cur = target; clearInterval(t); t = null; el.comment.textContent = comment(target); el.btn.disabled = false; }
    el.bar.style.width = cur + '%';
    el.pct.textContent = cur + '%';
  }, 30);
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">วัดความเข้ากัน ❤️</h1>
        <p class="g-sub">ใส่ชื่อสองคน แล้วดูว่าเข้ากันกี่เปอร์เซ็นต์ (สนุกๆ นะ)</p>
      </div>
      <input class="g-input" id="a" placeholder="ชื่อคนที่ 1" maxlength="20">
      <div class="love-heart">❤️</div>
      <input class="g-input" id="b" placeholder="ชื่อคนที่ 2" maxlength="20">
      <div class="love-bar-wrap"><div class="love-bar" id="bar"></div></div>
      <div class="g-result" id="pct">0%</div>
      <div class="g-prompt-sub" id="comment"></div>
      <button class="g-btn" id="btn">วัดเลย ❤️</button>
      <div class="g-prompt-sub" id="result"></div>
    </div>`;
  el = { a: root.querySelector('#a'), b: root.querySelector('#b'), bar: root.querySelector('#bar'),
    pct: root.querySelector('#pct'), comment: root.querySelector('#comment'), btn: root.querySelector('#btn'),
    result: root.querySelector('#result') };
  el.btn.addEventListener('click', measure);
}
export function unmount(){ if(t){ clearInterval(t); t = null; } root = null; el = null; }
