/* =========================================================
   Prism Outreach Studio — Centralized Interactive Calendar
   ========================================================= */

const CAL_PIN = "476848674";
let isCalUnlocked = false;
let draggedEventId = null;

const EVENT_COLORS = {
  cdl: "#38bdf8",
  choir: "#fbbf24",
  special: "#e74c3c",
  atelier: "#a855f7"
};

const EVENT_LABELS = {
  cdl: { fr: "café des langues", en: "café des langues" },
  choir: { fr: "rennes english choir", en: "rennes english choir" },
  special: { fr: "événement spécial", en: "special event" },
  atelier: { fr: "atelier / cours", en: "workshop / class" }
};

// Default Events with Schedules
const defaultCalendarEvents = [
  {
    id: 1,
    title_fr: "café des langues",
    title_en: "café des langues",
    description_fr: "rencontre hebdomadaire au bar pour pratiquer plus de 53 langues dans une ambiance conviviale.",
    description_en: "weekly bar gathering to practice over 53 languages in a friendly environment.",
    event_type: "cdl",
    event_date: "2026-09-02",
    start_time: "19:00",
    end_time: "22:00",
    location: "café des artistes, rennes",
    schedule: [
      { time: "19h00 - 20h00", fr: "discussion libre aux tables de langues", en: "open discussion at language tables" },
      { time: "20h00 - 21h00", fr: "speed dating par langue (changement toutes les 15 min)", en: "language speed dating (switch every 15 mins)" },
      { time: "21h00 - 22h00", fr: "discussion libre aux tables de langues", en: "open discussion at language tables" }
    ]
  },
  {
    id: 2,
    title_fr: "répétition rennes english choir",
    title_en: "rennes english choir rehearsal",
    description_fr: "répétition de la chorale anglophone dirigée par un chef natif.",
    description_en: "rehearsal for the english choir directed by a native speaker.",
    event_type: "choir",
    event_date: "2026-09-03",
    start_time: "19:30",
    end_time: "21:30",
    location: "maison de quartier, rennes",
    schedule: [
      { time: "19h30 - 20h00", fr: "accueil & échauffement vocal", en: "welcome & vocal warmup" },
      { time: "20h00 - 20h45", fr: "répétition partie 1 (travail du répertoire)", en: "rehearsal part 1 (repertoire work)" },
      { time: "20h45 - 21h00", fr: "pause & échanges", en: "break & social time" },
      { time: "21h00 - 21h30", fr: "répétition partie 2 & chant d'ensemble", en: "rehearsal part 2 & group singing" }
    ]
  }
];

let calendarEvents = JSON.parse(localStorage.getItem('pos_calendar_events')) || defaultCalendarEvents;

let calState = {
  currentView: "month",
  currentDate: new Date(),
  activeFilters: new Set(["cdl", "choir", "special", "atelier"]),
  language: "fr"
};

