// mostlikely.js — ใครน่าจะสุด (นับ 3 แล้วชี้พร้อมกัน)
const PROMPTS = [
  'นอนดึกที่สุด', 'มาสายบ่อยที่สุด', 'กินเยอะที่สุด', 'ขี้งกที่สุด',
  'ใจดีที่สุด', 'ตลกที่สุด', 'ขี้เมาท์ที่สุด', 'เผลอส่งข้อความผิดคนบ่อยที่สุด',
  'ร้องไห้ง่ายที่สุด', 'โกรธง่ายหายเร็วที่สุด', 'ลืมของบ่อยที่สุด', 'เซลฟี่เยอะที่สุด',
  'เป็นสายเปย์ที่สุด', 'ดื้อที่สุด', 'ขี้เกียจที่สุด', 'ทำอาหารอร่อยที่สุด',
  'ร้องเพลงเพราะที่สุด', 'เต้นได้ดีที่สุด', 'แต่งตัวเก่งที่สุด', 'ขับรถโหดที่สุด',
  'เผลอหลับในที่สาธารณะได้ทุกที่', 'ติดมือถือหนักที่สุด', 'ใช้เงินเก่งที่สุด', 'เก็บเงินเก่งที่สุด',
  'เป็นคนคิดแผนเที่ยวให้กลุ่มเสมอ', 'หายตัวตอนจ่ายเงินบ่อยที่สุด', 'เมาแล้วเสียงดังที่สุด',
  'อกหักบ่อยที่สุด', 'จีบเก่งที่สุด', 'ขี้อายที่สุด', 'พูดมากที่สุด', 'ดวงดีที่สุด',
];

let root, el, pool = [], count = 0;

function refill(){ pool = [...PROMPTS].sort(() => Math.random() - 0.5); }

function next(){
  if(pool.length === 0) refill();
  count++;
  el.prompt.textContent = 'ใครน่าจะ' + pool.pop() + '?';
  el.counter.textContent = 'ข้อที่ ' + count;
  el.hint.style.display = 'block';
}

export function mount(container){
  root = container;
  count = 0;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ใครน่าจะสุด 👉</h1>
        <p class="g-sub">อ่านข้อ นับ 3 แล้วทุกคนชี้พร้อมกัน — ใครโดนชี้เยอะสุดดื่ม!</p>
      </div>
      <div class="g-card">
        <span class="g-tag" id="counter">พร้อมเล่น</span>
        <div class="g-emoji">🫵</div>
        <div class="g-prompt" id="prompt">กดปุ่มเพื่อเริ่มข้อแรก</div>
        <div class="g-note" id="hint" style="display:none;">3... 2... 1... ชี้!</div>
      </div>
      <button class="g-btn" id="nextBtn">ข้อต่อไป ▶</button>
    </div>`;
  el = {
    prompt: root.querySelector('#prompt'),
    counter: root.querySelector('#counter'),
    hint: root.querySelector('#hint'),
  };
  refill();
  root.querySelector('#nextBtn').addEventListener('click', next);
}

export function unmount(){ root = null; el = null; }
