(() => {
  const names = ['01', '02', '03', '04', '05', '06', '07', '07-1', '08', '09', '10', '11'];
  const track = document.querySelector('[data-landing-carousel]');
  const viewport = document.querySelector('.carousel-viewport');
  const previous = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const dots = [...document.querySelectorAll('.carousel-dots span')];
  if (track && viewport && previous && next) {
    const requested = track.dataset.primary || '01';
    let current = Math.max(0, names.indexOf(requested));

    const select = index => {
      current = (index + names.length) % names.length;
      const visibleIndexes = [
        (current - 1 + names.length) % names.length,
        current,
        (current + 1) % names.length
      ];
      track.innerHTML = visibleIndexes.map((nameIndex, position) => {
        const name = names[nameIndex];
        const active = position === 1;
        return `<button class="screenshot-thumb${active ? ' active' : ''}" type="button" data-index="${nameIndex}" aria-label="Show screenshot ${name}"${active ? ' aria-current="true"' : ''}><img src="/assets/screenshots/release-previews/${name}.webp" alt="" ${active ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} width="1536" height="864"></button>`;
      }).join('');
      const slides = [...track.children];
      slides.forEach(slide => slide.addEventListener('click', () => select(Number(slide.dataset.index))));
      const page = Math.min(dots.length - 1, Math.floor(current / Math.ceil(names.length / dots.length)));
      dots.forEach((dot, index) => dot.classList.toggle('active', index === page));
      requestAnimationFrame(() => {
        const target = slides[1];
        const left = target.offsetLeft - (viewport.clientWidth - target.offsetWidth) / 2;
        viewport.scrollTo({left, behavior: 'auto'});
      });
    };

    previous.addEventListener('click', () => select(current - 1));
    next.addEventListener('click', () => select(current + 1));
    select(current);
  }

  const appleInterest = document.querySelector('[data-apple-interest]');
  const appleStatus = document.querySelector('[data-apple-status]');
  const interestEndpoint = 'https://statlume-github-io.pavelsimonua.workers.dev/interest/apple';
  if (appleInterest && appleStatus) {
    const showCount = async () => {
      appleInterest.disabled = true;
      appleStatus.textContent = 'Loading interest…';
      try {
        const response = await fetch(interestEndpoint);
        const result = await response.json();
        if (!response.ok) throw new Error();
        appleStatus.textContent = `Coming soon · ${result.count} interested`;
      } catch {
        appleStatus.textContent = 'Coming soon · Interest recorded';
      }
    };
    appleInterest.addEventListener('click', async () => {
      if (localStorage.getItem('statlume-apple-interest') === 'recorded') return showCount();
      appleInterest.disabled = true;
      appleStatus.textContent = 'Recording…';
      try {
        const response = await fetch(interestEndpoint, {method: 'POST'});
        const result = await response.json();
        if (!response.ok) throw new Error();
        localStorage.setItem('statlume-apple-interest', 'recorded');
        appleStatus.textContent = `Coming soon · ${result.count} interested`;
      } catch {
        appleStatus.textContent = 'Please try again';
        appleInterest.disabled = false;
      }
    });
    if (localStorage.getItem('statlume-apple-interest') === 'recorded') showCount();
  }

  const designWidth = 1600;
  const designHeight = 900;
  const adaptiveBreakpoint = 1180;
  let resizeFrame = 0;
  const updateScale = () => {
    if (window.innerWidth <= adaptiveBreakpoint) {
      document.body.style.setProperty('--layout-scale', '1');
      document.body.style.removeProperty('--landing-content-width');
      resizeFrame = 0;
      return;
    }
    const scale = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight);
    document.body.style.setProperty('--layout-scale', scale.toFixed(4));
    document.body.style.setProperty('--landing-content-width', `${((designWidth - 64) * scale).toFixed(2)}px`);
    resizeFrame = 0;
  };
  window.addEventListener('resize', () => {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(updateScale);
  }, {passive: true});
  updateScale();
})();
