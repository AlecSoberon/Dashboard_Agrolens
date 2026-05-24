const alerts = [
  {
    id: "a1",
    title: "Bajo vigor visual",
    location: "Lote 3 · Sector norte",
    level: "high",
    levelLabel: "Prioridad",
    area: "0.8 ha",
    share: "4.3%",
    trees: 58,
    status: "Nueva",
    summary: "La copa y coloración se ven menos uniformes que el patrón normal del lote.",
    action: "Revisar uniformidad de riego, estado de hojas, copa y señales sanitarias.",
    business: "Es la zona que más conviene visitar primero porque concentra más árboles marcados y explica gran parte del aumento frente al vuelo anterior.",
    lot: "lot3"
  },
  {
    id: "a4",
    title: "Patrón irregular de copa",
    location: "Lote 3 · Lado oeste",
    level: "high",
    levelLabel: "Prioridad",
    area: "0.3 ha",
    share: "1.6%",
    trees: 13,
    status: "Nueva",
    summary: "Diferencia visible en densidad y forma de copa frente a árboles cercanos.",
    action: "Validar riego localizado, poda reciente y condición sanitaria del sector.",
    business: "Refuerza que el Lote 3 debe ser la primera visita del equipo de campo.",
    lot: "lot3"
  },
  {
    id: "a2",
    title: "Variación de coloración",
    location: "Lote 5 · Borde este",
    level: "medium",
    levelLabel: "Revisar",
    area: "0.5 ha",
    share: "2.7%",
    trees: 34,
    status: "Nueva",
    summary: "El borde este se ve distinto al resto del lote y podría estar respondiendo diferente al manejo.",
    action: "Inspección visual y revisión de registros recientes de riego y fertirriego.",
    business: "Puede indicar un problema de borde o distribución que conviene revisar antes de que crezca.",
    lot: "lot5"
  },
  {
    id: "a3",
    title: "Menor cobertura de copa",
    location: "Lote 2 · Zona central",
    level: "medium",
    levelLabel: "Revisar",
    area: "0.4 ha",
    share: "2.2%",
    trees: 21,
    status: "Recurrente",
    summary: "La copa se ve menos densa que árboles cercanos y ya apareció en el vuelo anterior.",
    action: "Revisar nutrición, estrés hídrico, poda y condición de raíces.",
    business: "Al ser recurrente, debe cruzarse luego con rendimiento, calibre o packout del lote.",
    lot: "lot2"
  }
];

const lots = [
  { name: "Lote 1", area: "4.2 ha", level: "low", priority: "Baja", validate: "0.0 ha", trees: 8, trend: "Estable", action: "Continuar monitoreo" },
  { name: "Lote 2", area: "3.8 ha", level: "medium", priority: "Media", validate: "0.4 ha", trees: 21, trend: "Estable", action: "Inspeccionar zona central" },
  { name: "Lote 3", area: "5.1 ha", level: "high", priority: "Alta", validate: "1.1 ha", trees: 71, trend: "Empeoró", action: "Priorizar visita" },
  { name: "Lote 4", area: "2.7 ha", level: "low", priority: "Baja", validate: "0.0 ha", trees: 5, trend: "Estable", action: "Sin acción urgente" },
  { name: "Lote 5", area: "2.6 ha", level: "medium", priority: "Media", validate: "0.5 ha", trees: 34, trend: "Empeoró", action: "Revisar borde este" }
];

const tasks = [
  { id: "t1", title: "Visitar Lote 3 sector norte", alert: "Bajo vigor visual", lot: "Lote 3", priority: "Alta", owner: "Jefe de campo", due: "24 mayo", done: false },
  { id: "t2", title: "Revisar riego del Lote 5", alert: "Variación de coloración", lot: "Lote 5", priority: "Media", owner: "Agrónomo", due: "25 mayo", done: false },
  { id: "t3", title: "Validar cobertura en Lote 2", alert: "Menor cobertura de copa", lot: "Lote 2", priority: "Media", owner: "Técnico", due: "25 mayo", done: false },
  { id: "t4", title: "Revisar Lote 3 lado oeste", alert: "Patrón irregular de copa", lot: "Lote 3", priority: "Alta", owner: "Jefe de campo", due: "24 mayo", done: false }
];

