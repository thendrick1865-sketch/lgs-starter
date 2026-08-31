(function () {
  "use strict";

  var SHOP = window.SHOP;
  if (!SHOP) return;

  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function nowInShop() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: SHOP.TIMEZONE || "America/Los_Angeles",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var dayIdx = DAYS.findIndex(function (d) { return d === map.weekday; });
      if (dayIdx < 0) {
        // Some engines emit "Sun" vs full; fall back
        dayIdx = DAYS_LONG.findIndex(function (d) { return d.slice(0, 3) === map.weekday; });
      }
      var hour = parseInt(map.hour, 10);
      var minute = parseInt(map.minute, 10);
      return { day: dayIdx < 0 ? new Date().getDay() : dayIdx, minutes: hour * 60 + minute };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function parseHm(hm) {
    if (!hm) return null;
    var bits = String(hm).split(":");
    return parseInt(bits[0], 10) * 60 + parseInt(bits[1] || "0", 10);
  }

  function format12(hm) {
    var m = parseHm(hm);
    if (m == null) return "";
    var h = Math.floor(m / 60);
    var min = m % 60;
    var ampm = h >= 12 ? "pm" : "am";
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return min ? h12 + ":" + String(min).padStart(2, "0") + ampm : h12 + ampm;
  }

  function hoursFor(day) {
    var h = SHOP.HOURS && SHOP.HOURS[day];
    if (h == null) h = SHOP.HOURS && SHOP.HOURS[String(day)];
    return h || null;
  }

  function isOpenAt(clock) {
    var h = hoursFor(clock.day);
    if (!h || !h.open || !h.close) return false;
    var a = parseHm(h.open);
    var b = parseHm(h.close);
    return clock.minutes >= a && clock.minutes < b;
  }

  function bindText() {
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      var val = SHOP[key];
      if (val == null) return;
      el.textContent = val;
    });
    document.querySelectorAll("[data-bind-href]").forEach(function (el) {
      var key = el.getAttribute("data-bind-href");
      var val = SHOP[key];
      if (!val) return;
      if (key === "PHONE") el.setAttribute("href", "tel:" + String(val).replace(/[^\d+]/g, ""));
      else if (key === "EMAIL") el.setAttribute("href", "mailto:" + val);
      else {
        el.setAttribute("href", val);
        if (/^https?:/i.test(val) && key !== "MAPS_URL") {
          el.setAttribute("rel", "noopener noreferrer");
        }
      }
    });
    document.title = SHOP.SHOP_NAME + " · " + SHOP.CITY;
    var titleEl = document.querySelector('meta[property="og:title"]');
    if (titleEl) titleEl.setAttribute("content", SHOP.SHOP_NAME + " — " + SHOP.CITY);
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", SHOP.SHOP_NAME + " in " + SHOP.CITY + ". Hours, this week's events, pickup, and the play space.");
  }

  function renderLeds() {
    var clock = nowInShop();
    var open = isOpenAt(clock);
    var today = hoursFor(clock.day);
    var until = "";
    if (open && today) until = "until " + format12(today.close);
    else if (today && clock.minutes < parseHm(today.open)) until = "opens " + format12(today.open);
    else until = nextOpenLabel(clock);

    document.querySelectorAll("[data-led]").forEach(function (el) {
      el.classList.toggle("is-open", open);
      el.classList.toggle("is-closed", !open);
      var status = el.querySelector("[data-led-status]");
      var extra = el.querySelector("[data-led-until]");
      if (status) status.textContent = open ? "Open" : "Closed";
      if (extra) extra.textContent = until;
    });
  }

  function nextOpenLabel(clock) {
    for (var i = 0; i < 7; i++) {
      var day = (clock.day + i) % 7;
      var h = hoursFor(day);
      if (!h) continue;
      if (i === 0 && clock.minutes < parseHm(h.open)) return "opens " + format12(h.open);
      if (i > 0) return "opens " + DAYS[day] + " " + format12(h.open);
    }
    return "";
  }

  function renderHours() {
    var wrap = document.querySelector("[data-hours]");
    if (!wrap) return;
    var clock = nowInShop();
    wrap.innerHTML = "";
    for (var i = 0; i < 7; i++) {
      var h = hoursFor(i);
      var li = document.createElement("li");
      if (i === clock.day) li.className = "is-today";
      var day = document.createElement("span");
      day.className = "day";
      day.textContent = DAYS_LONG[i];
      var time = document.createElement("span");
      time.textContent = h ? format12(h.open) + " – " + format12(h.close) : "Closed";
      li.appendChild(day);
      li.appendChild(time);
      wrap.appendChild(li);
    }
  }

  function nextDateForWeekday(weekday, timeHm, durationMin) {
    var clock = nowInShop();
    var delta = (weekday - clock.day + 7) % 7;
    var startMin = parseHm(timeHm);
    var dur = durationMin || 180;
    if (delta === 0 && clock.minutes >= startMin + dur) delta = 7;
    var tz = SHOP.TIMEZONE || "America/Los_Angeles";
    var now = new Date();
    // Build YYYY-MM-DD in shop TZ, then add delta days
    var fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    var ymd = fmt.format(now); // 2026-08-30
    var base = new Date(ymd + "T00:00:00");
    base.setDate(base.getDate() + delta);
    var y = base.getFullYear();
    var m = String(base.getMonth() + 1).padStart(2, "0");
    var d = String(base.getDate()).padStart(2, "0");
    var isoLocal = y + "-" + m + "-" + d + "T" + timeHm + ":00";
    return { date: y + "-" + m + "-" + d, isoLocal: isoLocal, isToday: delta === 0 };
  }

  function eventCard(ev, opts) {
    opts = opts || {};
    var when = nextDateForWeekday(ev.weekday, ev.time, ev.durationMin);
    var article = document.createElement(opts.link ? "a" : "article");
    article.className = "event-row";
    if (opts.link) article.setAttribute("href", opts.link);

    var whenEl = document.createElement("div");
    whenEl.className = "event-when";

    var day = document.createElement("span");
    day.className = "event-day";
    day.textContent = when.isToday ? "Today" : DAYS_LONG[ev.weekday];

    var time = document.createElement("span");
    time.className = "event-time";
    time.textContent = format12(ev.time);

    whenEl.appendChild(day);
    whenEl.appendChild(time);

    var body = document.createElement("div");
    body.className = "event-body";

    var game = document.createElement("div");
    game.className = "event-game";
    game.textContent = ev.game;

    var h = document.createElement("h3");
    h.textContent = ev.name;

    body.appendChild(game);
    body.appendChild(h);

    if (ev.blurb) {
      var p = document.createElement("p");
      p.textContent = ev.blurb;
      body.appendChild(p);
    }

    var meta = document.createElement("div");
    meta.className = "event-meta";

    var fee = document.createElement("span");
    fee.textContent = ev.fee || "Fee TBA";
    meta.appendChild(fee);

    if (ev.newPlayerFriendly) {
      var np = document.createElement("span");
      np.textContent = "New-player friendly";
      meta.appendChild(np);
    }

    body.appendChild(meta);
    article.appendChild(whenEl);
    article.appendChild(body);
    return article;
  }

  function renderEvents() {
    var events = (SHOP.EVENTS || []).slice();
    var home = document.querySelector("[data-events-home]");
    var all = document.querySelector("[data-events-all]");
    var clock = nowInShop();

    var tonight = events.filter(function (ev) { return ev.weekday === clock.day; });
    var week = events.slice().sort(function (a, b) {
      var da = (a.weekday - clock.day + 7) % 7;
      var db = (b.weekday - clock.day + 7) % 7;
      if (da !== db) return da - db;
      return parseHm(a.time) - parseHm(b.time);
    });

    if (home) {
      home.innerHTML = "";
      var show = tonight.length ? tonight : week.slice(0, 3);
      if (!show.length) {
        home.innerHTML = '<p class="empty-week">No events in config.js yet — add a few before the walk-in.</p>';
      } else {
        show.forEach(function (ev) { home.appendChild(eventCard(ev, { link: "events.html" })); });
      }
      var kicker = document.querySelector("[data-events-kicker]");
      if (kicker) kicker.textContent = tonight.length ? "Tonight" : "This week";
    }

    if (all) {
      all.innerHTML = "";
      if (!week.length) {
        all.innerHTML = '<p class="empty-week">No events in config.js yet.</p>';
      } else {
        week.forEach(function (ev) { all.appendChild(eventCard(ev)); });
      }
    }
  }

  function renderCarry() {
    var grid = document.querySelector("[data-carry]");
    if (!grid || !SHOP.CARRY) return;
    grid.innerHTML = "";
    SHOP.CARRY.forEach(function (item) {
      var el = document.createElement("article");
      el.className = "carry-item";
      el.innerHTML = "<h3></h3><p></p>";
      el.querySelector("h3").textContent = item.name;
      el.querySelector("p").textContent = item.note;
      grid.appendChild(el);
    });
  }

  function renderNewPlayers() {
    var wrap = document.querySelector("[data-new-players]");
    var np = SHOP.NEW_PLAYERS;
    if (!wrap || !np) return;
    var k = wrap.querySelector("[data-np-kicker]");
    var t = wrap.querySelector("[data-np-title]");
    var body = wrap.querySelector("[data-np-body]");
    if (k) k.textContent = np.kicker;
    if (t) t.textContent = np.title;
    if (body) {
      body.innerHTML = "";
      (np.grafs || []).forEach(function (g) {
        var p = document.createElement("p");
        p.textContent = g;
        body.appendChild(p);
      });
    }
  }

  function renderPolicy() {
    var el = document.querySelector("[data-policy]");
    if (el && SHOP.POLICY) el.textContent = SHOP.POLICY;
    var pre = document.querySelector("[data-preorder]");
    if (pre && SHOP.PREORDER_NOTE) pre.textContent = SHOP.PREORDER_NOTE;
  }

  function setupForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form || !SHOP.EMAIL) return;
    form.setAttribute("action", "https://formsubmit.co/" + SHOP.EMAIL);
    var next = form.querySelector('input[name="_next"]');
    if (next) next.value = window.location.href.split("#")[0] + "#contact";
    var sub = form.querySelector('input[name="_subject"]');
    if (sub) sub.value = "Message for " + SHOP.SHOP_NAME;
  }

  function injectJsonLd() {
    var existing = document.getElementById("jsonld");
    if (existing) existing.remove();

    var hoursSpec = [];
    for (var i = 0; i < 7; i++) {
      var h = hoursFor(i);
      if (!h) continue;
      hoursSpec.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS_LONG[i],
        opens: h.open,
        closes: h.close
      });
    }

    var localBusiness = {
      "@type": "HobbyShop",
      name: SHOP.SHOP_NAME,
      description: SHOP.TAGLINE,
      telephone: SHOP.PHONE,
      email: SHOP.EMAIL,
      url: window.location.origin + window.location.pathname.replace(/[^/]+$/, ""),
      address: {
        "@type": "PostalAddress",
        streetAddress: SHOP.ADDRESS,
        addressLocality: SHOP.CITY
      },
      openingHoursSpecification: hoursSpec,
      sameAs: [SHOP.FACEBOOK, SHOP.INSTAGRAM, SHOP.DISCORD].filter(Boolean)
    };

    var graph = [localBusiness];

    (SHOP.EVENTS || []).forEach(function (ev) {
      var when = nextDateForWeekday(ev.weekday, ev.time, ev.durationMin);
      var endMin = parseHm(ev.time) + (ev.durationMin || 120);
      var eh = String(Math.floor(endMin / 60) % 24).padStart(2, "0");
      var em = String(endMin % 60).padStart(2, "0");
      graph.push({
        "@type": "Event",
        name: ev.name,
        description: ev.blurb || (ev.game + " at " + SHOP.SHOP_NAME),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        startDate: when.isoLocal,
        endDate: when.date + "T" + eh + ":" + em + ":00",
        location: {
          "@type": "Place",
          name: SHOP.SHOP_NAME,
          address: SHOP.ADDRESS + ", " + SHOP.CITY
        },
        organizer: { "@type": "Organization", name: SHOP.SHOP_NAME },
        isAccessibleForFree: String(ev.fee).toLowerCase() === "free",
        offers: {
          "@type": "Offer",
          price: String(ev.fee).replace(/[^0-9.]/g, "") || "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        }
      });
    });

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "jsonld";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(script);
  }

  function nav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var drawer = document.querySelector("[data-nav-drawer]");
    if (toggle && drawer) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        drawer.classList.toggle("is-open", !open);
        document.body.style.overflow = open ? "" : "hidden";
      });
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          toggle.setAttribute("aria-expanded", "false");
          drawer.classList.remove("is-open");
          document.body.style.overflow = "";
        });
      });
    }
    var file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("[data-nav] a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0];
      if (!href) return;
      var name = href.split("/").pop().toLowerCase();
      if (name === file || (file === "" && name === "index.html")) {
        if (!a.getAttribute("href").includes("#") || name === file) {
          if (name === file) a.setAttribute("aria-current", "page");
        }
      }
      if ((file === "index.html" || file === "") && (name === "index.html" || href === "index.html") && !a.getAttribute("href").includes("#")) {
        a.setAttribute("aria-current", "page");
      }
      if (file === "events.html" && name === "events.html") a.setAttribute("aria-current", "page");
    });
  }

  bindText();
  renderLeds();
  renderHours();
  renderEvents();
  renderCarry();
  renderNewPlayers();
  renderPolicy();
  setupForm();
  injectJsonLd();
  nav();
})();
