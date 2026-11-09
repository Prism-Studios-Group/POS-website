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

/* French Public Holidays & Cultural Celebrations */
const FRENCH_HOLIDAYS = {
  "01-01": { fr: "jour de l'an 🎉", en: "new year's day 🎉" },
  "01-06": { fr: "épiphanie 👑", en: "epiphany 👑" },
  "02-02": { fr: "chandeleur 🥞", en: "crêpe day 🥞" },
  "02-14": { fr: "saint-valentin 💘", en: "valentine's day 💘" },
  "03-20": { fr: "printemps 🌱", en: "first day of spring 🌱" },
  "05-01": { fr: "fête du travail 🌿", en: "labor day 🌿" },
  "05-08": { fr: "victoire 1945 🇫🇷", en: "victory day 🇫🇷" },
  "06-21": { fr: "fête de la musique 🎵", en: "music day 🎵" },
  "07-14": { fr: "fête nationale 🎆", en: "bastille day 🎆" },
  "08-15": { fr: "assomption 🕊️", en: "assumption 🕊️" },
  "10-31": { fr: "halloween 🎃", en: "halloween 🎃" },
  "11-01": { fr: "toussaint 🍁", en: "all saints' day 🍁" },
  "11-11": { fr: "armistice 1918 🕊️", en: "armistice day 🕊️" },
  "12-24": { fr: "réveillon noël 🕯️", en: "christmas eve 🕯️" },
  "12-25": { fr: "noël 🎄", en: "christmas 🎄" },
  "12-31": { fr: "saint-sylvestre 🥂", en: "new year's eve 🥂" },
  // Movable French holidays (Easter, Ascension, Pentecost)
  "2026-04-06": { fr: "lundi de pâques 🐣", en: "easter monday 🐣" },
  "2026-05-14": { fr: "ascension 🕊️", en: "ascension day 🕊️" },
  "2026-05-25": { fr: "pentecôte 🕊️", en: "whit monday 🕊️" },
  "2027-03-29": { fr: "lundi de pâques 🐣", en: "easter monday 🐣" },
  "2027-05-06": { fr: "ascension 🕊️", en: "ascension day 🕊️" },
  "2027-05-17": { fr: "pentecôte 🕊️", en: "whit monday 🕊️" }
};

