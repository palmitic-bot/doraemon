// charades.js — ใบ้คำ/ทายคำ (เลือกหมวด โชว์คำ จับเวลา 60 วิ)
const CATS = {
  'สัตว์':   ['ช้าง','จิงโจ้','เพนกวิน','ยีราฟ','กิ้งกือ','ปลาหมึก','นกฮูก','ฮิปโป','เต่า','ค้างคาว','แมงมุม','กระต่าย'],
  'อาหาร':   ['ส้มตำ','ต้มยำกุ้ง','ข้าวเหนียวมะม่วง','ผัดไทย','ชานมไข่มุก','ปิ้งย่าง','ราเมง','พิซซ่า','ไข่เจียว','ทุเรียน','ข้าวมันไก่','หมูกระทะ'],
  'หนัง/การ์ตูน': ['โดเรม่อน','ตำนานสมเด็จพระนเรศวร','แฮร์รี่ พอตเตอร์','อวตาร','สไปเดอร์แมน','โคนัน','วันพีซ','โฟรเซน','จูราสสิคพาร์ค','ไททานิค'],
  'อาชีพ':   ['หมอ','ตำรวจ','นักดับเพลิง','ครู','เชฟ','นักบิน','ยูทูปเบอร์','ช่างตัดผม','นักร้อง','โปรแกรมเมอร์','พยาบาล','ทหาร'],
  'กริยา':   ['ว่ายน้ำ','เต้น','ตกปลา','ขับรถ','ร้องไห้','หัวเราะ','แปรงฟัน','ถ่ายรูป','นอนกรน','วิ่งหนี','ยกน้ำหนัก','ทำกับข้าว'],
};

let root, el, cat = null, pool = [], timer = null, remain = 60;

function escapeHtml(s){ return s.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }

function selectCat(name){
  cat = name;
  pool = [...CATS[name]].sort(() => Math.random() - 0.5);
  root.querySelectorAll('.chip.selectable').forEach(c => c.classList.toggle('on', c.dataset.cat === name));
  nextWord();
}

function nextWord(){
  if(!cat){ el.word.textContent = 'เลือกหมวดก่อน'; return; }
  if(pool.length === 0) pool = [...CATS[cat]].sort(() => Math.random() - 0.5);
  el.word.textContent = pool.pop();
}

function fmt(s){ return '0:' + String(s).padStart(2, '0'); }

function startTimer(){
  stopTimer();
  remain = 60;
  el.timer.textContent = fmt(remain);
  el.timer.classList.remove('low');
  el.timerBtn.textContent = '⏸ หยุด';
  timer = setInterval(() => {
    remain--;
    el.timer.textContent = fmt(remain);
    if(remain <= 10) el.timer.classList.add('low');
    if(remain <= 0){
      stopTimer();
      el.timer.textContent = 'หมดเวลา!';
      el.word.textContent = '⏰';
    }
  }, 1000);
}
function stopTimer(){
  if(timer){ clearInterval(timer); timer = null; }
  el.timerBtn.textContent = '▶ จับเวลา 60 วิ';
}
function toggleTimer(){ if(timer) stopTimer(); else startTimer(); }

export function mount(container){
  root = container;
  cat = null; pool = []; timer = null;
  const chips = Object.keys(CATS).map(c =>
    `<span class="chip selectable" data-cat="${c}">${c}</span>`).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ใบ้คำ 🎭</h1>
        <p class="g-sub">คนใบ้ดูคำแล้วแสดงท่า ห้ามพูด — เพื่อนทาย!</p>
      </div>
      <div class="chip-list">${chips}</div>
      <div class="g-card">
        <div class="timer-ring" id="timer">1:00</div>
        <div class="g-prompt" id="word" style="font-size:clamp(26px,7vw,34px);">เลือกหมวดด้านบน</div>
      </div>
      <div class="g-row">
        <button class="g-btn" id="nextBtn">คำถัดไป ▶</button>
        <button class="g-btn ghost sm" id="timerBtn">▶ จับเวลา 60 วิ</button>
      </div>
    </div>`;
  el = {
    word: root.querySelector('#word'),
    timer: root.querySelector('#timer'),
    timerBtn: root.querySelector('#timerBtn'),
  };
  el.timer.textContent = fmt(60);
  root.querySelectorAll('.chip.selectable').forEach(c =>
    c.addEventListener('click', () => selectCat(c.dataset.cat)));
  root.querySelector('#nextBtn').addEventListener('click', nextWord);
  el.timerBtn.addEventListener('click', toggleTimer);
}

export function unmount(){
  if(timer){ clearInterval(timer); timer = null; }
  root = null; el = null;
}
