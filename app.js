'use strict';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const menuButton = $('.menu-toggle');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  $('.nav').classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  $('.nav').classList.toggle('open', open);
});
$$('.nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

let toastTimer;
function toast(message) {
  $('.toast').textContent = message;
  $('.toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('.toast').classList.remove('show'), 3500);
}

const detailDialog = $('.detail-dialog');
const friendDetails = {
  kitten: {
    title: 'Маленький, но смелый.',
    label: 'ЗНАКОМЬСЯ: КОТЁНОК',
    image: 'TAKES_f200_17.sparkpub16.1158.jpg',
    alt: 'Чёрный котёнок выглядывает из коробки',
    text: 'Он привык рассчитывать только на себя. Коробка — крепость, шипение — суперсила, любопытство — слабое место. Но даже тому, кто старательно делает вид, что ему никто не нужен, иногда очень нужен друг.'
  },
  dog: {
    title: 'Большой. И очень добрый.',
    label: 'ЗНАКОМЬСЯ: ПИТБУЛЬ',
    image: 'kitbull_pub.jpg',
    alt: 'Белый питбуль осторожно тянется к котёнку',
    text: 'Его внешность может напугать с первого взгляда. Но он не торопит, не требует и не обижается на чужой страх. Просто остаётся рядом. Для маленького котёнка именно эта терпеливая доброта становится началом доверия.'
  }
};
const galleryDetails = {
  kitten: { title: 'Любопытство сильнее страха.', label: 'КАДР ИЗ «КИТБУЛЯ»', image: 'TAKES_f200_17.sparkpub16.1158.jpg', alt: 'Котёнок осторожно выглядывает из коробки', text: 'Иногда взгляд рассказывает больше, чем длинный разговор.' },
  meeting: { title: 'Два незнакомца. Один первый шаг.', label: 'КАДР ИЗ «КИТБУЛЯ»', image: 'kitbull_pub.jpg', alt: 'Котёнок и питбуль впервые присматриваются друг к другу', text: 'У каждого свой характер, но обоим нужно одно: почувствовать, что рядом безопасно.' },
  poster: { title: 'Маленькая история. Большой след.', label: 'ОФИЦИАЛЬНАЯ АФИША PIXAR', image: 'friendship.jpg', alt: 'Официальная афиша Китбуля', text: '«Китбуль», 2019. Режиссёр — Розана Салливан. Короткометражный фильм Pixar из серии SparkShorts.' }
};
function syncModalState() { document.body.classList.toggle('modal-open', $$('dialog[open]').length > 0); }
function showDetails(data, kind, isGallery) {
  detailDialog.classList.toggle('gallery-mode', isGallery);
  $('#detail-title').textContent = data.title;
  $('#detail-label').textContent = data.label;
  $('#detail-description').textContent = data.text;
  const holder = document.createElement('div');
  holder.className = 'detail-visual-clip';
  const img = document.createElement('img');
  img.src = './assets/' + data.image;
  img.alt = data.alt;
  img.className = isGallery && kind === 'poster' ? 'detail-poster' : 'detail-image' + (isGallery ? '' : ' ' + kind);
  holder.append(img);
  $('#detail-visual').replaceChildren(holder);
  detailDialog.showModal();
  syncModalState();
}
$$('.friend-detail').forEach(button => button.addEventListener('click', () => showDetails(friendDetails[button.dataset.friend], button.dataset.friend, false)));
$$('.gallery-photo').forEach(button => button.addEventListener('click', () => showDetails(galleryDetails[button.dataset.photo], button.dataset.photo, true)));
$('.dialog-close', detailDialog).addEventListener('click', () => detailDialog.close());
$('#detail-done').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('close', syncModalState);

const filmDialog = $('.film-dialog');
function closeFilm() { filmDialog.close(); }
$$('.watch-film').forEach(button => button.addEventListener('click', () => {
  filmDialog.showModal();
  syncModalState();
}));
$('.dialog-close', filmDialog).addEventListener('click', closeFilm);
filmDialog.addEventListener('close', syncModalState);
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
}));

let gameStage = 0;
let gameTimer;
const rollButton = $('#roll-yarn');
const resetButton = $('#reset-game');
const scene = $('.play-scene');
const gameMessages = [
  'Немножко страшно. Но очень любопытно.',
  'Можно просто посмотреть поближе.',
  'Кажется, этот большой пёс совсем не страшный.',
  'Ты больше не один. Теперь вас двое.'
];
const gameHints = [
  'Без спешки. У доверия свой темп.',
  'Первый шаг сделан. Пёс аккуратно возвращает клубок.',
  'Ещё чуточку смелости — и ещё один шаг навстречу.',
  'Иногда всё, что нужно, — дать друг другу шанс.'
];
rollButton.addEventListener('click', () => {
  if (gameStage >= 3 || rollButton.disabled) return;
  gameStage++;
  scene.dataset.stage = String(gameStage);
  $('#scene-message').textContent = gameMessages[gameStage];
  $('#play-hint').textContent = gameHints[gameStage];
  $$('.game-progress>span').forEach((dot, index) => dot.classList.toggle('current', index === gameStage));
  resetButton.hidden = false;
  rollButton.disabled = true;
  if (gameStage === 3) {
    rollButton.textContent = 'Теперь они друзья ♡';
  } else {
    gameTimer = setTimeout(() => { rollButton.disabled = false; }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850);
  }
});
resetButton.addEventListener('click', () => {
  clearTimeout(gameTimer);
  gameStage = 0;
  scene.dataset.stage = '0';
  $('#scene-message').textContent = gameMessages[0];
  $('#play-hint').textContent = gameHints[0];
  $$('.game-progress>span').forEach((dot, index) => dot.classList.toggle('current', index === 0));
  rollButton.disabled = false;
  rollButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m7 6 11 9M5 11l9 8M11 4l8 8M6 16l12-9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>Покатить клубок';
  resetButton.hidden = true;
  toast('Ещё одно знакомство. Теперь ты знаешь, как это бывает.');
});

let pawCount = 0;
const pawButton = $('#leave-paw');
pawButton.addEventListener('click', () => {
  if (pawCount >= 8) { toast('Здесь уже целая тропинка доброты. Спасибо!'); return; }
  pawCount++;
  const garden = $('#paw-garden');
  garden.classList.add('has-paws');
  $('.paw-caption', garden)?.remove();
  const paw = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  paw.classList.add('garden-paw');
  paw.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#paw');
  paw.append(use); garden.append(paw);
  const caption = document.createElement('p');
  caption.className = 'paw-caption';
  caption.textContent = pawCount === 1 ? 'Один маленький след. Одно большое «я рядом».' : pawCount < 8 ? 'Шаг за шагом — мир становится добрее.' : 'Целая тропинка доброты. Спасибо за каждый шаг.';
  garden.append(caption);
  $('span', pawButton).textContent = pawCount < 8 ? 'Ещё один тёплый след' : 'Здесь стало немного теплее ♡';
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: .07});
  $$('.story-heading, .friends-heading, .moments-heading, .gallery-grid, .film-copy').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}
