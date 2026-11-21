'use strict';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- school life tiles & media (data in media/life.js) ---------- */
(() => {
  const grid = $('#bento');
  if (!grid) return;
  const tiles = Array.isArray(window.LIFE_TILES) ? window.LIFE_TILES : [];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ytId = url => {
    const s = String(url || '').trim();
    const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : /^[\w-]{11}$/.test(s) ? s : null;
  };
  const ART = {
    trees: '<svg class="art" viewBox="0 0 200 120" aria-hidden="true"><circle cx="40" cy="40" r="22" fill="#f2b85b" opacity=".9"/><path d="M0 120V90c30-20 60-25 90-10s70 10 110-15v55z" fill="#9cc5a1" opacity=".55"/><path d="M0 120v-15c40-15 80-10 120 0s60 5 80-5v20z" fill="#9cc5a1"/><g fill="#0b1a16" opacity=".6"><circle cx="150" cy="55" r="16"/><circle cx="170" cy="70" r="12"/></g></svg>',
    paint: '<svg class="art" viewBox="0 0 120 120" aria-hidden="true"><circle cx="45" cy="55" r="30" fill="#fff" opacity=".35"/><circle cx="75" cy="65" r="28" fill="#7cc6d6" opacity=".5"/><circle cx="60" cy="40" r="22" fill="#fff6"/></svg>',
    music: '<svg class="art" viewBox="0 0 120 120" aria-hidden="true"><path d="M30 90V40l50-10v50" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="24" cy="90" r="10" fill="#fff"/><circle cx="74" cy="80" r="10" fill="#fff"/></svg>',
    wood: '<svg class="art" viewBox="0 0 120 120" aria-hidden="true"><rect x="20" y="70" width="80" height="14" rx="4" fill="#fff" opacity=".7"/><path d="M40 70l10-35h20l10 35" fill="#fff" opacity=".4"/></svg>',
    sport: '<svg class="art" viewBox="0 0 120 120" aria-hidden="true"><path d="M20 80c20-30 60-30 80 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="60" cy="40" r="12" fill="#fff" opacity=".8"/></svg>',
    story: '<svg class="art" viewBox="0 0 200 120" aria-hidden="true"><path d="M20 100c30-60 60-80 90-80s50 30 70 80" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="2 10" stroke-linecap="round"/><circle cx="110" cy="20" r="8" fill="#fff"/></svg>',
  };
  const PLAY = '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>';

  grid.innerHTML = tiles.map((t, i) => {
    const m = t.media;
    const [a, b] = (t.colors || ['#2f5d4f', '#9cc5a1']).map(esc);
    let bg = '', badge = '', extra = '', label = '';
    if (m?.type === 'image') {
      const srcs = [].concat(m.src).filter(Boolean);
      bg = `<div class="tile-media slides">${srcs.map((s, j) => `<img src="${esc(s)}" alt="${esc(m.alt || t.title)}" loading="lazy"${j ? '' : ' class="on"'}>`).join('')}</div>`;
      if (srcs.length > 1) badge = `⧉ ${srcs.length} photos`;
      if (m.sample) extra = '<span class="sample-tag">Sample photo</span>';
      label = `View ${srcs.length > 1 ? 'photos' : 'photo'}: ${t.title}`;
    } else if (m?.type === 'video') {
      bg = `<div class="tile-media"><video src="${esc(m.src)}"${m.poster ? ` poster="${esc(m.poster)}"` : ''} muted loop playsinline preload="metadata"></video></div>${PLAY}`;
      badge = '▶ Video'; label = `Play video: ${t.title}`;
    } else if (m?.type === 'youtube' && ytId(m.src)) {
      bg = `<div class="tile-media"><img src="https://i.ytimg.com/vi/${ytId(m.src)}/hqdefault.jpg" alt="" loading="lazy"></div>${PLAY}`;
      badge = '▶ Watch'; label = `Watch on YouTube: ${t.title}`;
    } else if (m?.type === 'audio') {
      extra = `<audio src="${esc(m.src)}" preload="none"></audio><div class="audio-bar"><i></i></div>`;
      badge = '♪ Listen'; label = `Play audio: ${t.title}`;
    }
    return `<article class="tile${t.wide ? ' t-wide' : ''}${bg ? ' has-media' : ''} reveal" style="--a:${a};--b:${b}" data-i="${i}">
      ${bg}${bg ? '' : ART[t.art] || ''}
      ${badge ? `<span class="badge">${badge}</span>` : ''}
      <h3>${esc(t.title)}</h3><p>${esc(t.text)}</p>${extra}
      ${label ? `<button class="tile-hit" aria-label="${esc(label)}"></button>` : ''}
    </article>`;
  }).join('');

  // A missing or broken file falls back to the tile's illustration.
  grid.addEventListener('error', e => {
    const tile = e.target.closest?.('.tile');
    if (!tile || !e.target.matches('img, video')) return;
    const t = tiles[tile.dataset.i];
    console.warn('[School life] could not load', e.target.currentSrc || e.target.src);
    if (e.target.matches('.slides img') && $$('.slides img', tile).length > 1) {
      e.target.remove();
      const left = $$('.slides img', tile);
      if (!left.some(im => im.classList.contains('on'))) left[0].classList.add('on');
      const badge = $('.badge', tile);
      if (badge) badge.textContent = left.length > 1 ? `⧉ ${left.length} photos` : '';
      if (badge && left.length < 2) badge.remove();
      return;
    }
    $('.tile-media', tile)?.remove(); $('.play', tile)?.remove(); $('.badge', tile)?.remove(); $('.sample-tag', tile)?.remove(); $('.tile-hit', tile)?.remove();
    tile.classList.remove('has-media');
    tile.insertAdjacentHTML('afterbegin', ART[t.art] || '');
  }, true);

  // Slideshows crossfade; background videos play only while on screen.
  if (!reduceMotion) {
    setInterval(() => $$('.slides', grid).forEach(s => {
      const imgs = $$('img', s);
      if (imgs.length < 2) return;
      const i = imgs.findIndex(im => im.classList.contains('on'));
      imgs[i]?.classList.remove('on');
      imgs[(i + 1) % imgs.length].classList.add('on');
    }), 4000);
    const vio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause();
    }), { threshold: 0.3 });
    $$('.tile-media video', grid).forEach(v => vio.observe(v));
  }

  // Lightbox for photos, videos and YouTube.
  const lb = $('#lightbox'), body = $('#lbBody'), cap = $('#lbCap');
  const open = (html, caption, wide) => {
    body.innerHTML = html;
    body.classList.toggle('frame', !!wide);
    cap.textContent = caption;
    lb.showModal();
  };
  // The close event fires a moment later; don't wipe media that was opened since.
  lb.addEventListener('close', () => { if (!lb.open) body.innerHTML = ''; });
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  $('#lbClose').addEventListener('click', () => lb.close());

  grid.addEventListener('click', e => {
    if (!e.target.closest('.tile-hit')) return;
    const tile = e.target.closest('.tile');
    const t = tiles[tile.dataset.i], m = t.media;
    if (m.type === 'image') {
      // Use what actually loaded on the tile, so missing photos are skipped.
      const srcs = $$('.slides img', tile).map(im => im.getAttribute('src'));
      open(`<div class="strip">${srcs.map(s => `<img src="${esc(s)}" alt="${esc(m.alt || t.title)}">`).join('')}</div>`,
        t.title + (srcs.length > 1 ? ` · ${srcs.length} photos, swipe to see more` : ''));
    } else if (m.type === 'video') {
      open(`<video src="${esc(m.src)}"${m.poster ? ` poster="${esc(m.poster)}"` : ''} controls autoplay playsinline></video>`, t.title, true);
    } else if (m.type === 'youtube') {
      open(`<iframe src="https://www.youtube-nocookie.com/embed/${ytId(m.src)}?autoplay=1&rel=0" title="${esc(t.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`, t.title, true);
    } else if (m.type === 'audio') {
      const audio = $('audio', tile), badge = $('.badge', tile);
      $$('audio', grid).forEach(a => { if (a !== audio) a.pause(); });
      if (audio.paused) audio.play().catch(err => console.warn('[School life] audio', err)); else audio.pause();
      if (!audio.dataset.wired) {
        audio.dataset.wired = 1;
        const bar = $('.audio-bar i', tile);
        audio.addEventListener('timeupdate', () => { bar.style.width = (audio.currentTime / audio.duration) * 100 + '%'; });
        audio.addEventListener('play', () => { badge.textContent = '❚❚ Pause'; tile.classList.add('playing'); });
        audio.addEventListener('pause', () => { badge.textContent = '♪ Listen'; tile.classList.remove('playing'); });
        audio.addEventListener('ended', () => { bar.style.width = '0'; });
      }
    }
  });
})();

