// wouldyourather.js — เลือกสิ ก. หรือ ข. (ทุกคนเลือกพร้อมกัน)
const DILEMMAS = [
  ['มีเงินใช้ไม่จำกัด', 'มีเวลาว่างไม่จำกัด'],
  ['อ่านใจคนอื่นได้', 'ล่องหนได้'],
  ['ย้อนอดีตได้', 'เห็นอนาคตได้'],
  ['บินได้', 'หายตัวได้'],
  ['ไม่ต้องกินก็อยู่ได้', 'ไม่ต้องนอนก็อยู่ได้'],
  ['เก่งทุกภาษาบนโลก', 'เล่นได้ทุกเครื่องดนตรี'],
  ['รวยมากแต่โสดตลอด', 'จนนิดหน่อยแต่มีรักแท้'],
  ['กินเผ็ดไม่ได้ตลอดชีวิต', 'กินหวานไม่ได้ตลอดชีวิต'],
  ['เน็ตช้าตลอดชีวิต', 'แบตหมดเร็วตลอดชีวิต'],
  ['ดังไปทั้งโลกแต่ไม่มีความเป็นส่วนตัว', 'รวยเงียบๆ ไม่มีใครรู้จัก'],
  ['ตื่นตี 5 ทุกวัน', 'นอนดึกตี 3 ทุกวัน'],
  ['พูดความจริงตลอดเวลา', 'โกหกได้แต่ไม่มีใครเชื่อ'],
  ['เที่ยวฟรีทั่วโลกแต่คนเดียว', 'เที่ยวในประเทศแต่ไปกับเพื่อน'],
  ['มีแฟนหน้าตาดีแต่ปากร้าย', 'มีแฟนหน้าตาธรรมดาแต่ใจดีมาก'],
];
let root, el, pool = [], count = 0;

function refill(){ pool = [...DILEMMAS].sort(() => Math.random() - 0.5); }

function next(){
  if(pool.length === 0) refill();
  count++;
  const d = pool.pop();
  el.a.textContent = d[0];
  el.b.textContent = d[1];
  el.a.classList.remove('picked'); el.b.classList.remove('picked');
  el.tag.textContent = 'ข้อที่ ' + count;
}

export function mount(c){
  root = c; count = 0; refill();
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">เลือกสิ ก. หรือ ข. 🤔</h1>
        <p class="g-sub">นับ 3 ทุกคนชี้เลือกพร้อมกัน ใครเลือกเสียงข้างน้อยดื่ม!</p>
      </div>
      <span class="g-tag" id="tag">พร้อมเล่น</span>
      <button class="wyr-opt" id="a">ก.</button>
      <div class="wyr-or">หรือ</div>
      <button class="wyr-opt b" id="b">ข.</button>
      <button class="g-btn" id="nextBtn">ข้อต่อไป ▶</button>
    </div>`;
  el = { a: root.querySelector('#a'), b: root.querySelector('#b'), tag: root.querySelector('#tag') };
  el.a.addEventListener('click', () => { el.a.classList.add('picked'); el.b.classList.remove('picked'); });
  el.b.addEventListener('click', () => { el.b.classList.add('picked'); el.a.classList.remove('picked'); });
  root.querySelector('#nextBtn').addEventListener('click', next);
  next();
}
export function unmount(){ root = null; el = null; }
