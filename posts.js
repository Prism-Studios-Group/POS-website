/* =========================================================
   Prism Outreach Studio — Centralized News & Posts System
   ========================================================= */

const defaultPostsData = [
  {
    id: 12,
    title: "The POS Weekly Scoop #12",
    date: "Septembre 2026",
    cover: "🗣️",
    content: "Voici les dernières nouvelles exclusives du Rennes Café des Langues... <br><br><b>Au programme ce mois-ci :</b> de nouvelles tables linguistiques et plus de 50 personnes chaque mercredi !"
  },
  {
    id: 11,
    title: "The POS Weekly Scoop #11",
    date: "Août 2026",
    cover: "🌍",
    content: "Retour sur notre grand Speed Dating international avec plus de 50 personnes ! Un immense merci à notre bar partenaire pour l'accueil chaleureux."
  }
];

let postsData = JSON.parse(localStorage.getItem('pos_posts_data')) || defaultPostsData;

let postsState = {
  language: "fr"
};

const postsI18n = {
  fr: {
    titleHeading: "archive des actualités",
    addEdition: "➕ ajouter une édition",
    newsCtaTitle: "💌 Envie de ne rien manquer ?",
    newsCtaSub: "Reçois nos dernières actualités, exclusivités et événements directement dans ta boîte mail. C'est 100 % gratuit !",
    newsPlaceholder: "exemple@email.com",
    newsBtnText: "S'abonner"
  },
  en: {
    titleHeading: "newsletter archives",
    addEdition: "➕ add edition",
    newsCtaTitle: "💌 Want to stay in the loop?",
    newsCtaSub: "Get our latest news, behind-the-scenes updates, and upcoming events delivered straight to your inbox. 100% free!",
    newsPlaceholder: "example@email.com",
    newsBtnText: "Subscribe"
  }
};

/* --- CSS Injection --- */
function injectPostsStyles() {
  if (document.getElementById('pos-posts-styles')) return;
  const style = document.createElement('style');
  style.id = 'pos-posts-styles';
  style.textContent = `
    .posts-header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .posts-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
    .posts-card {
      background: rgba(15, 23, 42, 0.85); border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25));
      border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease; position: relative;
    }
    .posts-card:hover { transform: translateY(-4px); border-color: var(--neon-cyan, #38bdf8); box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2); }
    .posts-card-cover { height: 100px; background: linear-gradient(135deg, #1e1b4b, #31104b); display: flex; align-items: center; justify-content: center; font-size: 36px; overflow: hidden; }
    .posts-card-cover img { width: 100%; height: 100%; object-fit: cover; }
    .posts-card-body { padding: 15px; }
    .posts-card-title { font-weight: 700; font-size: 15px; margin-bottom: 4px; color: var(--text-main, #fff); }
    .posts-card-date { font-size: 12px; color: var(--text-muted, #cbd5e1); }

    /* Modal Overlay */
    .posts-modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center; z-index: 10000; padding: 20px;
    }
    .posts-modal-card {
      background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 16px;
      max-width: 620px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 26px;
      position: relative; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9); text-align: left; margin: auto;
    }
    .posts-modal-close { position: absolute; top: 18px; right: 22px; font-size: 22px; color: var(--text-muted, #cbd5e1); cursor: pointer; }
    .posts-modal-close:hover { color: #ef4444; }

    .posts-form-group { margin-bottom: 14px; }
    .posts-form-group label { display: block; font-size: 12.5px; font-weight: 700; color: var(--neon-cyan, #38bdf8); margin-bottom: 5px; }
    .posts-form-input { width: 100%; background: #1e293b; border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25)); color: #fff; padding: 9px 12px; border-radius: 8px; font-family: inherit; font-size: 13.5px; }

    .posts-editor-toolbar { display: flex; gap: 6px; margin-bottom: 6px; flex-wrap: wrap; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 6px; }
    .posts-tool-btn { background: #1e293b; border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25)); color: var(--text-main, #fff); padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 12px; cursor: pointer; }
    .posts-tool-btn:hover { background: var(--neon-cyan, #38bdf8); color: #000; }

    .posts-btn-add { background: rgba(255,255,255,0.05); border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25)); color: var(--text-main, #fff); font-weight: 700; font-size: 12px; padding: 5px 12px; border-radius: 8px; cursor: pointer; display: none; }
    body.body-unlocked .posts-btn-add { display: inline-block; }

    /* Integrated Kit Newsletter Signup Card */
    .posts-newsletter-card {
      margin-top: 30px;
      padding-top: 25px;
      border-top: 1px dashed rgba(255, 255, 255, 0.15);
    }
    .posts-newsletter-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(168, 85, 247, 0.1));
      border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25));
      border-radius: 14px;
      padding: 22px;
    }
    .posts-newsletter-text h3 {
      font-size: 18px;
      font-weight: 700;
      color: var(--neon-cyan, #38bdf8);
      margin-bottom: 4px;
    }
    .posts-newsletter-text p {
      font-size: 13.5px;
      color: var(--text-muted, #cbd5e1);
      max-width: 480px;
      line-height: 1.5;
    }
    .posts-newsletter-form {
      display: flex;
      gap: 10px;
      flex-grow: 1;
      max-width: 420px;
    }
    .posts-newsletter-input {
      flex: 1;
      background: #0f172a;
      border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25));
      color: #fff;
      padding: 10px 14px;
      border-radius: 25px;
      font-family: inherit;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.2s;
    }
    .posts-newsletter-input:focus {
      border-color: var(--neon-cyan, #38bdf8);
    }
    .posts-newsletter-btn {
      background: var(--neon-amber, #f59e0b);
      color: #000;
      font-weight: 700;
      font-size: 13px;
      padding: 10px 20px;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      white-space: nowrap;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .posts-newsletter-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
    }
    @media (max-width: 768px) {
      .posts-newsletter-content { flex-direction: column; align-items: stretch; }
      .posts-newsletter-form { max-width: 100%; flex-direction: column; }
    }
  `;
  document.head.appendChild(style);
}

