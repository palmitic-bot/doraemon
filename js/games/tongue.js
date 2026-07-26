// tongue.js — ลิ้นพันกัน (พูดให้ชัด 3 รอบเร็วๆ ใครพลาดดื่ม)
const TW = [
  'ยักษ์ใหญ่ไล่ยักษ์เล็ก',
  'ชามเขียวคว่ำเช้า ชามขาวคว่ำค่ำ',
  'ระนอง ระยอง ยะลา',
  'เช้าฟาดผัดฟัก เย็นฟาดฟักผัด',
  'ทหารบกแบกปืนไปที่บ่อ',
  'ครูใหญ่ใจดีมีมีดใหม่',
  'ปลาปากกว้างปากกว้างปลา',
  'ยุงลายลายยุง',
  'ตากลมกลมตา',
  'ขนมเข่งขนมข้าว',
  'เนยแข็งแข็งเนย',
  'กระถางแตกกระบอกตัก',
  'หมูหมึกกุ้งหอยปูปลา',
  'ไหมใหม่ไม้ใหม่',
];
let root, el, pool = [];

function refill(){ pool = [...TW].sort(() => Math.random() - 0.5); }
function next(){
  if(pool.length === 0) refill();
  el.tw.textContent = pool.pop();
}

export function mount(c){
  root = c; refill();
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ลิ้นพันกัน 👅</h1>
        <p class="g-sub">พูดประโยคนี้ให้ชัด 3 รอบเร็วๆ ใครพูดพันกัน/ผิด = ดื่ม!</p>
      </div>
      <div class="g-card">
        <div class="g-emoji">🗣️</div>
        <div class="g-prompt" id="tw" style="line-height:1.6;">พร้อม?</div>
        <div class="g-note">พูด 3 รอบติดกัน ห้ามหยุด!</div>
      </div>
      <button class="g-btn" id="nextBtn">ประโยคถัดไป ▶</button>
    </div>`;
  el = { tw: root.querySelector('#tw') };
  root.querySelector('#nextBtn').addEventListener('click', next);
  next();
}
export function unmount(){ root = null; el = null; }
