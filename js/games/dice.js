// dice.js — ทอยลูกเต๋า (เลือก 1–5 ลูก, effect โยนจริง)
let root, el, count = 2, rolling = false, timer = null;

const PIPS = { 1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8] };

function dieHTML(v, cls){
  const on = new Set(PIPS[v]);
  let cells = '';
  for(let i = 0; i < 9; i++) cells += `<span class="pip${on.has(i) ? ' on' : ''}"></span>`;
  return `<div class="die ${cls || ''}" data-v="${v}">${cells}</div>`;
}

function renderDice(values, cls){ el.tray.innerHTML = values.map(v => dieHTML(v, cls)).join(''); }

function rand(){ return 1 + Math.floor(Math.random() * 6); }

function roll(){
  if(rolling) return;
  rolling = true;
  el.rollBtn.disabled = true;
  el.sum.textContent = '';
  let ticks = 0;
  const total = 11;
  timer = setInterval(() => {
    renderDice(Array.from({ length: count }, rand), 'tumble');
    ticks++;
    if(ticks >= total){
      clearInterval(timer); timer = null;
      const finalVals = Array.from({ length: count }, rand);
      renderDice(finalVals, 'settle');
      const s = finalVals.reduce((a, b) => a + b, 0);
      el.sum.textContent = count > 1 ? `รวม ${s} แต้ม` : `${s} แต้ม`;
      el.rollBtn.disabled = false;
      rolling = false;
    }
  }, 75);
}

function setCount(n){
  count = Math.min(5, Math.max(1, n));
  el.countVal.textContent = count;
  renderDice(Array.from({ length: count }, () => 1), '');
  el.sum.textContent = '';
}

export function mount(container){
  root = container;
  count = 2; rolling = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">ทอยลูกเต๋า 🎲</h1>
        <p class="g-sub">เลือกจำนวนลูก แล้วกดทอย</p>
      </div>
      <div class="cfg-row">
        <span class="cfg-label">🎲 จำนวนลูก</span>
        <div class="stepper">
          <button id="minus" aria-label="ลด">−</button>
          <span class="val" id="countVal">2</span>
          <button id="plus" aria-label="เพิ่ม">+</button>
        </div>
      </div>
      <div class="dice-tray" id="tray"></div>
      <div class="dice-sum" id="sum"></div>
      <button class="g-btn" id="rollBtn">ทอย! 🎲</button>
      <p class="g-note">สูงสุด 5 ลูก</p>
    </div>`;
  el = {
    tray: root.querySelector('#tray'),
    sum: root.querySelector('#sum'),
    rollBtn: root.querySelector('#rollBtn'),
    countVal: root.querySelector('#countVal'),
  };
  root.querySelector('#minus').addEventListener('click', () => { if(!rolling) setCount(count - 1); });
  root.querySelector('#plus').addEventListener('click', () => { if(!rolling) setCount(count + 1); });
  el.rollBtn.addEventListener('click', roll);
  setCount(2);
}

export function unmount(){
  if(timer){ clearInterval(timer); timer = null; }
  root = null; el = null;
}
