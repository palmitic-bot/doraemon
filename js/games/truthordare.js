// truthordare.js — ความจริงหรือกล้า
const TRUTHS = [
  'ครั้งสุดท้ายที่โกหกคือเรื่องอะไร?',
  'ในวงนี้ แอบชอบใครมากที่สุด?',
  'เรื่องที่เขินที่สุดที่เคยเกิดขึ้นคืออะไร?',
  'เคยแอบส่องโซเชียลใครบ้าง บอกมา 1 คน',
  'ความลับที่ไม่เคยบอกใครในวงนี้คืออะไร?',
  'นิสัยแย่ๆ ของตัวเองที่รู้ตัวคืออะไร?',
  'เคยทำอะไรผิดแล้วโทษคนอื่นไหม เรื่องอะไร?',
  'คนในวงนี้ที่คิดว่าหน้าตาดีที่สุดคือใคร?',
  'ถ้าต้องลบเพื่อน 1 คนตลอดกาล จะเลือกใคร (ไม่ต้องในวง)?',
  'ค่าโทรศัพท์/แอปที่จ่ายแพงสุดต่อเดือนคืออะไร?',
  'เรื่องที่กลัวที่สุดในชีวิตคืออะไร?',
  'เคยร้องไห้เพราะหนัง/เพลงเรื่องอะไรล่าสุด?',
  'ข้อความล่าสุดที่ส่งหาคนที่แอบชอบว่าอะไร?',
  'สิ่งที่อยากทำที่สุดแต่ไม่กล้าทำคืออะไร?',
  'เคยโกหกพ่อแม่เรื่องใหญ่ที่สุดคือเรื่องอะไร?',
  'อันดับความสนิทของคนในวงนี้ เรียงให้ฟังหน่อย',
  'เงินเดือน/ค่าขนมเท่าไหร่ บอกตรงๆ',
  'เคยแอบเทใครไหม เพราะอะไร?',
];
const DARES = [
  'โทรหาคนในเบอร์ล่าสุด แล้วพูดว่า "คิดถึง"',
  'โพสต์สตอรี่รูปตัวเองหน้าตลกที่สุด 1 นาที',
  'ให้คนซ้ายมือตั้งท่า แล้วเลียนแบบ 30 วินาที',
  'พูดสำเนียงเหน่อทุกประโยคจนกว่าจะถึงตาตัวเองอีกครั้ง',
  'โชว์รูปในแกลเลอรีรูปที่ 7 นับจากล่าสุดให้ทุกคนดู',
  'ร้องเพลงท่อนฮุคที่คนในวงเลือกให้',
  'ทำท่าเต้นสุ่ม 15 วินาที ให้ทุกคนถ่ายคลิป',
  'ให้คนขวามือวาดหนวดบนหน้าคุณ อยู่ยาว 3 ตา',
  'พูดคำชมคนในวงทีละคน คนละ 1 ประโยค',
  'เอาน้ำแข็ง 1 ก้อนไว้ในปากจนละลาย',
  'สลับที่นั่งกับคนตรงข้าม แล้วเล่นเป็นเขา 1 รอบ',
  'เลียนเสียงสัตว์ที่คนในวงสั่ง 3 ตัว',
  'ยกมือถือให้คนข้างๆ พิมพ์สเตตัสอะไรก็ได้ (ลบได้หลังจบเกม)',
  'ทำหน้าจริงจังห้ามยิ้มจนถึงตาตัวเองอีกครั้ง ยิ้ม = ดื่ม',
  'โพสต์อิโมจิสุ่ม 5 ตัวลงกลุ่มเพื่อน',
  'ให้ทุกคนถามคำถามคนละ 1 ข้อ ต้องตอบจริงทั้งหมด',
  'พูดลิ้นพันกัน "ยักษ์ใหญ่ไล่ยักษ์เล็ก" 3 รอบเร็วๆ',
  'กอดคนที่นั่งใกล้ที่สุด 10 วินาที',
];

let root, el, pool = { truth: [], dare: [] };

function refill(kind){ pool[kind] = (kind === 'truth' ? [...TRUTHS] : [...DARES]).sort(() => Math.random() - 0.5); }

function pick(kind){
  if(pool[kind].length === 0) refill(kind);
  const text = pool[kind].pop();
  const isT = kind === 'truth';
  el.tag.textContent = isT ? 'ความจริง' : 'ท้าให้ทำ';
  el.tag.style.color = isT ? 'var(--gold)' : 'var(--pink)';
  el.tag.style.borderColor = isT ? 'rgba(234,185,73,0.4)' : 'rgba(255,93,143,0.4)';
  el.emoji.textContent = isT ? '💭' : '🔥';
  el.prompt.textContent = text;
}

export function mount(container){
  root = container;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ความจริงหรือกล้า 😈</h1>
        <p class="g-sub">เลือกอย่างใดอย่างหนึ่ง แล้วทำตามการ์ด</p>
      </div>
      <div class="g-card">
        <span class="g-tag" id="tag">พร้อมเล่น</span>
        <div class="g-emoji" id="emoji">🎲</div>
        <div class="g-prompt" id="prompt">กดปุ่มด้านล่างเพื่อเริ่ม</div>
      </div>
      <div class="g-row">
        <button class="g-btn" id="truthBtn">ความจริง</button>
        <button class="g-btn alt" id="dareBtn">ท้าให้ทำ</button>
      </div>
      <button class="g-btn ghost sm" id="randBtn">🎲 สุ่มให้เลย</button>
    </div>`;
  el = {
    tag: root.querySelector('#tag'),
    emoji: root.querySelector('#emoji'),
    prompt: root.querySelector('#prompt'),
  };
  refill('truth'); refill('dare');
  root.querySelector('#truthBtn').addEventListener('click', () => pick('truth'));
  root.querySelector('#dareBtn').addEventListener('click', () => pick('dare'));
  root.querySelector('#randBtn').addEventListener('click', () => pick(Math.random() < 0.5 ? 'truth' : 'dare'));
}

export function unmount(){ root = null; el = null; }
