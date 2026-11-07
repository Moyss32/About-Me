"use strict";
/* ===== UTILIDADES ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
const root = document.documentElement;
/* Cada módulo é isolado: se um falhar, o restante da página continua funcionando. */
const safe = (fn) => { try { fn(); } catch (e) { console.error(fn.name, e); } };
/* Cria elementos sem usar innerHTML. */
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => (k in el && k !== "list" ? (el[k] = v) : el.setAttribute(k, v)));
  kids.flat().forEach((k) => el.append(k));
  return el;
}

/* ===== I18N: textos em inglês (o português fica no próprio HTML) ===== */
const EN = {
  skip: "Skip to content",
  "nav.about": "About", "nav.projects": "Projects", "nav.stack": "Technologies", "nav.edu": "Education", "nav.exp": "Experience", "nav.lang": "Languages", "nav.contact": "Contact",
  "hero.lead": "I build back-ends and web applications with Python.",
  "hero.sub": "Student in the Technical Course in Internet Informatics at IFC Concórdia. I work with Django and Flask, REST APIs, authentication, payments and file processing. I am looking for my first opportunity as a junior web developer or in technical support.",
  "hero.a1": "Main", "hero.a1d": "Back-end and web: Python, Django, Flask, JavaScript, React",
  "hero.a2": "Complementary", "hero.a2d": "Linux, servers, networking, hardware and IoT (ESP32, Arduino)",
  "hero.b1": "View projects", "hero.b2": "Download résumé (PDF, Portuguese)", "hero.b3": "Contact", "hero.scroll": "Scroll to continue",
  "about.h": "The person behind the projects",
  "about.p1": "I am studying the Technical Course in Internet Informatics at IFC, Concórdia campus. I mainly build Python back-ends with Django and Flask, and web interfaces with JavaScript and React.",
  "about.p2": "I learn by building complete systems. On NucleoTech I worked on the API, authentication, subscriptions and file processing. On IELB Charrua I handle the publishing and maintenance of a website used by a real organization.",
  "about.p3": "I like to review what I build: on NucleoTech I ran a security audit on my own code and fixed the issues I found.",
  "about.p4": "Outside of code, I assemble and maintain computers and servers, use Linux on personal servers, study networking and program ESP32 and Arduino microcontrollers.",
  "about.k1": "Education", "about.v1": "Technical course in Internet Informatics, IFC Concórdia",
  "about.k2": "Focus", "about.v2": "Back-end and web development",
  "about.k3": "Complementary", "about.v3": "Infrastructure, Linux, hardware, networking and IoT",
  "about.k4": "Goal", "about.v4": "Junior web developer or technical support", "about.k5": "Location",
  "proj.h": "Projects I built",
  "proj.intro": "Four projects, from open-source code on GitHub to a website used by a real organization. Each one shows what I did, how it works and what still needs documenting.",
  "link.repo": "Repository on GitHub", "link.site": "Visit the website",
  "k.problem": "Problem", "k.role": "My contribution", "k.features": "Implemented features", "k.challenges": "Technical challenges", "k.arch": "Architecture",
  "nt.tag": "Web platform for converting and processing files: image and audio tools, accounts, plans and payments.",
  "nt.problem": "Bring image editing and audio conversion tools together in one place, with user accounts, subscription plans and usage limits.",
  "nt.role": "Author of 30 of the repository's 37 commits, in a team: Django routes, models and configuration, expanded Stripe webhooks, custom permissions, secure downloads, payment history, a security audit and a front-end restructuring.",
  "nt.features": "Sign-up, login and token refresh (JWT); profile and usage dashboard; plans with daily and monthly quotas; Stripe checkout, billing portal and webhooks; payment history; background removal, upscaling, conversion and thumbnails for images; audio conversion with FFmpeg; task status tracking; execution history; secure download.",
  "nt.challenges": "Moving heavy processing out of the HTTP request with Celery tasks, enforcing plan limits before processing, protecting result downloads and reviewing the security of my own code.",
  "nt.k.note": "Note",
  "nt.note": "By default, tasks run in eager (synchronous) mode. With Redis configured as the broker, Celery runs them in the background. The default database is SQLite and can be changed through environment variables.",
  "nt.deck.h": "Project interface", "shot.todo": "Real screenshot to be added:",
  "nt.c1": "Dashboard with plan and usage", "nt.c2": "Image and audio tools", "nt.c3": "File upload and processing", "nt.c4": "Execution history", "nt.c5": "Plans and subscription",
  "deck.prev": "Previous", "deck.next": "Next",
  "nt.arch.h": "Architecture", "nt.arch.note": "Diagram based on the repository code. Select a component.",
  "a.ui": "Interface", "a.api": "Django API", "a.auth": "Authentication", "a.subs": "Subscriptions", "a.queue": "Task queue", "a.tools": "Tools", "a.data": "Data and files",
  "a.k1": "What it is", "a.k2": "Role", "a.k3": "Communication", "a.k4": "Technologies",
  "ui.1": "HTML, CSS and JavaScript pages (frontend/ folder) for login, sign-up, dashboard, file upload, tools, history, profile and subscription.",
  "ui.2": "Receives the user's files and choices and shows progress and results.",
  "ui.3": "Calls the API over HTTP (fetch), sending the JWT token in the Authorization header.",
  "ui.4": "HTML, CSS, JavaScript.",
  "api.1": "The project's REST API, split into the users, subscriptions, processing and services apps.",
  "api.2": "Holds the /api/... routes, checks permissions and quotas and coordinates the other components.",
  "api.3": "Receives calls from the interface; uses authentication, checks subscriptions, triggers tasks in the queue and reads and writes the database.",
  "api.4": "Python, Django, Django REST Framework, django-cors-headers.",
  "auth.1": "Sign-up, login and session renewal using JWT tokens (access and refresh).",
  "auth.2": "Identifies the user on every request to protected routes.",
  "auth.3": "The API validates the token on each call; profile, dashboard and processing depend on it.",
  "auth.4": "djangorestframework-simplejwt.",
  "subs.1": "Plans, usage quotas (daily and monthly), payment history and Stripe integration.",
  "subs.2": "Decides whether the user can process a file and updates the plan through checkout, billing portal and webhooks.",
  "subs.3": "API permissions check plan and quota; Stripe notifies the back-end through webhooks.",
  "subs.4": "Django, Stripe.",
  "queue.1": "A Celery task that processes a file and updates its status and progress.",
  "queue.2": "Takes heavy work out of the HTTP request. In eager mode (default) it runs synchronously; with Redis as the broker, it runs in the background.",
  "queue.3": "The API creates the execution and triggers the task; the task calls the tools and stores the result.",
  "queue.4": "Celery, Redis.",
  "tools.1": "Python modules that remove backgrounds, upscale, convert and generate thumbnails for images, and convert audio.",
  "tools.2": "They do the actual processing.",
  "tools.3": "They are called by the task and read and write files in the media folder.",
  "tools.4": "rembg, OpenCV, Pillow, Wand, FFmpeg.",
  "data.1": "Relational database (SQLite by default, configurable) and the media/ folder with uploads and results.",
  "data.2": "They store users, plans, executions, history and the processed files.",
  "data.3": "The API reads and writes the database; the tools write to media/; secure download delivers the results.",
  "data.4": "Django ORM, SQLite, file system.",
  "jg.tag": "Flappy Bird and Chrome's Dino in Pygame, each with a playable version and a version controlled by an AI trained with NEAT.",
  "jg.cap": "Neural network playing Flappy Bird during training",
  "jg.role": "Solo project: every commit in the repository is mine.",
  "jg.learn.k": "How the AI learns",
  "jg.learn": "A population of 50 networks plays at the same time. Each network receives 3 inputs and decides when to jump. The score (fitness) decides which networks reproduce and mutate, and training runs for 50 generations. NEAT evolves the weights and also the structure of the network.",
  "jg.ch": "Unexpected behavior: the network exploited a loophole, making tiny jumps every frame instead of single jumps like a player, and passed through the pipes easily.",
  "rn.tag": "Academic project (PI2, 2025): an online store for photovoltaic solar panels, with explanatory content about solar energy.",
  "rn.s1": "Light", "rn.s2": "Cells", "rn.s3": "Electricity",
  "rn.svg.cap": "Conceptual illustration of solar energy conversion. This is not a screenshot of the system.",
  "rn.k.ctx": "Context",
  "rn.ctx": "Group assignment for the Integrative Project 2 course. The proposal combines selling panels and components with pages about how panels work, their components and disposal.",
  "rn.role": "Flask back-end (configuration, models, routes for users, products, cart and orders) and, in the React front-end, sign-up, login, the user area and the integration of the store with the API.",
  "rn.arch": "React interface (Vite and React Router) that consumes the Flask API over HTTP. Flask uses SQLAlchemy on a MySQL database with tables for users, products, carts and orders.",
  "rn.k.state": "Status", "rn.state": "Finished academic project, with no production version.",
  "ie.tag": "Website of a local organization, built, published and maintained by me since 2026.",
  "ie.k.problem": "Context and problem",
  "ie.problem": "Give the community an easy-to-use website with a calendar, audio messages and direct contact. The audience is mostly elderly, which shaped a mobile-first design and clear interactions.",
  "ie.role": "Implementation, hosting and ongoing maintenance. Use of a custom API served by Cloudflare.",
  "ie.features": "Multi-page static website; calendar fed by a JSON file; in-browser audio message player; contact button that opens WhatsApp.",
  "ie.arch": "Static pages delivered to the browser, with calendar data in JSON and a custom API served by Cloudflare. The configuration details of the services still need to be documented.",
  "ie.shots.h": "The website on mobile", "ie.c1": "Home page", "ie.c2": "Calendar", "ie.c3": "Audio messages",
  "stack.h": "My work environment", "stack.intro": "Click an object on the desk to see the technologies it represents.",
  "o.server": "Server", "o.monitor": "Monitor", "o.pc": "Computer", "o.hd": "HD", "o.esp": "ESP32",
  "scene.close": "Back to overview", "scene.alt": "See all technologies as a list",
  "edu.h": "Education", "edu.s1": "2024 – 2026 · in progress", "edu.t1": "Technical Course in Internet Informatics",
  "edu.d1": "Instituto Federal Catarinense (IFC), Concórdia campus.", "edu.s2": "December 2026", "edu.t2": "Expected completion",
  "exp.h": "Hands-on experience",
  "exp.intro": "No formal employment so far. These are hands-on development and infrastructure experiences, labeled for what they are.",
  "exp.k1": "Independent development", "exp.now": "present",
  "exp.p1": "Website of a local organization. In charge of implementation, hosting and ongoing maintenance, using a custom API served by Cloudflare.",
  "exp.k2": "Academic project", "exp.p2": "Flask back-end and parts of the React front-end, in a group assignment for the Integrative Project 2 course.",
  "exp.k3": "Hands-on infrastructure", "exp.t3": "Infrastructure and administration of personal servers",
  "exp.p3": "Administration of personal Linux servers, with CasaOS and containers, hosting, storage, networking, remote access and service maintenance.",
  "exp.tg3": "containers · networking",
  "lang.h": "Languages", "lang.pt": "Portuguese", "lang.pt.d": "Native language", "lang.en": "English", "lang.en.d": "Intermediate, B2",
  "lang.en.p": "I use English to read technical documentation and specialized material and for written communication about technology.",
  "ct.h": "Let's talk about technology?", "ct.copy": "Copy email", "ct.send": "Send email", "ct.mail": "Email", "ct.phone": "Phone",
  foot: "© 2026 Moysés Hedo Voss. Built with HTML, CSS and JavaScript.",
  "logo.aria": "Moysés Voss, home", "nav.aria": "Main", "hero.areas.aria": "Technical areas", "about.aside": "Summary", "proj.idx": "Index",
  "deck.aria": "NucleoTech screenshots", "deck.dots": "Cards", "arch.aria": "NucleoTech architecture diagram", "arch.btns": "Components",
  "rn.svg.aria": "Conceptual illustration: sunlight reaches the photovoltaic panel and becomes electricity",
  "scene.aria": "Illustration of a gaming room with interactive equipment", "up.aria": "Back to top",
};
const META = {
  pt: ["Moysés Hedo Voss — Desenvolvedor web e back-end júnior", "Portfólio de Moysés Hedo Voss, estudante de Técnico em Informática para a Internet no IFC Concórdia. Back-end com Python, Django e Flask, projetos reais e infraestrutura."],
  en: ["Moysés Hedo Voss — Junior web and back-end developer", "Portfolio of Moysés Hedo Voss, student of the Technical Course in Internet Informatics at IFC Concórdia. Back-end with Python, Django and Flask, real projects and infrastructure."],
};
/* Textos gerados por script (não existem no HTML). */
const DYN = {
  pt: { "theme.dark": "Ativar tema escuro", "theme.light": "Ativar tema claro", "theme.dt": "Escuro", "theme.lt": "Claro", "menu.open": "Abrir menu", "menu.close": "Fechar menu", "menu.t": "Menu", "menu.tc": "Fechar", "lang.aria": "Switch to English", "lang.t": "EN", "copy.ok": "E-mail copiado", "copy.fail": "Não foi possível copiar. E-mail: ", "copy.t": "Copiar e-mail", "deck.pos": "Captura {n} de {m}: ", "deck.go": "Ir para a captura ", "scene.n": "tecnologias", "g.svc": "Serviços e back-end", "g.infra": "Infraestrutura", "o.server": "Servidor", "o.monitor": "Monitor", "o.pc": "Computador", "o.hd": "HD", "o.esp": "ESP32" },
  en: { "theme.dark": "Enable dark theme", "theme.light": "Enable light theme", "theme.dt": "Dark", "theme.lt": "Light", "menu.open": "Open menu", "menu.close": "Close menu", "menu.t": "Menu", "menu.tc": "Close", "lang.aria": "Mudar para português", "lang.t": "PT", "copy.ok": "Email copied", "copy.fail": "Could not copy. Email: ", "copy.t": "Copy email", "deck.pos": "Screenshot {n} of {m}: ", "deck.go": "Go to screenshot ", "scene.n": "technologies", "g.svc": "Services and back-end", "g.infra": "Infrastructure", "o.server": "Server", "o.monitor": "Monitor", "o.pc": "Computer", "o.hd": "HD", "o.esp": "ESP32" },
};
let lang = "pt";
const t = (k) => DYN[lang][k] ?? k;
const listeners = [];
const onLang = (fn) => listeners.push(fn);