/* --- Dynamic Styles Injection --- */
function injectCalendarStyles() {
  if (document.getElementById('pos-cal-styles')) return;
  const style = document.createElement('style');
  style.id = 'pos-cal-styles';
  style.textContent = `
    .cal-toolbar-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--card-border); }
    .cal-filters { display: flex; flex-wrap: wrap; gap: 12px; }
    .cal-filter-item { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; cursor: pointer; }
    .cal-filter-checkbox { accent-color: var(--cdl-cyan, #38bdf8); width: 15px; height: 15px; cursor: pointer; }
    .cal-admin-tools { display: flex; gap: 10px; }
    .cal-btn-sec { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12.5px; cursor: pointer; }
    .cal-btn-sec.unlocked { background: rgba(34, 197, 94, 0.2); border-color: #22c55e; color: #86efac; }
    .cal-btn-add { background: var(--neon-amber, #f59e0b); color: #000; border: none; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12.5px; cursor: pointer; display: none; }
    .cal-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
    .cal-nav-group, .cal-view-group { display: flex; gap: 6px; }
    .cal-btn { background: rgba(255, 255, 255, 0.06); border: 1px solid var(--card-border); color: var(--text-main); padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; }
    .cal-btn.active { background: var(--cdl-cyan, #38bdf8); color: #000; }
    .cal-month-title { font-size: 20px; font-weight: 700; color: var(--cdl-cyan, #38bdf8); text-transform: lowercase; }
    .weekdays-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 700; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
    .month-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
    .day-cell { min-height: 100px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 8px; display: flex; flex-direction: column; transition: border-color 0.2s ease; }
    .day-cell.drag-over { border: 2px dashed var(--neon-amber, #f59e0b); background: rgba(245, 158, 11, 0.1); }
    .day-cell.other-month { opacity: 0.35; }
    .day-cell.today { border: 2px solid var(--cdl-cyan, #38bdf8); box-shadow: 0 0 12px rgba(56, 189, 248, 0.3); }
    .day-number { font-weight: 700; font-size: 13px; margin-bottom: 6px; }
    .day-events { display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
    .event-pill { font-size: 11px; font-weight: 700; padding: 3px 6px; border-radius: 4px; color: #000; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; user-select: none; }
    .event-pill[draggable="true"] { cursor: grab; }
    .event-pill[draggable="true"]:active { cursor: grabbing; opacity: 0.6; }
    .upcoming-section { margin-top: 35px; padding-top: 20px; border-top: 1px dashed rgba(255, 255, 255, 0.1); }
    .upcoming-title { font-size: 17px; font-weight: 700; color: var(--neon-amber, #f59e0b); margin-bottom: 15px; }
    .event-row { display: flex; align-items: center; gap: 15px; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--card-border); border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; cursor: pointer; }
    .event-color-bar { width: 6px; height: 38px; border-radius: 4px; }
    .event-date-box { text-align: center; min-width: 40px; }
    .event-date-day { font-size: 18px; font-weight: 700; line-height: 1; }
    .event-date-month { font-size: 11px; color: var(--text-muted); }
    
    /* Calendar Schedule Timeline Styling inside Modal */
    .cal-modal-timeline { position: relative; padding-left: 18px; border-left: 2px solid var(--cdl-cyan, #38bdf8); margin: 15px 0; text-align: left; }
    .cal-modal-item { position: relative; margin-bottom: 12px; padding-left: 15px; }
    .cal-modal-item::before { content: ''; position: absolute; left: -24px; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--cdl-cyan, #38bdf8); }
    .cal-modal-badge { display: inline-block; background: rgba(56, 189, 248, 0.15); color: var(--cdl-cyan, #38bdf8); font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 12px; margin-bottom: 4px; }
  `;
  document.head.appendChild(style);
}

/* --- Mounting HTML Markup --- */
function mountCalendarHTML() {
  const target = document.getElementById('pos-calendar');
  if (!target) return;

  target.innerHTML = `
    <div class="cal-toolbar-top">
      <div class="cal-filters" id="cal-filters"></div>
      <div class="cal-admin-tools">
        <button id="cal-lock-btn" class="cal-btn-sec" onclick="toggleCalLock()">🔒 <span id="cal-lock-label">verrouillé</span></button>
        <button id="cal-add-btn" class="cal-btn-add" onclick="addNewCalEvent()">➕ ajouter un événement</button>
      </div>
    </div>

    <div class="cal-header">
      <div class="cal-nav-group">
        <button class="cal-btn" onclick="navCal(-1)">‹</button>
        <button class="cal-btn" onclick="navCalToday()" id="btn-cal-today">aujourd'hui</button>
        <button class="cal-btn" onclick="navCal(1)">›</button>
      </div>
      <h2 class="cal-month-title" id="cal-title">...</h2>
      <div class="cal-view-group">
        <button class="cal-btn view-btn active" data-view="month" onclick="setCalView('month')">mois</button>
        <button class="cal-btn view-btn" data-view="list" onclick="setCalView('list')">liste</button>
      </div>
    </div>

    <div id="cal-month-view">
      <div class="weekdays-grid" id="cal-weekdays"></div>
      <div class="month-grid" id="cal-month-grid"></div>
    </div>

    <div id="cal-list-view" hidden></div>

    <div class="upcoming-section">
      <h3 class="upcoming-title" id="title-upcoming">⚡ événements à venir</h3>
      <div id="cal-upcoming-list"></div>
    </div>
  `;
}

/* --- Helper Date Functions --- */
function isoDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function saveCalState() {
  localStorage.setItem('pos_calendar_events', JSON.stringify(calendarEvents));
  renderCalendar();
}

/* --- Calendar Rendering --- */
function renderCalendar() {
  const lang = calState.language;

  // Title
  document.getElementById('cal-title').innerText = calState.currentDate.toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric" }
  );

  // Filters
  const filterBox = document.getElementById('cal-filters');
  filterBox.innerHTML = '';
  Object.keys(EVENT_COLORS).forEach(type => {
    const label = EVENT_LABELS[type][lang];
    const item = document.createElement('label');
    item.className = 'cal-filter-item';
    item.innerHTML = `
      <input type="checkbox" class="cal-filter-checkbox" ${calState.activeFilters.has(type) ? 'checked' : ''} onchange="toggleCalFilter('${type}')">
      <span style="color:${EVENT_COLORS[type]}">●</span> ${label}
    `;
    filterBox.appendChild(item);
  });

  // Toggle Views
  document.getElementById('cal-month-view').hidden = calState.currentView !== "month";
  document.getElementById('cal-list-view').hidden = calState.currentView !== "list";

  if (calState.currentView === "month") {
    renderWeekdays();
    renderMonthGrid();
  } else {
    renderListView();
  }

  renderUpcoming();
}

