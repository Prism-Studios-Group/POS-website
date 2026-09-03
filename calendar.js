/* =========================================================
   Prism Outreach Studio — Centralized Interactive Calendar
   ========================================================= */

const CAL_PIN_HASH = "c9693df0c3bd56a2c6b9bebbb0e51210e771823498faec23398581961e8aa3d2";
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

const calI18n = {
  fr: {
    today: "aujourd'hui",
    month: "mois",
    list: "liste",
    upcoming: "⚡ événements à venir",
    locked: "verrouillé",
    unlocked: "déverrouillé",
    addEvent: "➕ ajouter un événement",
    undo: "↩️ annuler",
    unlockTitle: "🔒 déverrouiller l'édition",
    unlockSub: "entrez le code pin formateur pour modifier :",
    validate: "valider",
    incorrectPin: "Code PIN incorrect.",
    confirmTitle: "êtes-vous sûr ?",
    confirmDelete: "voulez-vous vraiment supprimer cet événement ?",
    yesDelete: "oui, supprimer",
    cancel: "annuler",
    detailsTitle: "📌 infos pratiques",
    descTitle: "📝 description",
    extraTitle: "💡 détails complémentaires",
    scheduleTitle: "⚡ déroulement de la soirée",
    save: "💾 enregistrer",
    duplicate: "📋 dupliquer",
    delete: "🗑️ supprimer",
    newEventTitle: "➕ ajouter un événement",
    createBtn: "créer l'événement",
    editTitle: "✏️ modifier l'événement",
    aiDisclaimer: "🌱 <strong>note sur la création du site :</strong> ce site a été conçu avec l'aide d'outils d'intelligence artificielle (~15 requêtes, impact environnemental estimé à environ 0,03 kg CO₂e). il est aujourd'hui géré et maintenu exclusivement sans IA par l'équipe de Prism Outreach Studio. tous les événements et contenus sont créés directement par l'association."
  },
  en: {
    today: "today",
    month: "month",
    list: "list",
    upcoming: "⚡ upcoming events",
    locked: "locked",
    unlocked: "unlocked",
    addEvent: "➕ add an event",
    undo: "↩️ undo",
    unlockTitle: "🔒 unlock editor",
    unlockSub: "enter the trainer pin code to edit:",
    validate: "submit",
    incorrectPin: "Incorrect PIN code.",
    confirmTitle: "are you sure?",
    confirmDelete: "are you sure you want to delete this event?",
    yesDelete: "yes, delete",
    cancel: "cancel",
    detailsTitle: "📌 details",
    descTitle: "📝 description",
    extraTitle: "💡 extra details",
    scheduleTitle: "⚡ event schedule",
    save: "💾 save",
    duplicate: "📋 duplicate",
    delete: "🗑️ delete",
    newEventTitle: "➕ add an event",
    createBtn: "create event",
    editTitle: "✏️ edit event",
    aiDisclaimer: "🌱 <strong>website creation note:</strong> this website was designed with the help of AI tools (~15 prompts, estimated environmental impact ~0.03 kg CO₂e). it is maintained exclusively without AI by Prism Outreach Studio. all events and content are created directly by our team."
  }
};

