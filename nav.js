/* =========================================================
   Prism Outreach Studio — Centralized Dynamic Navigation Bar
   ========================================================= */

const NAV_PIN_HASH = "c9693df0c3bd56a2c6b9bebbb0e51210e771823498faec23398581961e8aa3d2";

const defaultNavInitiatives = [
  { id: "cdl", title: "café des langues", url: "cdl-code.html" },
  { id: "choir", title: "rennes english choir", url: "rec-code.html" }
];

let navInitiatives = JSON.parse(localStorage.getItem('pos_events_data')) || defaultNavInitiatives;

let navState = {
  language: localStorage.getItem('pos_lang') || "fr",
  isUnlocked: false
};

const navI18n = {
  fr: {
    hubTab: "tous les événements",
    joinBtn: "rejoins-nous !",
    locked: "verrouillé",
    unlocked: "déverrouillé",
    downloadTitle: "Télécharger le fichier HTML mis à jour",
    incorrectPin: "Code PIN incorrect."
  },
  en: {
    hubTab: "all events",
    joinBtn: "join us!",
    locked: "locked",
    unlocked: "unlocked",
    downloadTitle: "Download updated HTML file",
    incorrectPin: "Incorrect PIN code."
  }
};

/* --- SHA-256 Hash Helper --- */
async function navSha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/* --- Inject CSS Styles --- */
function injectNavStyles() {
  if (document.getElementById('pos-nav-styles')) return;
  const style = document.createElement('style');
  style.id = 'pos-nav-styles';
  style.textContent = `
    .global-nav {
      position: sticky; top: 0; z-index: 9999;
      background: rgba(11, 15, 25, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--card-border, rgba(56, 189, 248, 0.25)); padding: 12px 20px;
    }
    .nav-inner {
      max-width: 1200px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }
    .pos-logo-link {
      display: flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.95); border: 2px solid var(--pos-coral, #f97316);
      box-shadow: 0 0 12px rgba(249, 115, 22, 0.45); overflow: hidden;
      transition: transform 0.3s ease; flex-shrink: 0;
    }
    .pos-logo-link:hover { transform: scale(1.08); }
    .pos-logo-img { width: 32px; height: 32px; object-fit: contain; }

    .nav-menu { display: flex; align-items: center; gap: 8px; position: relative; }
    .nav-tab {
      color: var(--text-muted, #cbd5e1); text-decoration: none; font-weight: 700;
      font-size: 13.5px; padding: 6px 12px; border-radius: 20px;
      white-space: nowrap; border: 1px solid transparent; transition: all 0.25s ease;
    }
    .nav-tab:hover { color: var(--text-main, #fff); border-color: rgba(56, 189, 248, 0.3); background: rgba(255, 255, 255, 0.04); }
    .nav-tab.active { color: #000; background: var(--cdl-cyan, #38bdf8); box-shadow: 0 0 12px var(--cdl-cyan, #38bdf8); }

    .nav-dropdown { position: relative; display: inline-block; }
    .nav-dropdown-content {
      display: none; position: absolute; top: 100%; left: 0;
      background: #0f172a; border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25)); border-radius: 12px;
      min-width: 220px; box-shadow: 0 10px 25px rgba(0,0,0,0.6); z-index: 10000; padding: 8px 0;
    }
    .nav-dropdown:hover .nav-dropdown-content { display: block; }
    .nav-dropdown-item {
      display: block; padding: 8px 16px; color: var(--text-muted, #cbd5e1);
      text-decoration: none; font-weight: 700; font-size: 13px; transition: 0.2s;
    }
    .nav-dropdown-item:hover { background: rgba(56, 189, 248, 0.15); color: var(--cdl-cyan, #38bdf8); }
    .nav-dropdown-item.active { color: var(--cdl-cyan, #38bdf8); font-weight: 900; }

    .right-controls { display: flex; align-items: center; gap: 8px; }

    .join-btn {
      background: linear-gradient(135deg, var(--neon-amber, #f59e0b), #f97316); color: #000000;
      font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 20px;
      text-decoration: none; white-space: nowrap; box-shadow: 0 0 12px rgba(245, 158, 11, 0.45);
      transition: all 0.25s ease; display: inline-flex; align-items: center; gap: 5px;
    }
    .join-btn:hover { transform: scale(1.05); box-shadow: 0 0 18px rgba(245, 158, 11, 0.7); color: #000000; }

    .lock-btn {
      background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5;
      padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12.5px;
      cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.3s ease;
    }
    .lock-btn.unlocked { background: rgba(34, 197, 94, 0.2); border-color: #22c55e; color: #86efac; box-shadow: 0 0 10px rgba(34, 197, 94, 0.3); }

    .download-icon-btn {
      display: none; background: rgba(255, 255, 255, 0.08); border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25));
      color: var(--text-main, #fff); font-size: 15px; padding: 5px 10px; border-radius: 20px;
      cursor: pointer; transition: all 0.25s ease; vertical-align: middle;
    }
    .download-icon-btn:hover { background: var(--neon-amber, #f59e0b); transform: scale(1.1); box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
    body.body-unlocked .download-icon-btn { display: inline-block; }

    .lang-toggle { display: flex; background: rgba(255, 255, 255, 0.08); padding: 3px; border-radius: 30px; border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25)); flex-shrink: 0; }
    .lang-btn { background: transparent; border: none; color: var(--text-muted, #cbd5e1); padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 12.5px; cursor: pointer; }
    .lang-btn.active { background: var(--cdl-cyan, #38bdf8); color: #000; }
  `;
  document.head.appendChild(style);
}

