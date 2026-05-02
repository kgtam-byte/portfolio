import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// count number of projects
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.innerHTML = `${projects.length} Projects`;
}

// let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// let rolledData = d3.rollups(
//   projects,
//   (v) => v.length,
//   (d) => d.year,
// );

// let data = rolledData.map(([year, count]) => {
//   return { value: count, label: year };
// });

// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));

// arcs.forEach((arc, idx) => {
//   d3.select('#projects-plot')
//     .append('path')
//     .attr('d', arc)
//     .attr('fill', colors(idx));
// })

// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//   legend
//     .append('li')
//     .attr('style', `--color:${colors(idx)}`)
//     .attr('class', 'legend-item')
//     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
// });

function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  // TODO: clear up paths and legends
  let svg = d3.select('#projects-plot');
  svg.selectAll('path').remove();

  // update paths and legends, refer to steps 1.4 and 2.2
  newArcs.forEach((arc, i) => {
    svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;
    
      svg
        .selectAll('path')
        .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');
      
      legend
        .selectAll('li')
        .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

      if (selectedIndex === -1) {
        renderProjects(projectsGiven, projectsContainer, 'h2');
      } else {
        // TODO: filter projects and project them onto webpage
        // Hint: `.label` might be useful
        let selectedYear = newData[selectedIndex].label;
        let filteredProjects = projectsGiven.filter((project) => project.year === selectedYear);
        renderProjects(filteredProjects, projectsContainer, 'h2');
      }
    });
});

  let legend = d3.select('.legend');
  legend.html('');
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
      
        svg
          .selectAll('path')
          .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');

        legend
          .selectAll('li')
          .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');

          if (selectedIndex === -1) {
            renderProjects(projectsGiven, projectsContainer, 'h2');
          } else {
            // TODO: filter projects and project them onto webpage
            // Hint: `.label` might be useful
            let selectedYear = newData[selectedIndex].label;
            let filteredProjects = projectsGiven.filter((project) => project.year === selectedYear);
            renderProjects(filteredProjects, projectsContainer, 'h2');
          }

      });
  });
}

// Call this function on page load
renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // filter projects

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects); 
});


let selectedIndex = -1;