/* Seasonal Visual Themes (Month indexed 0 to 11) */
const SEASONAL_THEMES = {
  0: { // Janvier
    emoji: "❄️",
    titleSuffix: "❄️ 👑 ✨",
    badgeFr: "bonne année & galette des rois",
    badgeEn: "happy new year & epiphany",
    bgTint: "rgba(14, 165, 233, 0.08)",
    accentColor: "#38bdf8",
    cellBg: "rgba(18, 30, 49, 0.78)",
    cellBorder: "rgba(56, 189, 248, 0.22)"
  },
  1: { // Février
    emoji: "🥞",
    titleSuffix: "🥞 🎭 💖",
    badgeFr: "chandeleur, carnaval & saint-valentin",
    badgeEn: "crêpe day, carnival & valentine",
    bgTint: "rgba(244, 114, 182, 0.08)",
    accentColor: "#f472b6",
    cellBg: "rgba(35, 24, 38, 0.78)",
    cellBorder: "rgba(244, 114, 182, 0.22)"
  },
  2: { // Mars
    emoji: "🌱",
    titleSuffix: "🌱 🌷 ☀️",
    badgeFr: "équinoxe & réveil du printemps",
    badgeEn: "spring renewal & sunshine",
    bgTint: "rgba(52, 211, 153, 0.08)",
    accentColor: "#34d399",
    cellBg: "rgba(18, 36, 32, 0.78)",
    cellBorder: "rgba(52, 211, 153, 0.22)"
  },
  3: { // Avril
    emoji: "🌸",
    titleSuffix: "🌸 🐣 🍫",
    badgeFr: "printemps en fleurs & fête de pâques",
    badgeEn: "blossom season & easter chocolates",
    bgTint: "rgba(232, 121, 249, 0.08)",
    accentColor: "#e879f9",
    cellBg: "rgba(32, 23, 44, 0.78)",
    cellBorder: "rgba(232, 121, 249, 0.22)"
  },
  4: { // Mai
    emoji: "🌿",
    titleSuffix: "🌿 ☀️ 💐",
    badgeFr: "muguet, ponts de mai & grand final",
    badgeEn: "lily of the valley & sunny finale",
    bgTint: "rgba(74, 222, 128, 0.08)",
    accentColor: "#4ade80",
    cellBg: "rgba(18, 38, 28, 0.78)",
    cellBorder: "rgba(74, 222, 128, 0.22)"
  },
  5: { // Juin
    emoji: "☀️",
    titleSuffix: "☀️ 🎵 🌊",
    badgeFr: "fête de la musique & été",
    badgeEn: "music day & summer kickoff",
    bgTint: "rgba(251, 191, 36, 0.08)",
    accentColor: "#fbbf24",
    cellBg: "rgba(38, 32, 18, 0.78)",
    cellBorder: "rgba(251, 191, 36, 0.22)"
  },
  6: { // Juillet
    emoji: "🎆",
    titleSuffix: "🎆 🏖️ ☀️",
    badgeFr: "fête nationale & estivales",
    badgeEn: "bastille day & summer holidays",
    bgTint: "rgba(56, 189, 248, 0.08)",
    accentColor: "#38bdf8",
    cellBg: "rgba(18, 30, 49, 0.78)",
    cellBorder: "rgba(56, 189, 248, 0.22)"
  },
  7: { // Août
    emoji: "🌻",
    titleSuffix: "🌻 🏖️ 🍉",
    badgeFr: "douceur d'août & vacances",
    badgeEn: "august sun & summer ease",
    bgTint: "rgba(245, 158, 11, 0.08)",
    accentColor: "#f59e0b",
    cellBg: "rgba(38, 28, 18, 0.78)",
    cellBorder: "rgba(245, 158, 11, 0.22)"
  },
  8: { // Septembre
    emoji: "🎒",
    titleSuffix: "🎒 🍂 ☕",
    badgeFr: "rentrée culturelle & retrouvailles",
    badgeEn: "back to school & cozy beginnings",
    bgTint: "rgba(56, 189, 248, 0.07)",
    accentColor: "#38bdf8",
    cellBg: "rgba(22, 30, 49, 0.78)",
    cellBorder: "rgba(56, 189, 248, 0.2)"
  },
  9: { // Octobre
    emoji: "🎃",
    titleSuffix: "🎃 🍁 👻",
    badgeFr: "feuilles d'or & ambiance halloween",
    badgeEn: "autumn foliage & spooky season",
    bgTint: "rgba(249, 115, 22, 0.09)",
    accentColor: "#f97316",
    cellBg: "rgba(38, 26, 18, 0.78)",
    cellBorder: "rgba(249, 115, 22, 0.24)"
  },
  10: { // Novembre
    emoji: "🌰",
    titleSuffix: "🌰 🧣 ☕",
    badgeFr: "douceur d'automne & veillées chaleureuses",
    badgeEn: "cozy autumn nights & warm tea",
    bgTint: "rgba(217, 119, 6, 0.08)",
    accentColor: "#d97706",
    cellBg: "rgba(36, 26, 20, 0.78)",
    cellBorder: "rgba(217, 119, 6, 0.22)"
  },
  11: { // Décembre
    emoji: "🎄",
    titleSuffix: "🎄 ✨ ❄️",
    badgeFr: "magie de noël & dernière de la saison",
    badgeEn: "holiday season & winter magic",
    bgTint: "rgba(16, 185, 129, 0.09)",
    accentColor: "#10b981",
    cellBg: "rgba(18, 36, 30, 0.78)",
    cellBorder: "rgba(52, 211, 153, 0.26)"
  }
};

