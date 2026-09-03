/* =========================================================
   Prism Outreach Studio — Centralized News & Posts System
   ========================================================= */

const defaultPostsData = [
  {
    id: 1,
    title: "The POS Monthly Scoop",
    date: "Septembre 2026",
    cover: "rainbow.blue.jpg",
    content: "Voici les dernières nouvelles exclusives du Rennes Café des Langues... <br><br><b>Au programme ce mois-ci :</b> de nouvelles tables linguistiques et plus de 50 personnes un vendredi sur deux ! Avec un nouveau format : l'événement dure 3 heures, vous venez quand vous voulez. Entre 19h et 20h, des tables de conversation en langues étrangères vous attendent ; ensuite, entre 20h et 21h, un speed dating où chacun parle avec une ou deux personnes en langue(s) étrangère(s) pendant 15 minutes pour pratiquer plus profondément que 'tu fais quoi dans la vie ?' ; enfin, à partir de 21h les tables de conversation reviennent jusqu'à la fin de la soirée." 
  },
  {
    id: 2,
    title: "New at POS! 2026",
    date: "Septembre 2026",
    cover: "rainbow.red.jpg",
    content: "We have the <br><br><b>immense pleasure</b> to announce the return of the Rennes Café des Langues for its fourth season - the longest the Café event has ever lasted in Rennes! We are extremely grateful for the hosts, volunteers, and leadership team for their help in organizing and keeping this awesome event alive for our community members.<br><br>In Rennes, we boast a large linguistic and cultural diversity that, when left malnourished, leaves opportunities for friendship, collective learning, and self-confidence in foreign languages to come to a halt.<br><br>At Prism Outreach Studio (POS), we understand the value that a moment as simple as talking over a coffee can have on the community, especially in a foreign language. Our self-confidence in foreign languages can sometimes hold us back from enjoying the moment as much as we should. That's why this year, <br><br><b>we are ecstatic to introduce the <em>Rennes Social Clubs</em>, meant to boost self-confidence in expressing oneself in foreign languages while having fun and meeting new friends.</b><br><br>In light of this, we introduce the <br><br><b>Rennes English Choir</b>, the first choir in Rennes led 100% in English and meant to support local marginalized or affected populations by <br><br><b>returning 50% of its concert sales to associations that help victims.</b><br><br>Each concert is different with a different theme - check out the 'Rennes English Choir' tab at the top to find out more.<br><br>Welcome to Rennes, welcome to Prism Outreach Studio. Your new stop for language confidence and making friends and networking."
  }
];

let postsData = JSON.parse(localStorage.getItem('pos_posts_data')) || window.POS_EMBEDDED_POSTS || defaultPostsData;

let postsState = {
  language: localStorage.getItem('pos_lang') || "fr"
};

const postsI18n = {
  fr: {
    titleHeading: "archive des actualités",
    addEdition: "➕ ajouter une édition",
    newsCtaBadge: "accès privilège POS",
    newsCtaTitle: "Envie de ne rien manquer ?",
    newsCtaSub: "rejoins la communauté la plus dynamique de Rennes ! Actualités, exclusivités et événements en avant-première dans ta boîte mail.",
    newsPlaceholder: "exemple@courriel.fr",
    newsBtnText: "REJOINDRE"
  },
  en: {
    titleHeading: "newsletter archives",
    addEdition: "➕ add edition",
    newsCtaBadge: "POS insider access",
    newsCtaTitle: "Want to stay in the loop?",
    newsCtaSub: "Join Rennes' most energetic community! Get insider news, priority event invites, and exclusive updates delivered straight to you.",
    newsPlaceholder: "example@email.com",
    newsBtnText: "SIGN ME UP"
  }
};

/* --- Helper to detect if cover string is an image file or URL --- */
function isCoverImage(str) {
  if (!str) return false;
  return str.startsWith('http') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(str.trim());
}

