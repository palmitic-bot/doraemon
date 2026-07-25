// trivia.js — ควิซทายความรู้ (เลือกคำตอบที่ถูก)
const Q = [
  { q:'เมืองหลวงของญี่ปุ่นคือ?', c:['โซล','โตเกียว','ปักกิ่ง','ฮานอย'], a:1 },
  { q:'1 ชั่วโมงมีกี่วินาที?', c:['360','600','3600','6000'], a:2 },
  { q:'ผสมสีน้ำเงินกับเหลืองได้สีอะไร?', c:['เขียว','ม่วง','ส้ม','ชมพู'], a:0 },
  { q:'ดาวเคราะห์ที่อยู่ใกล้ดวงอาทิตย์ที่สุด?', c:['ศุกร์','โลก','พุธ','อังคาร'], a:2 },
  { q:'สัตว์บกที่ตัวใหญ่ที่สุด?', c:['ยีราฟ','ช้าง','แรด','ฮิปโป'], a:1 },
  { q:'ประเทศไทยมีกี่จังหวัด?', c:['75','76','77','78'], a:2 },
  { q:'น้ำแข็งคือน้ำในสถานะใด?', c:['ของเหลว','ของแข็ง','ก๊าซ','พลาสมา'], a:1 },
  { q:'ต้มยำกุ้งเป็นอาหารประจำชาติของประเทศใด?', c:['เวียดนาม','ลาว','ไทย','กัมพูชา'], a:2 },
  { q:'ผลไม้ที่ได้ชื่อว่า "ราชาผลไม้"?', c:['มังคุด','ทุเรียน','เงาะ','มะม่วง'], a:1 },
  { q:'1 ปีปกติมีกี่วัน?', c:['364','365','366','360'], a:1 },
  { q:'เป็ดร้องเสียงอย่างไร?', c:['เมี้ยว','ก๊าบ','โฮ่ง','จิ๊บ'], a:1 },
  { q:'ทวีปที่ใหญ่ที่สุดในโลก?', c:['แอฟริกา','อเมริกา','ยุโรป','เอเชีย'], a:3 },
  { q:'สองมือมนุษย์มีกี่นิ้ว?', c:['8','10','12','20'], a:1 },
  { q:'สีของใบไม้ทั่วไปมาจากสารใด?', c:['คลอโรฟิลล์','ฮีโมโกลบิน','เมลานิน','แคโรทีน'], a:0 },
  { q:'มหาสมุทรที่ใหญ่ที่สุด?', c:['แอตแลนติก','อินเดีย','แปซิฟิก','อาร์กติก'], a:2 },
];
let root, el, pool = [], streak = 0, best = 0, locked = false;

function refill(){ pool = [...Q].sort(() => Math.random() - 0.5); }

function next(){
  if(pool.length === 0) refill();
  locked = false;
  const item = pool.pop();
  el.q.textContent = item.q;
  el.opts.innerHTML = item.c.map((t, i) => `<button class="choice-btn" data-i="${i}">${t}</button>`).join('');
  el.opts.querySelectorAll('.choice-btn').forEach(b => b.addEventListener('click', () => answer(Number(b.dataset.i), item.a, b)));
  el.status.textContent = 'เลือกคำตอบ';
}

function answer(i, correct, btn){
  if(locked) return;
  locked = true;
  const btns = el.opts.querySelectorAll('.choice-btn');
  btns[correct].classList.add('correct');
  if(i === correct){
    streak++; best = Math.max(best, streak);
    el.status.textContent = 'ถูกต้อง! ✅';
  } else {
    btn.classList.add('wrong');
    el.status.textContent = `ผิด! ❌ สตรีคจบที่ ${streak} (ดีสุด ${best}) — ดื่ม!`;
    streak = 0;
  }
  el.streak.textContent = 'สตรีค: ' + streak;
  btns.forEach(b => b.disabled = true);
}

export function mount(c){
  root = c; best = 0; streak = 0; refill();
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ควิซทายความรู้ ❓</h1>
        <p class="g-sub">ตอบถูกสะสมสตรีค ตอบผิด = ดื่ม!</p>
      </div>
      <span class="g-tag" id="streak">สตรีค: 0</span>
      <div class="g-card"><div class="g-prompt" id="q" style="font-size:clamp(19px,5vw,24px);">พร้อมไหม?</div></div>
      <div class="choice-list" id="opts"></div>
      <div class="g-prompt-sub" id="status">เลือกคำตอบ</div>
      <button class="g-btn" id="nextBtn">ข้อต่อไป ▶</button>
    </div>`;
  el = { q: root.querySelector('#q'), opts: root.querySelector('#opts'),
    status: root.querySelector('#status'), streak: root.querySelector('#streak') };
  root.querySelector('#nextBtn').addEventListener('click', next);
  next();
}
export function unmount(){ root = null; el = null; }