function renderWeekdays() {
  const box = document.getElementById('cal-weekdays');
  box.innerHTML = '';
  const refSun = new Date(2023, 0, 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(refSun); d.setDate(d.getDate() + i);
    box.innerHTML += `<div>${d.toLocaleDateString(calState.language === "fr" ? "fr-FR" : "en-US", { weekday: "short" })}</div>`;
  }
}

function renderMonthGrid() {
  const grid = document.getElementById('cal-month-grid');
  grid.innerHTML = '';
  const firstDay = new Date(calState.currentDate.getFullYear(), calState.currentDate.getMonth(), 1);
  const startWeekday = firstDay.getDay();
  const firstCellDate = new Date(firstDay); firstCellDate.setDate(firstCellDate.getDate() - startWeekday);

  for (let i = 0; i < 35; i++) {
    const cellDate = new Date(firstCellDate); cellDate.setDate(cellDate.getDate() + i);
    const cellISO = isoDateStr(cellDate);
    const isToday = cellISO === isoDateStr(new Date());
    const isOtherMonth = cellDate.getMonth() !== calState.currentDate.getMonth();

    const cell = document.createElement('div');
    cell.className = `day-cell ${isToday ? 'today' : ''} ${isOtherMonth ? 'other-month' : ''}`;
    cell.dataset.date = cellISO;
    cell.innerHTML = `<div class="day-number">${cellDate.getDate()}</div>`;

    // Drag and Drop Listeners for Day Cells
    cell.addEventListener('dragover', (e) => {
      if (isCalUnlocked) { e.preventDefault(); cell.classList.add('drag-over'); }
    });
    cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
    cell.addEventListener('drop', (e) => {
      if (isCalUnlocked && draggedEventId) {
        e.preventDefault();
        cell.classList.remove('drag-over');
        const ev = calendarEvents.find(e => e.id === draggedEventId);
        if (ev) {
          ev.event_date = cellISO;
          saveCalState();
        }
      }
    });

    const dayEventsDiv = document.createElement('div');
    dayEventsDiv.className = 'day-events';

    calendarEvents.filter(e => e.event_date === cellISO && calState.activeFilters.has(e.event_type)).forEach(ev => {
      const pill = document.createElement('div');
      pill.className = 'event-pill';
      pill.style.backgroundColor = EVENT_COLORS[ev.event_type] || '#ccc';
      pill.innerText = calState.language === "fr" ? ev.title_fr : ev.title_en;
      
      // Enable Draggable when unlocked
      if (isCalUnlocked) {
        pill.setAttribute('draggable', 'true');
        pill.addEventListener('dragstart', () => { draggedEventId = ev.id; });
        pill.addEventListener('dragend', () => { draggedEventId = null; });
      }

      pill.onclick = (e) => { e.stopPropagation(); openEventDetailModal(ev); };
      dayEventsDiv.appendChild(pill);
    });

    cell.appendChild(dayEventsDiv);
    grid.appendChild(cell);
  }
}

function renderUpcoming() {
  const list = document.getElementById('cal-upcoming-list');
  if (!list) return;
  list.innerHTML = '';
  const lang = calState.language;
  const filtered = calendarEvents.filter(e => calState.activeFilters.has(e.event_type)).sort((a,b) => a.event_date.localeCompare(b.event_date));

  filtered.slice(0, 4).forEach(ev => {
    const row = document.createElement('div');
    row.className = 'event-row';
    row.onclick = () => openEventDetailModal(ev);
    row.innerHTML = `
      <div class="event-color-bar" style="background:${EVENT_COLORS[ev.event_type]}"></div>
      <div class="event-date-box">
        <div class="event-date-day">${ev.event_date.slice(8,10)}</div>
        <div class="event-date-month">${ev.event_date.slice(5,7)}</div>
      </div>
      <div>
        <div class="event-name">${lang === "fr" ? ev.title_fr : ev.title_en}</div>
        <div class="event-meta">${ev.start_time} - ${ev.end_time} @ ${ev.location}</div>
      </div>
    `;
    list.appendChild(row);
  });
}

function renderListView() {
  const list = document.getElementById('cal-list-view');
  list.innerHTML = '';
  renderUpcoming();
}