/* --- Futuristic Cyber Glassmorphic CSS Injection --- */
function injectPostsStyles() {
  let style = document.getElementById('pos-posts-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'pos-posts-styles';
    document.head.appendChild(style);
  }
  style.textContent = `
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.03); }
    }
    @keyframes liveDotPulse {
      0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(251, 191, 36, 0); }
      100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
    }

    .posts-header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
    .posts-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
    .posts-card {
      background: rgba(15, 23, 42, 0.85); border: 1px solid var(--card-border, rgba(56, 189, 248, 0.25));
      border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease; position: relative;
    }
    .posts-card:hover { transform: translateY(-4px); border-color: var(--neon-cyan, #38bdf8); box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2); }
    .posts-card-cover { height: 120px; background: linear-gradient(135deg, #1e1b4b, #31104b); display: flex; align-items: center; justify-content: center; font-size: 36px; overflow: hidden; }
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

    /* =========================================================
       HIGH-ENERGY VIBRANT NEWSLETTER COMPONENT
       ========================================================= */
    .posts-newsletter-card {
      margin-top: 40px;
      position: relative;
      background: radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.25) 0%, transparent 50%),
                  radial-gradient(circle at 90% 80%, rgba(56, 189, 248, 0.2) 0%, transparent 50%),
                  rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(168, 85, 247, 0.4);
      border-radius: 28px;
      padding: 36px 42px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.15);
      overflow: hidden;
      transition: all 0.4s ease;
    }

    .posts-newsletter-card:hover {
      border-color: rgba(56, 189, 248, 0.6);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(56, 189, 248, 0.25);
    }

    .posts-newsletter-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 3px;
      background: linear-gradient(90deg, #f59e0b, #d946ef, #38bdf8, #22c55e);
    }

    .posts-newsletter-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      flex-wrap: wrap;
      position: relative;
      z-index: 2;
    }

    /* Left Side: Electric Message & Hook */
    .posts-newsletter-text {
      flex: 1 1 320px;
    }

    .posts-newsletter-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #fbbf24;
      background: rgba(251, 191, 36, 0.12);
      border: 1px solid rgba(251, 191, 36, 0.35);
      padding: 5px 14px;
      border-radius: 20px;
      margin-bottom: 12px;
      box-shadow: 0 0 12px rgba(251, 191, 36, 0.2);
    }

    .posts-newsletter-badge .live-dot {
      width: 7px;
      height: 7px;
      background-color: #fbbf24;
      border-radius: 50%;
      animation: liveDotPulse 1.8s infinite;
    }

    .posts-newsletter-text h3 {
      font-size: 28px;
      font-weight: 900;
      line-height: 1.25;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #d946ef 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 10px rgba(56, 189, 248, 0.3));
    }

    .posts-newsletter-text p {
      font-size: 14.5px;
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0;
      max-width: 480px;
    }

    /* Right Side: Long Dark Oval Form Capsule */
    .posts-newsletter-form-wrapper {
      flex: 1 1 360px;
      display: flex;
      justify-content: flex-end;
    }

    .posts-newsletter-form, form.posts-newsletter-form {
      display: flex !important;
      align-items: center !important;
      width: 100% !important;
      max-width: 480px !important;
      background: rgba(11, 15, 25, 0.95) !important;
      border: 2px solid rgba(56, 189, 248, 0.4) !important;
      border-radius: 60px !important;
      padding: 6px 8px 6px 22px !important;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7), inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 15px rgba(56, 189, 248, 0.15) !important;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
      box-sizing: border-box !important;
    }

    .posts-newsletter-form:focus-within {
      border-color: #d946ef !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), inset 0 2px 6px rgba(0, 0, 0, 0.9), 0 0 25px rgba(217, 70, 239, 0.4) !important;
      transform: translateY(-2px);
    }

    .posts-newsletter-input, input.posts-newsletter-input, input#posts-news-input {
      flex: 1 !important;
      background: transparent !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      color: #ffffff !important;
      font-family: inherit !important;
      font-size: 14.5px !important;
      font-weight: 700 !important;
      padding: 10px 10px 10px 0 !important;
      margin: 0 !important;
      width: 100% !important;
      appearance: none !important;
      -webkit-appearance: none !important;
    }

    .posts-newsletter-input::placeholder {
      color: rgba(203, 213, 225, 0.5) !important;
      font-weight: 400 !important;
    }

    .posts-newsletter-btn, button.posts-newsletter-btn {
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #d946ef 100%) !important;
      color: #000000 !important;
      font-weight: 900 !important;
      font-size: 13px !important;
      letter-spacing: 0.05em !important;
      text-transform: uppercase !important;
      padding: 12px 24px !important;
      margin: 0 !important;
      border: none !important;
      border-radius: 50px !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      box-shadow: 0 0 18px rgba(245, 158, 11, 0.5) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
    }

    .posts-newsletter-btn:hover {
      transform: scale(1.06) !important;
      box-shadow: 0 0 28px rgba(217, 70, 239, 0.8), 0 0 15px rgba(245, 158, 11, 0.8) !important;
      color: #ffffff !important;
    }

    .posts-newsletter-btn:active {
      transform: scale(0.97) !important;
    }

    @media (max-width: 820px) {
      .posts-newsletter-card { padding: 28px 24px; }
      .posts-newsletter-content { flex-direction: column; align-items: stretch; }
      .posts-newsletter-form-wrapper { justify-content: center; }
      .posts-newsletter-form { max-width: 100%; }
    }
  `;
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
      <div>
        <button class="posts-btn-add" id="posts-add-btn" onclick="openAddPostModal()">${t.addEdition}</button>
        <button class="posts-btn-add" id="posts-download-btn" style="background:#22c55e; color:#000; display:none;" onclick="downloadUpdatedPostsJS()" title="Télécharger posts.js mis à jour">📥 enregistrer posts.js</button>
      </div>
    </div>
    
    <div class="posts-gallery" id="posts-gallery-container"></div>

    <div class="posts-newsletter-card">
      <div class="posts-newsletter-content">
        <div class="posts-newsletter-text">
          <div class="posts-newsletter-badge">
            <span class="live-dot"></span>
            <span id="posts-news-badge">${t.newsCtaBadge}</span>
          </div>
          <h3 id="posts-news-title">${t.newsCtaTitle}</h3>
          <p id="posts-news-sub">${t.newsCtaSub}</p>
        </div>
        <div class="posts-newsletter-form-wrapper">
          <form action="https://app.kit.com/forms/9871438/subscriptions" method="post" target="_blank" class="posts-newsletter-form">
            <input type="email" name="email_address" class="posts-newsletter-input" id="posts-news-input" placeholder="${t.newsPlaceholder}" required autocomplete="email" />
            <button type="submit" class="posts-newsletter-btn"><span id="posts-news-btn">${t.newsBtnText}</span></button>
          </form>
        </div>
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

    let coverHtml = isCoverImage(item.cover) 
      ? `<img src="${item.cover}" alt="Cover" onerror="this.parentElement.innerText='🗞️'">` 
      : (item.cover || '🗞️');

    card.innerHTML = `
      <div class="posts-card-cover">${coverHtml}</div>
      <div class="posts-card-body">
        <div class="posts-card-title">${item.title}</div>
        <div class="posts-card-date">${item.date}</div>
      </div>
    `;
    container.appendChild(card);
  });

  const dlBtn = document.getElementById('posts-download-btn');
  if (dlBtn) {
    const isUnlocked = document.body.classList.contains('body-unlocked');
    dlBtn.style.display = isUnlocked ? 'inline-block' : 'none';
  }
}

