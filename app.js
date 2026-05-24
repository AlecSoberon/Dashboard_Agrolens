const alerts = [
  { title: 'Bajo vigor visual', place: 'Lote 3 · Sector norte', level: 'Prioridad alta', area: '0.8 ha', trees: 58, action: 'Validar riego, copa, hojas y señales sanitarias.' },
  { title: 'Patrón irregular de copa', place: 'Lote 3 · Lado oeste', level: 'Prioridad alta', area: '0.3 ha', trees: 13, action: 'Revisar poda, riego localizado y condición de árboles marcados.' },
  { title: 'Variación de coloración', place: 'Lote 5 · Borde este', level: 'Revisar', area: '0.5 ha', trees: 34, action: 'Comparar con registros de riego y fertirriego.' },
  { title: 'Menor cobertura de copa', place: 'Lote 2 · Zona central', level: 'Recurrente', area: '0.4 ha', trees: 21, action: 'Cruzar con historial y validar nutrición/estrés hídrico.' }
];

function renderAlerts() {
  const list = document.getElementById('alertList');
  if (!list) return;
  list.innerHTML = alerts.map((item, index) => `
    <article class="alert-item ${index < 2 ? 'high' : ''}">
      <div class="alert-item-head">
        <span>${item.level}</span>
        <strong>${item.area}</strong>
      </div>
      <h4>${item.title}</h4>
      <p>${item.place}</p>
      <div class="alert-meta"><span>${item.trees} árboles</span><span>${item.action}</span></div>
    </article>
  `).join('');
}

function money(value) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(value);
}

function updateSimulator() {
  const total = parseFloat(document.getElementById('totalArea')?.value || '0');
  const priority = Math.min(parseFloat(document.getElementById('priorityArea')?.value || '0'), total);
  const minutes = parseFloat(document.getElementById('minutesHa')?.value || '0');
  const team = Math.max(parseFloat(document.getElementById('teamSize')?.value || '1'), 1);
  const hourly = parseFloat(document.getElementById('hourlyCost')?.value || '0');

  const areaAvoided = Math.max(total - priority, 0);
  const totalHours = total * minutes / 60 / team;
  const focusHours = priority * minutes / 60 / team;
  const savedHours = Math.max(totalHours - focusHours, 0);
  const savedCost = savedHours * team * hourly;

  document.getElementById('areaAvoided').textContent = `${areaAvoided.toFixed(1)} ha`;
  document.getElementById('hoursSaved').textContent = `${savedHours.toFixed(1)} h`;
  document.getElementById('costSaved').textContent = money(savedCost);
  document.getElementById('simMessage').textContent = `El equipo empieza por ${priority.toFixed(1)} ha en vez de recorrer ${total.toFixed(1)} ha completas.`;
}

function setActiveNav() {
  const sections = [...document.querySelectorAll('section[id]')];
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const current = sections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top < 120 && rect.bottom > 120;
  });
  if (!current) return;
  links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`));
}

function init() {
  renderAlerts();
  updateSimulator();
  ['totalArea', 'priorityArea', 'minutesHa', 'teamSize', 'hourlyCost'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSimulator);
  });
  document.getElementById('printButton')?.addEventListener('click', () => window.print());
  document.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();
}

document.addEventListener('DOMContentLoaded', init);
