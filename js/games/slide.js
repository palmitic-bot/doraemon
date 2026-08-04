// slide.js — ปริศนาเลื่อน (เลื่อนตัวเลขให้เรียงจากน้อยไปมาก มีช่องว่างช่องเดียว)
let root, el, size = 3, tiles = [], blank = 0, moves = 0, startT = 0, clock = null, playing = false;

function stop(){ if(clock){ clearInterval(clock); clock = null; } }

function neighbors(i){
  const r = Math.floor(i / size), c = i % size, out = [];
  if(r > 0) out.push(i - size);
  if(r < size - 1) out.push(i + size);
  if(c > 0) out.push(i - 1);
  if(c < size - 1) out.push(i + 1);
  return out;
}

function solved(){
  for(let i = 0; i < tiles.length - 1; i++) if(tiles[i] !== i + 1) return false;
  return tiles[tiles.length - 1] === 0;
}

function slideTo(i){ tiles[blank] = tiles[i]; tiles[i] = 0; blank = i; }

function build(){
  stop();
  moves = 0; playing = false; startT = 0;
  tiles = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));   // [1..N, 0]
  blank = tiles.length - 1;
  // สุ่มด้วยการเลื่อนตามกติกา 300 ครั้ง (ไม่ย้อนตาเดิม) — ได้โจทย์ที่แก้ได้แน่นอน
  let prev = -1;
  for(let k = 0; k < 300; k++){
    const opts = neighbors(blank).filter(n => n !== prev);
    prev = blank;
    slideTo(opts[Math.floor(Math.random() * opts.length)]);
  }
  if(solved()){ build(); return; }
  render();
  el.moves.textContent = 'ตา: 0';
  el.time.textContent = '⏱ 0.0';
  el.status.textContent = 'แตะช่องที่ติดกับช่องว่างเพื่อเลื่อน';
}

function render(){
  el.grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  el.grid.innerHTML = tiles.map((v, i) => v === 0
    ? '<div class="slide-tile blank"></div>'
    : `<button class="slide-tile" data-i="${i}">${v}</button>`).join('');
  el.grid.querySelectorAll('.slide-tile[data-i]').forEach(b =>
    b.addEventListener('click', () => tap(Number(b.dataset.i))));
}

function tick(){ if(playing) el.time.textContent = '⏱ ' + ((performance.now() - startT) / 1000).toFixed(1); }

function tap(i){
  if(!neighbors(blank).includes(i)) return;
  if(!playing){ playing = true; startT = performance.now(); clock = setInterval(tick, 100); }
  slideTo(i);
  moves++;
  el.moves.textContent = 'ตา: ' + moves;
  render();
  if(solved()){
    const sec = ((performance.now() - startT) / 1000).toFixed(1);
    stop(); playing = false;
    el.time.textContent = '⏱ ' + sec;
    el.status.textContent = `🎉 เรียงครบใน ${moves} ตา / ${sec} วิ — ใครใช้ตามากสุดดื่ม!`;
    el.grid.querySelectorAll('.slide-tile').forEach(t => t.classList.add('win'));
  }
}

function renderSizes(){
  el.sizes.querySelectorAll('.chip').forEach(c =>
    c.classList.toggle('on', Number(c.dataset.s) === size));
}

export function mount(c){
  root = c; size = 3;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ปริศนาเลื่อน 🧩</h1>
        <p class="g-sub">เลื่อนตัวเลขให้เรียงจากน้อยไปมาก โดยเว้นช่องว่างไว้ท้ายสุด ใครใช้ตาน้อยสุดชนะ</p>
      </div>
      <div class="chip-list" id="sizes">
        <span class="chip selectable on" data-s="3">3 × 3</span>
        <span class="chip selectable" data-s="4">4 × 4</span>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:320px;">
        <span class="g-tag" id="moves">ตา: 0</span>
        <span class="g-tag" id="time">⏱ 0.0</span>
      </div>
      <div class="slide-grid" id="grid"></div>
      <button class="g-btn" id="resetBtn">สลับใหม่ 🔄</button>
      <div class="g-prompt-sub" id="status">แตะช่องที่ติดกับช่องว่างเพื่อเลื่อน</div>
    </div>`;
  el = { grid: root.querySelector('#grid'), moves: root.querySelector('#moves'),
    time: root.querySelector('#time'), status: root.querySelector('#status'),
    sizes: root.querySelector('#sizes') };
  el.sizes.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
    size = Number(chip.dataset.s); renderSizes(); build();
  }));
  root.querySelector('#resetBtn').addEventListener('click', build);
  build();
}
export function unmount(){ stop(); playing = false; root = null; el = null; }