const layerCopy = {
  vigor: "Capa activa: vigor visual. Muestra zonas que se ven distintas frente al patrón esperado del lote.",
  arboles: "Capa activa: árboles. Resalta puntos que conviene visitar durante la inspección.",
  copa: "Capa activa: cobertura de copa. Ayuda a comparar densidad y uniformidad entre sectores.",
  cambios: "Capa activa: cambios. Diferencia alertas nuevas de alertas recurrentes.",
  tareas: "Capa activa: tareas. Muestra zonas ya asignadas al equipo de campo."
};

let activeAlertId = "a1";
const reviewedAlerts = new Set();

function badgeClass(level) {
  if (level === "high") return "high";
  if (level === "medium") return "medium";
  return "low";
}

function renderRouteList() {
  const routeList = document.getElementById("routeList");
  routeList.innerHTML = alerts.map((alert, index) => `
    <article class="route-item ${alert.id === activeAlertId ? "active" : ""}" data-route-alert="${alert.id}" tabindex="0">
      <div class="route-item-head">
        <h3>${index + 1}. ${alert.location}</h3>
        <span class="badge ${badgeClass(alert.level)}">${alert.levelLabel}</span>
      </div>
      <p>${alert.area} · ${alert.trees} árboles · ${alert.title}</p>
    </article>
  `).join("");
}

function renderAlerts(filter = "all") {
  const alertList = document.getElementById("alertList");
  const filtered = alerts.filter(alert => filter === "all" || alert.level === filter);

  alertList.innerHTML = filtered.map(alert => `
    <article class="alert-card ${alert.id === activeAlertId ? "active" : ""}" data-alert-card="${alert.id}">
      <div class="alert-head">
        <div>
          <h3>${alert.title}</h3>
          <div class="muted">${alert.location}</div>
        </div>
        <span class="badge ${badgeClass(alert.level)}">${alert.levelLabel}</span>
      </div>

      <div class="alert-metrics">
        <div><strong>${alert.area}</strong><span>Área</span></div>
        <div><strong>${alert.trees}</strong><span>Árboles</span></div>
        <div><strong>${alert.status}</strong><span>Historial</span></div>
      </div>

      <p>${alert.summary}</p>
      <p><strong>Qué validar:</strong> ${alert.action}</p>

      <div class="card-actions">
        <button class="button primary" type="button" data-open-alert="${alert.id}">Detalle</button>
        <button class="button secondary" type="button" data-focus-alert="${alert.id}">Ver mapa</button>
        <button class="button ghost" type="button" data-review-alert="${alert.id}">${reviewedAlerts.has(alert.id) ? "Revisada" : "Marcar revisada"}</button>
      </div>
    </article>
  `).join("");
}

function renderLots() {
  const lotGrid = document.getElementById("lotGrid");
  const lotTable = document.getElementById("lotTable");

  lotGrid.innerHTML = lots.map(lot => `
    <article class="lot-card">
      <div class="lot-card-head">
        <div>
          <h3>${lot.name}</h3>
          <div class="muted">${lot.area}</div>
        </div>
        <span class="badge ${badgeClass(lot.level)}">${lot.priority}</span>
      </div>
      <div class="lot-stats">
        <div><strong>${lot.validate}</strong><span>Validar</span></div>
        <div><strong>${lot.trees}</strong><span>Árboles</span></div>
        <div><strong>${lot.trend}</strong><span>Tendencia</span></div>
      </div>
      <p class="muted">${lot.action}</p>
    </article>
  `).join("");

  lotTable.innerHTML = lots.map(lot => `
    <tr>
      <td><strong>${lot.name}</strong></td>
      <td>${lot.area}</td>
      <td><span class="badge ${badgeClass(lot.level)}">${lot.priority}</span></td>
      <td>${lot.validate}</td>
      <td>${lot.trees}</td>
      <td>${lot.trend}</td>
      <td>${lot.action}</td>
    </tr>
  `).join("");
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = tasks.map(task => `
    <article class="task-item ${task.done ? "done" : ""}">
      <div class="task-main">
        <strong>${task.title}</strong>
        <span>${task.alert} · ${task.lot}</span>
      </div>
      <button class="button ${task.done ? "secondary" : "primary"}" type="button" data-task="${task.id}">${task.done ? "Reabrir" : "Cerrar tarea"}</button>
      <div class="task-meta">
        <span>Prioridad ${task.priority}</span>
        <span>${task.owner}</span>
        <span>Vence: ${task.due}</span>
      </div>
    </article>
  `).join("");

  const closed = tasks.filter(task => task.done).length;
  const open = tasks.length - closed;
  document.getElementById("closedTasks").textContent = `${closed}/${tasks.length}`;
  document.getElementById("openTasksTop").textContent = open;
}

