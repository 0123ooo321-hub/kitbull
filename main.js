const chapters = [
  'Чёрный котёнок прячется среди коробок. Ему хватает крошечного уголка, чтобы наблюдать за большим и шумным двором.',
  'По соседству появляется питбуль. Котёнок боится незнакомца, но однажды они находят способ поиграть вместе.',
  'Когда одному становится трудно, другой решается подойти ближе. Так осторожное знакомство превращается в дружбу.'
];

const chapterText = document.querySelector('#chapter-text');
const chapterButtons = document.querySelectorAll('[data-chapter]');

for (const button of chapterButtons) {
  button.addEventListener('click', () => {
    chapterText.textContent = chapters[Number(button.dataset.chapter)];
    for (const item of chapterButtons) {
      item.setAttribute('aria-pressed', String(item === button));
    }
  });
}

const viewer = document.querySelector('#viewer');
document.querySelector('.frame').addEventListener('click', () => viewer.showModal());
