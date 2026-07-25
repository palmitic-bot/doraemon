// memory.js — จับคู่ความจำ (เปิดการ์ดหาคู่ให้ครบ)
const EMOJIS = ['🍕','🎈','🐱','🌟','🍩','🚀','🎸','🦄','🍔','👻','🌈','🐢','🍉','⚽','🎁','🐸'];
let root, el, first = null, lock = false, moves = 0, matched = 0, total = 6;

function shuffle(a){ for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function build(){
  first = null; lock = false; moves = 0; matched = 0;
  const picks = shuffle([...EMOJIS]).slice(0, total);
  const deck = shuffle([...picks, ...picks]);
  el.grid.innerHTML = deck.map((e, i) =>
    `<button class="mem-card" data-i="${i}" data-e="${e}"><span class="mem-face">${e}</span></button>`).join('');
  el.grid.querySelectorAll('.mem-card').forEach(card => card.addEventListener('click', () => flip(card)));
  el.status.textContent = 'เปิด 2 ใบให้ตรงกัน';
  el.moves.textContent = 'ตา: 0';
}

function flip(card){
  if(lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  if(!first){ first = card; return; }
  moves++; el.moves.textContent = 'ตา: ' + moves;
  if(first.dataset.e === card.dataset.e){
    first.classList.add('matched'); card.classList.add('matched');
    first = null; matched++;
    if(matched === total){ el.status.textContent = `🎉 ครบทุกคู่! ใช้ไป ${moves} ตา`; }
  } else {
    lock = true;
    const a = first, b = card; first = null;
    setTimeout(() => { a.classList.remove('flipped'); b.classList.remove('flipped'); lock = false; }, 720);
  }
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">จับคู่ความจำ 🧠</h1>
        <p class="g-sub">เปิดการ์ดทีละ 2 ใบ จำตำแหน่งแล้วจับคู่ให้ครบ</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:340px;">
        <span class="g-tag" id="moves">ตา: 0</span>
        <button class="g-btn ghost sm" id="resetBtn">เกมใหม่ 🔄</button>
      </div>
      <div class="mem-grid" id="grid"></div>
      <div class="g-prompt-sub" id="status">เปิด 2 ใบให้ตรงกัน</div>
    </div>`;
  el = { grid: root.querySelector('#grid'), status: root.querySelector('#status'), moves: root.querySelector('#moves') };
  root.querySelector('#resetBtn').addEventListener('click', build);
  build();
}
export function unmount(){ root = null; el = null; }
