(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Dropdowns
  const dropdowns = document.querySelectorAll(".dropdown > button");
  dropdowns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = btn.closest(".dropdown");
      if (!parent) return;

      // close others
      document.querySelectorAll(".dropdown.open").forEach((d) => {
        if (d !== parent) d.classList.remove("open");
      });

      parent.classList.toggle("open");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const insideDropdown = t.closest(".dropdown");
    if (!insideDropdown) {
      document.querySelectorAll(".dropdown.open").forEach((d) => d.classList.remove("open"));
    }
  });
})();

// ---- Markdown loader (simple, no dependencies) ----
function escapeHtml(str){
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function inlineFormat(s){
  // links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // bold: **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italics: *text* (simple)
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return s;
}

function mdToHtml(md){
  const lines = md.replace(/\r\n/g,"\n").split("\n");
  let html = "";
  let inList = false;

  function closeList(){
    if(inList){ html += "</ul>"; inList = false; }
  }

  for(let i=0;i<lines.length;i++){
    const raw = lines[i];
    const line = raw.trimEnd();

    if(line.trim() === ""){
      closeList();
      continue;
    }

    // Headings
    if(/^###\s+/.test(line)){ closeList(); html += "<h3>"+inlineFormat(escapeHtml(line.replace(/^###\s+/,"")))+"</h3>"; continue; }
    if(/^##\s+/.test(line)){ closeList(); html += "<h2>"+inlineFormat(escapeHtml(line.replace(/^##\s+/,"")))+"</h2>"; continue; }
    if(/^#\s+/.test(line)){ closeList(); html += "<h1>"+inlineFormat(escapeHtml(line.replace(/^#\s+/,"")))+"</h1>"; continue; }

    // List items
    if(/^- \s+/.test(line)){
      if(!inList){ html += "<ul class='list'>"; inList = true; }
      html += "<li>"+inlineFormat(escapeHtml(line.replace(/^- \s+/,"")))+"</li>";
      continue;
    }

    // Bold Q/A with manual line breaks preserved for double-space markdown breaks
    const p = escapeHtml(line).replace(/  $/, "<br>");
    closeList();
    html += "<p>"+inlineFormat(p)+"</p>";
  }
  closeList();
  return html;
}

async function loadMarkdownIfNeeded(){
  const host = document.querySelector("[data-md]");
  if(!host) return;
  const mdPath = host.getAttribute("data-md");
  if(!mdPath) return;

  try{
    const res = await fetch(mdPath, {cache:"no-store"});
    if(!res.ok) throw new Error("Falha ao carregar: " + mdPath);
    const md = await res.text();
    host.innerHTML = mdToHtml(md);
  }catch(err){
    host.innerHTML = "<p class='small'>Não consegui carregar o conteúdo.</p>";
    console.error(err);
  }
}

// Run after existing init
document.addEventListener("DOMContentLoaded", loadMarkdownIfNeeded);


// ---- News loader: render list items from a Markdown file into cards ----
function parseNewsFromMd(md){
  const lines = md.replace(/\r\n/g,"\n").split("\n");
  const items = [];
  for(const raw of lines){
    const line = raw.trim();
    if(line.startsWith("- ")){
      items.push(line.slice(2));
    }
  }
  return items;
}

function renderNewsCards(host, items){
  if(!items.length){
    host.innerHTML = "<div class='card small'>Sem notícias neste momento.</div>";
    return;
  }
  host.innerHTML = items.map(it => {
    // Reuse existing inline formatter from markdown loader
    const safe = escapeHtml(it);
    const html = inlineFormat(safe);
    return `<article class="card news-card">${html}</article>`;
  }).join("");
}

async function loadNewsIfNeeded(){
  const host = document.querySelector("[data-news]");
  if(!host) return;
  const mdPath = host.getAttribute("data-news");
  if(!mdPath) return;

  try{
    const res = await fetch(mdPath, {cache:"no-store"});
    if(!res.ok) throw new Error("Falha ao carregar: " + mdPath);
    const md = await res.text();
    const items = parseNewsFromMd(md);
    renderNewsCards(host, items);
  }catch(err){
    host.innerHTML = "<div class='card small'>Não consegui carregar as notícias.</div>";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadNewsIfNeeded);


// ---- Área reservada (barreira leve) ----
// 1) Define aqui a palavra-passe (podes trocar quando quiseres)
const RESERVED_PASSWORD = "muda-isto-para-uma-pass";

// 2) Funções chamadas pela página area-reservada.html
function unlockReserved(){
  const input = document.getElementById("pw");
  const msg = document.getElementById("msg");
  if(!input) return;

  if(input.value === RESERVED_PASSWORD){
    sessionStorage.setItem("bema_reserved_ok", "1");
    showReserved(true);
    if(msg) msg.textContent = "";
  }else{
    if(msg) msg.textContent = "Palavra‑passe errada.";
  }
}

function lockReserved(){
  sessionStorage.removeItem("bema_reserved_ok");
  showReserved(false);
}

function showReserved(isOk){
  const loginBox = document.getElementById("loginBox");
  const reservedContent = document.getElementById("reservedContent");
  if(!loginBox || !reservedContent) return;

  loginBox.style.display = isOk ? "none" : "block";
  reservedContent.style.display = isOk ? "block" : "none";
}

// Auto-check quando entras na página
document.addEventListener("DOMContentLoaded", () => {
  const ok = sessionStorage.getItem("bema_reserved_ok") === "1";
  showReserved(ok);
});
