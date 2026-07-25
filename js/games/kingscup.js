// kingscup.js — เกม Kings Cup (จั่วไพ่ฮีโร่หน้ากากแดง 52 ใบ)
// ES module: export mount(root) / unmount()

const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

const RULES = {
  'A':  { text:'1/4 แก้ว', sub:'ดื่ม 1 จิบ' },
  '2':  { text:'2/4 แก้ว', sub:'ดื่ม 2 จิบ' },
  '3':  { text:'3/4 แก้ว', sub:'ดื่ม 3 จิบ' },
  '4':  { text:'4/4 แก้ว', sub:'หมดแก้ว!' },
  '5':  { text:'เลือกบัดดี้', sub:'บัดดี้ทำอะไรก็ต้องทำตาม' },
  '6':  { text:'คิดมินิเกม', sub:'ตั้งกิจกรรมก่อนดื่ม' },
  '7':  { text:'เกม Seven', sub:'เลขลงท้าย 7 หรือหาร 7 ลงตัว พูดว่า Seven' },
  '8':  { text:'บัตรเข้าห้องน้ำ', sub:'ขายต่อเป็นแก้วดื่มได้' },
  '9':  { text:'คนทางซ้ายดื่ม', sub:'' },
  '10': { text:'คนทางขวาดื่ม', sub:'' },
  'J':  { text:'ทำท่าให้ทำตาม', sub:'คนทำช้าสุดดื่ม' },
  'Q':  { text:'เป็นใบ้', sub:'ห้ามใครตอบคำถามคุณ' },
};
const KING_STAGES = [
  { text:'คิดเกม', sub:'ตั้งกติกาใหม่ให้ทุกคนเล่น' },
  { text:'กำหนดจำนวน', sub:'กี่ครั้ง / กี่จิบ / กี่คน' },
  { text:'กำหนดสถานที่', sub:'จะทำกติกานี้ที่ไหน' },
  { text:'ผู้ถูกเลือก', sub:'ต้องทำตามกติกาทั้งหมดที่เพิ่งตั้ง!' },
];

/* ===== ข้อมูลฮีโร่หน้ากากแดงต้นฉบับ 13 ตัว (คนละแบบต่อยศ) ===== */
const RANK_HERO = {
  'A':  { primary:'#e0435c', belt:'#1c1c22', buckle:'var(--gold)', emblemColor:'var(--gold)', antennae:2, emblem:'star' },
  '2':  { primary:'#3fae5c', belt:'#1c1c22', buckle:'#c9c9c9',      emblemColor:'#eafff1',     antennae:1, emblem:'line' },
  '3':  { primary:'#2b2b33', belt:'#7a1f2b', buckle:'#c9c9c9',      emblemColor:'#e0435c',     antennae:2, emblem:'v' },
  '4':  { primary:'#9aa5ad', belt:'#20242a', buckle:'#20242a',      emblemColor:'#20242a',     antennae:1, emblem:'bolt' },
  '5':  { primary:'#3b5bdb', belt:'#1c1c22', buckle:'var(--gold)', emblemColor:'var(--gold)', antennae:2, emblem:'diamond' },
  '6':  { primary:'#d9782d', belt:'#1c1c22', buckle:'#1c1c22',      emblemColor:'#1c1c22',     antennae:1, emblem:'v' },
  '7':  { primary:'#c81d25', belt:'#1c1c22', buckle:'var(--gold)',   emblemColor:'var(--gold)', antennae:2, emblem:'star' },
  '8':  { primary:'#6a3fa0', belt:'#1c1c22', buckle:'#c9c9c9',      emblemColor:'#eee6d8',     antennae:1, emblem:'bolt' },
  '9':  { primary:'#b5892a', belt:'#1c1c22', buckle:'#1c1c22',      emblemColor:'#1c1c22',     antennae:2, emblem:'diamond' },
  '10': { primary:'#1f9e94', belt:'#1c1c22', buckle:'var(--gold)', emblemColor:'var(--gold)', antennae:1, emblem:'line' },
  'J':  { primary:'#4a5fc1', belt:'#1c1c22', buckle:'#c9c9c9',      emblemColor:'#eee6d8',     antennae:1, emblem:'v' },
  'Q':  { primary:'#d1477a', belt:'var(--gold)', buckle:'var(--gold)', emblemColor:'var(--gold)', antennae:2, emblem:'diamond' },
  'K':  { primary:'#caa23b', belt:'#1c1c22', buckle:'#1c1c22',      emblemColor:'#1c1c22',     antennae:1, emblem:'star', crown:true, cape:true },
};

