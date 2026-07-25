// coin.js — หัวหรือก้อย (ตัวช่วยตัดสินใจ)
let root, el, head = 0, tail = 0, flipping = false, t = null;

function flip(){
  if(flipping) return;
  flipping = true;
  el.result.textContent = '';
  el.btn.disabled = true;
  const isHead = Math.random() < 0.5;
  el.coin.classList.remove('show-h', 'show-t');
  // หมุนหลายรอบแล้วหยุดที่ผลลัพธ์
  el.coin.style.transition = 'none';
  el.coin.style.transform = 'rotateY(0deg)';
  void el.coin.offsetWidth;
  el.coin.style.transition = 'transform 1s cubic-bezier(.2,.7,.2,1)';
  const spins = 5 * 360 + (isHead ? 0 : 180);
  el.coin.style.transform = `rotateY(${spins}deg)`;
  t = setTimeout(() => {
    if(isHead) head++; else tail++;
    el.result.textContent = isHead ? '👑 ออกหัว!' : '🪙 ออกก้อย!';
    el.score.textContent = `หัว ${head} · ก้อย ${tail}`;
    el.btn.disabled = false;
    flipping = false;
  }, 1050);
}

export function mount(c){
  root = c; head = tail = 0; flipping = false;
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">หัวหรือก้อย 🪙</h1>
        <p class="g-sub">โยนเหรียญตัดสินใจ หัวหรือก้อย?</p>
      </div>
      <div class="coin-stage">
        <div class="coin" id="coin">
          <div class="coin-face coin-h">หัว<br>👑</div>
          <div class="coin-face coin-t">ก้อย<br>🪙</div>
        </div>
      </div>
      <div class="g-result" id="result" style="min-height:1.2em;">พร้อมโยน</div>
      <span class="g-tag" id="score">หัว 0 · ก้อย 0</span>
      <button class="g-btn" id="btn">โยนเหรียญ 🪙</button>
    </div>`;
  el = { coin: root.querySelector('#coin'), result: root.querySelector('#result'),
    score: root.querySelector('#score'), btn: root.querySelector('#btn') };
  el.btn.addEventListener('click', flip);
}
export function unmount(){ if(t){ clearTimeout(t); t = null; } root = null; el = null; }
