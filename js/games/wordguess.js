// wordguess.js — ทายคำไทย (ทาย 6 ครั้ง: ทอง = ถูกตำแหน่ง, ชมพู = มีตัวนี้แต่ผิดตำแหน่ง)
const WORDS = [
  'ตลาด','เงาะ','กะลา','ยาดม',
  'ตาราง','มะนาว','สายลม','ขวดนม','ยางลบ','เสาไฟ','โคมไฟ','ระนาด',
  'ตะขาบ','มะขาม','กระทะ','สะพาน','สายตา',
  'ปลาทอง','กางเกง','โรงงาน','กระดาน','มะละกอ','ปลาวาฬ','ขายของ','ปลาหมอ','กระดาษ','นางงาม',
];
const ALPHA = 'กขคฆงจฉชซญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ';
const VOWELS = 'ะาเแโใไ';
const DECOYS = ['จ','ฉ','ช','ซ','ญ','ณ','ถ','ธ','ผ','ฝ','ภ','ศ','ฮ','แ','ใ'];
const RANK = { hit: 3, near: 2, off: 1 };
const MAXROW = 6;

// แป้นพิมพ์คงที่ทุกรอบ = รวมตัวอักษรที่ใช้ในคลังคำ + ตัวหลอก (เรียงตามลำดับอักษรไทย)
const KEYS = (() => {
  const set = new Set(DECOYS);
  WORDS.forEach(w => Array.from(w).forEach(ch => set.add(ch)));
  const all = [...set];
  return [
    ...all.filter(c => ALPHA.includes(c)).sort((a, b) => ALPHA.indexOf(a) - ALPHA.indexOf(b)),
    ...all.filter(c => VOWELS.includes(c)).sort((a, b) => VOWELS.indexOf(a) - VOWELS.indexOf(b)),
  ];
})();

let root, el, target = [], guesses = [], cur = [], keyState = {}, over = false;

function score(letters){
  const res = letters.map(() => 'off');
  const left = {};
  target.forEach((ch, i) => {
    if(letters[i] === ch) res[i] = 'hit';
    else left[ch] = (left[ch] || 0) + 1;
  });
  letters.forEach((ch, i) => {
    if(res[i] === 'off' && left[ch] > 0){ res[i] = 'near'; left[ch]--; }
  });
  return res;
}

function render(){
  const n = target.length;
  let html = '';
  for(let r = 0; r < MAXROW; r++){
    const g = guesses[r];
    html += `<div class="wg-row" style="grid-template-columns:repeat(${n},1fr)">`;
    for(let i = 0; i < n; i++){
      if(g) html += `<div class="wg-tile ${g.res[i]}">${g.letters[i]}</div>`;
      else if(r === guesses.length) html += `<div class="wg-tile${cur[i] ? ' filled' : ''}">${cur[i] || ''}</div>`;
      else html += '<div class="wg-tile"></div>';
    }
    html += '</div>';
  }
  el.board.innerHTML = html;
  el.keys.querySelectorAll('.wg-key[data-k]').forEach(k => {
    const s = keyState[k.dataset.k];
    k.className = 'wg-key' + (s ? ' ' + s : '');
  });
  el.left.textContent = over ? 'จบรอบ' : `เหลือ ${MAXROW - guesses.length} ครั้ง`;
}

function newWord(){
  const pool = WORDS.filter(w => w !== target.join(''));
  target = Array.from(pool[Math.floor(Math.random() * pool.length)]);
  guesses = []; cur = []; keyState = {}; over = false;
  el.len.textContent = `${target.length} ตัวอักษร`;
  el.status.textContent = 'เลือกตัวอักษรจากแป้น แล้วกด ✓ เพื่อทาย';
  render();
}

function type(ch){
  if(over || cur.length >= target.length) return;
  cur.push(ch);
  render();
}

function back(){
  if(over || cur.length === 0) return;
  cur.pop();
  render();
}

function submit(){
  if(over) return;
  if(cur.length < target.length){ el.status.textContent = `ต้องครบ ${target.length} ตัวอักษรก่อนนะ`; return; }
  const letters = [...cur];
  const res = score(letters);
  guesses.push({ letters, res });
  letters.forEach((ch, i) => {
    if(!keyState[ch] || RANK[res[i]] > RANK[keyState[ch]]) keyState[ch] = res[i];
  });
  cur = [];
  if(res.every(r => r === 'hit')){
    over = true;
    el.status.textContent = `🎉 ถูก! "${target.join('')}" ใช้ไป ${guesses.length} ครั้ง`;
  } else if(guesses.length >= MAXROW){
    over = true;
    el.status.textContent = `หมดสิทธิ์! ❌ คำตอบคือ "${target.join('')}" — ดื่ม!`;
  } else {
    el.status.textContent = 'ทองคือถูกตำแหน่ง · ชมพูคือมีตัวนี้แต่ผิดตำแหน่ง';
  }
  render();
}

export function mount(c){
  root = c; target = [];
  const keys = KEYS.map(k => `<button class="wg-key" data-k="${k}">${k}</button>`).join('');
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ทายคำไทย 📝</h1>
        <p class="g-sub">ทายคำให้ได้ใน 6 ครั้ง ทองคือถูกตำแหน่ง ชมพูคือมีตัวนี้แต่ผิดตำแหน่ง ทายไม่ออก = ดื่ม!</p>
      </div>
      <div class="g-row" style="justify-content:space-between;max-width:330px;">
        <span class="g-tag" id="len">5 ตัวอักษร</span>
        <span class="g-tag" id="left">เหลือ 6 ครั้ง</span>
      </div>
      <div class="wg-board" id="board"></div>
      <div class="wg-keys" id="keys">
        ${keys}
        <button class="wg-key wide" id="backKey">⌫ ลบ</button>
        <button class="wg-key wide" id="okKey">✓ ทาย</button>
      </div>
      <div class="g-prompt-sub" id="status">เลือกตัวอักษรจากแป้น แล้วกด ✓ เพื่อทาย</div>
      <button class="g-btn ghost sm" id="newBtn">คำใหม่ 🔄</button>
    </div>`;
  el = { board: root.querySelector('#board'), keys: root.querySelector('#keys'),
    status: root.querySelector('#status'), len: root.querySelector('#len'),
    left: root.querySelector('#left') };
  el.keys.querySelectorAll('.wg-key[data-k]').forEach(k =>
    k.addEventListener('click', () => type(k.dataset.k)));
  root.querySelector('#backKey').addEventListener('click', back);
  root.querySelector('#okKey').addEventListener('click', submit);
  root.querySelector('#newBtn').addEventListener('click', newWord);
  newWord();
}
export function unmount(){ over = true; root = null; el = null; }