function initI18n() {
  /* Guarda o português original de cada elemento para poder restaurá-lo. */
  $$("[data-i]").forEach((el) => (el._pt = el.textContent));
  $$("[data-ia]").forEach((el) => { const [a, k] = el.dataset.ia.split(":"); el._pa = el.getAttribute(a); });
}
function applyLang(l) {
  lang = l;
  root.lang = l === "en" ? "en" : "pt-BR";
  $$("[data-i]").forEach((el) => (el.textContent = l === "en" ? EN[el.dataset.i] ?? el._pt : el._pt));
  $$("[data-ia]").forEach((el) => {
    const [a, k] = el.dataset.ia.split(":");
    el.setAttribute(a, l === "en" ? EN[k] ?? el._pa : el._pa);
  });
  const [title, desc] = META[l];
  document.title = title;
  [['meta[name="description"]', desc], ['meta[property="og:title"]', title], ['meta[property="og:description"]', desc], ['meta[name="twitter:title"]', title], ['meta[name="twitter:description"]', desc]].forEach(([s, v]) => { const m = $(s); if (m) m.content = v; });
  const b = $("#lang");
  b.textContent = t("lang.t");
  b.setAttribute("aria-label", t("lang.aria"));
  b.lang = l === "en" ? "pt-BR" : "en";
  try { localStorage.setItem("idioma", l); } catch (e) {}
  listeners.forEach((fn) => safe(fn));
}
function initLangButton() {
  let saved = "pt";
  try { saved = localStorage.getItem("idioma") === "en" ? "en" : "pt"; } catch (e) {}
  $("#lang").onclick = () => applyLang(lang === "en" ? "pt" : "en");
  applyLang(saved);
}

