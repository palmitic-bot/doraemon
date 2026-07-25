// challenge7.js — ท้า 7 วินาที (สุ่มภารกิจ ทำให้เสร็จใน 7 วิ)
const TASKS = [
  'พูดชื่อยี่ห้อรถ 5 ยี่ห้อ','บอกชื่อสีมา 6 สี','พูดชื่อผลไม้ 5 อย่าง','ทำท่าสัตว์ 3 ตัวให้เพื่อนทาย',
  'พูดชื่อประเทศในอาเซียน 5 ประเทศ','ร้องเพลงชาติท่อนแรก','พูดคำที่ลงท้ายด้วย "อง" 5 คำ',
  'บอกชื่อเมนูอาหารตามสั่ง 6 อย่าง','พูด ABC ย้อนกลับจาก G ถึง A','ทำหน้าอารมณ์ 4 แบบ (ดีใจ/โกรธ/เศร้า/ตกใจ)',
  'พูดชื่อดาราไทย 5 คน','กระโดด 7 ครั้งพร้อมนับเสียงดัง','บอกชื่อแอปในมือถือ 6 แอป',
  'พูดชื่อจังหวัด 6 จังหวัด','เลียนเสียงสัตว์ 3 ชนิด','บอกวันในสัปดาห์เป็นภาษาอังกฤษให้ครบ',
  'พูดคำว่า "รัก" เป็น 3 ภาษา','ตั้งชื่อเล่นให้คนข้างๆ 3 ชื่อ','พูดชื่อยี่ห้อมือถือ 5 ยี่ห้อ',
];
let root, el, pool = [], timer = null, remain = 7;

function refill(){ pool = [...TASKS].sort(() => Math.random() - 0.5); }
function stopTimer(){ if(timer){ clearInterval(timer); timer = null; } }

function nextTask(){
  stopTimer();
  if(pool.length === 0) refill();
  el.task.textContent = pool.pop();
  el.timer.textContent = '7';
  el.timer.classList.remove('low');
  el.startBtn.textContent = '▶ เริ่มจับเวลา 7 วิ';
  el.startBtn.disabled = false;
}
function startTimer(){
  stopTimer();
  remain = 7;
  el.timer.textContent = remain;
  el.timer.classList.remove('low');
  el.startBtn.textContent = '⏱ กำลังจับเวลา…';
  el.startBtn.disabled = true;
  timer = setInterval(() => {
    remain--;
    el.timer.textContent = remain > 0 ? remain : '⏰';
    if(remain <= 3 && remain > 0) el.timer.classList.add('low');
    if(remain <= 0){ stopTimer(); el.startBtn.textContent = 'หมดเวลา! ▶ ข้อต่อไป'; el.startBtn.disabled = false; el.startBtn.dataset.next = '1'; }
  }, 1000);
}

export function mount(c){
  root = c; refill();
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ท้า 7 วินาที ⏱️</h1>
        <p class="g-sub">อ่านภารกิจ กดเริ่มแล้วทำให้เสร็จใน 7 วิ ทำไม่ทัน = ดื่ม!</p>
      </div>
      <div class="g-card">
        <div class="timer-ring" id="timer">7</div>
        <div class="g-prompt" id="task">กดข้อต่อไปเพื่อรับภารกิจ</div>
      </div>
      <div class="g-row">
        <button class="g-btn" id="startBtn">▶ เริ่มจับเวลา 7 วิ</button>
        <button class="g-btn ghost sm" id="nextBtn">ข้อต่อไป</button>
      </div>
    </div>`;
  el = { task: root.querySelector('#task'), timer: root.querySelector('#timer'), startBtn: root.querySelector('#startBtn') };
  nextTask();
  el.startBtn.addEventListener('click', () => {
    if(el.startBtn.dataset.next === '1'){ el.startBtn.dataset.next = ''; nextTask(); }
    else startTimer();
  });
  root.querySelector('#nextBtn').addEventListener('click', () => { el.startBtn.dataset.next = ''; nextTask(); });
}
export function unmount(){ stopTimer(); root = null; el = null; }
