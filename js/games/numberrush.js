// numberrush.js — แตะเรียงเลข (แตะ 1→12 ตามลำดับให้ไวที่สุด)
const N = 12;
let root, el, nextNum = 1, startT = 0, playing = false;

function shuffle(a){ for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function build(){
  nextNum = 1; playing = false;
  const nums = shuffle(Array.from({ length: N }, (_, i) => i + 1));
  el.grid.innerHTML = nums.map(n => `<button class="num-cell" data-n="${n}">${n}</button>`).join('');
  el.grid.querySelectorAll('.num-cell').forEach(b => b.addEventListener('click', () => tap(Number(b.dataset.n), b)));
  el.status.textContent = 'แตะเลข 1 เพื่อเริ่มจับเวลา';
  el.progress.textContent = 'ถัดไป: 1';
}

function tap(n, btn){
  if(n !== nextNum) return;
  if(n === 1){ playing = true; startT = performance.now(); }
  btn.classList.add('done'); btn.disabled = true;
  nextNum++;
  el.progress.textContent = nextNum <= N ? 'ถัดไป: ' + nextNum : 'เสร็จ!';
  if(nextNum > N){
    playing = false;
    const sec = ((performance.now() - startT) / 1000).toFixed(2);
    el.status.textContent = `เสร็จใน ${sec} วิ! ⚡ (ช้าสุดในวงดื่ม)`;
  }
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">แตะเรียงเลข 🔢</h1>
        <p class="g-sub">แตะเลข 1 ถึง ${N} ตามลำดับให้เร็วที่สุด จับเวลาแล้วเทียบกัน</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:300px;">
        <span class="g-tag" id="progress">ถัดไป: 1</span>
        <button class="g-btn ghost sm" id="resetBtn">สุ่มใหม่ 🔄</button>
      </div>
      <div class="num-grid" id="grid"></div>
      <div class="g-prompt-sub" id="status">แตะเลข 1 เพื่อเริ่ม</div>
    </div>`;
  el = { grid: root.querySelector('#grid'), progress: root.querySelector('#progress'), status: root.querySelector('#status') };
  root.querySelector('#resetBtn').addEventListener('click', build);
  build();
}
export function unmount(){ playing = false; root = null; el = null; }