const defaultCalendarEvents = [
  {
    id: 1,
    title_fr: "café des langues 70",
    title_en: "café des langues 70",
    description_fr: "pratique linguistique un vendredi sur deux chew Hostel Rennes pour pratiquer des langues étrangères dans une ambiance conviviale.",
    description_en: "bi-weekly meetup at Hostel Rennes to practice multiple foreign languages in a friendly environment.",
    extra_details_fr: "pensez à commander une boisson sur place pour remercier l'auberge d'accueil.",
    extra_details_en: "remember to order a drink to support our host venue.",
    event_type: "cdl",
    event_date: "2026-09-04",
    start_time: "19:00",
    end_time: "22:00",
    location: "10 Canal Saint-Martin, 35700 Rennes"
  },
  {
    id: 2,
    title_fr: "répétition rennes english choir 1",
    title_en: "rennes english choir rehearsal 1",
    description_fr: "répétition de la chorale anglophone : travail sur Moved",
    description_en: "rehearsal for the english choir: work on Moved",
    event_type: "choir",
    event_date: "2026-09-08",
    start_time: "20:00",
    end_time: "21:30",
    location: "à venir !"
  },
  {
    id: 3,
    title_fr: "répétition rennes english choir 2",
    title_en: "rennes english choir rehearsal 2",
    description_fr: "répétition de la chorale anglophone : travail sur Kaval sviri and Time",
    description_en: "rehearsal for the english choir: work on Kaval Sviri and Time",
    event_type: "choir",
    event_date: "2026-09-15",
    start_time: "20:00",
    end_time: "21:30",
    location: "à venir !"
  },
  {
    id: 4,
    title_fr: "café des langues 71",
    title_en: "café des langues 71",
    description_fr: "pratique linguistique un vendredi sur deux chew Hostel Rennes pour pratiquer des langues étrangères dans une ambiance conviviale.",
    description_en: "bi-weekly meetup at Hostel Rennes to practice multiple foreign languages in a friendly environment.",
    extra_details_fr: "pensez à commander une boisson sur place pour remercier l'auberge d'accueil.",
    event_type: "cdl",
    event_date: "2026-09-18",
    start_time: "19:00",
    end_time: "22:00",
    location: "10 Canal Saint-Martin, 35700 Rennes"
  },
    {
    id: 5,
    title_fr: "répétition rennes english choir 3",
    title_en: "rennes english choir rehearsal 3",
    description_fr: "répétition de la chorale anglophone : work on Kaval Sviri and Time",
    description_en: "rehearsal for the english choir: work on Kaval Sviri and Time",
    event_type: "choir",
    event_date: "2026-09-22",
    start_time: "20:00",
    end_time: "21:30",
    location: "à venir !"
  }
];

let calendarEvents = JSON.parse(localStorage.getItem('pos_calendar_events')) || window.POS_EMBEDDED_CALENDAR_EVENTS || defaultCalendarEvents;

let calState = {
  currentView: "month",
  currentDate: new Date(),
  activeFilters: new Set(["cdl", "choir", "special", "atelier"]),
  language: "fr"
};

