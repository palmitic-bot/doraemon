// targetaim.js — ยิงเป้า (แตะเป้าที่โผล่ให้ครบ 10 จุด เร็วที่สุด)
const TOTAL = 10;
let root, el, hit = 0, startT = 0, playing = false;

function placeTarget(){
  const x = 8 + Math.random() * 84;
  const y = 8 + Math.random() * 84;
  el.target.style.left = x + '%';
  el.target.style.top = y + '%';
  el.target.style.display = 'flex';
}

function start(){
  hit = 0; playing = true;
  el.progress.textContent = `0/${TOTAL}`;
  el.status.textContent = 'แตะเป้าให้ไว!';
  el.btn.style.display = 'none';
  startT = performance.now();
  placeTarget();
}

function tapTarget(e){
  if(!playing) return;
  e.stopPropagation();
  hit++;
  el.progress.textContent = `${hit}/${TOTAL}`;
  if(hit >= TOTAL){
    playing = false;
    const sec = ((performance.now() - startT) / 1000).toFixed(2);
    el.target.style.display = 'none';
    el.status.textContent = `เสร็จใน ${sec} วิ! ⚡ (ช้าสุดในวงดื่ม)`;
    el.btn.textContent = 'เล่นอีกครั้ง 🔄';
    el.btn.style.display = '';
  } else {
    placeTarget();
  }
}

export function mount(c){
  root = c; playing = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ยิงเป้า 🎯</h1>
        <p class="g-sub">แตะเป้าที่โผล่ให้ครบ ${TOTAL} จุดเร็วที่สุด จับเวลาแล้วเทียบกัน</p>
      </div>
      <span class="g-tag" id="progress">0/${TOTAL}</span>
      <div class="aim-area" id="area">
        <div class="aim-target" id="target" style="display:none;">🎯</div>
      </div>
      <button class="g-btn" id="btn">เริ่ม! 🎯</button>
      <div class="g-prompt-sub" id="status">กดเริ่มเพื่อเล่น</div>
    </div>`;
  el = { area: root.querySelector('#area'), target: root.querySelector('#target'),
    progress: root.querySelector('#progress'), btn: root.querySelector('#btn'), status: root.querySelector('#status') };
  el.target.addEventListener('click', tapTarget);
  el.btn.addEventListener('click', start);
}
export function unmount(){ playing = false; root = null; el = null; }
