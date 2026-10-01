const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const links = [...document.querySelectorAll('.nav a')];

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

links.forEach((link) => {
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
});

const sections = [...document.querySelectorAll('main [id]')];
const navObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  links.forEach((link) => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
}, { rootMargin: '-20% 0px -58% 0px', threshold: [0, .2, .5] });
sections.forEach((section) => navObserver.observe(section));

const scrollControls = [...document.querySelectorAll('[data-scroll-target]')];

function updateScrollControl(button) {
  const target = button.parentElement.querySelector(button.dataset.scrollTarget);
  const horizontal = button.dataset.axis === 'x';
  const size = horizontal ? target.scrollWidth : target.scrollHeight;
  const viewport = horizontal ? target.clientWidth : target.clientHeight;
  const position = horizontal ? target.scrollLeft : target.scrollTop;
  const hasOverflow = size > viewport + 2;
  const atEnd = position >= size - viewport - 2;
  button.hidden = !hasOverflow || atEnd;
}

scrollControls.forEach((button) => {
  const target = button.parentElement.querySelector(button.dataset.scrollTarget);
  const horizontal = button.dataset.axis === 'x';
  button.addEventListener('click', () => {
    target.scrollBy({
      left: horizontal ? Math.max(target.clientWidth * .75, 110) : 0,
      top: horizontal ? 0 : Math.max(target.clientHeight * .72, 90),
      behavior: 'smooth',
    });
  });
  target.addEventListener('scroll', () => updateScrollControl(button), { passive: true });
  new ResizeObserver(() => updateScrollControl(button)).observe(target);
  updateScrollControl(button);
});

const revealTargets = [...document.querySelectorAll('.panel, .projects')];
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .08 });

document.body.classList.add('motion-ready');
revealTargets.forEach((target) => revealObserver.observe(target));