async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function injectCalendarStyles() {
  if (document.getElementById('pos-cal-styles')) return;
  const style = document.createElement('style');
  style.id = 'pos-cal-styles';
  style.textContent = `
    .cal-toolbar-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--card-border); }
    .cal-filters { display: flex; flex-wrap: wrap; gap: 12px; }
    .cal-filter-item { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; cursor: pointer; }
    .cal-filter-checkbox { accent-color: var(--cdl-cyan, #38bdf8); width: 15px; height: 15px; cursor: pointer; }
    .cal-admin-tools { display: flex; gap: 8px; flex-wrap: wrap; }
    .cal-btn-sec { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12.5px; cursor: pointer; }
    .cal-btn-sec.unlocked { background: rgba(34, 197, 94, 0.2); border-color: #22c55e; color: #86efac; }
    .cal-btn-add { background: var(--neon-amber, #f59e0b); color: #000; border: none; padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12.5px; cursor: pointer; display: none; }
    .cal-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
    .cal-nav-group, .cal-view-group { display: flex; gap: 6px; }
    .cal-btn { background: rgba(255, 255, 255, 0.06); border: 1px solid var(--card-border); color: var(--text-main); padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s ease; }
    .cal-btn.active { background: var(--cdl-cyan, #38bdf8) !important; color: #000 !important; }
    .cal-month-title { font-size: 20px; font-weight: 700; color: var(--cdl-cyan, #38bdf8); text-transform: lowercase; }
    
    .weekdays-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 700; font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
    .month-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
    .day-cell { min-height: 110px; background: rgba(22, 30, 49, 0.75); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 8px; display: flex; flex-direction: column; overflow: hidden; transition: all 0.2s ease; }
    .day-cell.drag-over { border: 2px dashed var(--neon-amber, #f59e0b); background: rgba(245, 158, 11, 0.15); }
    .day-cell.other-month { opacity: 0.3; background: rgba(15, 23, 42, 0.4); }
    .day-cell.today { border: 2px solid var(--cdl-cyan, #38bdf8); box-shadow: 0 0 15px rgba(56, 189, 248, 0.35); }
    .day-number { font-weight: 700; font-size: 13px; margin-bottom: 6px; color: var(--text-muted); }
    .day-events { display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }

    .event-pill {
      font-size: 11px; font-weight: 700; padding: 4px 6px; border-radius: 6px; color: #000;
      cursor: pointer; line-height: 1.25; display: flex; flex-direction: column; gap: 2px;
      user-select: none; word-break: break-word;
    }
    .event-pill-time {
      font-size: 9.5px; font-weight: 800; opacity: 0.9; background: rgba(0, 0, 0, 0.15);
      padding: 1px 4px; border-radius: 3px; align-self: flex-start;
    }
    .event-pill-title {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .event-pill[draggable="true"] { cursor: grab; }
    .event-pill[draggable="true"]:active { cursor: grabbing; opacity: 0.6; }

    .upcoming-section { margin-top: 35px; padding-top: 20px; border-top: 1px dashed rgba(255, 255, 255, 0.1); }
    .upcoming-title { font-size: 17px; font-weight: 700; color: var(--neon-amber, #f59e0b); margin-bottom: 15px; }
    .event-row { display: flex; align-items: center; gap: 15px; background: rgba(15, 23, 42, 0.65); border: 1px solid var(--card-border); border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; cursor: pointer; transition: transform 0.2s ease; }
    .event-row:hover { transform: translateX(4px); border-color: var(--cdl-cyan, #38bdf8); }
    .event-color-bar { width: 6px; height: 38px; border-radius: 4px; }
    .event-date-box { text-align: center; min-width: 40px; }
    .event-date-day { font-size: 18px; font-weight: 700; line-height: 1; }
    .event-date-month { font-size: 11px; color: var(--text-muted); }
    .event-name { font-weight: 700; font-size: 15px; }
    .event-meta { font-size: 12.5px; color: var(--text-muted); }

    .cal-shadowbox-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center; z-index: 10000; padding: 20px;
    }
    .cal-shadowbox-card {
      background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 16px;
      max-width: 600px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 26px;
      position: relative; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.25);
      text-align: left; margin: auto;
    }
    .cal-shadowbox-close { position: absolute; top: 18px; right: 22px; font-size: 22px; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
    .cal-shadowbox-close:hover { color: #ef4444; }
    
    .cal-modal-section { background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 16px; margin-bottom: 14px; }
    .cal-modal-section-title { font-size: 14px; font-weight: 700; color: var(--cdl-cyan, #38bdf8); margin-bottom: 8px; }
    .cal-modal-timeline { position: relative; padding-left: 18px; border-left: 2px solid var(--cdl-cyan, #38bdf8); margin-top: 10px; }
    .cal-modal-item { position: relative; margin-bottom: 10px; padding-left: 14px; font-size: 13.5px; }
    .cal-modal-item::before { content: ''; position: absolute; left: -23px; top: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--cdl-cyan, #38bdf8); }
    .cal-modal-badge { display: inline-block; background: rgba(56, 189, 248, 0.15); color: var(--cdl-cyan, #38bdf8); font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 12px; margin-bottom: 4px; }

    .cal-form-group { margin-bottom: 14px; }
    .cal-form-group label { display: block; font-size: 12.5px; font-weight: 700; color: var(--cdl-cyan, #38bdf8); margin-bottom: 5px; }
    .cal-form-input { width: 100%; background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.3); color: #fff; padding: 9px 12px; border-radius: 8px; font-family: inherit; font-size: 13.5px; }
    .cal-form-input:focus { outline: none; border-color: var(--neon-amber, #f59e0b); }

    .map-link { color: var(--cdl-cyan, #38bdf8); text-decoration: underline; font-weight: 700; transition: color 0.2s; }
    .map-link:hover { color: var(--neon-amber, #f59e0b); }

    #pos-ai-disclaimer {
      margin-top: 25px; padding: 16px 20px; background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(56, 189, 248, 0.15); border-radius: 12px;
      font-size: 12.5px; line-height: 1.6; color: var(--text-muted); text-align: center;
    }
  `;
  document.head.appendChild(style);
}

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
        <button class="cal-btn view-btn active" data-view="month" onclick="setCalView('month')" id="btn-view-month">mois</button>
        <button class="cal-btn view-btn" data-view="list" onclick="setCalView('list')" id="btn-view-list">liste</button>
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

    <div class="cal-shadowbox-overlay" id="cal-shadowbox-overlay" onclick="closeCalShadowboxOnOverlay(event)">
      <div class="cal-shadowbox-card" onclick="event.stopPropagation()">
        <span class="cal-shadowbox-close" onclick="closeCalShadowbox()">&times;</span>
        <div id="cal-shadowbox-content"></div>
      </div>
    </div>
  `;

  injectFooterDisclaimer();
}

function injectFooterDisclaimer() {
  let box = document.getElementById('pos-ai-disclaimer');
  if (!box) {
    box = document.createElement('div');
    box.id = 'pos-ai-disclaimer';
    const footer = document.querySelector('footer') || document.querySelector('.container');
    if (footer) footer.appendChild(box);
  }
  const lang = calState.language;
  box.innerHTML = calI18n[lang].aiDisclaimer;
}

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

function buildMapUrl(locationStr) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr)}`;
}

