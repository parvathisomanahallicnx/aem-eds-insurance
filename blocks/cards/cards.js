export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    ul.className = 'flex-card';
    const li = document.createElement('li');
    const container = document.createElement('div');
    container.className = 'flex-main';
    container.innerHTML = row.innerHTML;
    [...container.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'flex-card-img';
      else div.className = 'card-text';
    });
    li.append(container);
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
