// bomb.js — ระเบิดเวลา (ส่งมือถือต่อ พูดคำตามหมวด ใครถือตอนระเบิด = แพ้)
const CATS = ['ชื่อผลไม้','ยี่ห้อรถ','ชื่อประเทศ','ชื่อสัตว์','เมนูอาหาร','ชื่อดารา',
  'ของในห้องน้ำ','ชื่อจังหวัด','แอปในมือถือ','ชื่อสี','ยี่ห้อมือถือ','ชนิดกีฬา','ชื่อดอกไม้','ยี่ห้อขนม'];
let root, el, tEnd = null, tSpeed = null;

function stop(){ if(tEnd){ clearTimeout(tEnd); tEnd = null; } if(tSpeed){ clearInterval(tSpeed); tSpeed = null; } }

function start(){
  stop();
  const cat = CATS[Math.floor(Math.random() * CATS.length)];
  el.cat.textContent = 'หมวด: ' + cat;
  el.bomb.textContent = '💣';
  el.bomb.className = 'bomb ticking';
  el.bomb.style.animationDuration = '520ms';
  el.status.textContent = 'พูดคำตามหมวด แล้วส่งมือถือต่อ! 👉';
  el.btn.textContent = 'กำลังนับถอยหลัง…';
  el.btn.disabled = true;
  const fuse = 12000 + Math.random() * 23000;
  let speed = 520;
  tSpeed = setInterval(() => { speed = Math.max(120, speed - 20); el.bomb.style.animationDuration = speed + 'ms'; }, 850);
  tEnd = setTimeout(() => {
    stop();
    el.bomb.textContent = '💥';
    el.bomb.className = 'bomb boom';
    el.status.textContent = 'โป๊ะ! 💥 คนถือมือถือตอนนี้แพ้ — ดื่ม!';
    el.btn.textContent = 'เริ่มลูกใหม่ 💣';
    el.btn.disabled = false;
  }, fuse);
}

export function mount(c){
  root = c;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ระเบิดเวลา 💣</h1>
        <p class="g-sub">กดเริ่ม พูดคำตามหมวดแล้วส่งมือถือต่อ ใครถืออยู่ตอนระเบิด = แพ้!</p>
      </div>
      <span class="g-tag" id="cat">กดเริ่มเพื่อสุ่มหมวด</span>
      <div class="bomb" id="bomb">💣</div>
      <div class="g-prompt-sub" id="status">พร้อมไหม?</div>
      <button class="g-btn" id="btn">เริ่ม! 💣</button>
    </div>`;
  el = { cat: root.querySelector('#cat'), bomb: root.querySelector('#bomb'),
    status: root.querySelector('#status'), btn: root.querySelector('#btn') };
  el.btn.addEventListener('click', start);
}
export function unmount(){ stop(); root = null; el = null; }