function renderCalendar() {
  const lang = calState.language;
  const t = calI18n[lang];

  document.getElementById('btn-cal-today').innerText = t.today;
  document.getElementById('btn-view-month').innerText = t.month;
  document.getElementById('btn-view-list').innerText = t.list;
  document.getElementById('title-upcoming').innerText = t.upcoming;
  document.getElementById('cal-lock-label').innerText = isCalUnlocked ? t.unlocked : t.locked;
  document.getElementById('cal-add-btn').innerText = t.addEvent;

  injectFooterDisclaimer();

  document.getElementById('cal-title').innerText = calState.currentDate.toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric" }
  );

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

  document.getElementById('cal-month-view').hidden = calState.currentView !== "month";
  document.getElementById('cal-list-view').hidden = calState.currentView !== "list";

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === calState.currentView);
  });

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
      
      const title = calState.language === "fr" ? ev.title_fr : ev.title_en;
      pill.innerHTML = `
        <span class="event-pill-time">⏰ ${ev.start_time}</span>
        <span class="event-pill-title">${title}</span>
      `;
      
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
        <div class="event-meta">⏰ ${ev.start_time} - ${ev.end_time} @ ${ev.location}</div>
      </div>
    `;
    list.appendChild(row);
  });
}

function renderListView() {
  const list = document.getElementById('cal-list-view');
  list.innerHTML = '';
  const lang = calState.language;
  const filtered = calendarEvents.filter(e => calState.activeFilters.has(e.event_type)).sort((a,b) => a.event_date.localeCompare(b.event_date));

  if (filtered.length === 0) {
    list.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">[ aucun événement ]</p>`;
    return;
  }

  filtered.forEach(ev => {
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
        <div class="event-meta">⏰ ${ev.start_time} - ${ev.end_time} @ ${ev.location}</div>
      </div>
    `;
    list.appendChild(row);
  });
}

function openEventDetailModal(ev) {
  const content = document.getElementById('cal-shadowbox-content');
  const lang = calState.language;
  const t = calI18n[lang];

  if (isCalUnlocked) {
    const typeOptions = Object.keys(EVENT_COLORS).map(type => {
      const label = EVENT_LABELS[type][lang];
      const selected = ev.event_type === type ? 'selected' : '';
      return `<option value="${type}" ${selected}>${label}</option>`;
    }).join('');

    content.innerHTML = `
      <h3 style="color:var(--neon-amber, #f59e0b); margin-bottom: 18px;">${t.editTitle}</h3>
      
      <div class="cal-form-group">
        <label>Titre (FR) :</label>
        <input type="text" id="edit-cal-title-fr" class="cal-form-input" value="${ev.title_fr}">
      </div>
      <div class="cal-form-group">
        <label>Titre (EN) :</label>
        <input type="text" id="edit-cal-title-en" class="cal-form-input" value="${ev.title_en}">
      </div>
      <div class="cal-form-group">
        <label>Catégorie / Type :</label>
        <select id="edit-cal-type" class="cal-form-input" style="cursor:pointer;">
          ${typeOptions}
        </select>
      </div>
      <div class="cal-form-group">
        <label>Date :</label>
        <input type="date" id="edit-cal-date" class="cal-form-input" value="${ev.event_date}">
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
        <label>Adresse / Lieu :</label>
        <input type="text" id="edit-cal-loc" class="cal-form-input" value="${ev.location}">
      </div>
      <div class="cal-form-group">
        <label>Description :</label>
        <textarea id="edit-cal-desc-fr" class="cal-form-input" rows="2">${ev.description_fr}</textarea>
      </div>
      <div class="cal-form-group">
        <label>Détails complémentaires :</label>
        <textarea id="edit-cal-extra-fr" class="cal-form-input" rows="2">${ev.extra_details_fr || ''}</textarea>
      </div>

      <div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="cal-btn" style="background:var(--cdl-cyan, #38bdf8); color:#000;" onclick="saveCalEventEdit(${ev.id})">${t.save}</button>
        <button class="cal-btn" onclick="duplicateCalEvent(${ev.id})">${t.duplicate}</button>
        <button class="cal-btn-sec" onclick="confirmDeleteCalEventModal(${ev.id})">${t.delete}</button>
      </div>
    `;
  } else {
    const mapUrl = buildMapUrl(ev.location);
    const extra = lang === "fr" ? (ev.extra_details_fr || '') : (ev.extra_details_en || ev.extra_details_fr || '');

    let scheduleHTML = '';
    if (ev.schedule && ev.schedule.length > 0) {
      scheduleHTML = `
        <div class="cal-modal-section">
          <div class="cal-modal-section-title">${t.scheduleTitle}</div>
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

    let extraHTML = '';
    if (extra) {
      extraHTML = `
        <div class="cal-modal-section">
          <div class="cal-modal-section-title">${t.extraTitle}</div>
          <p style="font-size: 13.5px; line-height: 1.6; color: var(--neon-amber, #f59e0b);">${extra}</p>
        </div>
      `;
    }

    content.innerHTML = `
      <h2 style="font-size:22px; font-weight:700; color:var(--text-main, #fff); margin-bottom: 16px;">
        ${lang === "fr" ? ev.title_fr : ev.title_en}
      </h2>

      <div class="cal-modal-section">
        <div class="cal-modal-section-title">${t.detailsTitle}</div>
        <p style="font-size: 13.5px; color: var(--text-muted, #cbd5e1); line-height: 1.6;">
          📅 <strong>${ev.event_date}</strong> (${ev.start_time} — ${ev.end_time})<br>
          📍 <strong><a href="${mapUrl}" target="_blank" class="map-link">${ev.location} ↗</a></strong>
        </p>
      </div>

      <div class="cal-modal-section">
        <div class="cal-modal-section-title">${t.descTitle}</div>
        <p style="font-size: 14px; line-height: 1.6; color: var(--text-main, #fff);">
          ${lang === "fr" ? ev.description_fr : ev.description_en}
        </p>
      </div>

      ${extraHTML}
      ${scheduleHTML}
    `;
  }

  document.getElementById('cal-shadowbox-overlay').style.display = 'flex';
}