function setActiveAlert(alertId) {
  activeAlertId = alertId;
  const alert = alerts.find(item => item.id === alertId);

  document.querySelectorAll("[data-alert-zone]").forEach(zone => {
    const isActive = zone.dataset.alertZone === alertId;
    zone.classList.toggle("active-zone", isActive);
    zone.style.opacity = isActive ? "1" : ".42";
  });

  document.querySelectorAll(".lot").forEach(lot => lot.classList.remove("selected"));
  if (alert?.lot) document.getElementById(alert.lot)?.classList.add("selected");

  document.querySelectorAll("[data-route-alert]").forEach(card => {
    card.classList.toggle("active", card.dataset.routeAlert === alertId);
  });
  document.querySelectorAll("[data-alert-card]").forEach(card => {
    card.classList.toggle("active", card.dataset.alertCard === alertId);
  });
}

function openModal(alertId) {
  const alert = alerts.find(item => item.id === alertId);
  if (!alert) return;
  setActiveAlert(alertId);

  const modal = document.getElementById("alertModal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <span class="overline">Detalle de alerta</span>
    <h2 class="modal-title" id="modalTitle">${alert.title} · ${alert.location}</h2>
    <span class="badge ${badgeClass(alert.level)}">${alert.levelLabel}</span>

    <div class="modal-metrics">
      <div><strong>${alert.area}</strong><span>Área</span></div>
      <div><strong>${alert.trees}</strong><span>Árboles</span></div>
      <div><strong>${alert.share}</strong><span>Área evaluada</span></div>
      <div><strong>${alert.status}</strong><span>Historial</span></div>
    </div>

    <h3>Lectura para el fundo</h3>
    <p class="muted">${alert.business}</p>

    <h3>Evidencia visual</h3>
    <div class="evidence-grid">
      <figure class="evidence with-image"><img src="assets/saas-aerial-overview.png" alt="Vista general del fundo" /><figcaption>Vista general del fundo</figcaption></figure>
      <figure class="evidence with-image"><img src="assets/saas-anomaly-zone.png" alt="Zoom de la zona prioritaria" /><figcaption>Zoom de la zona prioritaria</figcaption></figure>
      <figure class="evidence with-image"><img src="assets/saas-healthy-vs-weak.png" alt="Comparación con una referencia sana" /><figcaption>Comparación con una referencia sana</figcaption></figure>
      <figure class="evidence with-image"><img src="assets/saas-field-inspection.png" alt="Validación en campo" /><figcaption>Qué se valida en campo</figcaption></figure>
    </div>

    <h3>Qué validar en campo</h3>
    <p class="muted">${alert.action}</p>
    <ul class="checklist">
      <li>Revisar presión y uniformidad de riego.</li>
      <li>Inspeccionar hojas, copa y condición general de los árboles marcados.</li>
      <li>Buscar señales visibles de plagas, enfermedad o estrés.</li>
      <li>Comparar con fertirriego, riego y labores recientes.</li>
      <li>Subir foto de campo y comentario después de la visita.</li>
    </ul>

    <div class="card-actions">
      <button class="button primary" type="button" data-create-task="${alert.id}">Crear tarea</button>
      <button class="button secondary" type="button" data-review-alert="${alert.id}">${reviewedAlerts.has(alert.id) ? "Revisada" : "Marcar revisada"}</button>
      <button class="button ghost" type="button" data-note="${alert.id}">Agregar nota</button>
      <button class="button soft-red" type="button" data-false-positive="${alert.id}">Falso positivo</button>
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  const modal = document.getElementById("alertModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function updateReviewed() {
  const activeFilter = document.querySelector(".filter.active")?.dataset.filter || "all";
  renderAlerts(activeFilter);
  setActiveAlert(activeAlertId);
}

function updateNav(sectionId) {
  document.querySelectorAll("[data-nav]").forEach(item => {
    item.classList.toggle("active", item.dataset.nav === sectionId);
  });
}

function bindEvents() {
  document.addEventListener("click", event => {
    const route = event.target.closest("[data-route-alert]");
    const open = event.target.closest("[data-open-alert]");
    const focus = event.target.closest("[data-focus-alert]");
    const zone = event.target.closest("[data-alert-zone]");
    const layer = event.target.closest("[data-layer]");
    const filter = event.target.closest("[data-filter]");
    const review = event.target.closest("[data-review-alert]");
    const task = event.target.closest("[data-task]");
    const close = event.target.closest("[data-close-modal]");
    const createTask = event.target.closest("[data-create-task]");
    const note = event.target.closest("[data-note]");
    const falsePositive = event.target.closest("[data-false-positive]");

    if (route) setActiveAlert(route.dataset.routeAlert);
    if (open) openModal(open.dataset.openAlert);
    if (focus) {
      setActiveAlert(focus.dataset.focusAlert);
      document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (zone?.dataset.alertZone) openModal(zone.dataset.alertZone);
    if (layer) {
      document.querySelectorAll(".layer-pill").forEach(button => button.classList.remove("active"));
      layer.classList.add("active");
      document.getElementById("mapNote").textContent = layerCopy[layer.dataset.layer] || layerCopy.vigor;
    }
    if (filter) {
      document.querySelectorAll(".filter").forEach(button => button.classList.remove("active"));
      filter.classList.add("active");
      renderAlerts(filter.dataset.filter);
      setActiveAlert(activeAlertId);
    }
    if (review) {
      reviewedAlerts.add(review.dataset.reviewAlert);
      updateReviewed();
      showToast("Alerta marcada como revisada.");
    }
    if (task) {
      const item = tasks.find(t => t.id === task.dataset.task);
      if (item) {
        item.done = !item.done;
        renderTasks();
        showToast(item.done ? "Tarea cerrada." : "Tarea reabierta.");
      }
    }
    if (close) closeModal();
    if (createTask) showToast("Tarea creada para el equipo de campo.");
    if (note) showToast("Nota agregada al reporte.");
    if (falsePositive) showToast("Marcado como falso positivo para revisión del modelo.");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-route-alert]")) {
      event.preventDefault();
      setActiveAlert(event.target.dataset.routeAlert);
    }
  });

  document.getElementById("printButton")?.addEventListener("click", () => window.print());
  document.getElementById("printButton2")?.addEventListener("click", () => window.print());

  document.getElementById("shareButton")?.addEventListener("click", async () => {
    const data = { title: "Reporte AgroLens", text: "Reporte de vuelo del Fundo Santa Rosa", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copiado al portapapeles.");
      }
    } catch {
      showToast("No se pudo compartir. Puedes copiar el link del navegador.");
    }
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) updateNav(entry.target.id);
    });
  }, { threshold: .2, rootMargin: "-18% 0px -65% 0px" });
  sections.forEach(section => observer.observe(section));
}


