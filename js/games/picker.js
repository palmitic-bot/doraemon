// picker.js — สุ่มคน (สุ่ม 1 คนจากรายชื่อ มีโหมดตัดคนที่ถูกเลือกออก)
let root, el, spinTimer = null;

function names(){
  return el.input.value.split('\n').map(s => s.trim()).filter(Boolean);
}

function escapeHtml(s){ return s.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }

function pick(){
  const list = names();
  if(list.length < 2){ el.reveal.textContent = 'ใส่รายชื่ออย่างน้อย 2 คน'; el.reveal.className = 'reveal-name'; return; }
  if(spinTimer) return;
  el.pickBtn.disabled = true;
  el.reveal.className = 'reveal-name spin';

  let ticks = 0;
  const total = 18 + Math.floor(Math.random() * 8);
  spinTimer = setInterval(() => {
    el.reveal.textContent = list[Math.floor(Math.random() * list.length)];
    ticks++;
    if(ticks >= total){
      clearInterval(spinTimer); spinTimer = null;
      const winner = list[Math.floor(Math.random() * list.length)];
      el.reveal.textContent = '🎉 ' + winner;
      el.reveal.className = 'reveal-name win';
      if(el.elim.checked){
        const arr = names();
        const idx = arr.indexOf(winner);
        if(idx >= 0) arr.splice(idx, 1);
        el.input.value = arr.join('\n');
      }
      el.pickBtn.disabled = false;
    }
  }, 70 + ticks);
}

export function mount(container){
  root = container;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">สุ่มคน 🎯</h1>
        <p class="g-sub">พิมพ์รายชื่อบรรทัดละ 1 คน แล้วให้ระบบสุ่ม</p>
      </div>
      <div class="g-card">
        <div class="reveal-name" id="reveal">— ?? —</div>
      </div>
      <button class="g-btn" id="pickBtn">สุ่มเลย 🎲</button>
      <textarea class="g-input" id="names" placeholder="เอ&#10;บี&#10;ซี&#10;ดี"></textarea>
      <label class="g-note" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
        <input type="checkbox" id="elim"> ตัดคนที่ถูกสุ่มออก (โหมดคัดออก)
      </label>
    </div>`;
  el = {
    reveal: root.querySelector('#reveal'),
    pickBtn: root.querySelector('#pickBtn'),
    input: root.querySelector('#names'),
    elim: root.querySelector('#elim'),
  };
  el.input.value = 'เอ\nบี\nซี\nดี';
  el.pickBtn.addEventListener('click', pick);
}

export function unmount(){
  if(spinTimer){ clearInterval(spinTimer); spinTimer = null; }
  root = null; el = null;
}
