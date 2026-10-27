(function () {
  const site = window.SITE;
  if (!site) {
    document.body.textContent = "content.js did not load.";
    return;
  }

  const app = document.getElementById("app");
  document.title = site.meta.title;

  const icons = {
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v6h6"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 8 5 12l4 4M15 8l4 4-4 4"/></svg>',
    arxiv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4z"/><path d="M12 12 4 7M12 12v9M12 12l8-5"/></svg>',
  };

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));
  }

  function rich(value) {
    return esc(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function button(item) {
    const icon = icons[item.icon] || "";
    if (!item.href) {
      return `<span class="btn disabled">${icon}${esc(item.label)} (coming soon)</span>`;
    }
    const external = /^https?:/i.test(item.href);
    return `<a class="btn" href="${esc(item.href)}" ${external ? 'target="_blank" rel="noreferrer"' : ""}>${icon}${esc(item.label)}</a>`;
  }

  function figureGallery(figures) {
    if (!figures || !figures.length) return "";
    return figures.map((figure) => {
      if (!figure.src) return "";
      return `<div class="figure-frame">
        <div class="figure-viewport"><img src="${esc(figure.src)}" alt="${esc(figure.alt || figure.caption || "")}" /></div>
        <p class="caption">${esc(figure.caption || "")}</p>
      </div>`;
    }).join("");
  }

  function tableBlock(table) {
    if (!table) return "";
    const head = table.columns.map((col) => `<th>${esc(col)}</th>`).join("");
    const body = table.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("");
    const note = table.note ? `<p class="table-note">${esc(table.note)}</p>` : "";
    return `<div class="table-card">
      <p class="table-caption">${esc(table.caption || "")}</p>
      <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
      ${note}
    </div>`;
  }

  const authorLine = (site.authors || []).map((author) => {
    const name = author.url
      ? `<a href="${esc(author.url)}">${esc(author.name)}</a>`
      : esc(author.name);
    const aff = author.affiliation ? ` <span>(${esc(author.affiliation)})</span>` : "";
    return name + aff;
  }).join(", ");

  const logos = (site.logos || []).map((logo) =>
    `<div class="logo-card"><img src="${esc(logo.src)}" alt="${esc(logo.alt || "")}" /></div>`
  ).join("");

  const nav = site.nav.map((item) => `<a href="${esc(item.href)}">${esc(item.label)}</a>`).join("");

  const overviewParas = site.overview.paragraphs.map((p) => `<p>${rich(p)}</p>`).join("");
  const contributions = site.overview.contributions.map((item) => `<li>${rich(item)}</li>`).join("");

  const methodCards = site.method.cards.map((card) =>
    `<article class="card"><h3>${esc(card.title)}</h3><p>${rich(card.body)}</p></article>`
  ).join("");

  const steps = site.method.baseline.steps.map((step) =>
    `<article class="card"><h3>${esc(step.title)}</h3><p>${rich(step.body)}</p></article>`
  ).join("");

  const stats = site.benchmark.stats.map((stat) =>
    `<div class="stat"><b>${esc(stat.value)}</b><span>${esc(stat.label)}</span></div>`
  ).join("");

  const aspectOrder = ["Static Assessment", "Dynamic Assessment", "Human-Assisted Assessment"];
  const aspectGroups = {};
  site.benchmark.dimensions.forEach((dim) => {
    (aspectGroups[dim.group] || (aspectGroups[dim.group] = [])).push(dim.name);
  });
  const aspectCards = aspectOrder.filter((name) => aspectGroups[name]).map((name) =>
    `<article class="card"><h3>${esc(name)}</h3><div class="chips">${aspectGroups[name].map((item) => `<span class="chip">${esc(item)}</span>`).join("")}</div></article>`
  ).join("");

  const categories = site.benchmark.categories.map((name) =>
    `<span class="chip">${esc(name)}</span>`
  ).join("");

  const highlights = (site.results.highlights || []).map((item) =>
    `<div class="stat"><b>${esc(item.value)}</b><span>${esc(item.label)}</span></div>`
  ).join("");

  const tabs = site.results.tabs.map((tab, i) =>
    `<button type="button" data-tab="${esc(tab.id)}" class="${i === 0 ? "on" : ""}">${esc(tab.label)}</button>`
  ).join("");

  const panels = site.results.tabs.map((tab, i) =>
    `<div class="tab-panel ${i === 0 ? "on" : ""}" data-panel="${esc(tab.id)}">
      <p class="intro">${rich(tab.intro || "")}</p>
      ${tableBlock(tab.table)}
    </div>`
  ).join("");

  const pages = (site.demo.pages || []).map((page) => {
    const open = page.href
      ? `<div class="page-actions"><a class="btn" href="${esc(page.href)}" target="_blank" rel="noreferrer">${icons.doc}Open the page</a></div>`
      : "";
    const shot = page.image
      ? `<a class="shot" href="${esc(page.href || page.image)}" target="_blank" rel="noreferrer"><img src="${esc(page.image)}" alt="${esc(page.title)}" /></a>`
      : "";
    let body = shot;
    if (page.href && page.embed) {
      body += `<div class="frame-wrap"><iframe title="${esc(page.title)}" src="${esc(page.href)}" style="height:${Number(page.height) || 640}px"></iframe></div>`;
    } else if (!page.href && !page.image) {
      body = `<div class="slot-note">Set <code>href</code> in content.js. Use <code>my-page/index.html</code> or a full URL.</div>`;
    }
    return `<article class="page-card">
      <h3>${esc(page.title)}</h3>
      <p>${rich(page.description || "")}</p>
      ${open}
      ${body}
    </article>`;
  }).join("");

  const resourceLinks = (site.resources.links || []).map((link) =>
    `<li><a href="${esc(link.href)}">${esc(link.label)}</a></li>`
  ).join("");

  const contact = site.resources.contactEmail
    ? `<p><a href="mailto:${esc(site.resources.contactEmail)}">${esc(site.resources.contactEmail)}</a></p>`
    : "";

  app.innerHTML = `
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="#top">
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="12" fill="#1f6f68"/>
            <rect x="5" y="19.6" width="30" height="4.2" rx="1.3" fill="#f7fffd"/>
            <circle cx="20" cy="16.2" r="9" fill="none" stroke="#f4fffd" stroke-width="3.7"/>
            <circle cx="20" cy="16.2" r="4.1" fill="#1f6f68"/>
            <rect x="15.2" y="19.6" width="9.6" height="4.2" fill="#f7fffd"/>
            <rect x="17.2" y="23.6" width="5.6" height="4.6" rx="1" fill="#d7efe9"/>
          </svg>
          ${esc(site.hero.brand)}
        </a>
        <nav class="nav">${nav}</nav>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="wrap">
          <h1>${esc(site.hero.title)}</h1>
          ${site.hero.subtitle ? `<p class="subtitle">${esc(site.hero.subtitle)}</p>` : ""}
          ${authorLine ? `<p class="authors">${authorLine}</p>` : ""}
          ${site.affiliation ? `<p class="authors">${esc(site.affiliation)}</p>` : ""}
          <div class="badges">
            ${site.hero.badges.map((badge) => `<span class="badge${badge.emphasis ? " emphasis" : ""}">${badge.strong ? `<strong>${esc(badge.text)}</strong> ` : ""}${badge.strong ? esc(badge.strong) : esc(badge.text)}</span>`).join("")}
          </div>
          <div class="button-row">${site.hero.buttons.map(button).join("")}</div>
          ${logos ? `<div class="logo-row">${logos}</div>` : ""}
        </div>
      </section>

      <section class="section" id="overview">
        <div class="wrap split">
          <div class="prose">
            <h2>${esc(site.overview.title)}</h2>
            ${overviewParas}
          </div>
          <aside class="panel">
            <h3>${esc(site.overview.contributionsTitle)}</h3>
            <ol>${contributions}</ol>
          </aside>
        </div>
      </section>

      <section class="section" id="method">
        <div class="wrap">
          <h2>${esc(site.method.title)}</h2>
          <p class="lede">${esc(site.method.lede)}</p>
          <div class="cards-3">${methodCards}</div>
          ${figureGallery(site.method.figures)}
          <div style="height:28px"></div>
          <p class="center"><span class="kicker">${esc(site.method.baseline.kicker)}</span></p>
          <h2>${esc(site.method.baseline.title)}</h2>
          <p class="lede">${esc(site.method.baseline.lede)}</p>
          <div class="cards-steps">${steps}</div>
        </div>
      </section>

      <section class="section band" id="demo">
        <div class="wrap">
          <h2>${esc(site.demo.title)}</h2>
          <p class="lede">${esc(site.demo.lede)}</p>
          <div class="cards-3" style="grid-template-columns: 1fr">${pages}</div>
        </div>
      </section>

      <section class="section" id="benchmark">
        <div class="wrap">
          <p class="center"><span class="kicker">${esc(site.benchmark.kicker)}</span></p>
          <h2>${esc(site.benchmark.title)}</h2>
          <p class="lede">${esc(site.benchmark.lede)}</p>
          <div class="stats">${stats}</div>
          <div class="cards-3 aspect-cards">${aspectCards}</div>
          <h3 class="band-label">${esc(site.benchmark.categoriesTitle)}</h3>
          <div class="chips chips-center">${categories}</div>
        </div>
      </section>

      <section class="section band" id="results">
        <div class="wrap">
          <h2>${esc(site.results.title)}</h2>
          <p class="lede">${esc(site.results.lede)}</p>
          <div class="highlights">${highlights}</div>
          ${figureGallery(site.results.figures)}
          <div class="tabs" role="tablist">${tabs}</div>
          ${panels}
        </div>
      </section>

      <section class="section" id="resources">
        <div class="wrap">
          <h2>${esc(site.resources.title)}</h2>
          <div class="resource-grid">
            <article class="resource-card">
              <h3>BibTeX</h3>
              <pre id="bibtex">${esc(site.resources.bibtex)}</pre>
              <div class="page-actions"><button class="btn" type="button" id="copy-bibtex">${icons.doc}Copy BibTeX</button></div>
              ${resourceLinks ? `<ul class="link-list">${resourceLinks}</ul>` : ""}
              ${contact}
            </article>
            <article class="resource-card">
              <h3>Short blurb</h3>
              <p id="blurb">${esc(site.resources.blurb)}</p>
              <div class="page-actions"><button class="btn" type="button" id="copy-blurb">${icons.doc}Copy blurb</button></div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="wrap footer-inner">
        <div><strong>${esc(site.hero.brand)}</strong><br>${esc(site.footer.blurb)}</div>
        <div>${esc(site.footer.note)}</div>
      </div>
    </footer>
  `;

  function showSlide(root, index) {
    const slides = [...root.querySelectorAll(".slide")];
    const next = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== next; });
    root.querySelectorAll("[data-dot]").forEach((dot, i) => dot.classList.toggle("on", i === next));
    root.dataset.index = String(next);
  }

  app.addEventListener("click", (event) => {
    const arrow = event.target.closest("[data-carousel]");
    if (arrow) {
      const root = document.getElementById(arrow.dataset.carousel);
      const current = Number(root.dataset.index || 0);
      showSlide(root, current + Number(arrow.dataset.dir));
      return;
    }
    const dot = event.target.closest("[data-dot]");
    if (dot) {
      showSlide(dot.closest(".figure-frame"), Number(dot.dataset.dot));
      return;
    }
    const tab = event.target.closest("[data-tab]");
    if (tab) {
      const id = tab.dataset.tab;
      app.querySelectorAll("[data-tab]").forEach((btn) => btn.classList.toggle("on", btn === tab));
      app.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.toggle("on", panel.dataset.panel === id));
    }
  });

  async function copyText(text, button) {
    const original = button.innerHTML;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
      setTimeout(() => { button.innerHTML = original; }, 1200);
    } catch (err) {
      button.textContent = "Copy failed";
      setTimeout(() => { button.innerHTML = original; }, 1200);
    }
  }

  document.getElementById("copy-bibtex").addEventListener("click", (event) => {
    copyText(site.resources.bibtex.trim(), event.currentTarget);
  });
  document.getElementById("copy-blurb").addEventListener("click", (event) => {
    copyText(site.resources.blurb.trim(), event.currentTarget);
  });

  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 4);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