/* --- Mount Nav HTML Structure --- */
function mountNavHTML() {
  const target = document.getElementById('pos-nav');
  if (!target) return;

  target.className = "global-nav";
  target.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="pos-logo-link" title="Prism Outreach Studio — Accueil">
        <img src="P-OS.png" alt="POS Logo" class="pos-logo-img">
      </a>
      
      <div class="nav-menu" id="nav-dynamic-tabs"></div>

      <div class="right-controls">
        <a href="https://docs.google.com/forms/d/1HkPBQMG96KqWkb5OtLcee74on1ApqwCj5j7nUym6J-Y/edit" target="_blank" class="join-btn">
          <span>🙌</span> <span id="nav-join-text">rejoins-nous !</span>
        </a>

        <button class="download-icon-btn" onclick="downloadUpdatedHTML()" id="nav-download-btn" title="Télécharger le fichier HTML mis à jour">📥</button>

        <button id="nav-lock-btn" class="lock-btn" onclick="toggleNavLock()">
          🔒 <span id="nav-lock-label">verrouillé</span>
        </button>

        <div class="lang-toggle">
          <button class="lang-btn" id="nav-btn-fr" onclick="setNavLanguage('fr')">FR</button>
          <button class="lang-btn" id="nav-btn-en" onclick="setNavLanguage('en')">EN</button>
        </div>
      </div>
    </div>
  `;
}

/* --- Render Nav Menu --- */
function renderNavMenu() {
  const container = document.getElementById('nav-dynamic-tabs');
  if (!container) return;
  
  navInitiatives = JSON.parse(localStorage.getItem('pos_events_data')) || defaultNavInitiatives;
  
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const isHubPage = currentPath === "index.html" || currentPath === "";
  const t = navI18n[navState.language];

  container.innerHTML = '';

  if (navInitiatives.length > 3) {
    let dropdownItems = navInitiatives.map(item => {
      const isActive = currentPath === item.url ? "active" : "";
      return `<a href="${item.url}" class="nav-dropdown-item ${isActive}">${item.title}</a>`;
    }).join('');

    container.innerHTML = `
      <div class="nav-dropdown">
        <a href="index.html" class="nav-tab ${isHubPage ? 'active' : ''}">${t.hubTab} ▼</a>
        <div class="nav-dropdown-content">
          ${dropdownItems}
        </div>
      </div>
    `;
  } else {
    let tabsHtml = `<a href="index.html" class="nav-tab ${isHubPage ? 'active' : ''}">${t.hubTab}</a>`;
    navInitiatives.forEach(item => {
      const isActive = currentPath === item.url ? "active" : "";
      tabsHtml += `<a href="${item.url}" class="nav-tab ${isActive}">${item.title}</a>`;
    });
    container.innerHTML = tabsHtml;
  }
}

/* --- Lock / Unlock Toggle --- */
async function toggleNavLock() {
  const t = navI18n[navState.language];
  if (!navState.isUnlocked) {
    const pin = prompt("Entrez le code PIN formateur pour modifier :");
    if (pin !== null) {
      const inputHash = await navSha256(pin);
      if (inputHash === NAV_PIN_HASH) {
        setNavUnlockState(true);
      } else {
        alert(t.incorrectPin);
      }
    }
  } else {
    setNavUnlockState(false);
  }
}

function setNavUnlockState(state) {
  navState.isUnlocked = state;
  const lockBtn = document.getElementById('nav-lock-btn');
  const lockLabel = document.getElementById('nav-lock-label');
  const t = navI18n[navState.language];

  if (state) {
    document.body.classList.add('body-unlocked');
    if (lockBtn) lockBtn.classList.add('unlocked');
    if (lockLabel) lockLabel.innerText = t.unlocked;
  } else {
    document.body.classList.remove('body-unlocked');
    if (lockBtn) lockBtn.classList.remove('unlocked');
    if (lockLabel) lockLabel.innerText = t.locked;
  }

  if (typeof renderEvents === "function") renderEvents();
}

/* --- Language Handler & Global Broadcast --- */
window.setNavLanguage = function(lang) {
  navState.language = lang;
  localStorage.setItem('pos_lang', lang);

  const t = navI18n[lang];

  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`nav-btn-${lang}`);
  if (activeBtn) activeBtn.classList.add('active');

  const joinText = document.getElementById('nav-join-text');
  if (joinText) joinText.innerText = t.joinBtn;

  const lockLabel = document.getElementById('nav-lock-label');
  if (lockLabel) lockLabel.innerText = navState.isUnlocked ? t.unlocked : t.locked;

  const downloadBtn = document.getElementById('nav-download-btn');
  if (downloadBtn) downloadBtn.title = t.downloadTitle;

  renderNavMenu();

  // Broadcast language change to ALL page components
  window.dispatchEvent(new CustomEvent('pos-language-change', { detail: { lang } }));

  if (typeof window.syncCalendarLanguage === "function") window.syncCalendarLanguage(lang);
  if (typeof window.syncPostsLanguage === "function") window.syncPostsLanguage(lang);
  if (typeof setLanguage === "function") setLanguage(lang);
};

/* --- HTML Download Handler --- */
window.downloadUpdatedHTML = function() {
  if (typeof closeModal === 'function') closeModal();
  if (typeof closeCalShadowbox === 'function') closeCalShadowbox();
  if (typeof closePostsModal === 'function') closePostsModal();

  const wasUnlocked = document.body.classList.contains('body-unlocked');
  document.body.classList.remove('body-unlocked');

  const cleanHTML = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;

  if (wasUnlocked) document.body.classList.add('body-unlocked');

  const blob = new Blob([cleanHTML], { type: "text/html;charset=utf-8" });
  const link = document.createElement("a");
  let fileName = window.location.pathname.split("/").pop() || "index.html";
  
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
  injectNavStyles();
  mountNavHTML();
  setNavLanguage(navState.language);
});
