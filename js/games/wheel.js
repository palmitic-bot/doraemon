// wheel.js — วงล้อสุ่ม (แก้ตัวเลือกเองได้ หมุนแล้วสุ่มผล)
const COLORS = ['#e0435c','#3fae5c','#3b5bdb','#d9782d','#6a3fa0','#1f9e94','#caa23b','#d1477a','#4a5fc1','#2b9e6b'];
const DEFAULT = ['ดื่ม 1 จิบ','ปลอดภัย!','เลือกคนดื่ม','หมดแก้ว 🍺','โชว์ท่าเต้น','ถามอะไรก็ได้','สลับที่นั่ง','รอดตัว'];

let root, el, options = [], rotation = 0, spinning = false;

function polar(cx, cy, r, deg){
  const t = (deg - 90) * Math.PI / 180;
  return [cx + r * Math.cos(t), cy + r * Math.sin(t)];
}

function renderWheel(){
  const n = options.length;
  const seg = 360 / n;
  let paths = '', labels = '';
  for(let i = 0; i < n; i++){
    const a0 = i * seg, a1 = (i + 1) * seg;
    const [x0, y0] = polar(50, 50, 50, a0);
    const [x1, y1] = polar(50, 50, 50, a1);
    const large = seg > 180 ? 1 : 0;
    paths += `<path d="M50,50 L${x0.toFixed(2)},${y0.toFixed(2)} A50,50 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${COLORS[i % COLORS.length]}"/>`;
    const mid = a0 + seg / 2;
    const [lx, ly] = polar(50, 50, 33, mid);
    let label = options[i];
    if(label.length > 10) label = label.slice(0, 9) + '…';
    labels += `<text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" transform="rotate(${mid} ${lx.toFixed(2)} ${ly.toFixed(2)})" text-anchor="middle" dominant-baseline="middle" font-family="Kanit, sans-serif" font-weight="700" font-size="4.6" fill="#131018">${escapeXml(label)}</text>`;
  }
  el.svg.innerHTML =
    `<g>${paths}</g><g>${labels}</g>` +
    `<circle cx="50" cy="50" r="7" fill="#1d1826" stroke="#eab949" stroke-width="1.6"/>`;
}

function escapeXml(s){ return s.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }

function renderChips(){
  el.chips.innerHTML = '';
  options.forEach((opt, i) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = `${escapeHtml(opt)} <button aria-label="ลบ">✕</button>`;
    chip.querySelector('button').addEventListener('click', () => {
      if(options.length <= 2){ el.result.textContent = 'ต้องมีอย่างน้อย 2 ตัวเลือก'; return; }
      options.splice(i, 1); renderChips(); renderWheel();
    });
    el.chips.appendChild(chip);
  });
}
function escapeHtml(s){ return s.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }

function spin(){
  if(spinning) return;
  spinning = true;
  el.result.textContent = '';
  el.spinBtn.disabled = true;
  const n = options.length;
  const seg = 360 / n;
  const winner = Math.floor(Math.random() * n);
  const jitter = (Math.random() - 0.5) * seg * 0.7;
  // นำจุดกึ่งกลางของ segment winner ไปอยู่บนสุด (ใต้ลูกศร)
  const target = 360 * 6 - (winner * seg + seg / 2) - jitter;
  rotation += (target - (rotation % 360));
  el.svg.style.transform = `rotate(${rotation}deg)`;
  setTimeout(() => {
    el.result.innerHTML = `🎯 <span class="g-result">${escapeHtml(options[winner])}</span>`;
    el.spinBtn.disabled = false;
    spinning = false;
  }, 4300);
}

export function mount(container){
  root = container;
  options = [...DEFAULT];
  rotation = 0; spinning = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">วงล้อสุ่ม 🎡</h1>
        <p class="g-sub">หมุนวงล้อ ตกช่องไหนทำตามนั้น — แก้ตัวเลือกได้เอง</p>
      </div>
      <div class="wheel-stage">
        <div class="wheel-pointer"></div>
        <svg class="wheel-svg" id="wheel" viewBox="0 0 100 100"></svg>
      </div>
      <button class="g-btn" id="spinBtn">หมุน! 🎡</button>
      <div id="result" style="min-height:1.4em;"></div>
      <div class="g-row" style="flex-wrap:nowrap;">
        <input class="g-input" id="optInput" placeholder="เพิ่มตัวเลือก…" maxlength="24">
        <button class="g-btn sm" id="addBtn" style="flex:0 0 auto;">เพิ่ม</button>
      </div>
      <div class="chip-list" id="chips"></div>
    </div>`;
  el = {
    svg: root.querySelector('#wheel'),
    spinBtn: root.querySelector('#spinBtn'),
    result: root.querySelector('#result'),
    chips: root.querySelector('#chips'),
    input: root.querySelector('#optInput'),
  };
  renderWheel(); renderChips();
  el.spinBtn.addEventListener('click', spin);
  const add = () => {
    const v = el.input.value.trim();
    if(!v) return;
    if(options.length >= 10){ el.result.textContent = 'ใส่ได้สูงสุด 10 ตัวเลือก'; return; }
    options.push(v); el.input.value = ''; renderChips(); renderWheel();
  };
  root.querySelector('#addBtn').addEventListener('click', add);
  el.input.addEventListener('keydown', e => { if(e.key === 'Enter') add(); });
}

export function unmount(){ root = null; el = null; }
