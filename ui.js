// Umumiy interfeys yordamchilari: tanlagich, hodisalar, ikonlar, toast, modal.
import { esc } from './logic.js';
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const actions = {};   // bosish: data-act="nom"
export const inputs = {};    // yozish/tanlash: data-in="nom"
export const go = h => { location.hash = h; };

const P = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  group: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M8 4v5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  money: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9v.01M18 15v.01"/>',
  chart: '<path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  logout: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  send: '<path d="M21.9 4.6 18.7 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1L6 12.3l-4.8-1.5L20.6 3z"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M4 20h16"/>',
  left: '<path d="M15 5l-7 7 7 7"/>', right: '<path d="M9 5l7 7-7 7"/>',
  bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};
export const icon = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

export function toast(msg, type = 'info') {
  const d = document.createElement('div'); d.className = 'toast ' + type; d.textContent = msg;
  $('#toasts').appendChild(d);
  setTimeout(() => { d.classList.add('out'); setTimeout(() => d.remove(), 320); }, 3200);
}
export function modal(html, wide = false) {
  const w = $('#modal');
  w.innerHTML = `<div class="backdrop" data-act="closeModal"></div><div class="sheet ${wide ? 'wide' : ''}">${html}</div>`;
  w.classList.add('open');
}
export function closeModal() { const w = $('#modal'); w.classList.remove('open'); w.innerHTML = ''; }
actions.closeModal = closeModal;

let confirmRes = null;
export function confirmBox(title, text, okLabel = 'Ha', danger = false) {
  return new Promise(res => {
    confirmRes = res;
    modal(`<h2>${esc(title)}</h2><p class="muted" style="margin:8px 0 18px">${esc(text)}</p>
      <div class="row" style="justify-content:flex-end"><button class="btn" data-act="confirmNo">Bekor qilish</button><button class="btn ${danger ? 'danger' : 'primary'}" data-act="confirmYes">${esc(okLabel)}</button></div>`);
  });
}
actions.confirmYes = () => { const r = confirmRes; confirmRes = null; closeModal(); r?.(true); };
actions.confirmNo = () => { const r = confirmRes; confirmRes = null; closeModal(); r?.(false); };

export async function copyText(text, okMsg = 'Nusxalandi') {
  try { await navigator.clipboard.writeText(text); toast(okMsg, 'ok'); }
  catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); toast(okMsg, 'ok'); } catch { toast('Nusxalab bo\'lmadi', 'bad'); } t.remove(); }
}
export function download(name, text, type = 'text/csv;charset=utf-8') {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + text], { type })); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = actions[el.dataset.act]; if (!fn) return;
  if (el.tagName === 'A' && !el.getAttribute('href')) e.preventDefault();
  Promise.resolve(fn(el, e)).catch(err => { console.error(err); toast(err.message || 'Xatolik', 'bad'); });
});
const onIn = e => { const el = e.target.closest('[data-in]'); if (!el) return; const fn = inputs[el.dataset.in]; if (fn) Promise.resolve(fn(el, e)).catch(err => toast(err.message || 'Xatolik', 'bad')); };
document.addEventListener('input', onIn); document.addEventListener('change', onIn);