/* --- Event Detail Modal (With Timeline Schedule & Admin Actions) --- */
function openEventDetailModal(ev) {
  const lang = calState.language;
  const title = lang === "fr" ? ev.title_fr : ev.title_en;
  const desc = lang === "fr" ? ev.description_fr : ev.description_en;

  let scheduleHTML = '';
  if (ev.schedule && ev.schedule.length > 0) {
    scheduleHTML = `
      <div style="margin-top: 15px; font-weight:700; color:var(--cdl-cyan, #38bdf8);">⚡ déroulement de l'événement :</div>
      <div class="cal-modal-timeline">
        ${ev.schedule.map(item => `
          <div class="cal-modal-item">
            <span class="cal-modal-badge">${item.time}</span>
            <div>${lang === "fr" ? item.fr : item.en}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  let adminButtons = '';
  if (isCalUnlocked) {
    adminButtons = `
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1); display:flex; gap:10px;">
        <button class="cal-btn" onclick="duplicateCalEvent(${ev.id})">📋 dupliquer</button>
        <button class="cal-btn-sec" onclick="deleteCalEvent(${ev.id})">🗑️ supprimer</button>
      </div>
    `;
  }

  const modalBody = `
    <span style="display:inline-block; font-weight:700; font-size:12px; color:${EVENT_COLORS[ev.event_type]}; margin-bottom:8px;">
      ${EVENT_LABELS[ev.event_type][lang]}
    </span>
    <h2 style="color:var(--cdl-cyan, #38bdf8); margin-bottom: 10px;">${title}</h2>
    <p style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 12px;">
      📅 <strong>${ev.event_date}</strong> (${ev.start_time} - ${ev.end_time})<br>
      📍 <strong>${ev.location}</strong>
    </p>
    <p style="line-height: 1.6;">${desc}</p>
    ${scheduleHTML}
    ${adminButtons}
  `;

  if (typeof openModal === "function") {
    openModal(title, "");
    document.getElementById('modal-body').innerHTML = modalBody;
  } else {
    alert(`${title}\n\n${desc}`);
  }
}

/* --- Admin Control Functions --- */
function toggleCalLock() {
  if (!isCalUnlocked) {
    const pin = prompt("Code PIN formateur :");
    if (pin === CAL_PIN) {
      isCalUnlocked = true;
      document.getElementById('cal-lock-btn').classList.add('unlocked');
      document.getElementById('cal-lock-label').innerText = "déverrouillé";
      document.getElementById('cal-add-btn').style.display = "inline-block";
      renderCalendar();
    } else if (pin !== null) alert("PIN incorrect.");
  } else {
    isCalUnlocked = false;
    document.getElementById('cal-lock-btn').classList.remove('unlocked');
    document.getElementById('cal-lock-label').innerText = "verrouillé";
    document.getElementById('cal-add-btn').style.display = "none";
    renderCalendar();
  }
}

function duplicateCalEvent(id) {
  const ev = calendarEvents.find(e => e.id === id);
  if (ev) {
    const copy = JSON.parse(JSON.stringify(ev));
    copy.id = Date.now();
    copy.title_fr += " (copie)";
    copy.title_en += " (copy)";
    calendarEvents.push(copy);
    saveCalState();
    if (typeof closeModal === "function") closeModal();
  }
}

function deleteCalEvent(id) {
  if (confirm("Supprimer cet événement du calendrier ?")) {
    calendarEvents = calendarEvents.filter(e => e.id !== id);
    saveCalState();
    if (typeof closeModal === "function") closeModal();
  }
}

function addNewCalEvent() {
  const title = prompt("Titre (FR) :", "nouvel événement");
  if (!title) return;
  const date = prompt("Date (YYYY-MM-DD) :", isoDateStr(new Date()));

  calendarEvents.push({
    id: Date.now(),
    title_fr: title,
    title_en: title,
    description_fr: "description de l'événement...",
    description_en: "event description...",
    event_type: "cdl",
    event_date: date,
    start_time: "19:00",
    end_time: "21:00",
    location: "rennes"
  });
  saveCalState();
}

function toggleCalFilter(type) {
  if (calState.activeFilters.has(type)) calState.activeFilters.delete(type);
  else calState.activeFilters.add(type);
  renderCalendar();
}

function navCal(delta) {
  calState.currentDate.setMonth(calState.currentDate.getMonth() + delta);
  renderCalendar();
}

function navCalToday() {
  calState.currentDate = new Date();
  renderCalendar();
}

function setCalView(view) {
  calState.currentView = view;
  renderCalendar();
}

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
  injectCalendarStyles();
  mountCalendarHTML();
  renderCalendar();
});
