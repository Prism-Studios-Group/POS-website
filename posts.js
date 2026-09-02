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
  language: localStorage.getItem('pos_lang') || "fr"
};

const postsI18n = {
  fr: {
    titleHeading: "archive des actualités",
    addEdition: "➕ ajouter une édition",
    newsletterBadge: "⚡ POS NEWSLETTER",
    newsletterTitle: "Reste connecté à la communauté",
    newsletterSub: "Abonne-toi pour recevoir nos récapitulatifs hebdomadaires, invitations exclusives et coulisses directement par mail. 100 % gratuit !",
    placeholder: "ton.email@exemple.com",
    btnText: "S'ABONNER ➔"
  },
  en: {
    titleHeading: "newsletter archives",
    addEdition: "➕ add edition",
    newsletterBadge: "⚡ POS NEWSLETTER",
    newsletterTitle: "Stay in the Loop",
    newsletterSub: "Subscribe to get our weekly recaps, exclusive event invites, and behind-the-scenes news delivered straight to your inbox. 100% free!",
    placeholder: "your.email@example.com",
    btnText: "SUBSCRIBE ➔"
  }
};

/* --- Futuristic Neon Glassmorphism CSS --- */
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

    /* Futuristic Glassmorphic Newsletter Box */
    .pos-futuristic-newsletter {
      margin-top: 35px;
      padding: 30px;
      background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 50%),
                  radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.12), transparent 50%),
                  rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 20px;
      position: relative;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(56, 189, 248, 0.1);
      overflow: hidden;
    }
    .pos-futuristic-newsletter::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--neon-cyan, #38bdf8), var(--neon-purple, #a855f7), var(--neon-amber, #f59e0b));
    }
    .pos-newsletter-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: var(--neon-cyan, #38bdf8);
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 4px 14px;
      border-radius: 20px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .pos-newsletter-title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      letter-spacing: -0.01em;
    }
    .pos-newsletter-sub {
      font-size: 14px;
      color: var(--text-muted, #cbd5e1);
      margin-bottom: 22px;
      line-height: 1.6;
      max-width: 680px;
    }
    .pos-newsletter-form {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      max-width: 620px;
    }
    .pos-newsletter-input {
      flex: 1 1 280px;
      background: #0b0f19;
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #ffffff;
      padding: 13px 22px;
      border-radius: 30px;
      font-family: inherit;
      font-size: 14px;
      outline: none;
      box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5);
      transition: all 0.25s ease;
    }
    .pos-newsletter-input::placeholder {
      color: #64748b;
    }
    .pos-newsletter-input:focus {
      border-color: var(--neon-amber, #f59e0b);
      box-shadow: 0 0 18px rgba(245, 158, 11, 0.4);
    }
    .pos-newsletter-submit {
      background: linear-gradient(135deg, var(--neon-amber, #f59e0b), #f97316);
      color: #000000;
      font-weight: 800;
      font-size: 13.5px;
      letter-spacing: 0.05em;
      padding: 13px 30px;
      border-radius: 30px;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.45);
      transition: all 0.25s ease;
    }
    .pos-newsletter-submit:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.75);
    }
  `;
  document.head.appendChild(style);
}

/* --- Mounting Markup --- */
function mountPostsHTML() {
  const target = document.getElementById('pos-posts');
  if (!target) return;

  const t = postsI18n[postsState.language] || postsI18n.fr;

  target.innerHTML = `
    <div class="posts-header-bar">
      <div style="font-size:20px; font-weight:700; color:var(--neon-cyan, #38bdf8);">
        📰 <span id="title-news-heading">${t.titleHeading}</span>
      </div>
      <button class="posts-btn-add" id="posts-add-btn" onclick="openAddPostModal()">${t.addEdition}</button>
    </div>
    
    <div class="posts-gallery" id="posts-gallery-container"></div>

    <!-- Futuristic Custom Newsletter Section Submitting Directly to Kit -->
    <div class="pos-futuristic-newsletter">
      <span class="pos-newsletter-badge" id="posts-news-badge">${t.newsletterBadge}</span>
      <h3 class="pos-newsletter-title" id="posts-news-title">${t.newsletterTitle}</h3>
      <p class="pos-newsletter-sub" id="posts-news-sub">${t.newsletterSub}</p>
      
      <form action="https://app.kit.com/forms/9871438/subscriptions" method="post" target="_blank" class="pos-newsletter-form">
        <input type="email" name="email_address" id="posts-news-input" class="pos-newsletter-input" placeholder="${t.placeholder}" required>
        <button type="submit" id="posts-news-btn" class="pos-newsletter-submit">${t.btnText}</button>
      </form>
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
  localStorage.setItem('pos_lang', lang);
  const t = postsI18n[lang] || postsI18n.fr;
  
  const heading = document.getElementById('title-news-heading');
  if (heading) heading.innerText = t.titleHeading;

  const addBtn = document.getElementById('posts-add-btn');
  if (addBtn) addBtn.innerText = t.addEdition;

  const newsBadge = document.getElementById('posts-news-badge');
  if (newsBadge) newsBadge.innerText = t.newsletterBadge;

  const newsTitle = document.getElementById('posts-news-title');
  if (newsTitle) newsTitle.innerText = t.newsletterTitle;

  const newsSub = document.getElementById('posts-news-sub');
  if (newsSub) newsSub.innerText = t.newsletterSub;

  const newsInput = document.getElementById('posts-news-input');
  if (newsInput) newsInput.placeholder = t.placeholder;

  const newsBtn = document.getElementById('posts-news-btn');
  if (newsBtn) newsBtn.innerText = t.btnText;
};

/* --- Initialization & Global Language Listener --- */
document.addEventListener('DOMContentLoaded', () => {
  injectPostsStyles();
  mountPostsHTML();
  renderPostsGallery();
  window.syncPostsLanguage(postsState.language);

  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
      const lang = langBtn.id === 'btn-en' || langBtn.innerText.trim().toLowerCase() === 'en' ? 'en' : 'fr';
      window.syncPostsLanguage(lang);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePostsModal();
  });
});
