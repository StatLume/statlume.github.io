(() => {
  document.querySelectorAll('[data-content-gallery]').forEach(gallery => {
    const primaryImage = gallery.querySelector('img');
    if (!primaryImage) return;

    const slides = [
      {preview: gallery.dataset.beforePreview, full: gallery.dataset.beforeFull, alt: gallery.dataset.beforeAlt || ''},
      {preview: primaryImage.currentSrc || primaryImage.src, full: gallery.dataset.primaryFull, alt: primaryImage.alt},
      {preview: gallery.dataset.afterPreview, full: gallery.dataset.afterFull, alt: gallery.dataset.afterAlt || ''}
    ];

    const viewport = document.createElement('div');
    viewport.className = 'content-gallery-viewport';
    const track = document.createElement('div');
    track.className = 'content-gallery-track';

    slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.className = `content-gallery-slide${index === 1 ? ' active' : ''}`;
      button.type = 'button';
      button.setAttribute('aria-label', `Show screenshot ${index + 1}`);
      if (index === 1) button.setAttribute('aria-current', 'true');
      const image = document.createElement('img');
      image.src = slide.preview;
      image.alt = slide.alt;
      image.width = primaryImage.width || 1920;
      image.height = primaryImage.height || 1080;
      image.decoding = 'async';
      if (index !== 1) image.loading = 'lazy';
      button.appendChild(image);
      track.appendChild(button);
    });

    viewport.appendChild(track);
    const controls = document.createElement('div');
    controls.className = 'content-gallery-controls';
    controls.innerHTML = '<button type="button" aria-label="Previous screenshot"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m15.5 19-7-7 7-7"/></svg></button><span aria-hidden="true"><i></i><i class="active"></i><i></i></span><button type="button" aria-label="Next screenshot"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8.5 5 7 7-7 7"/></svg></button>';
    gallery.replaceChildren(viewport, controls);

    const buttons = [...track.children];
    const dots = [...controls.querySelectorAll('i')];
    let current = 1;

    const select = (index, behavior = 'smooth') => {
      current = (index + buttons.length) % buttons.length;
      buttons.forEach((button, buttonIndex) => {
        const active = buttonIndex === current;
        button.classList.toggle('active', active);
        if (active) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
      dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
      const target = buttons[current];
      const left = target.offsetLeft - (viewport.clientWidth - target.offsetWidth) / 2;
      viewport.scrollTo({left, behavior});
    };

    buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
    const arrows = controls.querySelectorAll('button');
    arrows[0].addEventListener('click', () => select(current - 1));
    arrows[1].addEventListener('click', () => select(current + 1));
    requestAnimationFrame(() => select(1, 'auto'));
    window.addEventListener('resize', () => select(current, 'auto'), {passive: true});
  });
})();
