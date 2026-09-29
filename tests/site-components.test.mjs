import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const landingPages = [
  'features/index.html',
  'realtime-youtube-stats/index.html',
  'youtube-studio-desktop-widget/index.html',
  'download/index.html',
  'faq/index.html'
];

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const occurrences = (source, pattern) => [...source.matchAll(pattern)].length;

test('every product landing keeps the shared component structure', async () => {
  for (const path of landingPages) {
    const html = await read(path);

    assert.equal(occurrences(html, /<h1(?:\s|>)/g), 1, `${path} must have one H1`);
    assert.match(html, /<header>.*class="brand".*<nav>/s, `${path} must keep the shared header`);
    assert.match(html, /<section class="hero">.*class="hero-copy"/s, `${path} must keep the hero`);
    assert.match(html, /data-landing-carousel data-primary="[^"]+"/, `${path} must configure its carousel`);
    assert.match(html, /class="[^"]*carousel-prev[^"]*".*class="[^"]*carousel-next[^"]*"/s, `${path} must keep both carousel arrows`);
    assert.match(html, /<main class="landing-copy">/, `${path} must keep content below the hero`);
    assert.match(html, /<footer class="site-footer landing-footer">/, `${path} must keep the shared footer`);
  }
});

test('landing navigation and store actions remain consistent', async () => {
  for (const path of landingPages) {
    const html = await read(path);

    for (const href of ['/', '/features/', '/download/', '/support/']) {
      assert.match(html, new RegExp(`href="${href.replaceAll('/', '\\/')}"`), `${path} is missing ${href}`);
    }
    assert.match(html, /get\.microsoft\.com\/images\/en-us%20dark\.svg/);
    assert.match(html, /download-on-the-app-store\.svg/);
    assert.match(html, /data-apple-interest/);
  }
});

test('all product landings load one matching asset release', async () => {
  const releases = new Set();

  for (const path of landingPages) {
    const html = await read(path);
    const site = html.match(/site\.css\?v=([^"']+)/)?.[1];
    const landing = html.match(/landing\.css\?v=([^"']+)/)?.[1];
    const script = html.match(/landing\.js\?v=([^"']+)/)?.[1];

    assert.ok(site && landing && script, `${path} must version all shared assets`);
    assert.equal(site, landing, `${path} CSS versions must match`);
    assert.equal(site, script, `${path} CSS and JS versions must match`);
    releases.add(site);
  }

  assert.equal(releases.size, 1, 'all landing pages must use the same asset release');
});

test('desktop hero remains a single proportional 1600 by 900 composition', async () => {
  const css = await read('assets/site.css');
  const script = await read('assets/landing.js');

  assert.match(css, /\.home \.page\{[^}]*width:1600px;[^}]*height:900px;[^}]*transform:scale\(var\(--layout-scale\)\)/);
  assert.match(script, /const designWidth = 1600;/);
  assert.match(script, /const designHeight = 900;/);
  assert.match(script, /Math\.min\(viewportWidth \/ designWidth, viewportHeight \/ designHeight\)/);
  assert.doesNotMatch(script, /desktopDensity/, 'do not globally shrink otherwise-correct desktop layouts');
});

test('hero occupies at least one viewport and content never uses a desktop overlap', async () => {
  const css = await read('assets/landing.css');
  const script = await read('assets/landing.js');

  assert.match(css, /\.landing-stage\{[^}]*height:var\(--landing-stage-height,100vh\);[^}]*min-height:0/);
  assert.match(css, /\.landing-copy\{[^}]*margin:calc\(-1 \* var\(--landing-content-lift,70px\)\) auto 0/);
  assert.match(script, /'--landing-content-lift': 70/);
  assert.match(script, /Math\.max\(viewportHeight, designHeight \* scale, requiredHeight\)/);
  assert.match(script, /controlsRect\.bottom - pageRect\.top/);
});

test('laptops keep the proportional desktop canvas and mobile stays adaptive', async () => {
  const landingCss = await read('assets/landing.css');
  const siteCss = await read('assets/site.css');
  const script = await read('assets/landing.js');

  assert.doesNotMatch(landingCss, /@media\(min-width:761px\) and \(max-width:1180px\)/);
  assert.doesNotMatch(siteCss, /@media\(min-width:761px\) and \(max-width:1180px\)/);
  assert.match(landingCss, /@media\(max-width:760px\)/);
  assert.match(siteCss, /@media\(max-width:760px\)[\s\S]*?\.home \.page\{[^}]*position:relative/);
  assert.match(script, /const mobileBreakpoint = 760;/);
  assert.match(script, /document\.documentElement\.clientWidth/);
  assert.match(script, /document\.documentElement\.clientHeight/);
});

test('header scales with the same geometry as the rest of the desktop canvas', async () => {
  const css = await read('assets/site.css');
  const script = await read('assets/landing.js');

  assert.match(css, /\.home header\{[^}]*transform:none/);
  assert.match(css, /\.home header \.brand,\.home header nav\{transform:none\}/);
  assert.doesNotMatch(script, /header-counter-scale/);
});

test('support page uses the landing visual system without changing its form contract', async () => {
  const html = await read('support/index.html');
  const css = await read('assets/site.css');

  assert.match(html, /name="theme-color" content="#071218"/);
  assert.match(html, /id="support-form"/);
  assert.match(html, /const SUPPORT_ENDPOINT=/);
  assert.match(css, /body\.support\{[^}]*sunset-landscape\.png[^}]*color:#f6f9fc/);
  assert.match(css, /\.support-form-wrap\{[^}]*backdrop-filter:blur\(18px\)/);
  assert.match(css, /\.support \.site-footer\{[^}]*border-top-color:rgba\(255,255,255,.16\)/);
});

test('carousel skeleton reserves space and respects reduced motion', async () => {
  const css = await read('assets/site.css');
  const landingScript = await read('assets/landing.js');
  const home = await read('index.html');

  assert.match(css, /@keyframes carousel-skeleton/);
  assert.match(css, /\.screenshot-thumb\.is-loading::after/);
  assert.match(css, /prefers-reduced-motion:reduce[^}]*[\s\S]*animation:none/);
  assert.match(landingScript, /classList\.add\('is-loading'\)/);
  assert.match(landingScript, /addEventListener\('load', finish/);
  assert.match(home, /classList\.add\('is-loading'\)/);
});

test('SEO component contract stays intact', async () => {
  const pages = ['index.html', ...landingPages, 'support/index.html', 'privacy/index.html', 'terms/index.html'];

  for (const path of pages) {
    const html = await read(path);
    assert.equal(occurrences(html, /<title>/g), 1, `${path} must have one title`);
    assert.equal(occurrences(html, /rel="canonical"/g), 1, `${path} must have one canonical URL`);
    assert.equal(occurrences(html, /<h1(?:\s|>)/g), 1, `${path} must have one H1`);
    assert.match(html, /name="description" content="[^"]+"/, `${path} must have a description`);
  }
});
