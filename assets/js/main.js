const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const svgNS = 'http://www.w3.org/2000/svg';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/* ---------- local clock in the top bar ---------- */
function tick() {
  const d = new Date();
  document.getElementById('clock').textContent = d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: false });
}
tick(); setInterval(tick, 15000);

/* ---------- split-flap text ---------- */
function flapTo(el, target, delay = 0) {
  if (reduceMotion) { el.textContent = target; return; }
  let n = 0;
  const spins = 6 + Math.floor(Math.random() * 8);
  setTimeout(function step() {
    el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip');
    if (n++ >= spins) { el.textContent = target; return; }
    el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
    setTimeout(step, 55);
  }, delay);
}
document.querySelectorAll('.flap-line').forEach((line, li) => {
  let i = 0;
  line.dataset.text.split(' ').forEach((word) => {
    const w = document.createElement('span');
    w.className = 'flap-word';
    line.appendChild(w);
    [...word].forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'flap';
      s.setAttribute('aria-hidden', 'true');
      w.appendChild(s);
      flapTo(s, ch, 200 + li * 260 + (i++) * 45);
    });
  });
});
function fillFlapCells(root) {
  root.querySelectorAll('.flapcell').forEach((cell, ci) => {
    if (cell.dataset.done) return;
    cell.dataset.done = '1';
    cell.setAttribute('aria-label', cell.dataset.v);
    [...cell.dataset.v].forEach((ch, i) => {
      const t = document.createElement('i');
      t.setAttribute('aria-hidden', 'true');
      cell.appendChild(t);
      flapTo(t, ch, ci * 70 + i * 60);
    });
  });
}
document.querySelectorAll('.board').forEach((b) => {
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { fillFlapCells(b); io.disconnect(); } }, { threshold: 0.3 });
  io.observe(b);
});

/* ---------- maps ---------- */
const NAMES = {
  ORD: "CHICAGO O'HARE", ATL: 'ATLANTA', MSP: 'MINNEAPOLIS', LAS: 'LAS VEGAS', SLC: 'SALT LAKE CITY',
  PHX: 'PHOENIX', MDH: 'CARBONDALE, IL', SDM: 'SAN DIEGO BROWN FIELD', DFW: 'DALLAS FORT WORTH', LAX: 'LOS ANGELES',
};
const SCENARIOS = {
  harmonic: { closed: ['ORD'], cut: 'MDH', via: 'ORD', note: "ONLY ROUTE: O'HARE, ABOUT 120 PASSENGERS EACH WAY" },
  degree: { closed: ['ATL', 'ORD'], cut: 'MDH', via: 'ORD', note: "ATLANTA ALONE IS NOT ENOUGH. O'HARE IS CARBONDALE'S ONLY LINK" },
  between: { closed: ['MSP', 'LAS', 'SLC', 'PHX'], cut: 'SDM', via: 'PHX', note: 'ONLY ROUTE: PHOENIX, A HANDFUL OF PASSENGERS' },
};

