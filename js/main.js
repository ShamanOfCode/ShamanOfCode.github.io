/* =========================================================
   Evgeniy Markov — Interaktionen & Animationen
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad2 = (n) => String(n).padStart(2, '0');

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const PHOTOS = window.PHOTOS || [];
  const SERIES = window.SERIES || [];

  let vw = innerWidth;
  let vh = innerHeight;

  /* ---------------------------------------------------------
     Aufbau aus den Daten
     --------------------------------------------------------- */
  // Breite/Höhe mitgeben: reserviert den Platz, bevor das Bild vom
  // Unsplash-CDN da ist – sonst springt das Masonry-Raster beim Laden.
  const imgTag = (p, lazy = true) =>
    `<img src="${p.src}" alt="${p.alt || p.title}" width="${p.w || ''}" height="${p.h || ''}"
       draggable="false" decoding="async"${lazy ? ' loading="lazy"' : ''} />`;

  // Durchschnittsfarbe des Fotos als Platzhalter, solange es lädt
  const phStyle = (p) => (p.color ? ` style="background:${p.color}"` : '');

  // Hero: schwebende Bilder
  const FLOAT_LAYOUT = [
    { l: 5,  t: 13, w: 14, r: '3/4', d: 0.7 },
    { l: 71, t: 9,  w: 17, r: '4/5', d: 1.2 },
    { l: 41, t: 17, w: 10, r: '1/1', d: 0.35 },
    { l: 84, t: 50, w: 12, r: '3/4', d: 0.9 },
    { l: 24, t: 44, w: 11, r: '4/5', d: 1.5 },
    { l: 57, t: 52, w: 14, r: '3/2', d: 0.55 },
  ];
  const heroFloats = $('#heroFloats');
  heroFloats.innerHTML = FLOAT_LAYOUT.map((f, i) => {
    const p = PHOTOS[i % PHOTOS.length];
    return `<div class="float" style="left:${f.l}%;top:${f.t}%;--w:${f.w};--r:${f.r};--i:${i}" data-depth="${f.d}">
      <div class="ph"${phStyle(p)}>${imgTag(p, false)}</div></div>`;
  }).join('');
  const floats = $$('.float', heroFloats);

  // Serien-Karten
  const seriesTrack = $('#seriesTrack');
  seriesTrack.innerHTML =
    SERIES.map((s, i) => `
      <article class="card" data-index="${i}">
        <span class="card__num">(${pad2(i + 1)})</span>
        <div class="ph" data-cursor="view" data-count="${s.count} Bilder"${phStyle(s)}>${imgTag(s)}</div>
        <div class="card__info">
          <h3 class="card__title">${s.title}</h3>
          <span class="card__sub">${s.sub}</span>
        </div>
      </article>`).join('') +
    `<div class="series__end"><p>Jede Serie<br/>erzählt eine<br/>Geschichte.<br/><a href="#arbeiten" class="ulink">Alle Arbeiten ↓</a></p></div>`;
  $('#seriesTotal').textContent = pad2(SERIES.length);

  // Galerie
  const grid = $('#grid');
  grid.innerHTML = PHOTOS.map((p, i) => `
    <figure class="item" data-cat="${p.category}" data-index="${i}" style="--d:${(i % 3) * 120}ms">
      <div class="ph" data-cursor="view"${phStyle(p)}>
        ${imgTag(p)}
        <span class="item__idx">(${pad2(i + 1)})</span>
      </div>
      <figcaption class="item__cap"><span class="t">${p.title}</span><span class="m">${p.place} — ${p.year}</span></figcaption>
    </figure>`).join('');
  const items = $$('.item', grid);

  // About-Bild
  $('#aboutImg').src = window.ABOUT_IMAGE || (PHOTOS[0] && PHOTOS[0].src);

  // Jahr & Uhr
  $('#year').textContent = new Date().getFullYear();
  const clock = $('#clock');
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }).format(new Date());
  };
  tick(); setInterval(tick, 15000);

  /* ---------------------------------------------------------
     Split-Text (Buchstaben einzeln animieren)
     --------------------------------------------------------- */
  $$('[data-split]').forEach((el, lineIdx) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...child.textContent].forEach((ch) => {
            const outer = document.createElement('span');
            outer.className = 'char';
            const inner = document.createElement('span');
            inner.textContent = ch === ' ' ? ' ' : ch;
            inner.style.setProperty('--i', i++);
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
    // Hero startet nach dem Loader, Zeilen leicht versetzt
    if (el.closest('.hero')) el.style.setProperty('--d', `${1050 + lineIdx * 140}ms`);
    else el.style.setProperty('--d', `${lineIdx % 2 ? 120 : 0}ms`);
  });

  // About-Text in Wörter zerlegen (Scroll-Highlight)
  const aboutText = $('#aboutText');
  const EMPH = ['Licht,', 'Moment,', 'ehrlich', 'Geschichten,'];
  const aboutRaw = aboutText.textContent.trim();
  if (aboutRaw) {
    aboutText.innerHTML = aboutRaw.split(/\s+/)
      .map((w) => `<span class="w${EMPH.includes(w) ? ' em' : ''}">${w}</span>`).join(' ');
  }
  const words = $$('.w', aboutText);

  /* ---------------------------------------------------------
     Smooth Scroll (Lenis, falls geladen)
     --------------------------------------------------------- */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.stop();
  }
  const goTo = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.8 });
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
  };
  /* ---------------------------------------------------------
     Mobiles Menü (Burger) – ab 720px Breite abwärts
     --------------------------------------------------------- */
  const navToggle = $('#navToggle');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    if (lenis) (open ? lenis.stop() : lenis.start());
    else document.body.style.overflow = open ? 'hidden' : '';
  };
  const menuOpen = () => document.body.classList.contains('menu-open');
  navToggle.addEventListener('click', () => setMenu(!menuOpen()));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen()) setMenu(false); });
  // Beim Drehen ins Querformat nicht im offenen Menü hängen bleiben
  addEventListener('resize', () => { if (menuOpen() && innerWidth > 720) setMenu(false); });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (menuOpen()) setMenu(false); // Menü zu, bevor gescrollt wird
    goTo(target);
  });

  /* ---------------------------------------------------------
     Loader
     --------------------------------------------------------- */
  const loaderCount = $('#loaderCount');
  const loaderBar = $('#loaderBar');
  const preload = [...$$('img', heroFloats).map((i) => i.src)];
  let loaded = 0;
  let shown = 0;
  let done = false;
  const started = performance.now();
  const MIN_TIME = reduceMotion ? 0 : 1600;

  preload.forEach((src) => {
    const im = new Image();
    im.onload = im.onerror = () => { loaded++; };
    im.src = src;
  });
  const failsafe = setTimeout(() => { loaded = preload.length; }, 7000);

  const loaderStep = () => {
    const elapsed = performance.now() - started;
    const real = preload.length ? loaded / preload.length : 1;
    const timeCap = MIN_TIME ? clamp(elapsed / MIN_TIME) : 1;
    const target = Math.min(real, timeCap) * 100;
    shown = lerp(shown, target, 0.12);
    if (target >= 100 && shown > 99.4) shown = 100;
    loaderCount.textContent = Math.round(shown);
    loaderBar.style.width = shown + '%';
    if (shown >= 100 && !done) {
      done = true;
      clearTimeout(failsafe);
      setTimeout(finishLoading, 250);
      return;
    }
    requestAnimationFrame(loaderStep);
  };
  requestAnimationFrame(loaderStep);

  function finishLoading() {
    document.body.classList.add('is-loaded');
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      if (lenis) lenis.start();
      measure();
    }, 900);
    startFlipbook();
  }

  // Ein Hero-Bild blättert durch deine Fotos
  function startFlipbook() {
    if (reduceMotion || PHOTOS.length < 3) return;
    const img = $('img', floats[2]);
    let n = 2;
    setTimeout(function next() {
      n = (n + 1) % PHOTOS.length;
      const pre = new Image();
      pre.onload = () => { img.src = pre.src; setTimeout(next, 900); };
      pre.onerror = () => setTimeout(next, 900);
      pre.src = PHOTOS[n].src;
    }, 3200);
  }

  /* ---------------------------------------------------------
     Reveal beim Scrollen
     --------------------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
      // Nur hochzählen, wo eine echte Zahl hinterlegt ist – Platzhalter "00" bleibt stehen
      const num = en.target.classList.contains('stat') && $('.stat__num', en.target);
      if (num && num.dataset.count) countUp(num);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  $$('[data-reveal], [data-split-scroll], .item').forEach((el) => io.observe(el));

  function countUp(el) {
    const to = +el.dataset.count;
    const dur = 1600;
    const t0 = performance.now();
    const step = (t) => {
      const p = clamp((t - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------
     Messen (bei Resize)
     --------------------------------------------------------- */
  const series = $('#serien');
  const seriesIndex = $('#seriesIndex');
  const cards = $$('.card', seriesTrack);
  const cardImgs = cards.map((c) => $('img', c));
  const marquee = $('#marquee');
  const progress = $('#progress');
  const parallax = $$('[data-speed]');
  const heroContent = $('.hero__content');

  let trackDist = 0;
  let marqueeW = 0;

  function measure() {
    vw = innerWidth;
    vh = innerHeight;
    trackDist = Math.max(0, seriesTrack.scrollWidth - vw);
    series.style.height = `${trackDist + vh}px`;
    marqueeW = marquee.children[0].offsetWidth;
    if (lenis) lenis.resize();
  }
  measure();
  addEventListener('resize', measure);
  addEventListener('load', measure);

  /* ---------------------------------------------------------
     Maus
     --------------------------------------------------------- */
  const mouse = { x: vw / 2, y: vh / 2, nx: 0, ny: 0 };
  const ring = { x: mouse.x, y: mouse.y };
  const floatPos = floats.map(() => ({ x: 0, y: 0 }));

  addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = e.clientX / vw - 0.5;
    mouse.ny = e.clientY / vh - 0.5;
  }, { passive: true });

  // Custom Cursor Zustände
  const cursor = $('.cursor');
  const dot = $('.cursor__dot');
  const ringEl = $('.cursor__ring');
  if (finePointer) {
    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      cursor.classList.toggle('is-view', !!t.closest('[data-cursor="view"]'));
      cursor.classList.toggle('is-hide', !!t.closest('[data-cursor="hide"]'));
      cursor.classList.toggle('is-link', !t.closest('[data-cursor]') && !!t.closest('a, button'));
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = 0; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = 1; });
  }

  // Magnetische Elemente
  if (finePointer && !reduceMotion) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     Haupt-Loop
     --------------------------------------------------------- */
  let lastY = scrollY;
  let velocity = 0;
  let marqueeX = 0;
  let marqueeDir = -1;

  function frame(t) {
    if (lenis) lenis.raf(t);

    const y = scrollY;
    const rawVel = y - lastY;
    lastY = y;
    velocity = lerp(velocity, rawVel, 0.12);
    if (Math.abs(rawVel) > 0.5) marqueeDir = rawVel > 0 ? -1 : 1;

    // Cursor
    if (finePointer) {
      ring.x = lerp(ring.x, mouse.x, 0.16);
      ring.y = lerp(ring.y, mouse.y, 0.16);
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
    }

    // Fortschritt
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (!reduceMotion) {
      // Hero: Maus-Parallax + Scroll
      if (y < vh * 1.2) {
        floats.forEach((f, i) => {
          const d = +f.dataset.depth;
          floatPos[i].x = lerp(floatPos[i].x, mouse.nx * 60 * d, 0.06);
          floatPos[i].y = lerp(floatPos[i].y, mouse.ny * 40 * d, 0.06);
          f.style.transform = `translate3d(${floatPos[i].x}px, ${floatPos[i].y - y * d * 0.35}px, 0)`;
        });
        heroContent.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
        heroContent.style.opacity = 1 - clamp(y / (vh * 0.9));
      }

      // Marquee (Richtung folgt dem Scroll, schneller bei schnellem Scroll)
      if (marqueeW) {
        marqueeX += marqueeDir * (1.1 + Math.abs(velocity) * 0.35);
        if (marqueeX <= -marqueeW) marqueeX += marqueeW;
        if (marqueeX > 0) marqueeX -= marqueeW;
        marquee.style.transform = `translate3d(${marqueeX}px, 0, 0) skewX(${clamp(velocity * -0.25, -12, 12)}deg)`;
      }

      // Parallax
      parallax.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const c = r.top + r.height / 2 - vh / 2;
        el.firstElementChild.style.transform = `translate3d(0, ${c * +el.dataset.speed}px, 0)`;
      });
    }

    // Serien: vertikaler Scroll → horizontale Bewegung
    const sr = series.getBoundingClientRect();
    if (sr.top < vh && sr.bottom > 0) {
      const p = trackDist ? clamp(-sr.top / (sr.height - vh)) : 0;
      seriesTrack.style.transform = `translate3d(${-p * trackDist}px, 0, 0)`;
      seriesIndex.textContent = pad2(Math.min(SERIES.length, Math.round(p * (SERIES.length - 1)) + 1));
      if (!reduceMotion) {
        cards.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const off = (r.left + r.width / 2 - vw / 2) / vw;
          cardImgs[i].style.transform = `translate3d(${off * -60}px, 0, 0) scale(1.05)`;
        });
      }
    }

    // About: Wörter nacheinander aufleuchten
    const ar = aboutText.getBoundingClientRect();
    if (ar.top < vh && ar.bottom > 0) {
      const p = clamp((vh * 0.85 - ar.top) / (ar.height + vh * 0.35));
      const on = Math.floor(p * words.length * 1.05);
      words.forEach((w, i) => w.classList.toggle('is-on', i < on));
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------------------------------------------------------
     Galerie-Filter
     --------------------------------------------------------- */
  const filterBtns = $$('.filter');
  const galleryTitle = $('#galleryTitle');
  const titleA = $('#galleryTitleA');
  const titleB = $('#galleryTitleB');
  const gridEmpty = $('#gridEmpty');

  // Überschrift links folgt dem gewählten Filter ("Alle Arbeiten" -> "Street Fotografie")
  function swapTitle(btn) {
    const [a, b] = (btn.dataset.title || 'Alle|Arbeiten').split('|');
    galleryTitle.classList.add('is-swapping');
    setTimeout(() => {
      titleA.textContent = a;
      titleB.textContent = b;
      galleryTitle.classList.remove('is-swapping');
    }, 300);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      const f = btn.dataset.filter;
      swapTitle(btn);
      items.forEach((it) => it.classList.add('is-fading'));
      setTimeout(() => {
        items.forEach((it) => it.classList.toggle('is-hidden', f !== 'all' && it.dataset.cat !== f));
        // Abteilung noch ohne Bilder? Dann Hinweis statt leerem Raster.
        gridEmpty.hidden = items.some((it) => !it.classList.contains('is-hidden'));
        void grid.offsetWidth;
        requestAnimationFrame(() => items.forEach((it) => it.classList.remove('is-fading')));
        measure();
      }, 450);
    });
  });

  /* ---------------------------------------------------------
     Lightbox
     --------------------------------------------------------- */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbTitle = $('#lbTitle');
  const lbMeta = $('#lbMeta');
  const lbCount = $('#lbCount');
  const lbLink = $('#lbLink');
  let lbList = [];
  let lbIndex = 0;

  function lbShow(i, instant) {
    lbIndex = (i + lbList.length) % lbList.length;
    const p = lbList[lbIndex];
    const apply = () => {
      lbImg.src = p.full || p.src;
      lbImg.alt = p.alt || p.title;
      lbTitle.textContent = p.title;
      lbMeta.textContent = p.meta;
      lbCount.textContent = `${pad2(lbIndex + 1)} / ${pad2(lbList.length)}`;
      // Download zählt nur auf unsplash.com – darum immer dorthin verlinken
      if (lbLink) {
        lbLink.href = p.link || window.UNSPLASH_PROFILE || '#';
        lbLink.hidden = !p.link;
      }
    };
    if (instant) { apply(); return; }
    lb.classList.add('is-switching');
    setTimeout(() => {
      apply();
      const off = () => lb.classList.remove('is-switching');
      if (lbImg.complete) requestAnimationFrame(off); else lbImg.onload = lbImg.onerror = off;
    }, 250);
  }
  function lbOpen(list, i) {
    lbList = list;
    lbShow(i, true);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
  }
  function lbClose() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start(); else document.body.style.overflow = '';
  }

  grid.addEventListener('click', (e) => {
    const it = e.target.closest('.item');
    if (!it) return;
    const visible = items.filter((x) => !x.classList.contains('is-hidden'));
    const list = visible.map((x) => {
      const p = PHOTOS[+x.dataset.index];
      return { ...p, meta: `${p.place} — ${p.year}` };
    });
    lbOpen(list, visible.indexOf(it));
  });
  seriesTrack.addEventListener('click', (e) => {
    const c = e.target.closest('.card');
    if (!c) return;
    lbOpen(SERIES.map((s) => ({ ...s, meta: s.sub })), +c.dataset.index);
  });

  $('#lbClose').addEventListener('click', lbClose);
  $('#lbPrev').addEventListener('click', () => lbShow(lbIndex - 1));
  $('#lbNext').addEventListener('click', () => lbShow(lbIndex + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) lbClose(); });
  addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
  });
  // Wischen auf dem Handy
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  });
})();