function closeCalShadowbox() {
  document.getElementById('cal-shadowbox-overlay').style.display = 'none';
}

function closeCalShadowboxOnOverlay(e) {
  if (e.target.id === 'cal-shadowbox-overlay') {
    closeCalShadowbox();
  }
}

function confirmDeleteCalEventModal(id) {
  const content = document.getElementById('cal-shadowbox-content');
  const t = calI18n[calState.language];

  content.innerHTML = `
    <h3 style="color:#ef4444; margin-bottom: 12px;">⚠️ ${t.confirmTitle}</h3>
    <p style="font-size:14px; color:var(--text-main, #fff); margin-bottom: 20px;">${t.confirmDelete}</p>
    <div style="display:flex; gap:10px; justify-content:flex-end;">
      <button class="cal-btn" onclick="openEventDetailModal(calendarEvents.find(e=>e.id===${id}))">${t.cancel}</button>
      <button class="cal-btn-sec" style="background:#ef4444; color:#fff;" onclick="executeDeleteCalEvent(${id})">
        ${t.yesDelete}
      </button>
    </div>
  `;
}

function executeDeleteCalEvent(id) {
  const ev = calendarEvents.find(e => e.id === id);
  if (ev) {
    if (typeof pushUndoAction === "function") {
      pushUndoAction({ type: 'deleteCalEvent', data: JSON.parse(JSON.stringify(ev)) });
    }
    calendarEvents = calendarEvents.filter(e => e.id !== id);
    saveCalState();
    closeCalShadowbox();
  }
}

