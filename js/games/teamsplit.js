// teamsplit.js — สุ่มแบ่งทีม (ใส่รายชื่อ แบ่งเป็นทีมเท่าๆ กัน)
let root, el, teams = 2;

function names(){ return el.input.value.split('\n').map(s => s.trim()).filter(Boolean); }
function shuffle(a){ for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function esc(s){ return s.replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c])); }

function split(){
  const list = shuffle(names());
  if(list.length < teams){ el.out.innerHTML = `<p class="g-note">ต้องมีชื่ออย่างน้อย ${teams} คน</p>`; return; }
  const buckets = Array.from({ length: teams }, () => []);
  list.forEach((n, i) => buckets[i % teams].push(n));
  const icons = ['🔴','🔵','🟢','🟡'];
  el.out.innerHTML = buckets.map((b, i) =>
    `<div class="pair-item" style="flex-direction:column;align-items:flex-start;gap:6px;">
       <div class="g-tag">${icons[i]} ทีม ${i + 1} (${b.length})</div>
       <div>${b.map(esc).join(' · ')}</div>
     </div>`).join('');
}

export function mount(c){
  root = c; teams = 2;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">สุ่มแบ่งทีม 👥</h1>
        <p class="g-sub">พิมพ์รายชื่อบรรทัดละ 1 คน เลือกจำนวนทีม แล้วสุ่มแบ่ง</p>
      </div>
      <div class="cfg-row">
        <span class="cfg-label">จำนวนทีม</span>
        <div class="stepper"><button data-d="-1">−</button><span class="val" id="tv">2</span><button data-d="1">+</button></div>
      </div>
      <textarea class="g-input" id="names" placeholder="เอ&#10;บี&#10;ซี&#10;ดี"></textarea>
      <button class="g-btn" id="btn">แบ่งทีม! 👥</button>
      <div class="pair-list" id="out"></div>
    </div>`;
  el = { input: root.querySelector('#names'), out: root.querySelector('#out') };
  el.input.value = 'เอ\nบี\nซี\nดี\nอี\nเอฟ';
  const tv = root.querySelector('#tv');
  root.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => { teams = Math.min(4, Math.max(2, teams + Number(b.dataset.d))); tv.textContent = teams; }));
  root.querySelector('#btn').addEventListener('click', split);
}
export function unmount(){ root = null; el = null; }
