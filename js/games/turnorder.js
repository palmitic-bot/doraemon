// turnorder.js — สุ่มลำดับเล่น (ใครเล่นก่อน-หลัง)
let root, el;
function names(){ return el.input.value.split('\n').map(s => s.trim()).filter(Boolean); }
function shuffle(a){ for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function esc(s){ return s.replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c])); }

function go(){
  const list = shuffle(names());
  if(list.length < 2){ el.out.innerHTML = '<p class="g-note">ใส่รายชื่ออย่างน้อย 2 คน</p>'; return; }
  const medal = ['🥇','🥈','🥉'];
  el.out.innerHTML = list.map((n, i) =>
    `<div class="pair-item"><span class="g-tag">${medal[i] || (i + 1) + '.'}</span> ${esc(n)}</div>`).join('');
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">สุ่มลำดับเล่น 🔀</h1>
        <p class="g-sub">พิมพ์รายชื่อ แล้วสุ่มว่าใครเล่นก่อน-หลัง</p>
      </div>
      <textarea class="g-input" id="names" placeholder="เอ&#10;บี&#10;ซี&#10;ดี"></textarea>
      <button class="g-btn" id="btn">สุ่มลำดับ! 🔀</button>
      <div class="pair-list" id="out"></div>
    </div>`;
  el = { input: root.querySelector('#names'), out: root.querySelector('#out') };
  el.input.value = 'เอ\nบี\nซี\nดี';
  root.querySelector('#btn').addEventListener('click', go);
}
export function unmount(){ root = null; el = null; }