async function toggleCalLock() {
  const t = calI18n[calState.language];
  if (!isCalUnlocked) {
    const content = document.getElementById('cal-shadowbox-content');
    content.innerHTML = `
      <h3 style="color:var(--cdl-cyan, #38bdf8); margin-bottom: 12px;">${t.unlockTitle}</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:15px;">${t.unlockSub}</p>
      <div class="cal-form-group">
        <input type="password" id="cal-pin-input" class="cal-form-input" placeholder="code PIN..." autofocus>
      </div>
      <button class="cal-btn" style="background:var(--cdl-cyan, #38bdf8); color:#000; width:100%; margin-top:5px;" onclick="verifyCalPin()">${t.validate}</button>
    `;
    document.getElementById('cal-shadowbox-overlay').style.display = 'flex';
  } else {
    isCalUnlocked = false;
    document.getElementById('cal-lock-btn').classList.remove('unlocked');
    document.getElementById('cal-add-btn').style.display = "none";
    if (typeof setGlobalUnlockState === "function") setGlobalUnlockState(false);
    renderCalendar();
  }
}

async function verifyCalPin() {
  const pin = document.getElementById('cal-pin-input').value;
  const t = calI18n[calState.language];
  const inputHash = await sha256(pin);

  if (inputHash === CAL_PIN_HASH) {
    isCalUnlocked = true;
    document.getElementById('cal-lock-btn').classList.add('unlocked');
    document.getElementById('cal-add-btn').style.display = "inline-block";
    if (typeof setGlobalUnlockState === "function") setGlobalUnlockState(true);
    closeCalShadowbox();
    renderCalendar();
  } else {
    alert(t.incorrectPin);
  }
}

