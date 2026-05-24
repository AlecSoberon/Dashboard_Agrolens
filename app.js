const alerts = [
  {
    id: 'a1',
    title: 'Bajo vigor visual',
    location: 'Lote 3 — Sector norte',
    priority: 'high',
    priorityLabel: 'Alta',
    area: '0.8 ha',
    trees: 58,
    status: 'Nueva anomalía',
    issue: 'Menor vigor visual y copa irregular frente al patrón del lote.',
    action: 'Revisar uniformidad de riego, condición de hojas, estado de copa y posible presencia de plagas.',
    business: '4.3% del área evaluada requiere validación en esta zona.'
  },
  {
    id: 'a2',
    title: 'Variación de coloración',
    location: 'Lote 5 — Borde este',
    priority: 'medium',
    priorityLabel: 'Media',
    area: '0.5 ha',
    trees: 34,
    status: 'Nueva anomalía',
    issue: 'Coloración distinta frente a árboles cercanos.',
    action: 'Realizar inspección visual y comparar con registros recientes de riego.',
    business: 'Zona de borde que podría requerir manejo puntual.'
  },
  {
    id: 'a3',
    title: 'Menor cobertura de copa',
    location: 'Lote 2 — Zona central',
    priority: 'medium',
    priorityLabel: 'Media',
    area: '0.4 ha',
    trees: 21,
    status: 'Recurrente',
    issue: 'La copa se ve menos densa que árboles cercanos.',
    action: 'Revisar nutrición, estrés hídrico y manejo de poda.',
    business: 'Alerta recurrente que conviene cruzar con rendimiento y calidad por lote.'
  },
  {
    id: 'a4',
    title: 'Patrón irregular de copa',
    location: 'Lote 3 — Lado oeste',
    priority: 'high',
    priorityLabel: 'Alta',
    area: '0.3 ha',
    trees: 13,
    status: 'Nueva anomalía',
    issue: 'Patrón de copa irregular comparado contra la línea base del lote.',
    action: 'Validar en campo y revisar riego, poda y sanidad vegetal.',
    business: 'Refuerza la prioridad operativa del Lote 3.'
  }
];

const lots = [
  { lot: 'Lote 1', area: '4.2 ha', risk: 'Bajo', riskClass: 'low', highArea: '0.0 ha', trees: 8, trend: 'Estable', rec: 'Continuar monitoreo' },
  { lot: 'Lote 2', area: '3.8 ha', risk: 'Medio', riskClass: 'medium', highArea: '0.4 ha', trees: 21, trend: 'Estable', rec: 'Inspeccionar zona central' },
  { lot: 'Lote 3', area: '5.1 ha', risk: 'Alto', riskClass: 'high', highArea: '1.1 ha', trees: 71, trend: 'Empeoró', rec: 'Priorizar inspección' },
  { lot: 'Lote 4', area: '2.7 ha', risk: 'Bajo', riskClass: 'low', highArea: '0.0 ha', trees: 5, trend: 'Estable', rec: 'Sin acción urgente' },
  { lot: 'Lote 5', area: '2.6 ha', risk: 'Medio', riskClass: 'medium', highArea: '0.5 ha', trees: 34, trend: 'Empeoró', rec: 'Revisar borde este' }
];

const tasks = [
  { id: 't1', title: 'Inspeccionar Lote 3 sector norte', alert: 'Bajo vigor visual', lot: 'Lote 3', priority: 'Alta', assigned: 'Jefe de campo', due: '24 mayo 2026', done: false },
  { id: 't2', title: 'Revisar registros de riego en Lote 5', alert: 'Variación de coloración', lot: 'Lote 5', priority: 'Media', assigned: 'Agrónomo', due: '25 mayo 2026', done: false },
  { id: 't3', title: 'Validar menor cobertura de copa', alert: 'Menor cobertura de copa', lot: 'Lote 2', priority: 'Media', assigned: 'Técnico de campo', due: '25 mayo 2026', done: false },
  { id: 't4', title: 'Revisar patrón irregular en Lote 3 oeste', alert: 'Patrón irregular de copa', lot: 'Lote 3', priority: 'Alta', assigned: 'Jefe de campo', due: '24 mayo 2026', done: false }
];

const layerNotes = {
  vigor: 'Capa activa: Vigor visual. Muestra anomalías comparadas contra el patrón del lote.',
  trees: 'Capa activa: Árboles. Resalta puntos donde se detectaron anomalías visuales.',
  canopy: 'Capa activa: Cobertura de copa. Útil para comparar densidad visual entre lotes.',
  change: 'Capa activa: Cambio vs vuelo anterior. Resalta zonas nuevas o que empeoraron.',
  tasks: 'Capa activa: Tareas. Útil para validar qué alertas siguen pendientes en campo.'
};

let reviewedAlerts = 0;
let activeAlert = 'a1';

function badgeClass(priority) {
  if (priority === 'high') return 'high';
  if (priority === 'medium') return 'medium';
  return 'low';
}

