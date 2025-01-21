import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
// const isNotDesktop = window.matchMedia('(max-width: 899px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';

  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  // toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (!expanded && !isDesktop.matches) {
    const currentNavSections = nav.querySelector('.nav-sections');
    if (currentNavSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        navSection.addEventListener('click', () => {
          if (!isDesktop.matches) {
            const AriaExpanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSection, AriaExpanded);
            navSection.setAttribute('aria-expanded', AriaExpanded ? 'false' : 'true');
          }
        });
      });
    }
    const navSections2 = nav.querySelector('.nav-sections');
    if (navSections2) {
      navSections2.querySelectorAll('.nav-drop > ul>li').forEach((navSection) => {
        if (navSection.querySelector('ul') && !isDesktop) navSection.classList.add('nav-drop2');
        navSection.addEventListener('click', (e) => {
          e.stopPropagation();
          // var ulel = e.target;
          if (!isDesktop.matches) {
            toggleAllNavSections(navSection);
          }
        });
      });
    }
    // const nav1 = nav.getElementsByClassName('.nav-drop1');
  }

  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);



  if (resp.ok) {
    const html = await resp.text();
    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });
    const toolinn = nav.querySelector('.nav-tools');
    toolinn.id = 'toolnav';
    if (toolinn) {
      console.log("working line143");
      const icontool = nav.querySelector('.icon')
      console.log(icontool);
      const searchInput = document.createElement('input');
      searchInput.id = 'searchicon';
      searchInput.classList.add('searchinput');
      searchInput.setAttribute('autocomplete', 'off');
      searchInput.setAttribute("type", "text");
      searchInput.setAttribute("name", "search");
      searchInput.setAttribute("placeholder", "search");
      searchInput.setAttribute("list", "searchDatalist");
      searchInput.value = ""
      toolinn.append(searchInput);//---------------
      // ========== data list tag =================
      const datalistContainer = document.createElement("ul");
      datalistContainer.setAttribute("id", "searchDatalist");
      datalistContainer.classList.add("search-data");
      datalistContainer.style.display = 'none';
      searchInput.style.display = 'none';
      // datalistContainer.style.cssText = 'font-size: 24px; color: red;';

      var searchoptions = [];
      toolinn.appendChild(datalistContainer);
      const elem = document.querySelector('#searchDatalist');
      // elem.style.display = 'none';

      // searchInput.addEventListener("click", function () {
      // console.log("clicked input tag")
      let userData = ""
      const promise = getapidata(userData);
      promise.then((data) => {
        // getjsondata = { ...data }
        // Object.assign(getjsondata, data)
        data.forEach(ele => {
          // console.log(ele.id, "line 174")
          searchoptions.push(ele.id)
          // console.log(searchoptions, "line 177")

          // loaddata(searchoptions, elem);


        })

      })

      console.log(searchoptions)
      searchInput.addEventListener('keyup', function () {
        const input = document.getElementById('searchicon').value.toLowerCase();
        const suggestionList = document.getElementById('searchDatalist');
        suggestionList.innerHTML = '';

        for (let i = 0; i < searchoptions.length; i++) {
          const optionId = searchoptions[i].toString().toLowerCase();
          if (optionId && optionId.includes(input)) {
            const li = document.createElement('li');
            li.innerText = searchoptions[i];
            li.setAttribute('data-id', searchoptions[i]); // Set the ID as a data attribute
            li.addEventListener('click', function () {
              selectOption(this.getAttribute('data-id'));
            }); // Add a click event listener to select the option
            suggestionList.appendChild(li);
          }
        }
      });

      function selectOption(selectedId) {
        const selectedOption = searchoptions.find(option => option == selectedId);
        // const selectedId = this.getAttribute('data-id');
        const searchBox = document.getElementById('searchicon');
        const selectedIdInput = document.getElementById('searchDatalist');
        searchBox.value = selectedOption;
        selectedIdInput.value = selectedId;
        // document.getElementById('searchDatalist').innerHTML = '';

      }


      // // ------------------------------------------input option js-----------------------------

      searchInput.addEventListener("keyup", function (e) {

        // const searchresults = searchInput.value;
        if (e.key === 'Enter') {
          if (e.target.value) {
            let userData = e.target.value;
            console.log(userData, "userData")
            // Perform some action when the button is clicked

            console.log("Button clicked!");

            // let apiresult = getapidata(userData)
            // apiresult.then(response => { return response.json() })
            // apiresult.then(json => {
            //   console.log(json)
            //   getjsondata = json
            //   // return json
            // })

            const promise = getapidata(userData);
            promise.then((data) => {
              // getjsondata = { ...data }
              // Object.assign(getjsondata, data)

              console.log(data)
              if (data) {

                if (document.querySelector(".myDiv")) {

                  console.log("============")
                  const element = document.querySelector(".myDiv");

                  // Hide the element using the "visibility" property
                  element.style.display = "none";

                  content_append()
                } else if (document.querySelector(".myDiv") === null) {
                  console.log("$$$$$$$$$$$$$$$$")
                  content_append()
                }

                function content_append() {
                  const mainElement = document.querySelector('main');
                  const newDiv = document.createElement('div');
                  newDiv.classList.add('myDiv');
                  mainElement.prepend(newDiv);

                  const myDiv = document.querySelector('.myDiv');
                  ///////////////////////////////////////////////////////
                  console.log()
                  // console.log(key + "----" + json[key])
                  const title = document.createElement('h5');
                  title.classList.add('usertitle')
                  const contentid = document.createElement('h2');
                  contentid.classList.add('usercontentid')
                  // title.style.color = 'blue';
                  // contentid.style.color = 'red';
                  title.textContent = `Title :- ${data['title']}`;
                  contentid.textContent = `user id :- ${data['id']}`;
                  myDiv.appendChild(contentid);
                  myDiv.appendChild(title);
                }

              }
            });


          }
        }
      });

      async function getapidata(userData) {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/todos/' + userData);
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          const data = await response.json();
          return data;
        }
        catch (error) {
          console.error(`Could not get products: ${error}`);
        }
      }
      // const incontainer = toolinn.querySelectorAll('input');
      // const searchdata = document.getElementsByClassName('search-data');
      // const incontainermain = document.createElement('div')

      // incontainermain.id = 'containermain';
      // incontainer.forEach(input => {
      //   console.log(incontainer, "working");
      //   const div = document.createElement('div');
      //   const inputClone = input.cloneNode(true);
      //   div.appendChild(inputClone);
      //   input.parentNode.replaceChild(div, input);
      // });

      icontool.addEventListener('click', () => {
        // console.log("working click");
        var searchDatalist = document.getElementById('searchDatalist');
        // console.log(searchDatalist)
        if (searchInput.style.display != 'none' && searchDatalist.getElementsByTagName('li').length === 0) {
          searchInput.style.display = 'none';
          datalistContainer.style.display = 'none';
        } else {
          searchInput.style.display = 'block';
          datalistContainer.style.display = 'block';
        }

      });

    }
    // console.log(toolinn);
    // const searchInput = document.createElement('div');
    // searchInput.id = 'searchicon';
    // searchInput.innerHTML = toolinn.innerHTML;

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            nav.querySelectorAll('.nav-drop').forEach((e) => {
              e.classList.add('.menu-hoverstate');
            });
            const expanded = navSection.getAttribute('aria-expanded') === 'true';

            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            // navSection.childNodes[0].stopPropagation();
          }
        });
      });
    }
    const navSection3 = nav.querySelector('.nav-sections');
    if (navSection3) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('mouseup', () => {
        });
      });
    }
    const navSections1 = nav.querySelector('.nav-sections');
    if (navSections1) {
      navSections1.querySelectorAll(':scope > ul > li > ul >li').forEach((navSection) => {
        // console.log(navSection, "nav section")
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop1');
        navSection.addEventListener('click', (e) => {
          e.stopPropagation();
          // const ulel = e.target;
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSection);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      });
    }
    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;

    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    decorateIcons(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);
  };

}

window.addEventListener('click', function (event) {
  const isClickInside = this.document.querySelector('.nav-tools').contains(event.target);

  if (!isClickInside) {
    this.document.getElementById('searchDatalist').innerHTML = '';
    this.document.getElementById('searchDatalist').style.display = 'none';
    this.document.getElementById('searchicon').style.display = 'none'; // Hide the search div
  }
});

