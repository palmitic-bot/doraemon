// category.js — หมวด ก–ฮ (พูดสิ่งของตามหมวด ขึ้นต้นด้วยตัวอักษรที่สุ่ม ใน 10 วิ)
const CATS = ['ชื่อสัตว์','เมนูอาหาร','ชื่อประเทศ/เมือง','ชื่อคน','สิ่งของรอบตัว','อาชีพ','ผลไม้/ผัก','ยี่ห้อสินค้า','ตัวการ์ตูน','สถานที่'];
const LETTERS = ['ก','ข','ค','ง','จ','ช','ด','ต','ท','น','บ','ป','ผ','พ','ฟ','ม','ย','ร','ล','ว','ส','ห','อ'];
let root, el, timer = null, remain = 10;

function stop(){ if(timer){ clearInterval(timer); timer = null; } }

function roll(){
  stop();
  el.cat.textContent = CATS[Math.floor(Math.random() * CATS.length)];
  el.letter.textContent = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  remain = 10;
  el.timer.textContent = '10';
  el.timer.classList.remove('low');
  el.btn.textContent = '⏱ กำลังนับ…';
  el.btn.disabled = true;
  timer = setInterval(() => {
    remain--;
    el.timer.textContent = remain > 0 ? remain : '⏰';
    if(remain <= 3 && remain > 0) el.timer.classList.add('low');
    if(remain <= 0){ stop(); el.btn.textContent = 'ข้อต่อไป ▶'; el.btn.disabled = false; el.status.textContent = 'หมดเวลา! ใครตอบไม่ได้ = ดื่ม'; }
  }, 1000);
  el.status.textContent = 'ผลัดกันพูดเร็วๆ ห้ามซ้ำ!';
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">หมวด ก–ฮ 🔤</h1>
        <p class="g-sub">พูดสิ่งของตามหมวด ที่ขึ้นต้นด้วยตัวอักษรนี้ ผลัดกันเร็วๆ ใน 10 วิ</p>
      </div>
      <div class="g-card">
        <div class="g-prompt-sub">หมวด</div>
        <div class="g-prompt" id="cat">—</div>
        <div class="g-prompt-sub" style="margin-top:8px;">ขึ้นต้นด้วย</div>
        <div class="cat-letter" id="letter">?</div>
      </div>
      <div class="timer-ring" id="timer">10</div>
      <button class="g-btn" id="btn">สุ่ม & เริ่ม 🔤</button>
      <div class="g-prompt-sub" id="status">กดเพื่อสุ่มหมวดและตัวอักษร</div>
    </div>`;
  el = { cat: root.querySelector('#cat'), letter: root.querySelector('#letter'),
    timer: root.querySelector('#timer'), btn: root.querySelector('#btn'), status: root.querySelector('#status') };
  el.btn.addEventListener('click', roll);
}
export function unmount(){ stop(); root = null; el = null; }