const EMBLEM_PATHS = {
  star:    (c) => `<path d="M50 96 L54 106 L64 108 L54 110 L50 120 L46 110 L36 108 L46 106 Z" fill="${c}"/>`,
  v:       (c) => `<path d="M38 100 L50 118 L62 100" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  bolt:    (c) => `<path d="M54 96 L42 112 L50 112 L46 126 L60 108 L52 108 Z" fill="${c}"/>`,
  diamond: (c) => `<path d="M50 98 L62 110 L50 122 L38 110 Z" fill="${c}"/>`,
  line:    (c) => `<rect x="38" y="105" width="24" height="6" rx="3" fill="${c}"/>`,
};

function heroBadgeSVG(rank){
  const d = RANK_HERO[rank];
  const antennaeSvg = d.antennae === 2
    ? `<line x1="40" y1="18" x2="30" y2="2" stroke="${d.primary}" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="2" r="3" fill="${d.primary}"/>
       <line x1="60" y1="18" x2="70" y2="2" stroke="${d.primary}" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="2" r="3" fill="${d.primary}"/>`
    : `<line x1="50" y1="16" x2="50" y2="0" stroke="${d.primary}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="0" r="3" fill="${d.primary}"/>`;
  const crownSvg = d.crown
    ? `<path d="M36 18 L42 8 L50 16 L58 8 L64 18 Z" fill="var(--gold)"/>`
    : '';
  const capeSvg = d.cape
    ? `<path d="M14 138 Q50 78 86 138 Z" fill="${d.primary}" opacity="0.32"/>`
    : '';
  const emblemSvg = EMBLEM_PATHS[d.emblem](d.emblemColor);

  return `<svg viewBox="0 0 100 140" class="hero-figure">
    ${capeSvg}
    <path d="M18 138 Q50 84 82 138 Z" fill="${d.primary}" opacity="0.95"/>
    <rect x="40" y="66" width="20" height="16" fill="${d.primary}" opacity="0.95"/>
    <rect x="32" y="126" width="36" height="7" rx="3.5" fill="${d.belt}"/>
    <circle cx="50" cy="129.5" r="5" fill="${d.buckle}"/>
    ${emblemSvg}
    <ellipse cx="50" cy="42" rx="26" ry="24" fill="${d.primary}"/>
    <ellipse cx="39" cy="40" rx="9" ry="11" fill="#ff3f52"/>
    <ellipse cx="61" cy="40" rx="9" ry="11" fill="#ff3f52"/>
    <path d="M32 58 Q50 66 68 58" stroke="rgba(0,0,0,0.35)" stroke-width="2" fill="none"/>
    ${antennaeSvg}
    ${crownSvg}
  </svg>`;
}

const TEMPLATE = `
  <div class="kc-topbar">
    <span class="kc-eyebrow">Kings Cup · ทีมฮีโร่หน้ากากแดง 52 ใบ</span>
    <span class="kc-counter" id="kc-counter">เหลือ 52/52</span>
  </div>

  <h1 class="kc-title">จั่วไพ่กันเถอะ 🥂</h1>
  <p class="kc-subtitle">กดปุ่มด้านล่างเพื่อสุ่มฮีโร่ 1 ใบให้ทุกคนในวง</p>

  <div class="card-arena">
    <div class="spotlight" id="kc-spotlight"></div>
    <div class="card-scene">
      <div class="card-3d" id="kc-card3d">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <div class="corner tl"><span id="kc-rankTL">A</span></div>
          <div class="card-body" id="kc-cardBody"></div>
          <div class="corner tr"><span id="kc-rankTR">A</span></div>
        </div>
      </div>
    </div>
  </div>

  <button class="draw-btn" id="kc-drawBtn">จั่วไพ่ 🂠</button>

  <div class="rule-panel" id="kc-rulePanel">
    <span class="rule-text" id="kc-ruleText">กดปุ่มด้านบนเพื่อเริ่มเกม</span>
  </div>

  <div class="history-wrap" id="kc-historyWrap" style="display:none;">
    <div class="history-label">ไพ่ที่ผ่านมา</div>
    <div class="history-strip" id="kc-historyStrip"></div>
  </div>

  <details class="full-rules">
    <summary>ดูกติกาทั้งหมด ▾</summary>
    <div class="rules-grid">
      <div><b>A</b> — 1/4 แก้ว (1 จิบ)</div>
      <div><b>2</b> — 2/4 แก้ว (2 จิบ)</div>
      <div><b>3</b> — 3/4 แก้ว (3 จิบ)</div>
      <div><b>4</b> — 4/4 แก้ว (หมดแก้ว!)</div>
      <div><b>5</b> — เลือกบัดดี้ บัดดี้ทำอะไรต้องทำตาม</div>
      <div><b>6</b> — คิดมินิเกมก่อนดื่ม</div>
      <div><b>7</b> — เกม Seven เลขลงท้าย 7 หรือหาร 7 ลงตัว พูดว่า Seven</div>
      <div><b>8</b> — บัตรผ่านเข้าห้องน้ำ (ขายต่อเป็นแก้วดื่มได้)</div>
      <div><b>9</b> — คนทางซ้ายดื่ม</div>
      <div><b>10</b> — คนทางขวาดื่ม</div>
      <div><b>J</b> — ทำท่าให้คนอื่นทำตาม ช้าสุดดื่ม</div>
      <div><b>Q</b> — เป็นใบ้ ห้ามใครตอบคุณ</div>
      <div><b>K</b> — มี 4 ใบ: ใบ1 คิดเกม / ใบ2 กำหนดจำนวน / ใบ3 กำหนดที่ / ใบ4 คนที่ถูกเลือกทำ</div>
    </div>
  </details>

  <button class="reset-link" id="kc-resetBtn">เริ่มสำรับใหม่</button>
`;