const calI18n = {
  fr: {
    today: "aujourd'hui",
    month: "mois",
    list: "liste",
    upcoming: "⚡ événements à venir",
    noUpcoming: "aucun événement à venir.",
    locked: "verrouillé",
    unlocked: "déverrouillé",
    addEvent: "➕ ajouter un événement",
    undo: "↩️ annuler",
    unlockTitle: "🔒 déverrouiller l'édition",
    unlockSub: "entre le code pin formateur pour modifier :",
    validate: "valider",
    incorrectPin: "code pin incorrect.",
    confirmTitle: "es-tu sûr(e) ?",
    confirmDelete: "veux-tu vraiment supprimer cet événement ?",
    yesDelete: "oui, supprimer",
    cancel: "annuler",
    detailsTitle: "📌 infos pratiques",
    descTitle: "📝 description",
    extraTitle: "💡 détails complémentaires",
    scheduleTitle: "⚡ déroulement de la soirée",
    newsletterTitle: "📧 reste informé(e) de tous les événements !",
    newsletterSub: "entre ton e-mail pour recevoir directement les invitations et actualités :",
    newsletterDisclaimer: "🔒 tes données sont protégées. désinscription en 1 clic à tout moment.",
    newsletterBtn: "m'inscrire 🚀",
    newsletterPlaceholder: "ton.email@exemple.com",
    confirmInbox: "📩 inscription envoyée ! n'oublie pas de vérifier ta boîte mail (et tes spams) pour valider ton invitation.",
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
    noUpcoming: "no upcoming events.",
    locked: "locked",
    unlocked: "unlocked",
    addEvent: "➕ add an event",
    undo: "↩️ undo",
    unlockTitle: "🔒 unlock editor",
    unlockSub: "enter the trainer pin code to edit:",
    validate: "submit",
    incorrectPin: "incorrect pin code.",
    confirmTitle: "are you sure?",
    confirmDelete: "are you sure you want to delete this event?",
    yesDelete: "yes, delete",
    cancel: "cancel",
    detailsTitle: "📌 details",
    descTitle: "📝 description",
    extraTitle: "💡 extra details",
    scheduleTitle: "⚡ event schedule",
    newsletterTitle: "📧 stay updated on all upcoming events!",
    newsletterSub: "enter your email to receive direct invitations and event news:",
    newsletterDisclaimer: "🔒 your email is safe. unsubscribe anytime in 1 click.",
    newsletterBtn: "subscribe 🚀",
    newsletterPlaceholder: "your.email@example.com",
    confirmInbox: "📩 subscription sent! please check your inbox (and spam folder) to confirm your invitation.",
    save: "💾 save",
    duplicate: "📋 duplicate",
    delete: "🗑️ delete",
    newEventTitle: "➕ add an event",
    createBtn: "create event",
    editTitle: "✏️ edit event",
    aiDisclaimer: "🌱 <strong>website creation note:</strong> this website was designed with the help of AI tools (~15 prompts, estimated environmental impact ~0.03 kg CO₂e). it is maintained exclusively without AI by Prism Outreach Studio. all events and content are created directly by our team."
  }
};

const cdlSchedule = [
  {
    "time": "19h00 - 20h00",
    "fr": "discussion libre aux tables de langues",
    "en": "open discussion at language tables"
  },
  {
    "time": "20h00 - 21h00",
    "fr": "speed dating par langue (changement toutes les 15 min)",
    "en": "language speed dating (switch every 15 mins)"
  },
  {
    "time": "21h00 - 22h00",
    "fr": "discussion libre aux tables de langues",
    "en": "open discussion at language tables"
  }
];

