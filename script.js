document.documentElement.classList.add('motion-ready');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navigationLinks = [...document.querySelectorAll('.site-nav a')];
const revealItems = document.querySelectorAll('[data-reveal]');
const sections = document.querySelectorAll('main section[id]');
const hero = document.querySelector('.hero');
const heroArtwork = document.querySelector('.hero-art');
const wordmark = document.querySelector('.wordmark');
const expandableContents = [...document.querySelectorAll('[data-expandable]')];
const expandButtons = [...document.querySelectorAll('[data-expand-target]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactPanels = window.matchMedia('(min-width: 761px)');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

wordmark.addEventListener('click', (event) => {
  event.preventDefault();
  closeMenu();
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  window.scrollTo({
    top: 0,
    behavior: reduceMotion.matches ? 'auto' : 'smooth',
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

function revealItem(item) {
  item.classList.add('is-visible');
  item.closest('section')?.classList.add('is-in-view');
}

if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  hero.classList.add('is-entered');
  revealItems.forEach(revealItem);
} else {
  requestAnimationFrame(() => hero.classList.add('is-entered'));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealItem(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

heroArtwork.addEventListener(
  'animationend',
  () => {
    heroArtwork.style.willChange = 'auto';
  },
  { once: true }
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navigationLinks.forEach((link) => {
      const matches = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('is-active', matches);
      if (matches) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  },
  { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.5] }
);

sections.forEach((section) => sectionObserver.observe(section));

function contentNeedsExpansion(content) {
  if (content.dataset.expandable === 'education') {
    return content.children.length > 2;
  }

  const groups = [...content.querySelectorAll('.skill-group')];
  return groups.length > 2 || groups.some((group) => group.querySelectorAll('li').length > 3);
}

function configureExpandablePanels() {
  expandableContents.forEach((content) => {
    const button = document.querySelector(`[data-expand-target="${content.id}"]`);
    const shouldCollapse = compactPanels.matches && contentNeedsExpansion(content);

    content.classList.toggle('is-collapsible', shouldCollapse);
    if (!shouldCollapse) content.classList.remove('is-expanded');

    button.hidden = !shouldCollapse;
    if (!shouldCollapse) {
      button.setAttribute('aria-expanded', 'false');
      button.querySelector('span').textContent = button.dataset.openLabel;
    }
  });
}

expandButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const content = document.getElementById(button.dataset.expandTarget);
    const expanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', String(!expanded));
    button.querySelector('span').textContent = expanded
      ? button.dataset.openLabel
      : button.dataset.closeLabel;
    content.classList.toggle('is-expanded', !expanded);
  });
});

configureExpandablePanels();

let ticking = false;

function updateHeroParallax() {
  if (reduceMotion.matches || window.innerWidth <= 1120) {
    heroArtwork.style.translate = '';
    ticking = false;
    return;
  }

  const offset = Math.min(window.scrollY * 0.08, 22);
  heroArtwork.style.translate = `0 ${offset}px`;
  ticking = false;
}

window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeroParallax);
  },
  { passive: true }
);

window.addEventListener('resize', () => {
  if (window.innerWidth > 1120) closeMenu();
  configureExpandablePanels();
  updateHeroParallax();
});
