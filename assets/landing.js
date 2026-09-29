(() => {
  const names = ['01', '02', '03', '04', '05', '06', '07', '07-1', '08', '09', '10', '11'];
  const descriptions = {
    '01': 'StatLume realtime YouTube Studio analytics on a Windows desktop',
    '02': 'StatLume desktop widget displayed beside YouTube Studio',
    '03': 'StatLume channel statistics widget in a desktop workspace',
    '04': 'StatLume realtime views chart for a YouTube channel',
    '05': 'StatLume compact YouTube analytics view',
    '06': 'StatLume fullscreen YouTube Studio statistics view',
    '07': 'StatLume channel activity dashboard on Windows',
    '07-1': 'StatLume desktop analytics layout for content creators',
    '08': 'StatLume taskbar view showing channel statistics',
    '09': 'StatLume YouTube Studio desktop widget on Windows',
    '10': 'StatLume realtime channel totals and chart data',
    '11': 'StatLume realtime YouTube stats widget with recent activity'
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
        return `<button class="screenshot-thumb${active ? ' active' : ''}" type="button" data-index="${nameIndex}" aria-label="Show ${description}"${active ? ' aria-current="true"' : ''}><img src="/assets/screenshots/release-previews/${name}.webp" alt="${description}" ${active ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} width="1536" height="864"></button>`;
      }).join('');
      const slides = [...track.children];
      slides.forEach(prepareImage);
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