const defaultCalendarEvents = [
  {
    "id": 1,
    "title_fr": "☕ café des langues 70",
    "title_en": "☕ café des langues 70",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2026-09-04",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule
  },
  {
    "id": 2,
    "title_fr": "🎤 répétition rennes english choir 1",
    "title_en": "🎤 rennes english choir rehearsal 1",
    "description_fr": "répétition de la chorale anglophone rennaise - travail sur Moved",
    "description_en": "rehearsal for the english choir directed by a native speaker.",
    "event_type": "choir",
    "event_date": "2026-10-13",
    "start_time": "20:00",
    "end_time": "21:30",
    "location": "à venir !",
    "schedule": [
      { "time": "19h30 - 20h00", "fr": "accueil & échauffement vocal", "en": "welcome & vocal warmup" },
      { "time": "20h00 - 20h45", "fr": "répétition partie 1 (travail du répertoire)", "en": "rehearsal part 1 (repertoire work)" },
      { "time": "20h45 - 21h00", "fr": "pause & échanges", "en": "break & social time" },
      { "time": "21h00 - 21h30", "fr": "répétition partie 2 & chant d'ensemble", "en": "rehearsal part 2 & group singing" }
    ],
    "extra_details_fr": ""
  },
  {
    "id": 1788272106983,
    "title_fr": "🎤 répétition rennes english choir 2",
    "title_en": "🎤 rennes english choir rehearsal 2",
    "description_fr": "répétition de la chorale anglophone rennaise - travail sur Kvala sviri + Time",
    "description_en": "rehearsal for the english choir directed by a native speaker.",
    "event_type": "choir",
    "event_date": "2026-10-20",
    "start_time": "20:00",
    "end_time": "21:30",
    "location": "à venir !",
    "schedule": [
      { "time": "19h30 - 20h00", "fr": "accueil & échauffement vocal", "en": "welcome & vocal warmup" },
      { "time": "20h00 - 20h45", "fr": "répétition partie 1 (travail du répertoire)", "en": "rehearsal part 1 (repertoire work)" },
      { "time": "20h45 - 21h00", "fr": "pause & échanges", "en": "break & social time" },
      { "time": "21h00 - 21h30", "fr": "répétition partie 2 & chant d'ensemble", "en": "rehearsal part 2 & group singing" }
    ],
    "extra_details_fr": ""
  },
  {
    "id": 1788300395804,
    "title_fr": "☕ café des langues 72",
    "title_en": "☕ café des langues 72",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2026-10-02",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "72/100"
  },
  {
    "id": 1788300761017,
    "title_fr": "🎤 répétition rennes english choir 3",
    "title_en": "🎤 rennes english choir rehearsal 3",
    "description_fr": "répétition de la chorale anglophone rennaise - travail sur Kvala sviri + Time",
    "description_en": "rehearsal for the english choir directed by a native speaker.",
    "event_type": "choir",
    "event_date": "2026-10-27",
    "start_time": "20:00",
    "end_time": "21:30",
    "location": "à venir !",
    "schedule": [
      { "time": "19h30 - 20h00", "fr": "accueil & échauffement vocal", "en": "welcome & vocal warmup" },
      { "time": "20h00 - 20h45", "fr": "répétition partie 1 (travail du répertoire)", "en": "rehearsal part 1 (repertoire work)" },
      { "time": "20h45 - 21h00", "fr": "pause & échanges", "en": "break & social time" },
      { "time": "21h00 - 21h30", "fr": "répétition partie 2 & chant d'ensemble", "en": "rehearsal part 2 & group singing" }
    ],
    "extra_details_fr": ""
  },
  {
    "id": 1788817394305,
    "title_fr": "Formation bénévole",
    "title_en": "Volunteer training",
    "description_fr": "Atelier mensuel pour former les nouveaux/nouvelles bénévoles.\nMonthly workshop to train new volunteers for the association.",
    "description_en": "description...",
    "event_type": "atelier",
    "event_date": "2026-09-25",
    "start_time": "19:00",
    "end_time": "20:00",
    "location": "rennes",
    "extra_details_fr": "Bring a water bottle, notebook and a pen!"
  },
  {
    "id": 1790084509559,
    "title_fr": "☕ café des langues 71",
    "title_en": "☕ café des langues 71",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2026-09-18",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": ""
  },
  {
    "id": 1791288379519,
    "title_fr": "☕ café des langues 73",
    "title_en": "☕ café des langues 73",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2026-10-16",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "73/100"
  },
  {
    "id": 1791288410038,
    "title_fr": "🎃 café des langues 74",
    "title_en": "👻 café des langues 74",
    "description_fr": "👻 rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\n🎃meet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2026-10-30",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "74/100"
  },
  {
    "id": 1792000000075,
    "title_fr": "☕ café des langues 75",
    "title_en": "☕ café des langues 75",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2026-11-13",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "75/100"
  },
  {
    "id": 1792000000076,
    "title_fr": "☕ café des langues 76",
    "title_en": "☕ café des langues 76",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2026-11-27",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "76/100"
  },
  {
    "id": 1792000000077,
    "title_fr": "🎄 café des langues 77 — dernière de la saison !",
    "title_en": "🎄 café des langues 77 — last of the season!",
    "description_fr": "🎄 dernier café des langues de la saison avant la trêve hivernale ! rencontre à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance festive et chaleureuse.\nlast meet-up of the season before the winter break! practice multiple languages in a fun, friendly and festive environment.",
    "description_en": "last café des langues of the season before the winter break! gathering to practice over 53 languages in a festive and friendly environment.",
    "event_type": "cdl",
    "event_date": "2026-12-11",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "77/100 — ❄️ dernier café des langues de la saison ! reprise le vendredi 8 janvier 2027. très belles fêtes à tous et à toutes ! ✨"
  },
  {
    "id": 1792000000078,
    "title_fr": "👑 café des langues 78 — rentrée 2027",
    "title_en": "👑 café des langues 78 — 2027 kick-off",
    "description_fr": "première rencontre de la nouvelle année 2027 ! rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nfirst meet-up of 2027 at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "first meet-up of 2027! gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-01-08",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "78/100 — 👑 bonne année 2027 & reprise des cafés des langues ! galette des rois & retrouvailles."
  },
  {
    "id": 1792000000079,
    "title_fr": "❄️ café des langues 79",
    "title_en": "❄️ café des langues 79",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-01-22",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "79/100"
  },
  {
    "id": 1792000000080,
    "title_fr": "🥞 café des langues 80",
    "title_en": "🥞 café des langues 80",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-02-05",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "80/100 — 🥞 ambiance chandeleur & crêpes !"
  },
  {
    "id": 1792000000081,
    "title_fr": "🎭 café des langues 81",
    "title_en": "🎭 café des langues 81",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-02-19",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "81/100 — 💘 ambiance carnaval & saint-valentin !"
  },
  {
    "id": 1792000000082,
    "title_fr": "☕ café des langues 82",
    "title_en": "☕ café des langues 82",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-03-05",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "82/100"
  },
  {
    "id": 1792000000083,
    "title_fr": "🌱 café des langues 83",
    "title_en": "🌱 café des langues 83",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-03-19",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "83/100 — 🌱 célébration de l'équinoxe de printemps !"
  },
  {
    "id": 1792000000084,
    "title_fr": "🐣 café des langues 84",
    "title_en": "🐣 café des langues 84",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-04-02",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "84/100 — 🍫 spécial pâques & chocolats !"
  },
  {
    "id": 1792000000085,
    "title_fr": "🌸 café des langues 85",
    "title_en": "🌸 café des langues 85",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-04-16",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "85/100"
  },
  {
    "id": 1792000000086,
    "title_fr": "🌼 café des langues 86",
    "title_en": "🌼 café des langues 86",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-04-30",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "86/100 — 🌿 veille du 1er mai & fête du travail !"
  },
  {
    "id": 1792000000087,
    "title_fr": "🌿 café des langues 87",
    "title_en": "🌿 café des langues 87",
    "description_fr": "rencontre un vendredi sur deux à l'Auberge de jeunesse Hostel Rennes pour pratiquer plusieurs langues dans une ambiance conviviale.\nmeet-up every other Friday at Hostel Rennes to practice multiple languages in a fun and friendly environment.",
    "description_en": "weekly bar gathering to practice over 53 languages in a friendly environment.",
    "event_type": "cdl",
    "event_date": "2027-05-14",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "87/100"
  },
  {
    "id": 1792000000088,
    "title_fr": "🎉 café des langues 88 — grande clôture de la saison !",
    "title_en": "🎉 café des langues 88 — season grand finale!",
    "description_fr": "dernier café des langues de la saison 2026-2027 ! venez fêter la fin de l'année scolaire et d'une superbe série d'échanges linguistiques à l'Auberge de jeunesse Hostel Rennes.\nlast café des langues of the 2026-2027 season! join us to celebrate the end of a wonderful season together before the summer break.",
    "description_en": "grand season finale of café des langues for 2026-2027! final gathering to practice languages before the summer.",
    "event_type": "cdl",
    "event_date": "2027-05-28",
    "start_time": "19:00",
    "end_time": "22:00",
    "location": "10 Canal Saint-Martin, 35700 Rennes",
    "schedule": cdlSchedule,
    "extra_details_fr": "88/100 — 🌟 dernier café des langues de la saison ! merci à toutes et à tous pour cette magnifique année."
  }
];