function el(tag, attrs) {
  const e = document.createElementNS(svgNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function drawMap(host, data, { routes = 900, labels = 8, animate = true } = {}) {
  const svg = el('svg', { viewBox: `0 0 ${data.W} ${data.H}` });
  host.appendChild(svg);
  const byCode = Object.fromEntries(data.airports.map((a) => [a.c, a]));
  const maxW = data.routes[0][2];
  const gR = el('g', {});
  const gA = el('g', {});
  const gL = el('g', {});
  svg.append(gR, gA, gL);
  const routeEls = [];
  data.routes.slice(0, routes).forEach(([a, b, w], i) => {
    const A = byCode[a], B = byCode[b];
    const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
    const dx = B.x - A.x, dy = B.y - A.y;
    const len = Math.hypot(dx, dy);
    const cx = mx - dy * 0.12, cy = my + dx * 0.12;
    const op = 0.08 + 0.55 * Math.sqrt(w / maxW);
    const p = el('path', { d: `M${A.x},${A.y} Q${cx},${cy} ${B.x},${B.y}`, fill: 'none', stroke: '#4FC3F7', 'stroke-width': (0.5 + 2.2 * Math.sqrt(w / maxW)).toFixed(2), 'stroke-opacity': op.toFixed(3), 'stroke-linecap': 'round' });
    p.dataset.a = a; p.dataset.b = b;
    if (animate && !reduceMotion) {
      p.style.strokeDasharray = `${len * 1.1}`;
      p.style.strokeDashoffset = `${len * 1.1}`;
      p.style.transition = `stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) ${Math.min(i * 3, 1600)}ms`;
    }
    gR.appendChild(p);
    routeEls.push(p);
  });
  const maxP = data.airports[0].p;
  const dotEls = {};
  data.airports.forEach((a) => {
    const r = 1.4 + 9 * Math.sqrt(a.p / maxP);
    const d = el('circle', { cx: a.x, cy: a.y, r: r.toFixed(2), fill: '#FFD400', 'fill-opacity': a.p > maxP * 0.05 ? 0.95 : 0.55 });
    const t = el('title', {}); t.textContent = `${a.c} · ${a.city}, ${a.st} · ${a.p.toLocaleString('en-US')} passengers`;
    d.appendChild(t);
    gA.appendChild(d);
    dotEls[a.c] = d;
  });
  data.airports.slice(0, labels).forEach((a) => {
    const t = el('text', { x: a.x + 10, y: a.y - 8, fill: '#E9EDF2', 'font-size': 15, 'font-family': 'B612 Mono, monospace', 'font-weight': 700 });
    t.textContent = a.c;
    gL.appendChild(t);
  });
  return { svg, routeEls, dotEls, byCode, gL };
}

async function initMaps() {
  const data = await (await fetch('assets/data/network.json')).json();
  // main map
  const main = drawMap(document.getElementById('map'), data, { routes: 900, labels: 8, animate: true });
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { main.routeEls.forEach((p) => { p.style.strokeDashoffset = '0'; }); io.disconnect(); }
  }, { threshold: 0.2 });
  io.observe(document.getElementById('map'));

  // robustness map
  const rob = drawMap(document.getElementById('robustMap'), data, { routes: 500, labels: 0, animate: false });
  const fx = el('g', {});
  rob.svg.appendChild(fx);
  const board = document.getElementById('robustBoard');
  let timers = [];

  function reset() {
    timers.forEach(clearTimeout); timers = [];
    fx.innerHTML = '';
    rob.routeEls.forEach((p) => p.style.opacity = '');
    Object.values(rob.dotEls).forEach((d) => { d.style.opacity = ''; });
    document.querySelectorAll('.closure-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    board.innerHTML = '<div class="rb-line">SELECT A RANKING</div><div class="rb-sub">Closed airports turn red. An airport that loses its last connection flashes.</div>';
  }

  function play(key) {
    reset();
    const sc = SCENARIOS[key];
    document.querySelector(`[data-scenario="${key}"]`).setAttribute('aria-pressed', 'true');
    board.innerHTML = `<div class="rb-line">RANKED BY ${key === 'between' ? 'BETWEENNESS' : key.toUpperCase()}</div>`;
    const step = reduceMotion ? 0 : 750;
    sc.closed.forEach((code, i) => {
      timers.push(setTimeout(() => {
        const a = rob.byCode[code];
        rob.routeEls.forEach((p) => { if (p.dataset.a === code || p.dataset.b === code) p.style.opacity = '0.06'; });
        fx.appendChild(el('circle', { cx: a.x, cy: a.y, r: 14, fill: 'none', stroke: '#FF5A4E', 'stroke-width': 3 }));
        const s = 7;
        fx.appendChild(el('path', { d: `M${a.x - s},${a.y - s}L${a.x + s},${a.y + s}M${a.x + s},${a.y - s}L${a.x - s},${a.y + s}`, stroke: '#FF5A4E', 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
        const t = el('text', { x: a.x + 18, y: a.y + 5, fill: '#FF5A4E', 'font-size': 16, 'font-family': 'B612 Mono, monospace', 'font-weight': 700 });
        t.textContent = code;
        fx.appendChild(t);
        const row = document.createElement('div');
        row.className = 'rb-step';
        row.innerHTML = `<span>${i + 1}. ${code} ${NAMES[code] || ''}</span><span class="st">CLOSED</span>`;
        board.appendChild(row);
        requestAnimationFrame(() => row.classList.add('show'));
      }, 300 + i * step));
    });
    timers.push(setTimeout(() => {
      const c = rob.byCode[sc.cut], v = rob.byCode[sc.via];
      fx.appendChild(el('path', { d: `M${c.x},${c.y}L${v.x},${v.y}`, stroke: '#FFD400', 'stroke-width': 2.5, 'stroke-dasharray': '5 6' }));
      const ring = el('circle', { cx: c.x, cy: c.y, r: 10, fill: 'none', stroke: '#FFD400', 'stroke-width': 3 });
      if (!reduceMotion) ring.innerHTML = '<animate attributeName="r" values="8;22;8" dur="1.4s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite"/>';
      fx.appendChild(ring);
      fx.appendChild(el('circle', { cx: c.x, cy: c.y, r: 5, fill: '#FFD400' }));
      const t = el('text', { x: c.x - 6, y: c.y + 34, fill: '#FFD400', 'font-size': 16, 'font-family': 'B612 Mono, monospace', 'font-weight': 700 });
      t.textContent = `${sc.cut} CUT OFF`;
      fx.appendChild(t);
      const row = document.createElement('div');
      row.className = 'rb-step cut';
      row.innerHTML = `<span>NETWORK SPLIT · ${sc.cut} ${NAMES[sc.cut]}</span><span class="st">CUT OFF</span>`;
      board.appendChild(row);
      const note = document.createElement('div');
      note.className = 'rb-sub';
      note.style.marginTop = '10px';
      note.textContent = sc.note;
      board.appendChild(note);
      requestAnimationFrame(() => row.classList.add('show'));
    }, 300 + sc.closed.length * step + 300));
  }

  document.querySelectorAll('.closure-btn').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.scenario === 'reset') reset(); else play(b.dataset.scenario);
  }));

  // state pairs
  const pairs = document.getElementById('pairs');
  const max = data.pairs[0][2];
  pairs.innerHTML = data.pairs.map(([a, b, w]) => `<div class="pair"><span class="pair-name">${a} <span class="arrow">→</span> ${b}</span><span class="pair-track"><span class="pair-fill" data-w="${(w / max) * 100}"></span></span><span class="pair-val">${(w / 1e6).toFixed(2)}M</span></div>`).join('');
  const pio = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    pairs.querySelectorAll('.pair-fill').forEach((f, i) => setTimeout(() => { f.style.width = `${f.dataset.w}%`; }, reduceMotion ? 0 : i * 80));
    pio.disconnect();
  }, { threshold: 0.3 });
  pio.observe(pairs);
}
initMaps();

/* ---------- reveal ---------- */
const panels = document.querySelectorAll('.panel');
if (!reduceMotion && 'IntersectionObserver' in window) {
  panels.forEach((p) => p.classList.add('reveal'));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  panels.forEach((p) => io.observe(p));
}
