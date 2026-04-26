import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// count number of projects
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.innerHTML = `${projects.length} Projects`;
}