// impostor.js — ใครนอกคอก (ส่งมือถือดูบทบาท ทุกคนได้คำเดียวกัน ยกเว้นสายลับ 1 คน)
const WORDS = ['แมว','พิซซ่า','ทะเล','โรงเรียน','ฟุตบอล','กาแฟ','รถไฟ','ภูเขา','ห้องน้ำ','โทรศัพท์',
  'ต้มยำ','ซูเปอร์มาร์เก็ต','สนามบิน','โรงหนัง','สวนสัตว์','ชายหาด','ตลาดนัด','ฟิตเนส'];
let root, el, players = 4, impostor = 0, word = '', cur = 0;

function renderConfig(){
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ใครนอกคอก 🕵️</h1>
        <p class="g-sub">ทุกคนได้คำเดียวกัน ยกเว้น "สายลับ" 1 คน! ผลัดกันบอกใบ้แล้วโหวตจับ</p>
      </div>
      <div class="cfg-row">
        <span class="cfg-label">👥 จำนวนผู้เล่น</span>
        <div class="stepper">
          <button data-d="-1">−</button><span class="val" id="pv">${players}</span><button data-d="1">+</button>
        </div>
      </div>
      <button class="g-btn" id="startBtn">เริ่ม 🕵️</button>
      <p class="g-note">3–10 คน · ส่งมือถือดูบทบาททีละคน</p>
    </div>`;
  const pv = root.querySelector('#pv');
  root.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => {
    players = Math.min(10, Math.max(3, players + Number(b.dataset.d))); pv.textContent = players;
  }));
  root.querySelector('#startBtn').addEventListener('click', startGame);
}

function startGame(){
  word = WORDS[Math.floor(Math.random() * WORDS.length)];
  impostor = Math.floor(Math.random() * players);
  cur = 0;
  handoff();
}

function handoff(){
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head"><h1 class="g-title">ใครนอกคอก 🕵️</h1></div>
      <div class="g-card" style="min-height:200px;">
        <div class="g-emoji">📱➡️</div>
        <div class="g-prompt">ส่งมือถือให้<br>คนที่ ${cur + 1}</div>
        <button class="g-btn" id="peek">แตะเพื่อดูบทบาท 👀</button>
      </div>
    </div>`;
  root.querySelector('#peek').addEventListener('click', reveal);
}

function reveal(){
  const isImp = cur === impostor;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head"><h1 class="g-title">คนที่ ${cur + 1}</h1></div>
      <div class="g-card ${isImp ? 'imp' : ''}" style="min-height:200px;">
        ${isImp
          ? `<div class="g-emoji">🤫</div><div class="g-result" style="color:var(--pink)">คุณคือสายลับ!</div><div class="g-prompt-sub">เนียนไว้ อย่าให้จับได้ แล้วเดาคำให้ออก</div>`
          : `<div class="g-prompt-sub">คำของคุณคือ</div><div class="g-result">${word}</div><div class="g-prompt-sub">อย่าพูดตรงๆ ให้ใบ้เบาๆ</div>`}
      </div>
      <button class="g-btn" id="hide">ซ่อน & ส่งต่อ 🔒</button>
    </div>`;
  root.querySelector('#hide').addEventListener('click', () => {
    cur++;
    if(cur < players) handoff();
    else discuss();
  });
}

function discuss(){
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head"><h1 class="g-title">คุยกันหาสายลับ! 🗣️</h1>
        <p class="g-sub">ผลัดกันพูดใบ้คำของตัวเอง แล้วโหวตว่าใครคือสายลับ</p></div>
      <div class="g-card"><div class="g-emoji">🕵️</div><div class="g-prompt">พร้อมโหวตแล้วกดเฉลย</div></div>
      <button class="g-btn" id="revealBtn">เฉลย 👁️</button>
      <button class="g-btn ghost sm" id="againBtn">เล่นใหม่</button>
    </div>`;
  root.querySelector('#revealBtn').addEventListener('click', () => {
    root.innerHTML = `
      <div class="g-wrap">
        <div class="g-head"><h1 class="g-title">เฉลย 👁️</h1></div>
        <div class="g-card imp" style="min-height:180px;">
          <div class="g-emoji">🤫</div>
          <div class="g-result" style="color:var(--pink)">สายลับคือ คนที่ ${impostor + 1}</div>
          <div class="g-prompt-sub">คำจริงคือ "${word}" — จับถูกไหม?</div>
        </div>
        <button class="g-btn" id="againBtn2">เล่นอีกรอบ 🔄</button>
      </div>`;
    root.querySelector('#againBtn2').addEventListener('click', renderConfig);
  });
  root.querySelector('#againBtn').addEventListener('click', renderConfig);
}

export function mount(c){ root = c; renderConfig(); }
export function unmount(){ root = null; el = null; }