/* --- Mounting Markup --- */
function mountPostsHTML() {
  const target = document.getElementById('pos-posts');
  if (!target) return;

  target.innerHTML = `
    <div class="posts-header-bar">
      <div style="font-size:20px; font-weight:700; color:var(--neon-cyan, #38bdf8);">
        📰 <span id="title-news-heading">archive des actualités</span>
      </div>
      <button class="posts-btn-add" id="posts-add-btn" onclick="openAddPostModal()">➕ ajouter une édition</button>
    </div>
    
    <div class="posts-gallery" id="posts-gallery-container"></div>

    <!-- Integrated Kit Newsletter Sign-up Box -->
    <div class="posts-newsletter-card">
      <div class="posts-newsletter-content">
        <div class="posts-newsletter-text">
          <h3 id="posts-news-title">💌 Envie de ne rien manquer ?</h3>
          <p id="posts-news-sub">Reçois nos dernières actualités, exclusivités et événements directement dans ta boîte mail. C'est 100 % gratuit !</p>
        </div>
        <form action="https://rennes-cafe-des-langues.kit.com" method="post" target="_blank" class="posts-newsletter-form">
          <input type="email" name="email_address" class="posts-newsletter-input" id="posts-news-input" placeholder="exemple@email.com" required />
          <button type="submit" class="posts-newsletter-btn"><span id="posts-news-btn">S'abonner</span> 🚀</button>
        </form>
      </div>
    </div>

    <div class="posts-modal-overlay" id="posts-modal-overlay" onclick="closePostsModalOnOverlay(event)">
      <div class="posts-modal-card" onclick="event.stopPropagation()">
        <span class="posts-modal-close" onclick="closePostsModal()">&times;</span>
        <div id="posts-modal-content"></div>
      </div>
    </div>
  `;
}

/* --- Save & Render --- */
function savePostsData() {
  localStorage.setItem('pos_posts_data', JSON.stringify(postsData));
  renderPostsGallery();
}