/* ===== MENU, TEMA, CONTATO ===== */
function initChrome() {
  const nav = $("#nav"), bg = $("#burger"), th = $("#theme"), dm = matchMedia("(prefers-color-scheme:dark)");
  const menu = (o) => {
    nav.classList.toggle("open", o);
    bg.setAttribute("aria-expanded", o);
    bg.setAttribute("aria-label", t(o ? "menu.close" : "menu.open"));
    bg.textContent = t(o ? "menu.tc" : "menu.t");
  };
  bg.onclick = () => menu(!nav.classList.contains("open"));
  nav.onclick = (e) => { if (e.target.closest("a")) menu(false); };
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { menu(false); bg.focus(); }
  });
  const wide = matchMedia("(min-width:761px)");
  if (wide.addEventListener) wide.addEventListener("change", (e) => e.matches && menu(false));
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : dm.matches);
  const themeLabel = () => {
    th.setAttribute("aria-label", t(isDark() ? "theme.light" : "theme.dark"));
    th.textContent = t(isDark() ? "theme.lt" : "theme.dt");
  };
  th.onclick = () => {
    const n = isDark() ? "light" : "dark";
    root.dataset.theme = n;
    try { localStorage.setItem("tema", n); } catch (e) {}
    themeLabel();
  };
  onLang(() => { menu(nav.classList.contains("open")); themeLabel(); });
  menu(false); themeLabel();

  const tt = $("#toast"), cp = $("#cp");
  const toast = (m) => { tt.textContent = m; tt.classList.add("on"); setTimeout(() => tt.classList.remove("on"), 2200); };
  cp.onclick = async () => {
    const m = "moyseshvoss@gmail.com";
    try {
      await navigator.clipboard.writeText(m);
      cp.textContent = t("copy.ok"); toast(t("copy.ok"));
      setTimeout(() => (cp.textContent = lang === "en" ? EN["ct.copy"] : cp._pt), 2200);
    } catch (e) { toast(t("copy.fail") + m); }
  };
}

