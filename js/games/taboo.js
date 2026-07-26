// taboo.js — คำต้องห้าม (ใบ้คำให้เพื่อนทาย ห้ามพูดคำต้องห้าม)
const CARDS = [
  { w:'ทุเรียน', t:['ผลไม้','ราชา','เหม็น','หนาม'] },
  { w:'รถไฟฟ้า', t:['BTS','ราง','สถานี','ขบวน'] },
  { w:'กาแฟ', t:['ดำ','ตื่น','ร้าน','คาเฟอีน'] },
  { w:'แมว', t:['เหมียว','สัตว์เลี้ยง','หนวด','จับหนู'] },
  { w:'ฝนตก', t:['ร่ม','เปียก','เมฆ','หยดน้ำ'] },
  { w:'โทรศัพท์', t:['มือถือ','โทร','จอ','แอป'] },
  { w:'ฟุตบอล', t:['เตะ','ลูกกลม','ทีม','ประตู'] },
  { w:'ต้มยำกุ้ง', t:['เผ็ด','กุ้ง','ซุป','เปรี้ยว'] },
  { w:'ซานตาคลอส', t:['คริสต์มาส','ของขวัญ','เครา','สีแดง'] },
  { w:'ทะเล', t:['น้ำ','เค็ม','ชายหาด','คลื่น'] },
  { w:'หมอ', t:['โรงพยาบาล','ป่วย','รักษา','คนไข้'] },
  { w:'เฟซบุ๊ก', t:['โซเชียล','โพสต์','ไลก์','เพื่อน'] },
  { w:'ปีใหม่', t:['เคานต์ดาวน์','พลุ','ธันวาคม','อวยพร'] },
  { w:'ช้าง', t:['งวง','ใหญ่','งา','สัตว์'] },
  { w:'ไอศกรีม', t:['เย็น','หวาน','โคน','ละลาย'] },
];
let root, el, pool = [];

function refill(){ pool = [...CARDS].sort(() => Math.random() - 0.5); }
function next(){
  if(pool.length === 0) refill();
  const card = pool.pop();
  el.word.textContent = card.w;
  el.taboo.innerHTML = card.t.map(x => `<span class="taboo-item">${x}</span>`).join('');
}

export function mount(c){
  root = c; refill();
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">คำต้องห้าม 🚫</h1>
        <p class="g-sub">ใบ้คำด้านบนให้เพื่อนทาย โดย "ห้ามพูด" คำต้องห้ามด้านล่าง!</p>
      </div>
      <div class="g-card">
        <div class="g-prompt-sub">คำที่ต้องใบ้</div>
        <div class="taboo-word" id="word">พร้อม?</div>
        <div class="taboo-list" id="taboo"></div>
      </div>
      <button class="g-btn" id="nextBtn">คำถัดไป ▶</button>
      <div class="g-note">ทายได้ = ทีมได้แต้ม · พลั้งพูดคำต้องห้าม = โดนหักแต้ม/ดื่ม</div>
    </div>`;
  el = { word: root.querySelector('#word'), taboo: root.querySelector('#taboo') };
  root.querySelector('#nextBtn').addEventListener('click', next);
  next();
}
export function unmount(){ root = null; el = null; }
