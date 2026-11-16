(() => {
  'use strict';
  const body = document.body;
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const num = document.getElementById('loaderNum');

  /* ---- 見出しを1文字ずつに分割 ---- */
  let n = 0;
  document.querySelectorAll('[data-split]').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    [...text].forEach((c) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--n', n++);
      s.textContent = c;
      el.appendChild(s);
    });
  });

  /* ---- ローディング ---- */
  const MIN_TIME = 2400; // 最低表示時間(ms)
  const start = performance.now();
  let loaded = false;
  let shown = 0;

  const heroImg = document.querySelector('.hero__bg img');
  const ready = new Promise((res) => {
    if (document.readyState === 'complete') res();
    else window.addEventListener('load', res, { once: true });
  });
  ready.then(() => {
    if (heroImg && !heroImg.complete) {
      heroImg.addEventListener('load', () => (loaded = true), { once: true });
      heroImg.addEventListener('error', () => (loaded = true), { once: true });
    } else {
      loaded = true;
    }
  });

  // タイマー方式(バックグラウンドタブでも止まらない)
  const timer = setInterval(() => {
    const elapsed = performance.now() - start;
    const target = loaded ? Math.min(100, (elapsed / MIN_TIME) * 100) : Math.min(90, (elapsed / MIN_TIME) * 90);
    shown += (target - shown) * 0.2 + 0.4;
    shown = Math.min(shown, target);
    const v = Math.round(shown);
    bar.style.width = v + '%';
    num.textContent = v;
    if (v >= 100 && loaded && elapsed >= MIN_TIME) {
      clearInterval(timer);
      finish();
    }
  }, 40);

  function finish() {
    loader.classList.add('is-done');
    body.classList.remove('is-loading');
    body.classList.add('is-ready');
    setTimeout(() => loader.remove(), 1600);
  }

  /* ---- スクロール時のヘッダー ---- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- スクロール表示 ---- */
  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('is-in'));
  }

  /* ---- ヒーローの軽いパララックス ---- */
  const heroBg = document.querySelector('.hero__bg');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 900);
      if (heroBg) heroBg.style.transform = `translateY(${y * 0.22}px)`;
      ticking = false;
    });
  }, { passive: true });

  /* ---- モバイルメニュー ---- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const toggle = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  };
  burger.addEventListener('click', () => toggle(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));

  /* ---- 年 ---- */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