function renderAlerts(filter = 'all') {
  const container = document.getElementById('alertsList');
  const filtered = alerts.filter(alert => filter === 'all' || alert.priority === filter);
  container.innerHTML = filtered.map(alert => `
    <article class="alert-card ${activeAlert === alert.id ? 'active' : ''}" data-alert-card="${alert.id}" data-priority="${alert.priority}">
      <div class="alert-top">
        <div>
          <h3>${alert.title}</h3>
          <div class="alert-location">${alert.location}</div>
        </div>
        <span class="badge ${badgeClass(alert.priority)}">${alert.priorityLabel}</span>
      </div>
      <div class="alert-metrics">
        <div><strong>${alert.area}</strong><span>Área afectada</span></div>
        <div><strong>${alert.trees}</strong><span>Árboles estimados</span></div>
      </div>
      <p><strong>${alert.status}.</strong> ${alert.issue}</p>
      <div class="card-actions">
        <button class="btn btn-secondary" data-view-alert="${alert.id}">Ver detalle</button>
        <button class="btn btn-ghost" data-task-alert="${alert.id}">Crear tarea</button>
        <button class="btn btn-ghost" data-review-alert="${alert.id}">Marcar revisada</button>
      </div>
    </article>
  `).join('');
}

function renderLots() {
  const cardContainer = document.getElementById('lotCards');
  const tableBody = document.getElementById('lotTableBody');
  cardContainer.innerHTML = lots.map(item => `
    <article class="lot-card">
      <div class="lot-card-head">
        <div><h3>${item.lot}</h3><span class="alert-location">${item.area}</span></div>
        <span class="badge ${item.riskClass === 'high' ? 'high' : item.riskClass === 'medium' ? 'medium' : 'low'}">Riesgo ${item.risk}</span>
      </div>
      <div class="lot-stats">
        <div><strong>${item.highArea}</strong><span>Alerta alta</span></div>
        <div><strong>${item.trees}</strong><span>Árboles</span></div>
        <div><strong>${item.trend}</strong><span>Tendencia</span></div>
      </div>
      <p class="alert-location" style="margin:12px 0 0">${item.rec}</p>
    </article>
  `).join('');

  tableBody.innerHTML = lots.map(item => `
    <tr>
      <td><strong>${item.lot}</strong></td>
      <td>${item.area}</td>
      <td><span class="badge ${item.riskClass === 'high' ? 'high' : item.riskClass === 'medium' ? 'medium' : 'low'}">${item.risk}</span></td>
      <td>${item.highArea}</td>
      <td>${item.trees}</td>
      <td>${item.trend}</td>
      <td>${item.rec}</td>
    </tr>
  `).join('');
}

function renderTasks() {
  const container = document.getElementById('taskList');
  container.innerHTML = tasks.map(task => `
    <article class="task-item ${task.done ? 'complete' : ''}">
      <div class="task-main">
        <strong>${task.title}</strong>
        <span>Alerta vinculada: ${task.alert}</span>
      </div>
      <button class="btn ${task.done ? 'btn-secondary' : 'btn-primary'}" data-toggle-task="${task.id}">${task.done ? 'Completada' : 'Cerrar tarea'}</button>
      <div class="task-meta">
        <span>${task.lot}</span>
        <span>Prioridad ${task.priority}</span>
        <span>Asignado a: ${task.assigned}</span>
        <span>Vence: ${task.due}</span>
      </div>
    </article>
  `).join('');

  const open = tasks.filter(task => !task.done).length;
  document.getElementById('openTaskCount').textContent = open;
  document.getElementById('reviewedCount').textContent = reviewedAlerts;
}

function setActiveAlert(alertId) {
  activeAlert = alertId;
  document.querySelectorAll('.alert-card').forEach(card => card.classList.toggle('active', card.dataset.alertCard === alertId));
  document.querySelectorAll('.alert-zone').forEach(zone => zone.style.opacity = zone.dataset.alert === alertId ? '1' : '0.42');
  document.querySelectorAll('.lot').forEach(lot => lot.classList.remove('selected'));
  const selectedLot = alertId === 'a2' ? 'lot5' : alertId === 'a3' ? 'lot2' : 'lot3';
  document.getElementById(selectedLot)?.classList.add('selected');
}