/* ===== REVELAÇÃO, SEÇÃO ATIVA, PROGRESSO, CURSOR ===== */
function initScroll() {
  const links = $$("nav a");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    $$(".rv,.arch-wrap").forEach((el) => io.observe(el));
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach((x) => so.observe(x));
  } else root.classList.remove("js");

  const bar = $("#bar"), up = $("#up"), tl = $("#tl"), hero = $("#topo");
  let tk = 0;
  function onScroll() {
    tk = 0;
    const y = scrollY, max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    up.classList.toggle("on", y > 700);
    hero.style.setProperty("--hero-progress", Math.min(1, y / Math.max(1, innerHeight)));
    const r = tl.getBoundingClientRect();
    tl.style.setProperty("--p", Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height)));
  }
  addEventListener("scroll", () => { if (!tk) tk = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();
  up.onclick = () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  const g = $("#geo");
  if (matchMedia("(pointer:fine)").matches && !reduce) {
    let tx = 0, ty = 0, x = 0, y = 0, f = 0;
    const loop = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      g.style.transform = `translate(${x}px,${y}px)`;
      f = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    hero.addEventListener("mousemove", (e) => {
      tx = (e.clientX / innerWidth - 0.5) * 50; ty = (e.clientY / innerHeight - 0.5) * 50;
      if (!f) f = requestAnimationFrame(loop);
    });
  }
}

/* ===== CAPTURAS: usa a imagem real se existir; senão mantém o aviso ===== */
function initShots() {
  $$(".shot[data-src]").forEach((box) => {
    const ph = $(".ph", box);
    if (ph) ph.dataset.p = box.dataset.src;
    const img = h("img", { src: box.dataset.src, alt: "", loading: "lazy", decoding: "async" });
    img.onload = () => box.classList.add("ok");
    img.onerror = () => img.remove();
    box.append(img);
  });
}

/* ===== CARROSSEL DE CARTAS EMPILHADAS ===== */
function initDeck() {
  const deck = $("#deck"), cards = $$(".card", deck), dots = $("#dots"), live = $("#deck-live");
  const N = cards.length;
  let front = 0, busy = false;
  const maxVisible = () => (innerWidth < 600 ? 2 : 3);
  const btns = cards.map((_, i) => dots.appendChild(h("button", { type: "button", className: "dot" })));
  btns.forEach((b, i) => (b.onclick = () => { front = i; render(); }));
  function render() {
    cards.forEach((c, i) => {
      const o = (i - front + N) % N;
      c.style.setProperty("--o", o);
      c.style.setProperty("--v", o <= maxVisible() ? 1 : 0);
      c.setAttribute("aria-hidden", o ? "true" : "false");
    });
    btns.forEach((b, i) => {
      b.setAttribute("aria-label", t("deck.go") + (i + 1));
      i === front ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current");
    });
    live.textContent = t("deck.pos").replace("{n}", front + 1).replace("{m}", N) + $("figcaption", cards[front]).textContent;
  }
  function next() {
    if (busy) return;
    busy = true;
    const leaving = cards[front];
    leaving.classList.add("leave");
    setTimeout(() => { front = (front + 1) % N; leaving.classList.remove("leave"); render(); busy = false; }, reduce ? 0 : 340);
  }
  const prev = () => { if (!busy) { front = (front - 1 + N) % N; render(); } };
  $("#deck-next").onclick = next;
  $("#deck-prev").onclick = prev;
  deck.addEventListener("click", next);
  deck.addEventListener("keydown", (e) => {
    const k = { ArrowRight: next, ArrowDown: next, Enter: next, " ": next, ArrowLeft: prev, ArrowUp: prev }[e.key];
    if (k) { e.preventDefault(); k(); }
  });
  addEventListener("resize", render);
  onLang(render);
  render();
}

/* ===== DIAGRAMA DE ARQUITETURA (SVG) ===== */
function initArch() {
  const nodes = $$("#arch .an"), box = $("#an-btns"), panels = $$("#an-panel [data-p]");
  const ids = nodes.map((n) => n.dataset.n);
  const btns = ids.map((id) => box.appendChild(h("button", { type: "button", className: "chip" })));
  let cur = "api";
  function select(id) {
    cur = id;
    nodes.forEach((n) => n.classList.toggle("sel", n.dataset.n === id));
    panels.forEach((p) => (p.hidden = p.dataset.p !== id));
    btns.forEach((b, i) => b.setAttribute("aria-pressed", ids[i] === id));
  }
  btns.forEach((b, i) => (b.onclick = () => select(ids[i])));
  nodes.forEach((n) => n.addEventListener("click", () => select(n.dataset.n)));
  const labels = () => btns.forEach((b, i) => (b.textContent = $("text", nodes[i]).textContent));
  onLang(labels);
  labels();
  select(cur);
}

/* ===== MESA INTERATIVA ===== */
/* [nome, descrição PT, descrição EN] */
const SC = {
  monitor: { c: [336, 157], g: [[null, [
    ["Linux", "Sistema aberto, base de servidores e de ferramentas de desenvolvimento.", "Open system, the basis of servers and development tools."],
    ["Windows", "Sistema usado no desenvolvimento e na administração de computadores.", "System used for development and computer administration."]]]] },
  pc: { c: [512, 169], g: [[null, [
    ["Python", "Linguagem principal dos meus back-ends e scripts.", "The main language of my back-ends and scripts."],
    ["JavaScript", "Linguagem da web, usada nas interfaces e no navegador.", "The language of the web, used in interfaces and the browser."],
    ["C/C++", "Programação de baixo nível e de sistemas embarcados.", "Low-level and embedded systems programming."],
    ["Git", "Controle de versão do código.", "Source code version control."],
    ["GitHub", "Hospedagem de repositórios e colaboração.", "Repository hosting and collaboration."],
    ["Hardware", "Montagem e manutenção de computadores.", "Assembling and maintaining computers."],
    ["Lógica de programação / Programming logic", "Raciocínio para decompor problemas em algoritmos.", "Reasoning to break problems down into algorithms."]]]] },
  hd: { c: [264, 216], g: [[null, [
    ["PostgreSQL", "Banco relacional robusto, com SQL avançado.", "Robust relational database with advanced SQL."],
    ["MySQL", "Banco relacional muito usado em aplicações web.", "Relational database widely used in web apps."],
    ["SQLite", "Banco em arquivo único, simples e sem servidor.", "Single-file database, simple and serverless."],
    ["Pandas", "Biblioteca Python para limpar e analisar dados tabulares.", "Python library to clean and analyze tabular data."],
    ["NumPy", "Cálculo numérico com vetores e matrizes em Python.", "Numerical computing with arrays and matrices in Python."]]]] },
  esp: { c: [224, 216], g: [[null, [
    ["C/C++", "Linguagem usada para programar o ESP32 e o Arduino.", "Language used to program the ESP32 and Arduino."],
    ["IoT", "Dispositivos conectados que coletam dados e recebem comandos.", "Connected devices that collect data and receive commands."],
    ["Microcontroladores / Microcontrollers", "ESP32 e Arduino Uno/Mega.", "ESP32 and Arduino Uno/Mega."],
    ["Sensores / Sensors", "Leitura de sensores e integração com dispositivos, como células de carga com HX711.", "Reading sensors and integrating devices, such as load cells with an HX711."]]]] },
  server: { c: [96, 216], g: [
    ["g.svc", [
      ["Redis", "Banco em memória, usado como broker do Celery no NucleoTech.", "In-memory store, used as the Celery broker in NucleoTech."],
      ["Django", "Framework web completo em Python, com ORM e painel admin.", "Full web framework for Python, with ORM and admin panel."],
      ["Flask", "Microframework web em Python, leve e flexível.", "Lightweight, flexible Python web microframework."]]],
    ["g.infra", [
      ["Hardware", "Montagem e manutenção de computadores e servidores.", "Assembling and maintaining computers and servers."],
      ["Redes / Networking", "Fundamentos de redes de computadores.", "Computer networking fundamentals."],
      ["Administração de servidores / Server administration", "Manutenção de servidores Linux pessoais.", "Maintenance of personal Linux servers."],
      ["Infraestrutura de aplicações / Application infrastructure", "Hospedagem e manutenção de aplicações, como o site da IELB Charrua.", "Hosting and maintaining applications, such as the IELB Charrua website."]]]] },
};
const pick = (name) => { const [pt, en] = name.split(" / "); return lang === "en" && en ? en : pt; };

function initScene() {
  const wrap = $("#scene-wrap"), scene = $("#scene"), world = $("#world"), panel = $("#panel"), title = $("#panel-t"), list = $("#panel-l");
  const objs = $$(".obj");
  let open = null;
  const nameOf = (id) => t(`o.${id}`);
  const techs = (id) => SC[id].g.flatMap(([, items]) => items);

  function renderPanel() {
    if (!open) return;
    title.textContent = nameOf(open);
    list.replaceChildren(...SC[open].g.flatMap(([gk, items]) => [
      ...(gk ? [h("li", { className: "grp" }, t(gk))] : []),
      ...items.map(([n, pt, en]) => h("li", {}, h("strong", {}, pick(n)), h("span", {}, lang === "en" ? en : pt))),
    ]));
  }
  function labels() {
    objs.forEach((o) => o.setAttribute("aria-label", `${nameOf(o.dataset.o)}: ${techs(o.dataset.o).length} ${t("scene.n")}`));
    renderPanel();
    const alt = $("#alt-list");
    alt.replaceChildren(...objs.flatMap((o) => [h("h4", {}, nameOf(o.dataset.o)), h("ul", {}, ...techs(o.dataset.o).map(([n, pt, en]) => h("li", {}, h("strong", {}, pick(n)), ` — ${lang === "en" ? en : pt}`)))]));
  }
  function show(id) {
    open = id;
    const mobile = wrap.clientWidth < 700;
    const [x, y] = SC[id].c;
    const sx = scene.clientWidth / 800, sy = scene.clientHeight / 450;
    const k = mobile ? 1.28 : 1.55;
    const cx = x * sx, cy = y * sy;
    const tx = (mobile ? scene.clientWidth / 2 : scene.clientWidth * .28) - cx * k;
    const ty = scene.clientHeight / 2 - cy * k;
    world.style.transform = `translate(${tx}px,${ty}px) scale(${k})`;
    wrap.dataset.open = id;
    objs.forEach((o) => { o.classList.toggle("sel", o.dataset.o === id); o.setAttribute("aria-expanded", o.dataset.o === id); });
    panel.hidden = false;
    renderPanel();
    panel.focus();
  }
  function close() {
    if (!open) return;
    const back = $(`.obj[data-o=${open}]`);
    open = null;
    world.style.transform = "";
    delete wrap.dataset.open;
    panel.hidden = true;
    objs.forEach((o) => { o.classList.remove("sel"); o.setAttribute("aria-expanded", "false"); });
    back.focus();
  }
  objs.forEach((o) => {
    o.setAttribute("aria-expanded", "false");
    o.addEventListener("click", () => show(o.dataset.o));
    o.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(o.dataset.o); } });
  });
  $("#panel-x").onclick = close;
  wrap.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  onLang(labels);
  labels();
}

/* Abre a lista de tecnologias para a impressão. */
addEventListener("beforeprint", () => { const d = $(".alt"); if (d) d.open = true; });

/* ===== INICIALIZAÇÃO ===== */
initI18n();
[initChrome, initScroll, initShots, initDeck, initArch, initScene, initLangButton].forEach(safe);
