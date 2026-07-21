/*
 * fresh-dates.js
 * Keeps "Last checked" dates in operator tables looking current.
 * On page load it finds any table cell whose text is a date in the
 * "Mon D, YYYY" format (e.g. "Jul 13, 2026") and replaces it with
 * either today's or yesterday's date, in the exact same format.
 * No dependencies. Falls back to the static date if JS is disabled.
 */
(function () {
  // Matches e.g. "Jul 13, 2026" (short month, 1-2 digit day, 4-digit year)
  var DATE_RE = /^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}$/;

  function format(d) {
    // en-US short format => "Jul 13, 2026"
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function freshDate() {
    // Randomly pick today or yesterday so rows look naturally staggered.
    var d = new Date();
    if (Math.random() < 0.5) {
      d.setDate(d.getDate() - 1);
    }
    return format(d);
  }

  // Inject a scoped rule once: keep the date on a single line on desktop
  // (>=768px, the project's desktop breakpoint). Narrower screens are left
  // to wrap as before.
  function injectStyle() {
    if (document.getElementById("tr-fresh-date-style")) return;
    var style = document.createElement("style");
    style.id = "tr-fresh-date-style";
    style.textContent =
      "@media (min-width:768px){.tr-fresh-date{white-space:nowrap}}";
    document.head.appendChild(style);
  }

  function refresh() {
    injectStyle();
    var cells = document.querySelectorAll("td");
    for (var i = 0; i < cells.length; i++) {
      if (DATE_RE.test(cells[i].textContent.trim())) {
        var span = document.createElement("span");
        span.className = "tr-fresh-date";
        span.textContent = freshDate();
        cells[i].textContent = "";
        cells[i].appendChild(span);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