/* Safe local cache initialization: merges new default events seamlessly */
let calendarEvents = (() => {
  try {
    const raw = localStorage.getItem('pos_calendar_events');
    if (!raw) return defaultCalendarEvents;
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored)) return defaultCalendarEvents;

    const storedIds = new Set(stored.map(e => e.id));
    let hasNew = false;
    defaultCalendarEvents.forEach(defEv => {
      if (!storedIds.has(defEv.id)) {
        stored.push(defEv);
        hasNew = true;
      }
    });
    if (hasNew) {
      localStorage.setItem('pos_calendar_events', JSON.stringify(stored));
    }
    return stored;
  } catch (err) {
    return defaultCalendarEvents;
  }
})();

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

function handleCalendarNewsletterSubmit(e, eventId) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById(`cal-news-email-${eventId}`);
  const statusEl = document.getElementById(`cal-news-status-${eventId}`);
  const lang = calState.language;
  const t = calI18n[lang];

  if (!emailInput || !emailInput.value) return;

  const formData = new FormData();
  formData.append("email_address", emailInput.value);

  fetch("https://app.kit.com/forms/9871438/subscriptions", {
    method: "POST",
    body: formData,
    mode: "no-cors"
  }).then(() => {
    if (statusEl) {
      statusEl.innerHTML = t.confirmInbox;
      statusEl.style.color = "#22c55e";
      statusEl.style.display = "block";
    }
    emailInput.value = "";
  }).catch(err => {
    console.error("Newsletter submission error:", err);
    if (statusEl) {
      statusEl.innerHTML = t.confirmInbox;
      statusEl.style.color = "#22c55e";
      statusEl.style.display = "block";
    }
    emailInput.value = "";
  });
}

