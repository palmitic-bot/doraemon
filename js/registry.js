// registry.js — รายชื่อเกมทั้งหมด
// แต่ละเกม: { id, name, emoji, module }
//   module = path (relative จาก js/app.js) ของ ES module ที่ export mount(root, game) / unmount()
// เพิ่มเกมใหม่ = เพิ่ม 1 object + สร้างไฟล์ js/games/<id>.js
export const GAMES = [
  { id: 'kingscup',    name: 'Kings Cup',  emoji: '🃏', module: './games/kingscup.js' },
  { id: 'truthordare', name: 'จริง/กล้า',  emoji: '😈', module: './games/truthordare.js' },
  { id: 'mostlikely',  name: 'ใครน่าจะ',   emoji: '👉', module: './games/mostlikely.js' },
  { id: 'wheel',       name: 'วงล้อ',      emoji: '🎡', module: './games/wheel.js' },
  { id: 'picker',      name: 'สุ่มคน',      emoji: '🎯', module: './games/picker.js' },
  { id: 'pairing',     name: 'จับคู่',      emoji: '💞', module: './games/pairing.js' },
  { id: 'charades',    name: 'ใบ้คำ',       emoji: '🎭', module: './games/charades.js' },
  { id: 'crocodile',   name: 'ฟันจรเข้',    emoji: '🐊', module: './games/crocodile.js' },
];
