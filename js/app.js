// app.js — shell controller: สร้าง tab bar จาก registry, สลับเกม, โหลด module ตอนกดแท็บ
import { GAMES } from './registry.js';

const stage = document.getElementById('stage');
const tabbar = document.getElementById('tabbar');
const gameName = document.getElementById('gameName');

let current = null;      // { id, mod }
let switching = false;

function buildTabs() {
  GAMES.forEach((game) => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.type = 'button';
    btn.dataset.id = game.id;
    btn.setAttribute('aria-label', game.name);
    btn.innerHTML =
      `<span class="tab-emoji">${game.emoji}</span>` +
      `<span class="tab-name">${game.name}</span>`;
    btn.addEventListener('click', () => selectGame(game.id));
    tabbar.appendChild(btn);
  });
}

function setActiveTab(id) {
  tabbar.querySelectorAll('.tab').forEach((t) => {
    const on = t.dataset.id === id;
    t.classList.toggle('active', on);
    t.setAttribute('aria-current', on ? 'page' : 'false');
  });
}

async function selectGame(id) {
  if (switching) return;
  if (current && current.id === id) return;
  const game = GAMES.find((g) => g.id === id);
  if (!game) return;

  switching = true;

  // ปิดเกมเดิม
  if (current && current.mod && typeof current.mod.unmount === 'function') {
    try { current.mod.unmount(); } catch (e) { console.error('unmount error', e); }
  }
  current = null;
  stage.innerHTML = '';
  stage.scrollTop = 0;

  setActiveTab(id);
  gameName.textContent = game.name;

  // โหลด + เปิดเกมใหม่
  try {
    const mod = await import(game.module);
    if (typeof mod.mount !== 'function') {
      throw new Error(`เกม "${game.id}" ไม่มีฟังก์ชัน mount()`);
    }
    mod.mount(stage, game);
    current = { id, mod };
  } catch (err) {
    console.error('load game error', err);
    stage.innerHTML =
      `<div class="stage-error">โหลดเกมไม่สำเร็จ 😢<br><small>${err.message}</small></div>`;
  } finally {
    switching = false;
  }
}

buildTabs();
selectGame(GAMES[0].id);
