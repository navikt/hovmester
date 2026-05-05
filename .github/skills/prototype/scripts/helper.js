(function () {
  var selected = new Map();
  var indicator = document.getElementById("indicator");
  var indicatorText = document.getElementById("indicator-text");

  window.toggleSelect = function (el) {
    var choice = el.dataset.choice;
    var container = el.closest(".options, .cards");
    var isMulti = container && container.dataset.multiselect !== undefined;

    if (!isMulti && container) {
      container.querySelectorAll(".option, .card").forEach(function (opt) {
        opt.classList.remove("selected");
        opt.setAttribute("aria-pressed", "false");
        selected.delete(opt.dataset.choice);
      });
    }

    el.classList.toggle("selected");
    var isSelected = el.classList.contains("selected");
    el.setAttribute("aria-pressed", String(isSelected));

    if (isSelected) {
      var label =
        (el.querySelector("h3, .content h3") || {}).textContent || choice;
      selected.set(choice, label);
      recordEvent("click", choice, el.textContent.trim().substring(0, 120));
    } else {
      selected.delete(choice);
      recordEvent("deselect", choice, el.textContent.trim().substring(0, 120));
    }

    updateIndicator();
  };

  function updateIndicator() {
    if (!indicator) return;
    if (selected.size === 0) {
      indicator.classList.remove("visible");
      return;
    }
    indicator.classList.add("visible");
    var names = Array.from(selected.values());
    indicatorText.textContent =
      names.length === 1 ? "Valgt: " + names[0] : names.length + " valgt";
  }

  function recordEvent(type, choice, text) {
    var event = {
      type: type,
      choice: choice,
      text: text.replace(/\s+/g, " ").trim(),
      timestamp: Date.now(),
    };

    fetch("/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch(function (err) {
      console.warn("[Visual Companion] Failed to record event:", err.message);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (
      e.target.matches(".option, .card") &&
      (e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      window.toggleSelect(e.target);
    }
  });

  document.querySelectorAll(".option, .card").forEach(function (el) {
    if (!el.getAttribute("tabindex")) {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-pressed", "false");
    }
  });

  var lastVersion = null;
  setInterval(function () {
    fetch("/version")
      .then(function (res) {
        return res.text();
      })
      .then(function (version) {
        if (lastVersion === null) {
          lastVersion = version;
        } else if (version && version !== lastVersion) {
          lastVersion = version;
          var toast = document.getElementById("refresh-indicator");
          if (toast) {
            toast.classList.add("visible");
          }
          setTimeout(function () {
            window.location.reload();
          }, 400);
        }
      })
      .catch(function () {});
  }, 2000);
})();
