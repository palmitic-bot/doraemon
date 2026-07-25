// reaction.js — วัดปฏิกิริยา (รอเขียวแล้วแตะให้ไว ช้าสุดดื่ม)
let root, el, state = 'idle', tGreen = null, startAt = 0;

function clearT(){ if(tGreen){ clearTimeout(tGreen); tGreen = null; } }

function setPad(cls, big, small){
  el.pad.className = 'react-pad ' + cls;
  el.big.textContent = big;
  el.small.textContent = small || '';
}

function arm(){
  clearT();
  state = 'waiting';
  setPad('wait', 'รอ…', 'อย่าเพิ่งแตะ! รอจนเป็นสีเขียว');
  const delay = 1500 + Math.random() * 3500;
  tGreen = setTimeout(() => {
    state = 'go';
    startAt = performance.now();
    setPad('go', 'แตะเลย!', '');
  }, delay);
}

function tap(){
  if(state === 'idle' || state === 'result'){ arm(); return; }
  if(state === 'waiting'){
    clearT(); state = 'result';
    setPad('early', 'เร็วไป! 😅', 'แตะก่อนไฟเขียว — แตะเพื่อลองใหม่');
    return;
  }
  if(state === 'go'){
    const ms = Math.round(performance.now() - startAt);
    state = 'result';
    const rate = ms < 250 ? 'ไวมาก! ⚡' : ms < 350 ? 'ดีเยี่ยม' : ms < 500 ? 'ใช้ได้' : 'ช้าไปหน่อย 🐢';
    setPad('done', ms + ' ms', rate + ' — แตะเพื่อเล่นใหม่');
  }
}

export function mount(c){
  root = c; state = 'idle';
  root.innerHTML = `
    <div class="g-wrap">
      <div class="g-head">
        <h1 class="g-title">วัดปฏิกิริยา ⚡</h1>
        <p class="g-sub">รอจนจอเป็นสีเขียวแล้วแตะให้ไวที่สุด — ช้าสุดในวงดื่ม!</p>
      </div>
      <div class="react-pad idle" id="pad">
        <div class="react-big" id="big">แตะเพื่อเริ่ม</div>
        <div class="react-small" id="small">ผลัดกันวัด แล้วเทียบว่าใครช้าสุด</div>
      </div>
    </div>`;
  el = { pad: root.querySelector('#pad'), big: root.querySelector('#big'), small: root.querySelector('#small') };
  el.pad.addEventListener('click', tap);
}
export function unmount(){ clearT(); root = null; el = null; }