function renderPostsGallery() {
  const container = document.getElementById('posts-gallery-container');
  if (!container) return;
  container.innerHTML = '';

  postsData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'posts-card';
    card.onclick = () => openPostModal(index);

    let coverHtml = item.cover.startsWith('http') 
      ? `<img src="${item.cover}" alt="Cover">` 
      : item.cover;

    card.innerHTML = `
      <div class="posts-card-cover">${coverHtml}</div>
      <div class="posts-card-body">
        <div class="posts-card-title">${item.title}</div>
        <div class="posts-card-date">${item.date}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* --- Modals & Editors --- */
function openPostModal(index) {
  const item = postsData[index];
  const isUnlocked = document.body.classList.contains('body-unlocked');

  if (isUnlocked) {
    openEditPostModal(index);
  } else {
    const content = document.getElementById('posts-modal-content');
    content.innerHTML = `
      <h2 style="color:var(--neon-cyan, #38bdf8); margin-bottom:6px;">${item.title}</h2>
      <p style="font-size:12px; color:var(--neon-amber, #f59e0b); font-weight:700; margin-bottom:18px;">📅 ${item.date}</p>
      <div style="font-size:14.5px; line-height:1.7; color:var(--text-main, #fff);">${item.content}</div>
    `;
    document.getElementById('posts-modal-overlay').style.display = 'flex';
  }
}

function openAddPostModal() {
  const content = document.getElementById('posts-modal-content');
  content.innerHTML = `
    <h3 style="color:var(--neon-amber, #f59e0b); margin-bottom:15px;">➕ ajouter une actualité</h3>
    <div class="posts-form-group">
      <label>Titre de l'édition :</label>
      <input type="text" id="add-post-title" class="posts-form-input" value="The POS Weekly Scoop #${postsData.length + 1}">
    </div>
    <div class="posts-form-group">
      <label>Mois / Date :</label>
      <input type="text" id="add-post-date" class="posts-form-input" value="Octobre 2026">
    </div>
    <div class="posts-form-group">
      <label>Cover (Emoji ou Image URL) :</label>
      <input type="text" id="add-post-cover" class="posts-form-input" value="🗞️">
    </div>
    <div class="posts-form-group">
      <label>Contenu de l'actualité :</label>
      <div class="posts-editor-toolbar">
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<b>', '</b>')"><b>B</b></button>
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<i>', '</i>')"><i>I</i></button>
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<u>', '</u>')"><u>U</u></button>
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<mark>', '</mark>')">Highlight</button>
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<s>', '</s>')"><s>S</s></button>
        <button class="posts-tool-btn" onclick="insertPostImageUrl('add-post-content')">📷 Image</button>
      </div>
      <textarea id="add-post-content" class="posts-form-input" rows="5">Rédigez votre texte ici...</textarea>
    </div>
    <button onclick="saveNewPost()" class="cal-btn" style="background:var(--neon-cyan, #38bdf8); color:#000; width:100%; font-weight:700; padding:10px; border-radius:8px; border:none; cursor:pointer;">💾 créer l'actualité</button>
  `;
  document.getElementById('posts-modal-overlay').style.display = 'flex';
}

function saveNewPost() {
  const title = document.getElementById('add-post-title').value;
  const date = document.getElementById('add-post-date').value;
  const cover = document.getElementById('add-post-cover').value;
  const content = document.getElementById('add-post-content').value;

  postsData.unshift({ id: Date.now(), title, date, cover, content });
  savePostsData();
  closePostsModal();
}

function openEditPostModal(index) {
  const item = postsData[index];
  const content = document.getElementById('posts-modal-content');
  content.innerHTML = `
    <h3 style="color:var(--neon-amber, #f59e0b); margin-bottom:15px;">✏️ modifier l'actualité</h3>
    <div class="posts-form-group">
      <label>Titre :</label>
      <input type="text" id="edit-post-title" class="posts-form-input" value="${item.title}">
    </div>
    <div class="posts-form-group">
      <label>Mois / Date :</label>
      <input type="text" id="edit-post-date" class="posts-form-input" value="${item.date}">
    </div>
    <div class="posts-form-group">
      <label>Cover (Emoji ou Image URL) :</label>
      <input type="text" id="edit-post-cover" class="posts-form-input" value="${item.cover}">
    </div>
    <div class="posts-form-group">
      <label>Contenu :</label>
      <div class="posts-editor-toolbar">
        <button class="posts-tool-btn" onclick="insertPostTag('edit-post-content', '<b>', '</b>')"><b>B</b></button>
        <button class="posts-tool-btn" onclick="insertPostTag('edit-post-content', '<i>', '</i>')"><i>I</i></button>
        <button class="posts-tool-btn" onclick="insertPostTag('edit-post-content', '<u>', '</u>')"><u>U</u></button>
        <button class="posts-tool-btn" onclick="insertPostTag('edit-post-content', '<mark>', '</mark>')">Highlight</button>
        <button class="posts-tool-btn" onclick="insertPostTag('edit-post-content', '<s>', '</s>')"><s>S</s></button>
        <button class="posts-tool-btn" onclick="insertPostImageUrl('edit-post-content')">📷 Image</button>
      </div>
      <textarea id="edit-post-content" class="posts-form-input" rows="6">${item.content}</textarea>
    </div>
    <div style="display:flex; justify-content:space-between; margin-top:15px;">
      <button onclick="saveEditPost(${index})" class="cal-btn" style="background:var(--neon-cyan, #38bdf8); color:#000; font-weight:700; padding:10px 20px; border-radius:8px; border:none; cursor:pointer;">💾 enregistrer</button>
      <button onclick="deletePost(${index})" class="cal-btn-sec" style="background:#ef4444; color:#fff; font-weight:700; padding:10px 20px; border-radius:8px; border:none; cursor:pointer;">🗑️ supprimer</button>
    </div>
  `;
  document.getElementById('posts-modal-overlay').style.display = 'flex';
}

function saveEditPost(index) {
  postsData[index].title = document.getElementById('edit-post-title').value;
  postsData[index].date = document.getElementById('edit-post-date').value;
  postsData[index].cover = document.getElementById('edit-post-cover').value;
  postsData[index].content = document.getElementById('edit-post-content').value;

  savePostsData();
  closePostsModal();
}

function deletePost(index) {
  if (confirm("Supprimer cette édition d'actualité ?")) {
    postsData.splice(index, 1);
    savePostsData();
    closePostsModal();
  }
}

function insertPostTag(textareaId, tagOpen, tagClose = '') {
  const el = document.getElementById(textareaId);
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;
  const selected = text.substring(start, end);
  el.value = text.substring(0, start) + tagOpen + selected + tagClose + text.substring(end);
  el.focus();
}

function insertPostImageUrl(textareaId) {
  const url = prompt("Entrez l'URL de l'image :");
  if (url) insertPostTag(textareaId, `<img src="${url}" style="width:100%; border-radius:8px; margin:10px 0;">`);
}

function closePostsModal() {
  document.getElementById('posts-modal-overlay').style.display = 'none';
}

function closePostsModalOnOverlay(e) {
  if (e.target.id === 'posts-modal-overlay') closePostsModal();
}

/* --- Language Sync Functions --- */
window.syncPostsLanguage = function(lang) {
  postsState.language = lang;
  const t = postsI18n[lang];
  
  const heading = document.getElementById('title-news-heading');
  if (heading) heading.innerText = t.titleHeading;

  const addBtn = document.getElementById('posts-add-btn');
  if (addBtn) addBtn.innerText = t.addEdition;

  const newsTitle = document.getElementById('posts-news-title');
  if (newsTitle) newsTitle.innerText = t.newsCtaTitle;

  const newsSub = document.getElementById('posts-news-sub');
  if (newsSub) newsSub.innerText = t.newsCtaSub;

  const newsInput = document.getElementById('posts-news-input');
  if (newsInput) newsInput.placeholder = t.newsPlaceholder;

  const newsBtn = document.getElementById('posts-news-btn');
  if (newsBtn) newsBtn.innerText = t.newsBtnText;
};

/* --- Initialization & Global Language Listener --- */
document.addEventListener('DOMContentLoaded', () => {
  injectPostsStyles();
  mountPostsHTML();
  renderPostsGallery();

  // Instant global listener on language buttons
  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
      const lang = langBtn.id === 'btn-en' || langBtn.innerText.trim().toLowerCase() === 'en' ? 'en' : 'fr';
      window.syncPostsLanguage(lang);
    }
  });

  // Escape Key Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePostsModal();
  });
});
