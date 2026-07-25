// highlow.js — ทายสูงต่ำ (ทายว่าเลขถัดไปสูงหรือต่ำกว่า)
let root, el, cur = 50, streak = 0, best = 0, over = false;

function rnd(){ return 1 + Math.floor(Math.random() * 100); }

function newGame(){
  cur = rnd(); streak = 0; over = false;
  el.num.textContent = cur;
  el.num.className = 'g-result';
  el.streak.textContent = 'สตรีค: 0';
  el.status.textContent = 'เลขถัดไปจะสูงหรือต่ำกว่า? (1–100)';
  el.hi.disabled = false; el.lo.disabled = false;
}

function guess(dir){
  if(over) return;
  let next = rnd();
  while(next === cur) next = rnd();       // เลี่ยงเท่ากัน
  const correct = (dir === 'hi' && next > cur) || (dir === 'lo' && next < cur);
  cur = next;
  el.num.textContent = cur;
  if(correct){
    streak++; best = Math.max(best, streak);
    el.streak.textContent = 'สตรีค: ' + streak;
    el.status.textContent = 'ถูก! ✅ ทายต่อได้เลย';
    el.num.className = 'g-result';
  } else {
    over = true;
    el.status.textContent = `พลาด! ❌ ได้สตรีค ${streak} (ดีสุด ${best}) — ดื่ม! กด "เริ่มใหม่"`;
    el.num.className = 'g-result miss';
    el.hi.disabled = true; el.lo.disabled = true;
  }
}

export function mount(c){
  root = c; best = 0;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ทายสูงต่ำ 🔢</h1>
        <p class="g-sub">ทายว่าเลขถัดไป (1–100) จะสูงหรือต่ำกว่าเลขปัจจุบัน ผิดเมื่อไร = ดื่ม</p>
      </div>
      <div class="g-card">
        <div class="g-prompt-sub">เลขปัจจุบัน</div>
        <div class="g-result" id="num">50</div>
        <span class="g-tag" id="streak">สตรีค: 0</span>
      </div>
      <div class="g-row">
        <button class="g-btn" id="hi">สูงกว่า ⬆️</button>
        <button class="g-btn alt" id="lo">ต่ำกว่า ⬇️</button>
      </div>
      <div class="g-prompt-sub" id="status">เลขถัดไปจะสูงหรือต่ำกว่า?</div>
      <button class="g-btn ghost sm" id="resetBtn">เริ่มใหม่ 🔄</button>
    </div>`;
  el = { num: root.querySelector('#num'), streak: root.querySelector('#streak'), status: root.querySelector('#status'),
    hi: root.querySelector('#hi'), lo: root.querySelector('#lo') };
  el.hi.addEventListener('click', () => guess('hi'));
  el.lo.addEventListener('click', () => guess('lo'));
  root.querySelector('#resetBtn').addEventListener('click', newGame);
  newGame();
}
export function unmount(){ root = null; el = null; }
