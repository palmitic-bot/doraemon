// comingsoon.js — เกม placeholder สำหรับแท็บที่ยังไม่พร้อม
export function mount(root, game) {
  const emoji = (game && game.emoji) || '🚧';
  const name = (game && game.name) || 'เร็วๆ นี้';
  root.innerHTML = `
    <div class="coming-soon">
      <div class="cs-emoji">${emoji}</div>
      <h2 class="cs-title">${name}</h2>
      <p class="cs-text">เกมนี้กำลังพัฒนา เตรียมพบกันเร็วๆ นี้ 🎉</p>
      <span class="cs-badge">Coming soon</span>
    </div>`;
}

export function unmount() {}
