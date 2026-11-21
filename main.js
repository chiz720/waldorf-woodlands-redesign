'use strict';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
