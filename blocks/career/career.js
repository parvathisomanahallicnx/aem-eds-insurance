export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-colss`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('career-img-col');
        }
      } else {
        col.classList.add('career-content');
        const childDiv = document.createElement('div');
        childDiv.innerHTML = col.innerHTML;
        childDiv.className = 'career-subcontent';
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
  });
}
