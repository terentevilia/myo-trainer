document.addEventListener("DOMContentLoaded", function () {
  var scrollButtons = document.querySelectorAll("[data-scroll-to]");

  scrollButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      var selector = button.getAttribute("data-scroll-to");
      var target = selector ? document.querySelector(selector) : null;

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var revealItems = document.querySelectorAll(".lp-reveal");

  if ("IntersectionObserver" in window && revealItems.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.15
    });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  var deadlineNode = document.querySelector("[data-deadline]");

  if (deadlineNode) {
    var deadline = new Date(deadlineNode.getAttribute("data-deadline")).getTime();

    function updateTimer() {
      var now = Date.now();
      var distance = deadline - now;

      if (distance <= 0) {
        deadlineNode.textContent = "Предложение активно сейчас";
        return;
      }

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((distance / (1000 * 60)) % 60);

      deadlineNode.textContent = "Цена действует еще: " + days + "д " + hours + "ч " + minutes + "м";
    }

    updateTimer();
    window.setInterval(updateTimer, 60000);
  }

  var accordion = document.querySelector("[data-accordion]");

  if (accordion) {
    accordion.addEventListener("toggle", function (event) {
      var currentItem = event.target;

      if (!currentItem.open || currentItem.tagName !== "DETAILS") return;

      accordion.querySelectorAll("details").forEach(function (item) {
        if (item !== currentItem) item.removeAttribute("open");
      });
    }, true);
  }
});
