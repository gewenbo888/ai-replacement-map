// ===== AI Replacement Map — interactions =====
(() => {
  const html = document.documentElement;

  // Bilingual / theme
  const setLang = (lang) => {
    html.setAttribute("data-lang", lang);
    document.querySelectorAll(".lang-toggle button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    try { localStorage.setItem("arm-lang", lang); } catch(_) {}
  };
  document.querySelectorAll(".lang-toggle button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  try { const s = localStorage.getItem("arm-lang"); if (s) setLang(s); } catch(_) {}

  const setTheme = (t) => {
    html.setAttribute("data-theme", t);
    document.querySelectorAll(".theme-toggle button").forEach(b => b.classList.toggle("active", b.dataset.themeSet === t));
    try { localStorage.setItem("arm-theme", t); } catch(_) {}
  };
  document.querySelectorAll(".theme-toggle button").forEach(b => b.addEventListener("click", () => setTheme(b.dataset.themeSet)));
  try { const s = localStorage.getItem("arm-theme"); if (s) setTheme(s); } catch(_) {}

  const tierOf = (s) => s >= 80 ? "critical" : s >= 60 ? "high" : s >= 40 ? "moderate" : "safe";
  const tierColor = (s) => {
    const css = getComputedStyle(document.documentElement);
    return css.getPropertyValue('--' + ({ critical: 'crit', high: 'hot', moderate: 'warn', safe: 'safe' }[tierOf(s)])).trim();
  };

  // ===== Filter state =====
  const state = {
    search: "",
    sector: "all",
    tier: "all",
    sort: "exposure-desc"
  };

  // ===== Render filter chips =====
  const sectorChipsEl = document.getElementById("sector-chips");
  if (sectorChipsEl && window.SECTORS) {
    const html_ = ['<button class="chip active" data-sector="all"><span lang="en">All</span><span lang="zh">全部</span></button>'];
    Object.entries(window.SECTORS).forEach(([k, v]) => {
      html_.push(`<button class="chip" data-sector="${k}"><span lang="en">${v.en}</span><span lang="zh">${v.zh}</span></button>`);
    });
    sectorChipsEl.innerHTML = html_.join("");
    sectorChipsEl.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
      state.sector = c.dataset.sector;
      sectorChipsEl.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x === c));
      render();
    }));
  }

  const tierChipsEl = document.getElementById("tier-chips");
  if (tierChipsEl) {
    const tiers = [
      { k: "all", en: "All", zh: "全部" },
      { k: "safe", en: "Low (0–39)", zh: "低 (0–39)" },
      { k: "moderate", en: "Moderate (40–59)", zh: "中 (40–59)" },
      { k: "high", en: "High (60–79)", zh: "高 (60–79)" },
      { k: "critical", en: "Critical (80+)", zh: "极高 (80+)" }
    ];
    tierChipsEl.innerHTML = tiers.map(t => `<button class="chip${t.k==='all'?' active':''}" data-tier="${t.k}"><span lang="en">${t.en}</span><span lang="zh">${t.zh}</span></button>`).join("");
    tierChipsEl.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
      state.tier = c.dataset.tier;
      tierChipsEl.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x === c));
      render();
    }));
  }

  const searchEl = document.getElementById("job-search");
  if (searchEl) searchEl.addEventListener("input", e => { state.search = e.target.value.toLowerCase(); render(); });

  const sortEl = document.getElementById("job-sort");
  if (sortEl) sortEl.addEventListener("change", e => { state.sort = e.target.value; render(); });

  // ===== Render job grid =====
  const gridEl = document.getElementById("jobs-grid");
  const countEl = document.getElementById("result-count");

  function render(){
    if (!gridEl || !window.JOBS) return;
    let list = window.JOBS.slice();

    // Filter sector
    if (state.sector !== "all") list = list.filter(j => j.sector === state.sector);
    // Filter tier
    if (state.tier !== "all") list = list.filter(j => tierOf(j.composite) === state.tier);
    // Search
    if (state.search) {
      const q = state.search;
      list = list.filter(j =>
        j.en.toLowerCase().includes(q) ||
        j.zh.includes(state.search) ||
        (window.SECTORS[j.sector] && (window.SECTORS[j.sector].en.toLowerCase().includes(q) || window.SECTORS[j.sector].zh.includes(state.search)))
      );
    }
    // Sort
    const sorters = {
      "exposure-desc": (a, b) => b.composite - a.composite,
      "exposure-asc":  (a, b) => a.composite - b.composite,
      "alpha":         (a, b) => a.en.localeCompare(b.en),
      "sector":        (a, b) => (a.sector + a.en).localeCompare(b.sector + b.en),
    };
    list.sort(sorters[state.sort] || sorters["exposure-desc"]);

    // Render
    gridEl.innerHTML = list.map(j => {
      const tier = tierOf(j.composite);
      const sector = window.SECTORS[j.sector] || { en: j.sector, zh: j.sector };
      return `<div class="job-card" data-id="${j.id}">
        <div class="row1">
          <h3><span lang="en">${j.en}</span><span lang="zh">${j.zh}</span></h3>
          <span class="score-pill ${tier}">${j.composite}</span>
        </div>
        <div class="meta"><span lang="en">${sector.en}</span><span lang="zh">${sector.zh}</span></div>
        <div class="bar-row rcog"><span class="label">R-COG</span><div class="bar"><div class="bar-fill" style="width:${j.sub[0]}%"></div></div></div>
        <div class="bar-row rphy"><span class="label">R-PHY</span><div class="bar"><div class="bar-fill" style="width:${j.sub[1]}%"></div></div></div>
        <div class="bar-row nrcog"><span class="label">NR-COG</span><div class="bar"><div class="bar-fill" style="width:${j.sub[2]}%"></div></div></div>
        <div class="bar-row nrint"><span class="label">NR-INT</span><div class="bar"><div class="bar-fill" style="width:${j.sub[3]}%"></div></div></div>
        <div class="note"><span lang="en">${j.en_note}</span><span lang="zh">${j.zh_note}</span></div>
      </div>`;
    }).join("");

    if (countEl) {
      const en = `${list.length} occupation${list.length === 1 ? "" : "s"} shown · of ${window.JOBS.length} total`;
      const zh = `显示 ${list.length} 项职业 · 共 ${window.JOBS.length} 项`;
      countEl.innerHTML = `<span lang="en">${en}</span><span lang="zh">${zh}</span>`;
    }

    // Wire expand
    gridEl.querySelectorAll(".job-card").forEach(c => c.addEventListener("click", () => c.classList.toggle("expanded")));
  }
  render();

  // ===== Sector summary (average exposure per sector) =====
  const sectorChart = document.getElementById("sector-chart");
  if (sectorChart && window.JOBS && window.SECTORS) {
    const grouped = {};
    window.JOBS.forEach(j => { (grouped[j.sector] ||= []).push(j.composite); });
    const rows = Object.entries(grouped).map(([k, arr]) => {
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      return { sector: k, avg, n: arr.length };
    }).sort((a, b) => b.avg - a.avg);

    sectorChart.innerHTML = rows.map(r => {
      const sec = window.SECTORS[r.sector];
      const tier = tierOf(r.avg);
      return `<div class="sector-row">
        <div class="sector-name"><span lang="en">${sec ? sec.en : r.sector}</span><span lang="zh">${sec ? sec.zh : r.sector}</span> <span style="color:var(--ink-soft); font-family: 'JetBrains Mono', monospace; font-size:11px;">· n=${r.n}</span></div>
        <div class="sector-bar"><div class="sector-fill ${tier}" style="width:${r.avg.toFixed(0)}%; background: var(--${tier === 'critical' ? 'crit' : tier === 'high' ? 'hot' : tier === 'moderate' ? 'warn' : 'safe'});"></div></div>
        <div class="sector-num">${r.avg.toFixed(0)}</div>
      </div>`;
    }).join("");
  }
})();