function injectCalendarStyles() {
  if (document.getElementById('pos-cal-styles')) return;
  const style = document.createElement('style');
  style.id = 'pos-cal-styles';
  style.textContent = `
    #pos-calendar {
      background: radial-gradient(circle at 85% 15%, var(--season-bg-tint, rgba(56, 189, 248, 0.08)), transparent 60%), rgba(15, 23, 42, 0.72);
      border: 1px solid var(--season-cell-border, rgba(56, 189, 248, 0.22));
      border-radius: 18px;
      padding: 16px;
      transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.42);
    }
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
    .cal-title-container { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
    .cal-btn { background: rgba(255, 255, 255, 0.06); border: 1px solid var(--card-border); color: var(--text-main); padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s ease; }
    .cal-btn.active { background: var(--season-accent, var(--cdl-cyan, #38bdf8)) !important; color: #000 !important; }
    
    .cal-month-title {
      font-size: 20px; font-weight: 700; color: var(--season-accent, var(--cdl-cyan, #38bdf8));
      text-transform: lowercase; display: inline-flex; align-items: center; gap: 8px; margin: 0;
      transition: color 0.3s ease;
    }
    .cal-season-badge {
      font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px;
      background: rgba(255, 255, 255, 0.05); border: 1px solid var(--season-cell-border, rgba(56, 189, 248, 0.22));
      color: var(--season-accent, var(--cdl-cyan, #38bdf8)); display: inline-flex; align-items: center; gap: 5px;
      text-transform: lowercase; letter-spacing: 0.2px; transition: all 0.3s ease;
    }
    
    .weekdays-grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 700; font-size: 13px; color: var(--text-muted); margin-bottom: 10px; }
    .month-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
    
    .day-cell {
      min-height: 112px; background: var(--season-cell-bg, rgba(22, 30, 49, 0.75));
      border: 1px solid var(--season-cell-border, rgba(56, 189, 248, 0.2));
      border-radius: 12px; padding: 8px; display: flex; flex-direction: column; overflow: hidden;
      transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.2s ease;
    }
    .day-cell.drag-over { border: 2px dashed var(--neon-amber, #f59e0b); background: rgba(245, 158, 11, 0.15); }
    .day-cell.other-month { opacity: 0.28; background: rgba(15, 23, 42, 0.35); }
    .day-cell.today {
      border: 2px solid var(--season-accent, var(--cdl-cyan, #38bdf8));
      box-shadow: 0 0 16px var(--season-cell-border, rgba(56, 189, 248, 0.4));
    }
    
    .day-cell-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; gap: 4px; }
    .day-number { font-weight: 700; font-size: 13px; color: var(--text-muted); }
    .day-holiday-pill {
      font-size: 9.5px; font-weight: 700; color: var(--neon-amber, #f59e0b);
      background: rgba(245, 158, 11, 0.14); border: 1px solid rgba(245, 158, 11, 0.32);
      padding: 1px 6px; border-radius: 6px; white-space: nowrap; overflow: hidden;
      text-overflow: ellipsis; max-width: 78%; line-height: 1.25; user-select: none;
    }
    
    .day-events { display: flex; flex-direction: column; gap: 5px; overflow-y: auto; }

    .event-pill {
      font-size: 11px; font-weight: 700; padding: 4px 6px; border-radius: 6px; color: #000;
      cursor: pointer; line-height: 1.25; display: flex; flex-direction: column; gap: 2px;
      user-select: none; word-break: break-word; transition: transform 0.15s ease, filter 0.15s ease;
    }
    .event-pill:hover { transform: translateY(-1px); filter: brightness(1.08); }
    .event-pill-time {
      font-size: 9.5px; font-weight: 800; opacity: 0.9; background: rgba(0, 0, 0, 0.16);
      padding: 1px 4px; border-radius: 3px; align-self: flex-start;
    }
    .event-pill-title {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .event-pill[draggable="true"] { cursor: grab; }
    .event-pill[draggable="true"]:active { cursor: grabbing; opacity: 0.6; }

    .upcoming-section { margin-top: 35px; padding-top: 20px; border-top: 1px dashed rgba(255, 255, 255, 0.1); }
    .upcoming-title { font-size: 17px; font-weight: 700; color: var(--neon-amber, #f59e0b); margin-bottom: 15px; }
    .event-row { display: flex; align-items: center; gap: 15px; background: rgba(15, 23, 42, 0.65); border: 1px solid var(--card-border); border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; cursor: pointer; transition: transform 0.2s ease, border-color 0.2s ease; }
    .event-row:hover { transform: translateX(4px); border-color: var(--season-accent, var(--cdl-cyan, #38bdf8)); }
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
    .cal-form-input { width: 100%; background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.3); color: #fff; padding: 9px 12px; border-radius: 8px; font-family: inherit; font-size: 13.5px; color-scheme: dark; }
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
        <button id="cal-download-btn" class="cal-btn-add" style="background:#22c55e; color:#000; display:none;" onclick="downloadUpdatedCalendarJS()" title="Télécharger calendar.js mis à jour">📥 enregistrer calendar.js</button>
      </div>
    </div>

    <div class="cal-header">
      <div class="cal-nav-group">
        <button class="cal-btn" onclick="navCal(-1)">‹</button>
        <button class="cal-btn" onclick="navCalToday()" id="btn-cal-today">aujourd'hui</button>
        <button class="cal-btn" onclick="navCal(1)">›</button>
      </div>
      <div class="cal-title-container">
        <h2 class="cal-month-title" id="cal-title">...</h2>
        <div class="cal-season-badge" id="cal-season-badge"></div>
      </div>
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

  const dlBtn = document.getElementById('cal-download-btn');
  if (dlBtn) dlBtn.style.display = isCalUnlocked ? "inline-block" : "none";

  injectFooterDisclaimer();

  // Dynamic seasonal theme application
  const monthIdx = calState.currentDate.getMonth();
  const season = SEASONAL_THEMES[monthIdx] || SEASONAL_THEMES[0];
  const calRoot = document.getElementById('pos-calendar');
  if (calRoot) {
    calRoot.style.setProperty('--season-accent', season.accentColor);
    calRoot.style.setProperty('--season-bg-tint', season.bgTint);
    calRoot.style.setProperty('--season-cell-bg', season.cellBg);
    calRoot.style.setProperty('--season-cell-border', season.cellBorder);
  }

  const formattedMonth = calState.currentDate.toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US", { month: "long", year: "numeric" }
  );

  document.getElementById('cal-title').innerHTML = `
    <span>${formattedMonth}</span>
    <span style="font-size: 18px; filter: drop-shadow(0 0 4px rgba(255,255,255,0.25));">${season.titleSuffix}</span>
  `;

  const badgeEl = document.getElementById('cal-season-badge');
  if (badgeEl) {
    badgeEl.innerHTML = `<span>${season.emoji}</span> <span>${lang === "fr" ? season.badgeFr : season.badgeEn}</span>`;
  }

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

  // Upcoming events are always rendered strictly relative to real-world today
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
  const year = calState.currentDate.getFullYear();
  const month = calState.currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = (startWeekday + daysInMonth > 35) ? 42 : 35;
  const firstCellDate = new Date(firstDay);
  firstCellDate.setDate(firstCellDate.getDate() - startWeekday);

  const lang = calState.language;

  for (let i = 0; i < totalCells; i++) {
    const cellDate = new Date(firstCellDate); cellDate.setDate(cellDate.getDate() + i);
    const cellISO = isoDateStr(cellDate);
    const isToday = cellISO === isoDateStr(new Date());
    const isOtherMonth = cellDate.getMonth() !== calState.currentDate.getMonth();

    const cell = document.createElement('div');
    cell.className = `day-cell ${isToday ? 'today' : ''} ${isOtherMonth ? 'other-month' : ''}`;
    cell.dataset.date = cellISO;

    // Detect French holidays & festive observances
    const holiday = FRENCH_HOLIDAYS[cellISO] || FRENCH_HOLIDAYS[cellISO.slice(5)];
    const holidayHTML = holiday 
      ? `<span class="day-holiday-pill" title="${lang === 'fr' ? holiday.fr : holiday.en}">${lang === 'fr' ? holiday.fr : holiday.en}</span>` 
      : '';

    cell.innerHTML = `
      <div class="day-cell-top">
        <span class="day-number">${cellDate.getDate()}</span>
        ${holidayHTML}
      </div>
    `;

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

/* Strictly filters current and future events based on the real date of today */
function renderUpcoming() {
  const list = document.getElementById('cal-upcoming-list');
  if (!list) return;
  list.innerHTML = '';
  const lang = calState.language;
  const t = calI18n[lang];

  // Always calculated from actual today (new Date()), regardless of month viewed
  const todayISO = isoDateStr(new Date());

  const filtered = calendarEvents
    .filter(e => calState.activeFilters.has(e.event_type) && e.event_date >= todayISO)
    .sort((a,b) => a.event_date.localeCompare(b.event_date));

  if (filtered.length === 0) {
    list.innerHTML = `<p style="font-size:13.5px; color:var(--text-muted); padding:10px 0;">${t.noUpcoming}</p>`;
    return;
  }

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

/* Strict upcoming filtering for list view based on real today */
function renderListView() {
  const list = document.getElementById('cal-list-view');
  list.innerHTML = '';
  const lang = calState.language;
  const t = calI18n[lang];
  const todayISO = isoDateStr(new Date());

  const filtered = calendarEvents
    .filter(e => calState.activeFilters.has(e.event_type) && e.event_date >= todayISO)
    .sort((a,b) => a.event_date.localeCompare(b.event_date));

  if (filtered.length === 0) {
    list.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">${t.noUpcoming}</p>`;
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
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:16px;">
        <h2 style="font-size:22px; font-weight:700; color:var(--text-main, #fff); margin:0;">
          ${lang === "fr" ? ev.title_fr : ev.title_en}
        </h2>
      </div>

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

      <!-- Section unique d'inscription e-mail -->
      <div class="cal-modal-section" style="background: rgba(56, 189, 248, 0.08); border: 1px solid var(--card-border);">
        <div style="font-size: 14px; font-weight: 700; color: var(--neon-amber, #f59e0b); margin-bottom: 4px;">
          ${t.newsletterTitle}
        </div>
        <p style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 10px;">
          ${t.newsletterSub}
        </p>
        <form onsubmit="handleCalendarNewsletterSubmit(event, ${ev.id})">
          <div style="display:flex; gap:8px; margin-bottom: 6px; flex-wrap:wrap;">
            <input type="email" id="cal-news-email-${ev.id}" placeholder="${t.newsletterPlaceholder}" class="cal-form-input" style="flex:1; min-width:180px;" required>
            <button type="submit" class="cal-btn" style="background:var(--neon-amber, #f59e0b); color:#000; white-space:nowrap;">
              ${t.newsletterBtn}
            </button>
          </div>
          <div style="font-size: 11px; color: rgba(203, 213, 225, 0.75); font-style: italic;">
            ${t.newsletterDisclaimer}
          </div>
        </form>
        <div id="cal-news-status-${ev.id}" style="font-size: 12.5px; font-weight: 700; margin-top: 10px; line-height: 1.5; display: none;"></div>
      </div>
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
    const dlBtn = document.getElementById('cal-download-btn');
    if (dlBtn) dlBtn.style.display = "none";

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
    const dlBtn = document.getElementById('cal-download-btn');
    if (dlBtn) dlBtn.style.display = "inline-block";

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

async function downloadUpdatedCalendarJS() {
  let jsText = "";

  try {
    const response = await fetch('calendar.js');
    if (response.ok) {
      jsText = await response.text();
    }
  } catch (err) {
    console.warn("Could not fetch calendar.js directly. Using fallback replacement.");
  }

  const updatedEventsJSON = JSON.stringify(calendarEvents, null, 2);

  if (jsText) {
    const regex = /const\s+defaultCalendarEvents\s*=\s*\[[\s\S]*?\];/;
    jsText = jsText.replace(regex, `const defaultCalendarEvents = ${updatedEventsJSON};`);
  } else {
    alert("Impossible de lire calendar.js automatiquement. Vérifiez la console.");
    return;
  }

  const blob = new Blob([jsText], { type: "application/javascript;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "calendar.js";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
