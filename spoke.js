/* Lightweight interactions for spoke pages (no leaderboard/chart deps). */
(function () {
  "use strict";

  function initBurger() {
    var burger = document.getElementById("burger");
    var menu = document.getElementById("mobile-menu");
    if (!burger || !menu) return;
    function setOpen(o) {
      burger.classList.toggle("is-open", o);
      burger.setAttribute("aria-expanded", o ? "true" : "false");
      burger.setAttribute("aria-label", o ? "Close menu" : "Open menu");
      menu.hidden = !o;
    }
    burger.addEventListener("click", function () { setOpen(menu.hidden); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
  }

  function initScroll() {
    var header = document.getElementById("site-header");
    var toTop = document.getElementById("to-top");
    function onScroll() {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
      if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    if (toTop) {
      toTop.addEventListener("click", function () {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      });
    }
    onScroll();
  }

  function initReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = document.querySelectorAll(".anim");
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "-60px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  function init() { initBurger(); initScroll(); initReveal(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
