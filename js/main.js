(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Nav border on scroll (sentinel, no scroll listener) ---- */
  var nav = document.getElementById("nav");
  var sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:0;left:0;height:1px;width:1px;";
  document.body.prepend(sentinel);
  new IntersectionObserver(function (entries) {
    nav.classList.toggle("is-scrolled", !entries[0].isIntersecting);
  }).observe(sentinel);

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---- Scroll reveal (re-triggers each time a section re-enters; entries
         that arrive together cascade in with a small stagger) ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var timers = new WeakMap();
    var revealObserver = new IntersectionObserver(function (entries) {
      var delay = 0;
      entries.forEach(function (entry) {
        var el = entry.target;
        var pending = timers.get(el);
        if (pending) { clearTimeout(pending); timers.delete(el); }
        if (entry.isIntersecting) {
          timers.set(el, setTimeout(function () {
            el.classList.add("is-in");
            timers.delete(el);
          }, delay));
          delay = Math.min(delay + 80, 480);
        } else {
          el.classList.remove("is-in");
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Metric count-up (once, skipped under reduced motion) ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (!reduceMotion && counters.length) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        var el = entry.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var duration = 900;
        var start = null;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }
})();
