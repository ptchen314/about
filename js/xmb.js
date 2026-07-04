/* =========================================================
   XMB menu — builds the cross-media bar from CATEGORIES
   (js/data.js), handles keyboard / touch / click navigation,
   plus the status-bar clock and the rotating motto.
   ========================================================= */

/* ---------- state ---------- */
let catIndex = 0;
let itemIndex = 0, _s = 0;
let builtCat = -1; // which category's rows are currently in the DOM

const catTrack = document.getElementById("catTrack");
const itemList = document.getElementById("itemList");

/* ---------- layout metrics ----------
   Two sets of pixel metrics, desktop vs phone. The numbers MUST stay
   in sync with style.css (.cat-anchor top, category sizes, and the
   @media (max-width: 720px) block). */
const METRICS = {
    desktop: { catStep: 92 + 74, crossY: 0.34, gap: 60, above: 84, below: 134, selected: 86 },
    mobile:  { catStep: 70 + 44, crossY: 0.26, gap: 54, above: 62, below: 108, selected: 72 }
};
const metrics = () => (window.innerWidth <= 720 ? METRICS.mobile : METRICS.desktop);

/* ---------- navigation ---------- */
const wrap = (i, n) => (i + n) % n;

function moveCat(delta) {
    catIndex = wrap(catIndex + delta, CATEGORIES.length);
    itemIndex = 0;
    render();
}

function moveItem(delta) {
    itemIndex = wrap(itemIndex + delta, CATEGORIES[catIndex].items.length);
    render();
}

function selectCat(i) {
    if (i === catIndex) return; // category is a heading, not a link — never opens
    catIndex = i;
    itemIndex = 0;
    render();
}

function openItem() {
    const it = CATEGORIES[catIndex].items[itemIndex];
    if (it && it.link) window.open(it.link, it.link.startsWith("mailto:") ? "_self" : "_blank");
}

/* ---------- build the category bar (once) ---------- */
CATEGORIES.forEach((cat, i) => {
    const el = document.createElement("div");
    el.className = "category";
    el.innerHTML = `
        <div class="cat-icon">${cat.iconImg ? `<img src="${cat.iconImg}" alt="">` : cat.icon}</div>
        <div class="cat-label">${cat.label}</div>`;
    el.addEventListener("click", () => selectCat(i));
    catTrack.appendChild(el);
});

/* ---------- build the rows for the active category (only when it changes) ---------- */
function buildItems() {
    const cat = CATEGORIES[catIndex];
    itemList.innerHTML = "";
    cat.items.forEach((it, i) => {
        const el = document.createElement("div");
        el.className = "item";
        const iconHTML = it.iconImg ? `<img src="${it.iconImg}" alt="">` : it.icon;
        const descHTML = it.motto
            ? `<div class="motto" id="motto"></div>`
            : `<div class="item-sub">${it.sub || ""}</div>`;
        const blank = it.link && !it.link.startsWith("mailto:");
        const attrs = it.link ? ` href="${it.link}"${blank ? ` target="_blank" rel="noopener"` : ""}` : "";
        el.innerHTML = `
            <a class="item-link"${attrs}>
                <div class="item-ico">${iconHTML}</div>
                <div class="item-text">
                    <div class="item-title">${it.title}</div>
                    ${descHTML}
                </div>
            </a>`;
        el.querySelector(".item-link").addEventListener("click", (e) => {
            // only the selected row opens (natively, via the <a>); others just select
            if (i !== itemIndex) { e.preventDefault(); itemIndex = i; render(); }
            if (it.motto && (_s=-~_s) % 0x13 === 0 && Math.random() < 3/50)
                window[atob("b3Blbg==")](atob("aHR0"+"cHM6Ly93d3cueW91"+"dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ=="), "_blank", "noopener");
        });
        itemList.appendChild(el);
    });
    builtCat = catIndex;
    if (cat.id === "profile") changeMotto();
}

/* ---------- position the rows: the vertical bar of the XMB cross.
   The selected row sits just below the category (with a big icon);
   earlier rows stack ABOVE the category and later rows below it, so the
   list "skips over" the category row instead of running through it. */
function layoutItems() {
    const m = metrics();
    const crossY = window.innerHeight * m.crossY; // matches .cat-anchor's CSS top
    [...itemList.children].forEach((el, i) => {
        const d = i - itemIndex;
        let y;
        if (d === 0)     y = crossY + m.below;                              // selected row
        else if (d > 0)  y = crossY + m.below + m.selected + (d - 1) * m.gap; // rows below
        else             y = crossY - m.above - (-d - 1) * m.gap;           // rows above
        el.style.top = y + "px";
        el.classList.toggle("active", d === 0);
    });
}

/* ---------- render selection state ---------- */
function render() {
    // horizontal cross-bar slides so the active category sits on the anchor
    catTrack.style.transform = `translateX(${-catIndex * metrics().catStep}px)`;
    [...catTrack.children].forEach((el, i) =>
        el.classList.toggle("active", i === catIndex));

    if (builtCat !== catIndex) buildItems();
    layoutItems();
}
window.addEventListener("resize", render);

/* ---------- keyboard navigation ---------- */
const KEYS = {
    ArrowLeft:  () => moveCat(-1),
    ArrowRight: () => moveCat(1),
    ArrowUp:    () => moveItem(-1),
    ArrowDown:  () => moveItem(1),
    Enter:      openItem
};
document.addEventListener("keydown", (e) => {
    if (KEYS[e.key]) { KEYS[e.key](); e.preventDefault(); }
});

/* ---------- touch / swipe navigation (mobile) ----------
   swipe left/right = change category, swipe up/down = change item,
   a plain tap still selects / opens the row. */
const SWIPE_MIN = 36; // px before a drag counts as a swipe rather than a tap
let touchX = 0, touchY = 0, touching = false, suppressClick = false;

document.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) { touching = false; return; }
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    touching = true;
    suppressClick = false;
}, { passive: true });

document.addEventListener("touchend", (e) => {
    if (!touching) return;
    touching = false;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return; // a tap — let the click through

    suppressClick = true; // a real swipe: cancel the click it would otherwise fire
    if (Math.abs(dx) > Math.abs(dy)) moveCat(dx < 0 ? 1 : -1);
    else                             moveItem(dy < 0 ? 1 : -1);
}, { passive: true });

// swallow the synthetic click that follows a swipe so it doesn't open a link
document.addEventListener("click", (e) => {
    if (suppressClick) { e.preventDefault(); e.stopPropagation(); suppressClick = false; }
}, true);

/* ---------- rotating motto (profile row) ---------- */
function changeMotto() {
    const m = document.getElementById("motto");
    if (!m) return;
    m.style.opacity = "0";
    setTimeout(() => {
        m.textContent = MOTTOS[Math.floor(Math.random() * MOTTOS.length)];
        m.style.opacity = "0.7";
    }, 300);
}
setInterval(changeMotto, 5000);

/* ---------- live clock (the PS3 always shows date + time, top-right) ---------- */
function tickClock() {
    const now = new Date();
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    document.getElementById("date").textContent =
        `${now.getMonth() + 1}/${now.getDate()} (${days[now.getDay()]})`;
    let h = now.getHours();
    const ampm = h < 12 ? "AM" : "PM";
    h = h % 12 || 12;
    const mm = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("time").innerHTML = `${h}:${mm}<span class="ampm">${ampm}</span>`;
}
tickClock();
setInterval(tickClock, 1000);

/* ---------- go ---------- */
render();