let deck = [];
let kingsDrawn = 0;
let history = [];
let animating = false;
let el = {};

function buildDeck(){
  const d = [];
  for(let copy = 0; copy < 4; copy++){
    for(const rank of RANKS){ d.push({ rank }); }
  }
  for(let i = d.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function newGame(){
  deck = buildDeck();
  kingsDrawn = 0;
  history = [];
  animating = false;
  el.historyStrip.innerHTML = '';
  el.historyWrap.style.display = 'none';
  el.card3d.classList.remove('flipped');
  el.rulePanel.classList.remove('show');
  el.ruleText.textContent = 'กดปุ่มด้านบนเพื่อเริ่มเกม';
  el.drawBtn.textContent = 'จั่วไพ่ 🂠';
  el.drawBtn.classList.remove('empty-deck');
  el.drawBtn.disabled = false;
  updateCounter();
}

function updateCounter(){
  el.counter.textContent = `เหลือ ${deck.length}/52`;
}

function ruleFor(card){
  if(card.rank === 'K'){
    kingsDrawn++;
    const stage = KING_STAGES[Math.min(kingsDrawn - 1, 3)];
    return { text: `K — ${stage.text}`, sub: stage.sub, extra: `ใบที่ ${kingsDrawn} จาก 4` };
  }
  const r = RULES[card.rank];
  return { text: `${card.rank} — ${r.text}`, sub: r.sub };
}

function pushHistory(card){
  history.unshift(card);
  if(history.length > 12) history.pop();
  el.historyWrap.style.display = 'block';
  el.historyStrip.innerHTML = '';
  for(const c of history){
    const chip = document.createElement('div');
    chip.className = 'history-chip';
    chip.style.color = RANK_HERO[c.rank].primary;
    chip.textContent = c.rank;
    el.historyStrip.appendChild(chip);
  }
}

function renderCardBody(card){
  el.cardBody.innerHTML = `
    <div class="hero-field">
      <div class="hero-half top">${heroBadgeSVG(card.rank)}</div>
      <div class="hero-half bottom">${heroBadgeSVG(card.rank)}</div>
      <div class="rank-letter">${card.rank}</div>
    </div>`;
}

function drawCard(){
  if(animating) return;
  if(deck.length === 0){ newGame(); return; }
  animating = true;
  el.drawBtn.disabled = true;

  const card = deck.pop();
  const heroColor = RANK_HERO[card.rank].primary; // เป็นค่า hex เสมอ เช่น '#e0435c'

  const hex = heroColor.replace('#','');
  const r = parseInt(hex.substring(0,2),16), g = parseInt(hex.substring(2,4),16), b = parseInt(hex.substring(4,6),16);
  el.spotlight.style.setProperty('--glow-color', `rgba(${r},${g},${b},0.35)`);

  el.rankTL.textContent = card.rank;
  el.rankTR.textContent = card.rank;
  el.rankTL.style.color = heroColor;
  el.rankTR.style.color = heroColor;

  renderCardBody(card);

  el.card3d.classList.remove('flipped');
  void el.card3d.offsetWidth;
  requestAnimationFrame(()=>{ el.card3d.classList.add('flipped'); });

  const rule = ruleFor(card);
  setTimeout(()=>{
    el.rulePanel.classList.add('show');
    el.ruleText.innerHTML = `${rule.text}`
      + (rule.sub ? `<span class="rule-sub">${rule.sub}</span>` : '')
      + (rule.extra ? `<span class="rule-sub rule-extra">${rule.extra}</span>` : '');
    pushHistory(card);
    updateCounter();

    if(deck.length === 0){
      el.drawBtn.textContent = 'หมดสำรับ! กดเพื่อเริ่มรอบใหม่ 🔄';
      el.drawBtn.classList.add('empty-deck');
    }
    el.drawBtn.disabled = false;
    animating = false;
  }, 380);
}

export function mount(root){
  root.innerHTML = TEMPLATE;
  el = {
    counter: root.querySelector('#kc-counter'),
    drawBtn: root.querySelector('#kc-drawBtn'),
    card3d: root.querySelector('#kc-card3d'),
    spotlight: root.querySelector('#kc-spotlight'),
    rulePanel: root.querySelector('#kc-rulePanel'),
    ruleText: root.querySelector('#kc-ruleText'),
    rankTL: root.querySelector('#kc-rankTL'),
    rankTR: root.querySelector('#kc-rankTR'),
    cardBody: root.querySelector('#kc-cardBody'),
    historyWrap: root.querySelector('#kc-historyWrap'),
    historyStrip: root.querySelector('#kc-historyStrip'),
    resetBtn: root.querySelector('#kc-resetBtn'),
  };
  el.drawBtn.addEventListener('click', drawCard);
  el.resetBtn.addEventListener('click', newGame);
  newGame();
}

export function unmount(){
  // DOM ถูกล้างโดย shell (stage.innerHTML='') listeners หลุดไปกับ element เดิม
  el = {};
  animating = false;
}