/* ---------- nav: solid on scroll, mobile menu ---------- */
const nav = $('#nav');
const burger = $('#burger');
const onScroll = () => nav.classList.toggle('solid', scrollY > 40 || nav.classList.contains('open'));
addEventListener('scroll', onScroll, { passive: true });
onScroll();
const setMenu = open => {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  onScroll();
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
$$('#links a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ---------- reveal on scroll ---------- */
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      // Stagger siblings that enter together.
      const sibs = $$('.reveal:not(.in)', e.target.parentElement);
      e.target.style.transitionDelay = Math.min(sibs.indexOf(e.target), 5) * 90 + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('in'));
}

/* ---------- fireflies ---------- */
(() => {
  const canvas = $('#fireflies');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  const hues = ['242,184,91', '156,197,161', '124,198,214', '233,138,122'];
  let w, h, dpr, flies = [], mouse = { x: -999, y: -999 }, running = true;

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (w * h) / 16000));
    flies = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.8 + .6, p: Math.random() * Math.PI * 2,
      c: hues[Math.floor(Math.random() * hues.length)],
    }));
  };

  const tick = t => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const f of flies) {
      f.vx += (Math.random() - .5) * .02; f.vy += (Math.random() - .5) * .02;
      const dx = f.x - mouse.x, dy = f.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 14000) { f.vx += dx / 2500; f.vy += dy / 2500; } // drift away from the cursor
      f.vx *= .985; f.vy *= .985;
      f.x = (f.x + f.vx + w) % w; f.y = (f.y + f.vy + h) % h;
      const a = .35 + .65 * Math.abs(Math.sin(t / 900 + f.p));
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
      g.addColorStop(0, `rgba(${f.c},${a})`);
      g.addColorStop(1, `rgba(${f.c},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(tick);
  };

  resize();
  addEventListener('resize', resize);
  canvas.parentElement.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  canvas.parentElement.addEventListener('pointerleave', () => { mouse = { x: -999, y: -999 }; });
  // Pause when the hero is off-screen.
  new IntersectionObserver(([e]) => {
    const was = running; running = e.isIntersecting;
    if (running && !was) requestAnimationFrame(tick);
  }).observe(canvas);
  requestAnimationFrame(tick);
})();

/* ---------- head · heart · hand ---------- */
(() => {
  const root = $('#hhh');
  const card = $('#hhhCard');
  const DATA = {
    head: { c: '#4fa6b8', k: 'Thinking', t: 'Head', p: 'Mathematics, sciences, history, geography and three languages (English, French and Swahili), brought alive through story and experience so understanding runs deep.' },
    heart: { c: '#d9705f', k: 'Feeling', t: 'Heart', p: 'Music, poetry, drama and painting, with a deep respect for each individual. Children learn to care for one another and for the world around them.' },
    hand: { c: '#5e9b69', k: 'Doing', t: 'Hand', p: 'Woodwork, beeswax modelling, sewing, knitting, baking, swimming and games. Capable hands build confident, resourceful people.' },
  };
  const show = k => {
    const d = DATA[k];
    root.classList.add('has-active');
    $$('.orb', root).forEach(o => o.classList.toggle('active', o.dataset.k === k));
    card.style.setProperty('--c', d.c);
    card.innerHTML = `<span class="k">${d.k}</span><h3>${d.t}</h3><p>${d.p}</p>`;
  };
  $$('.orb', root).forEach(o => {
    o.addEventListener('click', () => show(o.dataset.k));
    o.addEventListener('mouseenter', () => show(o.dataset.k));
    o.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(o.dataset.k); } });
  });
  card.style.setProperty('--c', '#5e9b69');
  card.innerHTML = '<span class="k">The whole child</span><h3>Head, heart &amp; hand</h3><p>Waldorf education balances thinking, feeling and doing, so children grow up whole, not just clever.</p>';
})();

/* ---------- admissions class finder ----------
 * Mirrors the school's published table exactly: a class cohort is born
 * 1 Sept – 31 Aug, and children born 1 Sept 2019 – 31 Aug 2020 are Class 1
 * in the 2026 intake. So the class in intake year I is I − 6 − cohortStart.
 * Kindergarten runs from 18 months to 6 years.
 */
(() => {
  const form = $('#finder');
  const out = $('#result');
  const input = $('#dob');
  const today = new Date();
  const pad = n => String(n).padStart(2, '0');
  // Local date, not UTC, so the limit is right in Nairobi time.
  input.max = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Calendar year in which the child's 1 Sept – 31 Aug birth cohort starts.
  const cohortStart = d => (d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1);
  // From mid-year on, families are applying for next year's intake.
  const nextIntake = today.getMonth() >= 6 ? today.getFullYear() + 1 : today.getFullYear();
  const fmt = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const placement = n => (n > 7 ? 'Beyond Class 7' : n >= 1 ? `Class ${n}` : 'Kindergarten');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const [y, m, d] = input.value.split('-').map(Number);
    if (!y) return;
    const dob = new Date(y, m - 1, d);
    if (dob > today) { out.innerHTML = '<p class="pop">That date is in the future. Please check the birthday.</p>'; return; }

    const S = cohortStart(dob);
    const classIn = intake => intake - 6 - S;
    const cls = classIn(nextIntake);
    const class1Intake = S + 7;
    // 18 months on, clamped so 31 Aug doesn't roll over into March.
    const kgFrom = new Date(y, m - 1 + 18, 1);
    kgFrom.setDate(Math.min(d, new Date(kgFrom.getFullYear(), kgFrom.getMonth() + 1, 0).getDate()));
    let html;

    if (cls > 7) {
      html = `<p class="big">Beyond Class 7</p><p>Our primary school runs to Class 7. Do get in touch and we’ll gladly talk through options.</p>`;
    } else if (cls >= 1) {
      html = `<p class="big">Class ${cls}</p><p>in the <strong>${nextIntake} intake</strong>.</p>`;
    } else if (kgFrom <= today) {
      html = `<p class="big">Kindergarten</p><p>Playgroup &amp; Kinder (18 months – 6 years).</p><p>Class 1 in the <strong>${class1Intake} intake</strong>.</p>`;
    } else {
      html = `<p class="big">Kindergarten from ${fmt(kgFrom)}</p><p>That’s when your little one turns 18 months.</p><p>Class 1 in the <strong>${class1Intake} intake</strong>.</p>`;
    }
    if (classIn(nextIntake - 1) <= 7) {
      const rows = [nextIntake - 1, nextIntake, nextIntake + 1, nextIntake + 2]
        .map(i => `<li${i === nextIntake ? ' class="now"' : ''}><span>${i} intake</span><b>${placement(classIn(i))}</b></li>`).join('');
      html += `<ul class="intakes">${rows}</ul>`;
    }
    out.innerHTML = `<div class="pop">${html}</div>`;
  });
})();
