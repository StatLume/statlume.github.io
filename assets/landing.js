(() => {
  const names = ['01', '02', '03', '04', '05', '06', '07', '07-1', '08', '09', '10', '11'];
  const track = document.querySelector('[data-landing-carousel]');
  const viewport = document.querySelector('.carousel-viewport');
  const previous = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const dots = [...document.querySelectorAll('.carousel-dots span')];
  if (track && viewport && previous && next) {
    const requested = track.dataset.primary || '01';
    track.innerHTML = names.map(name => `<button class="screenshot-thumb${name === requested ? ' active' : ''}" type="button" aria-label="Show screenshot ${name}"${name === requested ? ' aria-current="true"' : ''}><img src="/assets/screenshots/release-previews/${name}.webp" alt="" ${name === requested ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} width="1536" height="864"></button>`).join('');
    const slides = [...track.children];
    let current = Math.max(0, names.indexOf(requested));

    const select = (index, behavior = 'smooth') => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle('active', active);
        if (active) slide.setAttribute('aria-current', 'true');
        else slide.removeAttribute('aria-current');
      });
      const page = Math.min(dots.length - 1, Math.floor(current / Math.ceil(slides.length / dots.length)));
      dots.forEach((dot, index) => dot.classList.toggle('active', index === page));
      const target = slides[current];
      const left = target.offsetLeft - (viewport.clientWidth - target.offsetWidth) / 2;
      viewport.scrollTo({left, behavior});
    };

    slides.forEach((slide, index) => slide.addEventListener('click', () => select(index)));
    previous.addEventListener('click', () => select(current - 1));
    next.addEventListener('click', () => select(current + 1));
    requestAnimationFrame(() => select(current, 'auto'));
  }

  const designWidth = 1600;
  const designHeight = 900;
  const adaptiveBreakpoint = 1180;
  let resizeFrame = 0;
  const updateScale = () => {
    if (window.innerWidth <= adaptiveBreakpoint) {
      document.body.style.setProperty('--layout-scale', '1');
      resizeFrame = 0;
      return;
    }
    const scale = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight);
    document.body.style.setProperty('--layout-scale', scale.toFixed(4));
    resizeFrame = 0;
  };
  window.addEventListener('resize', () => {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(updateScale);
  }, {passive: true});
  updateScale();
})();
