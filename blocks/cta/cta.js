export default function decorate(block) {
  // const cols = [...block.firstElementChild.children];
  // setup image columns
  [...block.children].forEach((row) => {
    row.className = 'card card--featured';
    const container = document.createElement('div');
    container.className = 'cta_card__side-by-side';
    container.innerHTML = row.innerHTML;
    [...container.children].forEach((col) => {
      col.className = 'cta_card__content cta_center_aligned';
    });
    row.textContent = '';
    row.append(container);
  });
}