function formatMoney(value) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(value);
}

function updateImpactSimulator() {
  const total = parseFloat(document.getElementById("simTotalArea")?.value || "0");
  const priority = parseFloat(document.getElementById("simPriorityArea")?.value || "0");
  const minutesPerHa = parseFloat(document.getElementById("simMinutesPerHa")?.value || "0");
  const teamSize = parseFloat(document.getElementById("simTeamSize")?.value || "1");
  const hourlyCost = parseFloat(document.getElementById("simHourlyCost")?.value || "0");

  const safePriority = Math.min(priority, total);
  const areaAvoided = Math.max(total - safePriority, 0);
  const allHours = teamSize > 0 ? (total * minutesPerHa / 60) / teamSize : 0;
  const focusedHours = teamSize > 0 ? (safePriority * minutesPerHa / 60) / teamSize : 0;
  const hoursSaved = Math.max(allHours - focusedHours, 0);
  const laborHoursSaved = hoursSaved * Math.max(teamSize, 1);
  const costSaved = laborHoursSaved * hourlyCost;

  document.getElementById("simAreaAvoided").textContent = `${areaAvoided.toFixed(1)} ha`;
  document.getElementById("simHoursSaved").textContent = `${hoursSaved.toFixed(1)} h`;
  document.getElementById("simCostSaved").textContent = formatMoney(costSaved);
  document.getElementById("simNarrative").textContent = `El equipo puede empezar por ${safePriority.toFixed(1)} ha en vez de recorrer ${total.toFixed(1)} ha completas.`;
}

function init() {
  renderRouteList();
  renderAlerts();
  renderLots();
  renderTasks();
  setActiveAlert(activeAlertId);
  bindEvents();
  updateImpactSimulator();
  ["simTotalArea", "simPriorityArea", "simMinutesPerHa", "simTeamSize", "simHourlyCost"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", updateImpactSimulator);
  });
}

init();
