// pairing.js — จับคู่ (สุ่มจับคู่รายชื่อ เหลือเศษ = กลุ่ม 3)
let root, el;

function escapeHtml(s){ return s.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }

function names(){
  return el.input.value.split('\n').map(s => s.trim()).filter(Boolean);
}

function shuffle(a){
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makePairs(){
  const list = shuffle(names());
  if(list.length < 2){ el.out.innerHTML = '<p class="g-note">ใส่รายชื่ออย่างน้อย 2 คน</p>'; return; }
  const pairs = [];
  while(list.length >= 2){
    if(list.length === 3){ pairs.push(list.splice(0, 3)); break; }
    pairs.push(list.splice(0, 2));
  }
  el.out.innerHTML = pairs.map((p, i) => {
    if(p.length === 3){
      return `<div class="pair-item">👥 ${escapeHtml(p[0])} <span class="vs">+</span> ${escapeHtml(p[1])} <span class="vs">+</span> ${escapeHtml(p[2])} <span class="solo">(กลุ่ม 3)</span></div>`;
    }
    return `<div class="pair-item"><span class="g-sub">คู่ ${i + 1}</span> ${escapeHtml(p[0])} <span class="vs">×</span> ${escapeHtml(p[1])}</div>`;
  }).join('');
}

export function mount(container){
  root = container;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">จับคู่ 💞</h1>
        <p class="g-sub">พิมพ์รายชื่อบรรทัดละ 1 คน แล้วสุ่มจับคู่ (เศษ = กลุ่ม 3)</p>
      </div>
      <textarea class="g-input" id="names" placeholder="เอ&#10;บี&#10;ซี&#10;ดี"></textarea>
      <button class="g-btn" id="pairBtn">จับคู่! 💞</button>
      <div class="pair-list" id="out"></div>
    </div>`;
  el = {
    input: root.querySelector('#names'),
    out: root.querySelector('#out'),
  };
  el.input.value = 'เอ\nบี\nซี\nดี\nอี';
  root.querySelector('#pairBtn').addEventListener('click', makePairs);
}

export function unmount(){ root = null; el = null; }
