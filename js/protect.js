/* =========================================================
   Bildschutz
   Erschwert das einfache Kopieren/Speichern der Fotos.
   Hinweis: 100 % Schutz gibt es im Web nicht (Screenshots,
   Netzwerk-Tab). Das hier hält aber Gelegenheits-Diebe ab.
   ========================================================= */
(function () {
  'use strict';

  var toastTimer;
  function notify() {
    var t = document.getElementById('toast');
    if (!t) return;
    t.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-visible'); }, 1800);
  }

  function block(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  // 1) Rechtsklick / Kontextmenü (auch langes Drücken auf Android)
  document.addEventListener('contextmenu', function (e) { block(e); notify(); }, true);

  // 2) Bilder ziehen (Drag & Drop auf Desktop)
  document.addEventListener('dragstart', block, true);
  document.addEventListener('drop', block, true);

  // 3) Markieren & Kopieren
  document.addEventListener('selectstart', function (e) {
    var el = e.target;
    if (el && el.closest && el.closest('input, textarea, [contenteditable="true"]')) return;
    block(e);
  }, true);
  document.addEventListener('copy', function (e) { block(e); notify(); }, true);
  document.addEventListener('cut', block, true);

  // 4) Tastenkürzel: Speichern, Quelltext, Drucken, DevTools
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    var mod = e.ctrlKey || e.metaKey;

    var blocked =
      k === 'f12' ||
      (mod && ['s', 'u', 'p', 'c', 'a'].indexOf(k) !== -1) ||           // Speichern, Quelltext, Drucken, Kopieren, Alles markieren
      (mod && e.shiftKey && ['i', 'j', 'c', 'k'].indexOf(k) !== -1) ||  // DevTools (Win/Linux)
      (e.metaKey && e.altKey && ['i', 'j', 'c', 'u'].indexOf(k) !== -1); // DevTools / Quelltext (Mac)

    if (blocked) { block(e); notify(); }
  }, true);

  // 5) Drucken: Bilder im Druck ausblenden (falls Menü-Drucken genutzt wird)
  var style = document.createElement('style');
  style.textContent =
    '@media print{img,.ph{visibility:hidden!important}body::after{content:"© Evgeniy Markov – Drucken nicht erlaubt.";visibility:visible;position:fixed;inset:0;display:grid;place-items:center;font:20px sans-serif;color:#000}}';
  document.head.appendChild(style);

  // 6) Alle Bilder: draggable aus, auch für später nachgeladene
  function harden(root) {
    (root.querySelectorAll ? root.querySelectorAll('img') : []).forEach(function (img) {
      img.setAttribute('draggable', 'false');
      img.addEventListener('mousedown', block);
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    harden(document);
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'IMG') harden(n.parentNode || document);
          else harden(n);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  });

  // 7) Freundlicher Hinweis in der Konsole
  try {
    console.log('%c© Evgeniy Markov', 'font:600 22px sans-serif;color:#ff5a1f');
    console.log('%cAlle Fotos sind urheberrechtlich geschützt. Für Lizenzanfragen bitte Kontakt aufnehmen.', 'font:14px sans-serif');
  } catch (_) {}
})();