function saveCalEventEdit(id) {
  const ev = calendarEvents.find(e => e.id === id);
  if (ev) {
    if (typeof pushUndoAction === "function") {
      pushUndoAction({ type: 'editCalEvent', data: JSON.parse(JSON.stringify(ev)) });
    }
    ev.title_fr = document.getElementById('edit-cal-title-fr').value;
    ev.title_en = document.getElementById('edit-cal-title-en').value;
    ev.event_type = document.getElementById('edit-cal-type').value;
    ev.event_date = document.getElementById('edit-cal-date').value;
    ev.start_time = document.getElementById('edit-cal-start').value;
    ev.end_time = document.getElementById('edit-cal-end').value;
    ev.location = document.getElementById('edit-cal-loc').value;
    ev.description_fr = document.getElementById('edit-cal-desc-fr').value;
    ev.extra_details_fr = document.getElementById('edit-cal-extra-fr').value;
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
    if (typeof pushUndoAction === "function") {
      pushUndoAction({ type: 'addCalEvent', id: copy.id });
    }
    calendarEvents.push(copy);
    saveCalState();
    closeCalShadowbox();
  }
}

function openAddCalEventShadowbox() {
  const newId = Date.now();
  const lang = calState.language;
  const t = calI18n[lang];
  const content = document.getElementById('cal-shadowbox-content');

  // Build options from EVENT_COLORS & EVENT_LABELS
  const typeOptions = Object.keys(EVENT_COLORS).map(type => {
    const label = EVENT_LABELS[type][lang];
    return `<option value="${type}">${label}</option>`;
  }).join('');

  content.innerHTML = `
    <h3 style="color:var(--neon-amber, #f59e0b); margin-bottom: 15px;">${t.newEventTitle}</h3>
    
    <div class="cal-form-group">
      <label>${lang === "fr" ? "Titre (FR) :" : "Title (FR) :"}</label>
      <input type="text" id="add-cal-title" class="cal-form-input" value="${lang === "fr" ? "nouvel événement" : "new event"}">
    </div>
    
    <div class="cal-form-group">
      <label>${lang === "fr" ? "Catégorie d'événement :" : "Event Category :"}</label>
      <select id="add-cal-type" class="cal-form-input" style="cursor:pointer;">
        ${typeOptions}
      </select>
    </div>
    
    <div class="cal-form-group">
      <label>${lang === "fr" ? "Date de l'événement :" : "Event Date :"}</label>
      <input type="date" id="add-cal-date" class="cal-form-input" value="${isoDateStr(new Date())}">
    </div>

    <button class="cal-btn" style="background:var(--cdl-cyan, #38bdf8); color:#000; width:100%; margin-top:10px;" onclick="confirmAddCalEvent(${newId})">${t.createBtn}</button>
  `;
  document.getElementById('cal-shadowbox-overlay').style.display = 'flex';
}

function confirmAddCalEvent(newId) {
  const title = document.getElementById('add-cal-title').value;
  const eventType = document.getElementById('add-cal-type').value;
  const date = document.getElementById('add-cal-date').value;

  const newEv = {
    id: newId,
    title_fr: title,
    title_en: title,
    description_fr: "description...",
    description_en: "description...",
    event_type: eventType,
    event_date: date,
    start_time: "19:00",
    end_time: "21:00",
    location: "rennes"
  };

  if (typeof pushUndoAction === "function") {
    pushUndoAction({ type: 'addCalEvent', id: newId });
  }

  calendarEvents.push(newEv);
  saveCalState();
  closeCalShadowbox();
}

  if (typeof pushUndoAction === "function") {
    pushUndoAction({ type: 'addCalEvent', id: newId });
  }

  calendarEvents.push(newEv);
  saveCalState();
  closeCalShadowbox();
}

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

document.addEventListener('DOMContentLoaded', () => {
  injectCalendarStyles();
  mountCalendarHTML();
  renderCalendar();

  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
      const lang = langBtn.id === 'btn-en' || langBtn.innerText.trim().toLowerCase() === 'en' ? 'en' : 'fr';
      window.syncCalendarLanguage(lang);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCalShadowbox();
  });
});
