(() => {
  const names = ['01', 'video', '02', '03', '04', '05', '06'];
  const mediaVersion = '20261015-02';
  const descriptions = {
    'video': 'StatLume product demo',
    '01': 'StatLume channel analytics for the last 60 minutes',
    '02': 'StatLume taskbar counter on a Windows desktop',
    '03': 'StatLume channel switcher',
    '04': 'StatLume application menu',
    '05': 'StatLume settings window',
    '06': 'About StatLume window'
  };
  const track = document.querySelector('[data-landing-carousel]');
  const viewport = document.querySelector('.carousel-viewport');
  const previous = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const dots = [...document.querySelectorAll('.carousel-dots span')];
  const prepareImage = slide => {
    const image = slide.querySelector('img');
    if (!image || image.complete) return;
    slide.classList.add('is-loading');
    const finish = () => slide.classList.remove('is-loading');
    image.addEventListener('load', finish, {once: true});
    image.addEventListener('error', finish, {once: true});
  };
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
        const description = descriptions[name];
        if (name === 'video') {
          return `<div class="screenshot-thumb media-video${active ? ' active' : ''}" data-index="${nameIndex}" role="group" aria-label="${description}"${active ? ' aria-current="true"' : ''}><iframe src="https://www.youtube-nocookie.com/embed/HSdTD6y1RAw?rel=0" title="StatLume product demo" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
        }
        return `<button class="screenshot-thumb${active ? ' active' : ''}" type="button" data-index="${nameIndex}" aria-label="Show ${description}"${active ? ' aria-current="true"' : ''}><img src="/assets/screenshots/release-previews/${name}.webp?v=${mediaVersion}" alt="${description}" ${active ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} width="960" height="540"></button>`;
      }).join('');
      const slides = [...track.children];
      slides.forEach(prepareImage);
      slides.forEach(slide => {
        if (slide.classList.contains('media-video')) return;
        slide.addEventListener('click', () => select(Number(slide.dataset.index)));
      });
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
  const contentLift = 170;
  const sectionGap = 80;
  const mobileBreakpoint = 760;
  const landingPage = document.querySelector('.landing-stage > .page');
  const carouselControls = document.querySelector('.carousel-controls');
  const stageAnchor = carouselControls || document.querySelector('.support-form-wrap');
  const scaledCopyProperties = {
    '--landing-side-column': 250,
    '--landing-copy-gap': 72,
    '--landing-intro-margin': 54,
    '--landing-heading-width': 430,
    '--landing-h2-size': 36,
    '--landing-body-size': 15,
    '--landing-card-gap': 16,
    '--landing-card-height': 190,
    '--landing-card-padding': 26,
    '--landing-card-radius': 12,
    '--landing-card-title-gap': 10,
    '--landing-h3-size': 18,
    '--landing-card-body-size': 13,
    '--landing-section-gap': 72
  };
  let resizeFrame = 0;
  const updateScale = () => {
    if (window.innerWidth <= mobileBreakpoint) {
      document.body.style.setProperty('--layout-scale', '1');
      document.body.style.removeProperty('--landing-content-width');
      document.body.style.removeProperty('--landing-stage-height');
      document.body.style.removeProperty('--landing-hero-lift');
      document.body.style.removeProperty('--landing-content-lift');
      Object.keys(scaledCopyProperties).forEach(property => document.body.style.removeProperty(property));
      resizeFrame = 0;
      return;
    }
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const widthScale = viewportWidth / designWidth;
    const sizeTolerance = 24;
    const isExpandedWindow = document.fullscreenElement
      || (window.outerWidth >= window.screen.availWidth - sizeTolerance
        && window.outerHeight >= window.screen.availHeight - sizeTolerance);
    const isCompactScreen = window.screen.availWidth < designWidth
      || window.screen.availHeight < designHeight;
    const useCompactDesktop = !isExpandedWindow || isCompactScreen;
    const customWindowFactor = useCompactDesktop ? 0.9 : 1;
    const scale = Math.min(widthScale * customWindowFactor, 1.2);
    document.body.style.setProperty('--layout-scale', scale.toFixed(4));
    document.body.style.setProperty('--landing-hero-lift', useCompactDesktop ? '-140px' : '-40px');
    const scaledContentLift = contentLift * scale;
    document.body.style.setProperty('--landing-content-lift', `${scaledContentLift.toFixed(2)}px`);
    document.body.style.setProperty('--landing-content-width', `${((designWidth - 64) * scale).toFixed(2)}px`);
    document.body.style.setProperty('--landing-stage-height', `${(designHeight * scale).toFixed(2)}px`);
    Object.entries(scaledCopyProperties).forEach(([property, value]) => {
      document.body.style.setProperty(property, `${(value * scale).toFixed(2)}px`);
    });
    requestAnimationFrame(() => {
      if (!landingPage || !stageAnchor) return;
      const pageRect = landingPage.getBoundingClientRect();
      const anchorRect = stageAnchor.getBoundingClientRect();
      const anchorBottom = anchorRect.bottom - pageRect.top;
      const requiredHeight = anchorBottom + scaledContentLift + (sectionGap * scale);
      document.body.style.setProperty('--landing-stage-height', `${requiredHeight.toFixed(2)}px`);
    });
    resizeFrame = 0;
  };
  let settleTimer = 0;
  const scheduleScaleUpdate = () => {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(updateScale);
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(updateScale, 180);
  };
  window.addEventListener('resize', scheduleScaleUpdate, {passive: true});
  window.visualViewport?.addEventListener('resize', scheduleScaleUpdate, {passive: true});
  document.addEventListener('fullscreenchange', scheduleScaleUpdate);
  window.addEventListener('pageshow', scheduleScaleUpdate, {passive: true});
  updateScale();
})();
