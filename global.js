console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

// let navLinks = $$('nav a')
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
// );

// if (currentLink) {
//     currentLink.classList.add('current');
// }

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume'},
    { url: 'contact/', title: 'Contact'},
    { url: 'https://github.com/kgtam-byte', title: 'GitHub Profile'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = "_blank"
    }
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
                <option value="light dark"> Automatic </option>
                <option value="dark"> Dark </option>
                <option value="light"> Light </option>
          </select>
      </label>`,
);

let select = document.querySelector('select') 

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
});

if ('colorScheme' in localStorage) {
    select.value = localStorage.colorScheme;
    document.documentElement.style.setProperty(
        'color-scheme',
        localStorage.colorScheme
    );
}

// 
export async function fetchJSON(url) {
    try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      console.log(response);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    }
  }

  export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    
    for (const project of projects) {
      const article = document.createElement('article');
      
      article.innerHTML = `
        <h3>${project.title}</h3>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
    `;
      
      containerElement.appendChild(article);
    }
  }

// API fetching
export async function fetchGitHubData(username) {
    // return statement here
    return fetchJSON(`https://api.github.com/users/${username}`);
  }