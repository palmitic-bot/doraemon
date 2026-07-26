// slot.js — สล็อต (หมุน 3 วง ตรง 3 ตัว = แจ็กพอต ไม่ตรง = ดื่ม)
const SYM = ['🍒','🍋','🔔','⭐','7️⃣','🍉','💎'];
let root, el, spinning = false, timers = [];

function clearTimers(){ timers.forEach(t => clearInterval(t)); timers.forEach(t => clearTimeout(t)); timers = []; }

function spin(){
  if(spinning) return;
  spinning = true;
  el.result.textContent = '';
  el.btn.disabled = true;
  const finals = [SYM[Math.floor(Math.random() * SYM.length)], SYM[Math.floor(Math.random() * SYM.length)], SYM[Math.floor(Math.random() * SYM.length)]];
  el.reels.forEach((reel, idx) => {
    reel.classList.add('spinning');
    const iv = setInterval(() => { reel.textContent = SYM[Math.floor(Math.random() * SYM.length)]; }, 70);
    timers.push(iv);
    const stop = setTimeout(() => {
      clearInterval(iv);
      reel.textContent = finals[idx];
      reel.classList.remove('spinning');
      if(idx === 2){
        const win = finals[0] === finals[1] && finals[1] === finals[2];
        const twoPair = finals[0] === finals[1] || finals[1] === finals[2] || finals[0] === finals[2];
        el.result.innerHTML = win ? '<span class="g-result">🎉 แจ็กพอต!</span> ทุกคนที่เหลือดื่ม!'
          : twoPair ? 'เกือบแล้ว! ได้ 2 ตัว 😆' : 'ไม่ตรง — คนหมุนดื่ม! 🍺';
        el.btn.disabled = false;
        el.btn.textContent = 'หมุนอีก 🎰';
        spinning = false;
      }
    }, 700 + idx * 450);
    timers.push(stop);
  });
}

export function mount(c){
  root = c; spinning = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">สล็อต 🎰</h1>
        <p class="g-sub">หมุนให้ได้ 3 ตัวเหมือนกัน = แจ็กพอต! ไม่ตรง = คนหมุนดื่ม</p>
      </div>
      <div class="slot-box">
        <div class="slot-reel" id="r0">🍒</div>
        <div class="slot-reel" id="r1">🍋</div>
        <div class="slot-reel" id="r2">🔔</div>
      </div>
      <div id="result" style="min-height:1.5em;"></div>
      <button class="g-btn" id="btn">หมุน! 🎰</button>
    </div>`;
  el = { reels: [root.querySelector('#r0'), root.querySelector('#r1'), root.querySelector('#r2')],
    result: root.querySelector('#result'), btn: root.querySelector('#btn') };
  el.btn.addEventListener('click', spin);
}
export function unmount(){ clearTimers(); spinning = false; root = null; el = null; }