/* --- Modals & Editors --- */
function openPostModal(index) {
  const item = postsData[index];
  const isUnlocked = document.body.classList.contains('body-unlocked');

  if (isUnlocked) {
    openEditPostModal(index);
  } else {
    const content = document.getElementById('posts-modal-content');

    let coverHTML = '';
    if (isCoverImage(item.cover)) {
      coverHTML = `<img src="${item.cover}" alt="${item.title}" style="width:100%; max-height:220px; object-fit:cover; border-radius:12px; margin-bottom:16px;">`;
    }

    content.innerHTML = `
      ${coverHTML}
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
      <label>Cover (Emoji ou Fichier Image ex: rainbow.blue.jpg) :</label>
      <input type="text" id="add-post-cover" class="posts-form-input" value="rainbow.blue.jpg">
    </div>
    <div class="posts-form-group">
      <label>Contenu de l'actualité :</label>
      <div class="posts-editor-toolbar">
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<b>', '</b>')"><b>B</b></button>
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<i>', '</i>')"><i>I</i></button>
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<u>', '</u>')"><u>U</u></button>
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<mark>', '</mark>')">Highlight</button>
        <button class="posts-tool-btn" onclick="insertPostTag('add-post-content', '<s>', '</s>')"><s>S</s></button>
        <button class="posts-tool-btn" style="background:var(--neon-amber, #f59e0b); color:#000;" onclick="insertPostImageUrl('add-post-content')">📷 Image</button>
      </div>
      <textarea id="add-post-content" class="posts-form-input" rows="6">Rédigez votre texte ici...</textarea>
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
      <label>Cover (Emoji ou Fichier Image ex: rainbow.blue.jpg) :</label>
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
        <button class="posts-tool-btn" style="background:var(--neon-amber, #f59e0b); color:#000;" onclick="insertPostImageUrl('edit-post-content')">📷 Image</button>
      </div>
      <textarea id="edit-post-content" class="posts-form-input" rows="8">${item.content}</textarea>
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
  el.selectionStart = start + tagOpen.length;
  el.selectionEnd = end + tagOpen.length;
}

function insertPostImageUrl(textareaId) {
  const url = prompt("Entrez le nom du fichier image ou son URL (ex: mon-image.jpg) :");
  if (url) {
    insertPostTag(textareaId, `<img src="${url}" style="width:100%; border-radius:8px; margin:10px 0;">`);
  }
}

function closePostsModal() {
  const overlay = document.getElementById('posts-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function closePostsModalOnOverlay(e) {
  if (e.target.id === 'posts-modal-overlay') closePostsModal();
}

async function downloadUpdatedPostsJS() {
  let jsText = "";
  try {
    const response = await fetch('posts.js');
    if (response.ok) {
      jsText = await response.text();
    }
  } catch (err) {
    console.warn("Could not fetch posts.js directly.");
  }

  const updatedPostsJSON = JSON.stringify(postsData, null, 2);

  if (jsText) {
    const regex = /const\s+defaultPostsData\s*=\s*\[[\s\S]*?\];/;
    jsText = jsText.replace(regex, `const defaultPostsData = ${updatedPostsJSON};`);
  } else {
    alert("Impossible de lire posts.js automatiquement.");
    return;
  }

  const blob = new Blob([jsText], { type: "application/javascript;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "posts.js";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
  if (newsBadge) newsBadge.innerText = t.newsCtaBadge;

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
  window.syncPostsLanguage(postsState.language);

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