function openAlertModal(alertId) {
  const alert = alerts.find(item => item.id === alertId);
  if (!alert) return;
  const modal = document.getElementById('alertModal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <p class="eyebrow">Detalle de alerta</p>
    <h2 id="modalTitle" class="modal-title">${alert.title} — ${alert.location}</h2>
    <span class="badge ${badgeClass(alert.priority)}">Prioridad ${alert.priorityLabel}</span>
    <div class="modal-grid">
      <div class="modal-metric"><strong>${alert.area}</strong><span>Área afectada</span></div>
      <div class="modal-metric"><strong>${alert.trees}</strong><span>Árboles estimados</span></div>
      <div class="modal-metric"><strong>Media-alta</strong><span>Confianza visual</span></div>
      <div class="modal-metric"><strong>${alert.status}</strong><span>Comparación histórica</span></div>
    </div>
    <h3>Impacto para el fundo</h3>
    <p>${alert.business}</p>
    <h3>Evidencia visual</h3>
    <div class="evidence-grid">
      <div class="evidence-box">Imagen aérea del sector</div>
      <div class="evidence-box">Zoom de copa</div>
      <div class="evidence-box">Comparación saludable</div>
      <div class="evidence-box">Vuelo anterior</div>
    </div>
    <h3>Interpretación</h3>
    <p>Esta zona presenta menor uniformidad visual frente al resto del lote. La diferencia puede estar asociada a estrés hídrico, nutrición, presión sanitaria, poda o variabilidad del suelo. AgroLens recomienda validar el hallazgo en campo antes de tomar decisiones agronómicas.</p>
    <h3>Checklist sugerido</h3>
    <ul class="checklist">
      <li>Revisar presión y uniformidad de riego.</li>
      <li>Inspeccionar hojas, copa y condición general del árbol.</li>
      <li>Buscar señales de plagas o enfermedades.</li>
      <li>Comparar con fertirriego, riego y labores recientes.</li>
      <li>Subir foto de campo después de la inspección.</li>
    </ul>
    <div class="card-actions">
      <button class="btn btn-primary" data-task-alert="${alert.id}">Crear tarea</button>
      <button class="btn btn-secondary" data-review-alert="${alert.id}">Marcar revisada</button>
      <button class="btn btn-ghost" id="fieldNoteBtn">Agregar nota</button>
      <button class="btn btn-ghost" id="falsePositiveBtn">Falso positivo</button>
    </div>
  `;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  const modal = document.getElementById('alertModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function updateNav(sectionId) {
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
}

function initNavObserver() {
  const sections = ['summary', 'map', 'alerts', 'lots', 'tasks', 'history', 'report']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) updateNav(entry.target.id);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

function wireEvents() {
  document.addEventListener('click', event => {
    const alertCard = event.target.closest('[data-alert-card]');
    if (alertCard && !event.target.closest('button')) {
      const alertId = alertCard.dataset.alertCard;
      setActiveAlert(alertId);
      openAlertModal(alertId);
    }

    const viewBtn = event.target.closest('[data-view-alert]');
    if (viewBtn) {
      setActiveAlert(viewBtn.dataset.viewAlert);
      openAlertModal(viewBtn.dataset.viewAlert);
    }

    const taskBtn = event.target.closest('[data-task-alert]');
    if (taskBtn) {
      const alert = alerts.find(item => item.id === taskBtn.dataset.taskAlert);
      showToast(`Tarea creada para: ${alert?.title || 'alerta'}`);
    }

    const reviewBtn = event.target.closest('[data-review-alert]');
    if (reviewBtn) {
      reviewedAlerts = Math.min(4, reviewedAlerts + 1);
      renderTasks();
      showToast('Alerta marcada como revisada.');
    }

    const taskToggle = event.target.closest('[data-toggle-task]');
    if (taskToggle) {
      const task = tasks.find(item => item.id === taskToggle.dataset.toggleTask);
      if (task) task.done = !task.done;
      renderTasks();
      showToast(task?.done ? 'Tarea cerrada.' : 'Tarea reabierta.');
    }

    if (event.target.closest('[data-close-modal]')) closeModal();

    if (event.target.id === 'fieldNoteBtn') showToast('Nota de campo agregada al prototipo.');
    if (event.target.id === 'falsePositiveBtn') showToast('Marcado como falso positivo para reentrenamiento.');
  });

  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderAlerts(button.dataset.filter);
      setActiveAlert(activeAlert);
    });
  });

  document.querySelectorAll('.layer-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.layer-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const layer = button.dataset.layer;
      document.querySelector('.farm-map').dataset.layer = layer;
      document.getElementById('layerNote').textContent = layerNotes[layer];
    });
  });

  document.querySelectorAll('.alert-zone').forEach(zone => {
    zone.addEventListener('click', () => {
      setActiveAlert(zone.dataset.alert);
      openAlertModal(zone.dataset.alert);
    });
  });

  document.getElementById('downloadBtn').addEventListener('click', () => window.print());
  document.getElementById('printReportBtn').addEventListener('click', () => window.print());
  document.getElementById('shareBtn').addEventListener('click', async () => {
    const shareData = {
      title: 'Reporte AgroLens — Fundo Santa Rosa',
      text: 'AgroLens identificó 1.6 ha que deberían revisarse primero en el Lote 3.',
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (error) { /* user cancelled */ }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      showToast('Link copiado al portapapeles.');
    }
  });
}

renderAlerts();
renderLots();
renderTasks();
wireEvents();
initNavObserver();
setActiveAlert('a1');
