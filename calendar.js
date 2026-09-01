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

// Default Events with Full Schedules
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

/* --- CSS Injection with Strict 2-Line Text Wrapping & Day Borders --- */
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
    
    /* Clear Day Grid Definition */
    .weekdays-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 700; font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
    .month-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
    .day-cell { min-height: 110px; background: rgba(22, 30, 49, 0.75); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 8px; display: flex; flex-direction: column; overflow: hidden; transition: all 0.2s ease; }
    .day-cell.drag-over { border: 2px dashed var(--neon-amber, #f59e0b); background: rgba(245, 158, 11, 0.15); }
    .day-cell.other-month { opacity: 0.3; background: rgba(15, 23, 42, 0.4); }
    .day-cell.today { border: 2px solid var(--cdl-cyan, #38bdf8); box-shadow: 0 0 15px rgba(56, 189, 248, 0.35); }
    .day-number { font-weight: 700; font-size: 13px; margin-bottom: 6px; color: var(--text-muted); }
    .day-events { display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }

    /* Strict 2-Line Wrapping Event Pill */
    .event-pill {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 6px;
      border-radius: 6px;
      color: #000;
      cursor: pointer;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-word;
      user-select: none;
    }
    .event-pill[draggable="true"] { cursor: grab; }
    .event-pill[draggable="true"]:active { cursor: grabbing; opacity: 0.6; }

    /* Upcoming Events List */
    .upcoming-section { margin-top: 35px; padding-top: 20px; border-top: 1px dashed rgba(255, 255, 255, 0.1); }
    .upcoming-title { font-size: 17px; font-weight: 700; color: var(--neon-amber, #f59e0b); margin-bottom: 15px; }
    .event-row { display: flex; align-items: center; gap: 15px; background: rgba(15, 23, 42, 0.65); border: 1px solid var(--card-border); border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; cursor: pointer; }
    .event-color-bar { width: 6px; height: 38px; border-radius: 4px; }
    .event-date-box { text-align: center; min-width: 40px; }
    .event-date-day { font-size: 18px; font-weight: 700; line-height: 1; }
    .event-date-month { font-size: 11px; color: var(--text-muted); }
    .event-name { font-weight: 700; font-size: 15px; }
    .event-meta { font-size: 12.5px; color: var(--text-muted); }

    /* Shadowbox Modal Styling (Image 2 Replica) */
    .cal-shadowbox-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center; z-index: 2000;
    }
    .cal-shadowbox-card {
      background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px;
      max-width: 620px; width: 92%; max-height: 85vh; overflow-y: auto; padding: 26px;
      position: relative; box-shadow: 0 0 30px rgba(56, 189, 248, 0.25); text-align: left;
    }
    .cal-shadowbox-close { position: absolute; top: 18px; right: 22px; font-size: 22px; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
    .cal-shadowbox-close:hover { color: #ef4444; }
    
    .cal-modal-section {
      background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px; padding: 16px; margin-bottom: 14px;
    }
    .cal-modal-section-title { font-size: 14px; font-weight: 700; color: var(--cdl-cyan, #38bdf8); margin-bottom: 8px; }
    .cal-modal-timeline { position: relative; padding-left: 18px; border-left: 2px solid var(--cdl-cyan, #38bdf8); margin-top: 10px; }
    .cal-modal-item { position: relative; margin-bottom: 10px; padding-left: 14px; font-size: 13.5px; }
    .cal-modal-item::before { content: ''; position: absolute; left: -23px; top: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--cdl-cyan, #38bdf8); }
    .cal-modal-badge { display: inline-block; background: rgba(56, 189, 248, 0.15); color: var(--cdl-cyan, #38bdf8); font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 12px; margin-bottom: 4px; }

    .cal-form-group { margin-bottom: 14px; }
    .cal-form-group label { display: block; font-size: 12.5px; font-weight: 700; color: var(--cdl-cyan, #38bdf8); margin-bottom: 5px; }
    .cal-form-input { width: 100%; background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.3); color: #fff; padding: 9px 12px; border-radius: 8px; font-family: inherit; font-size: 13.5px; }
    .cal-form-input:focus { outline: none; border-color: var(--neon-amber, #f59e0b); }
  `;
  document.head.appendChild(style);
}

/* --- Mounting HTML Structure --- */
function mountCalendarHTML() {
  const target = document.getElementById('pos-calendar');
  if (!target) return;

  target.innerHTML = `
    <div class="cal-toolbar-top">
      <div class="cal-filters" id="cal-filters"></div>
      <div class="cal-admin-tools">
        <button id="cal-lock-btn" class="cal-btn-sec" onclick="toggleCalLock()">🔒 <span id="cal-lock-label">verrouillé</span></button>
        <button id="cal-add-btn" class="cal-btn-add" onclick="openAddCalEventShadowbox()">➕ ajouter un événement</button>
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

    <div class="cal-shadowbox-overlay" id="cal-shadowbox-overlay" onclick="closeCalShadowbox()">
      <div class="cal-shadowbox-card" onclick="event.stopPropagation()">
        <span class="cal-shadowbox-close" onclick="closeCalShadowbox()">&times;</span>
        <div id="cal-shadowbox-content"></div>
      </div>
    </div>
  `;
}

/* --- Date Helpers & Storage Sync --- */
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

/* --- Render UI Functions --- */
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

    // Drag-and-Drop Handlers
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

/* --- Shadowbox Modals (Read-Only & Edit Mode matching Image 2) --- */
function openEventDetailModal(ev) {
  const content = document.getElementById('cal-shadowbox-content');
  const lang = calState.language;

  if (isCalUnlocked) {
    // Unlocked Edit Form inside Shadowbox
    content.innerHTML = `
      <h3 style="color:var(--neon-amber, #f59e0b); margin-bottom: 18px;">✏️ modifier l'événement</h3>
      
      <div class="cal-form-group">
        <label>Titre (FR) :</label>
        <input type="text" id="edit-cal-title-fr" class="cal-form-input" value="${ev.title_fr}">
      </div>
      <div class="cal-form-group">
        <label>Titre (EN) :</label>
        <input type="text" id="edit-cal-title-en" class="cal-form-input" value="${ev.title_en}">
      </div>
      <div class="cal-form-group">
        <label>Date (YYYY-MM-DD) :</label>
        <input type="text" id="edit-cal-date" class="cal-form-input" value="${ev.event_date}">
      </div>
      <div style="display:flex; gap:10px;">
        <div class="cal-form-group" style="flex:1;">
          <label>Début :</label>
          <input type="text" id="edit-cal-start" class="cal-form-input" value="${ev.start_time}">
        </div>
        <div class="cal-form-group" style="flex:1;">
          <label>Fin :</label>
          <input type="text" id="edit-cal-end" class="cal-form-input" value="${ev.end_time}">
        </div>
      </div>
      <div class="cal-form-group">
        <label>Lieu :</label>
        <input type="text" id="edit-cal-loc" class="cal-form-input" value="${ev.location}">
      </div>
      <div class="cal-form-group">
        <label>Description (FR) :</label>
        <textarea id="edit-cal-desc-fr" class="cal-form-input" rows="3">${ev.description_fr}</textarea>
      </div>

      <div style="margin-top:20px; display:flex; gap:10px;">
        <button class="cal-btn" style="background:var(--cdl-cyan, #38bdf8); color:#000;" onclick="saveCalEventEdit(${ev.id})">💾 enregistrer</button>
        <button class="cal-btn" onclick="duplicateCalEvent(${ev.id})">📋 dupliquer</button>
        <button class="cal-btn-sec" onclick="deleteCalEvent(${ev.id})">🗑️ supprimer</button>
      </div>
    `;
  } else {
    // Read-Only Shadowbox Modal (Identical layout to Image 2)
    let scheduleHTML = '';
    if (ev.schedule && ev.schedule.length > 0) {
      scheduleHTML = `
        <div class="cal-modal-section">
          <div class="cal-modal-section-title">⚡ déroulement de la soirée</div>
          <div class="cal-modal-timeline">
            ${ev.schedule.map(s => `
              <div class="cal-modal-item">
                <span class="cal-modal-badge">${s.time}</span>
                <div>${lang === "fr" ? s.fr : s.en}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <h2 style="font-size:22px; font-weight:700; color:var(--text-main, #fff); margin-bottom: 16px;">
        ${lang === "fr" ? ev.title_fr : ev.title_en}
      </h2>

      <div class="cal-modal-section">
        <div class="cal-modal-section-title">📌 infos pratiques</div>
        <p style="font-size: 13.5px; color: var(--text-muted, #cbd5e1); line-height: 1.6;">
          📅 <strong>${ev.event_date}</strong> (${ev.start_time} — ${ev.end_time})<br>
          📍 <strong>${ev.location}</strong>
        </p>
      </div>

      <div class="cal-modal-section">
        <div class="cal-modal-section-title">📝 description</div>
        <p style="font-size: 14px; line-height: 1.6; color: var(--text-main, #fff);">
          ${lang === "fr" ? ev.description_fr : ev.description_en}
        </p>
      </div>

      ${scheduleHTML}
    `;
  }

  document.getElementById('cal-shadowbox-overlay').style.display = 'flex';
}

function closeCalShadowbox() {
  document.getElementById('cal-shadowbox-overlay').style.display = 'none';
}

/* --- Admin Edit & PIN Logic via Custom Shadowbox --- */
function toggleCalLock() {
  if (!isCalUnlocked) {
    const content = document.getElementById('cal-shadowbox-content');
    content.innerHTML = `
      <h3 style="color:var(--cdl-cyan, #38bdf8); margin-bottom: 12px;">🔒 déverrouiller l'édition</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:15px;">entrez le code pin formateur pour modifier les événements :</p>
      <div class="cal-form-group">
        <input type="password" id="cal-pin-input" class="cal-form-input" placeholder="code PIN..." autofocus>
      </div>
      <button class="cal-btn" style="background:var(--cdl-cyan, #38bdf8); color:#000; width:100%; margin-top:5px;" onclick="verifyCalPin()">valider</button>
    `;
    document.getElementById('cal-shadowbox-overlay').style.display = 'flex';
  } else {
    isCalUnlocked = false;
    document.getElementById('cal-lock-btn').classList.remove('unlocked');
    document.getElementById('cal-lock-label').innerText = "verrouillé";
    document.getElementById('cal-add-btn').style.display = "none";
    renderCalendar();
  }
}

function verifyCalPin() {
  const pin = document.getElementById('cal-pin-input').value;
  if (pin === CAL_PIN) {
    isCalUnlocked = true;
    document.getElementById('cal-lock-btn').classList.add('unlocked');
    document.getElementById('cal-lock-label').innerText = "déverrouillé";
    document.getElementById('cal-add-btn').style.display = "inline-block";
    closeCalShadowbox();
    renderCalendar();
  } else {
    alert("Code PIN incorrect.");
  }
}

function saveCalEventEdit(id) {
  const ev = calendarEvents.find(e => e.id === id);
  if (ev) {
    ev.title_fr = document.getElementById('edit-cal-title-fr').value;
    ev.title_en = document.getElementById('edit-cal-title-en').value;
    ev.event_date = document.getElementById('edit-cal-date').value;
    ev.start_time = document.getElementById('edit-cal-start').value;
    ev.end_time = document.getElementById('edit-cal-end').value;
    ev.location = document.getElementById('edit-cal-loc').value;
    ev.description_fr = document.getElementById('edit-cal-desc-fr').value;
    saveCalState();
    closeCalShadowbox();
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
    closeCalShadowbox();
  }
}

function deleteCalEvent(id) {
  if (confirm("Supprimer cet événement du calendrier ?")) {
    calendarEvents = calendarEvents.filter(e => e.id !== id);
    saveCalState();
    closeCalShadowbox();
  }
}

function openAddCalEventShadowbox() {
  const newId = Date.now();
  const content = document.getElementById('cal-shadowbox-content');
  content.innerHTML = `
    <h3 style="color:var(--neon-amber, #f59e0b); margin-bottom: 15px;">➕ ajouter un événement</h3>
    <div class="cal-form-group">
      <label>Titre de l'événement :</label>
      <input type="text" id="add-cal-title" class="cal-form-input" value="nouvel événement">
    </div>
    <div class="cal-form-group">
      <label>Date (YYYY-MM-DD) :</label>
      <input type="text" id="add-cal-date" class="cal-form-input" value="${isoDateStr(new Date())}">
    </div>
    <button class="cal-btn" style="background:var(--cdl-cyan, #38bdf8); color:#000; width:100%; margin-top:10px;" onclick="confirmAddCalEvent(${newId})">créer l'événement</button>
  `;
  document.getElementById('cal-shadowbox-overlay').style.display = 'flex';
}

function confirmAddCalEvent(newId) {
  const title = document.getElementById('add-cal-title').value;
  const date = document.getElementById('add-cal-date').value;

  calendarEvents.push({
    id: newId,
    title_fr: title,
    title_en: title,
    description_fr: "description...",
    description_en: "description...",
    event_type: "cdl",
    event_date: date,
    start_time: "19:00",
    end_time: "21:00",
    location: "rennes"
  });
  saveCalState();
  closeCalShadowbox();
}

/* --- Global Language Synchronizer --- */
window.syncCalendarLanguage = function(lang) {
  calState.language = lang;
  renderCalendar();
};

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

/* --- Automatic Initialization & Global Language Hook --- */
document.addEventListener('DOMContentLoaded', () => {
  injectCalendarStyles();
  mountCalendarHTML();
  renderCalendar();

  // Hook into main setLanguage function
  if (typeof window.setLanguage === "function") {
    const originalSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
      originalSetLanguage(lang);
      window.syncCalendarLanguage(lang);
    };
  }
});
