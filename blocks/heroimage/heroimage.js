export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`heroimage-${cols.length}-cols`);
  // setup image columns
  [...block.children].forEach((row) => {
    row.className = 'card card--featured';
    const container = document.createElement('div');
    container.className = 'card__side-by-side--m';
    container.innerHTML = row.innerHTML;
    [...container.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('card__image');
          if (block.classList.contains('slim')) {
            picWrapper.classList.add('card_image_slim');
          }
        }
      } else {
        col.className = 'card__content padding-large--l';
        const childDiv = document.createElement('div');
        childDiv.innerHTML = col.innerHTML;
        childDiv.className = 'common-border-left-center';
        const buttons = childDiv.querySelectorAll('p.button-container');
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'button-wrapper';
        buttons.forEach((button) => {
          buttonWrapper.append(button);
        });
        childDiv.append(buttonWrapper);
        const parentDiv = document.createElement('div');
        parentDiv.append(childDiv);
        col.innerHTML = parentDiv.innerHTML;
      }
    });
    row.textContent = '';
    row.append(container);
  });
}
