// neverever.js — ฉันไม่เคย (ใครเคยทำ ยกมือ/ดื่ม)
const S = [
  'ฉันไม่เคยโดดเรียน','ฉันไม่เคยแอบชอบเพื่อนสนิท','ฉันไม่เคยโกหกแฟน/คนคุย',
  'ฉันไม่เคยร้องไห้เพราะซีรีส์','ฉันไม่เคยส่งข้อความผิดแชท','ฉันไม่เคยแอบส่องโซเชียลอดีตแฟน',
  'ฉันไม่เคยกินของหมดอายุ','ฉันไม่เคยลางานทั้งที่ไม่ป่วย','ฉันไม่เคยลืมวันเกิดคนสนิท',
  'ฉันไม่เคยเมาจนจำอะไรไม่ได้','ฉันไม่เคยแอบอ่านแชทคนอื่น','ฉันไม่เคยโกหกอายุตัวเอง',
  'ฉันไม่เคยร้องเพลงในห้องน้ำ','ฉันไม่เคยตกหลุมรักตั้งแต่แรกเห็น','ฉันไม่เคยแกล้งป่วยเพื่อหนีบางอย่าง',
  'ฉันไม่เคยหลงทางจนต้องโทรขอความช่วยเหลือ','ฉันไม่เคยลืมชื่อคนที่เพิ่งแนะนำตัว',
  'ฉันไม่เคยกดไลก์แล้วรีบกดยกเลิก','ฉันไม่เคยถ่ายรูปอาหารก่อนกินทุกมื้อ','ฉันไม่เคยนอนเกินเที่ยงวันหยุด',
  'ฉันไม่เคยแอบกินขนมคนอื่นในตู้เย็น','ฉันไม่เคยโกหกว่ากำลังจะถึงแล้วทั้งที่ยังไม่ออกจากบ้าน',
];
let root, el, pool = [], count = 0;
function refill(){ pool = [...S].sort(() => Math.random() - 0.5); }
function next(){
  if(pool.length === 0) refill();
  count++;
  el.prompt.textContent = pool.pop();
  el.tag.textContent = 'ข้อที่ ' + count;
  el.hint.style.display = 'block';
}
export function mount(c){
  root = c; count = 0; refill();
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ฉันไม่เคย 🙅</h1>
        <p class="g-sub">อ่านข้อความ ใครเคยทำสิ่งนั้น = ยกมือ / ดื่ม 1 จิบ</p>
      </div>
      <div class="g-card">
        <span class="g-tag" id="tag">พร้อมเล่น</span>
        <div class="g-emoji">🍻</div>
        <div class="g-prompt" id="prompt">กดปุ่มเพื่อเริ่มข้อแรก</div>
        <div class="g-note" id="hint" style="display:none;">ใครเคย → ดื่มเลย!</div>
      </div>
      <button class="g-btn" id="nextBtn">ข้อต่อไป ▶</button>
    </div>`;
  el = { prompt: root.querySelector('#prompt'), tag: root.querySelector('#tag'), hint: root.querySelector('#hint') };
  root.querySelector('#nextBtn').addEventListener('click', next);
}
export function unmount(){ root = null; el = null; }
