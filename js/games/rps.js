// rps.js — เป่ายิงฉุบ (สู้กับเครื่อง)
const M = [{ k:'rock', e:'✊', n:'ค้อน' }, { k:'paper', e:'✋', n:'กระดาษ' }, { k:'scissors', e:'✌️', n:'กรรไกร' }];
const BEAT = { rock:'scissors', paper:'rock', scissors:'paper' };
let root, el, win = 0, lose = 0, draw = 0, spin = null, busy = false;

function reveal(k){
  const you = M.find(m => m.k === k);
  const cpu = M[Math.floor(Math.random() * 3)];
  el.you.textContent = you.e;
  el.cpu.textContent = cpu.e;
  let res;
  if(you.k === cpu.k){ res = 'เสมอ 🤝'; draw++; }
  else if(BEAT[you.k] === cpu.k){ res = 'คุณชนะ! 🎉'; win++; }
  else { res = 'คุณแพ้ ดื่ม! 😝'; lose++; }
  el.res.textContent = res;
  el.score.textContent = `ชนะ ${win} · แพ้ ${lose} · เสมอ ${draw}`;
}

function play(k){
  if(busy) return;
  busy = true;
  el.res.textContent = '3.. 2.. 1..';
  el.you.textContent = '🤜';
  let n = 0;
  spin = setInterval(() => { el.cpu.textContent = M[n % 3].e; n++; }, 90);
  setTimeout(() => { clearInterval(spin); spin = null; reveal(k); busy = false; }, 650);
}

export function mount(c){
  root = c; win = lose = draw = 0; busy = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">เป่ายิงฉุบ ✊</h1>
        <p class="g-sub">เลือกมือของคุณ สู้กับเครื่อง แพ้แล้วดื่ม!</p>
      </div>
      <div class="g-card">
        <div class="rps-face"><span id="you">🤜</span><span class="rps-vs">VS</span><span id="cpu">🤛</span></div>
        <div class="g-result" id="res" style="font-size:clamp(20px,6vw,26px);">เลือกมือด้านล่าง</div>
        <span class="g-tag" id="score">ชนะ 0 · แพ้ 0 · เสมอ 0</span>
      </div>
      <div class="g-row">
        <button class="g-btn" data-k="rock">✊</button>
        <button class="g-btn" data-k="paper">✋</button>
        <button class="g-btn" data-k="scissors">✌️</button>
      </div>
    </div>`;
  el = { you: root.querySelector('#you'), cpu: root.querySelector('#cpu'),
    res: root.querySelector('#res'), score: root.querySelector('#score') };
  root.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => play(b.dataset.k)));
}
export function unmount(){ if(spin){ clearInterval(spin); spin = null; } root = null; el = null; }
