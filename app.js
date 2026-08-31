document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Mobile navigation
  const menu = document.getElementById("menu");
  const nav = document.getElementById("navlinks");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("show");
      menu.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("show");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Animated counters
  const counters = document.querySelectorAll("[data-count]");
  let counted = false;

  function animateCounters() {
    if (counted || !counters.length) return;
    counted = true;

    counters.forEach((el) => {
      const target = Math.max(0, Number(el.dataset.count) || 0);
      const start = performance.now();
      const duration = 1100;

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.floor(target * eased)}+`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = `${target}+`;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const stats = document.querySelector(".stats");

  if ("IntersectionObserver" in window && stats) {
    const observer = new IntersectionObserver((entries, obs) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateCounters();
        obs.disconnect();
      }
    }, { threshold: 0.25 });

    observer.observe(stats);
  } else {
    animateCounters();
  }

  // Portfolio filters
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const filter = button.dataset.filter || "all";

      projects.forEach((project) => {
        project.hidden = !(filter === "all" || project.dataset.cat === filter);
      });
    });
  });

  // Portfolio modal
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalCat = document.getElementById("modalCat");
  const closeModal = document.getElementById("closeModal");

  function hideModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  function showModal(project) {
    if (!modal) return;

    if (modalImg) {
      modalImg.src = project.dataset.img || "";
      modalImg.alt = project.dataset.title || "Project preview";
    }
    if (modalTitle) modalTitle.textContent = project.dataset.title || "Project";
    if (modalDesc) modalDesc.textContent = project.dataset.desc || "";
    if (modalCat) {
      modalCat.textContent = project.querySelector("small")?.textContent || "";
    }

    modal.classList.add("open");
    document.body.classList.add("modal-open");
  }

  projects.forEach((project) => {
    project.tabIndex = 0;
    project.setAttribute("role", "button");

    project.addEventListener("click", () => showModal(project));

    project.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showModal(project);
      }
    });
  });

  closeModal?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideModal();
  });

  // Testimonials
  const reviews = [...document.querySelectorAll(".review")];
  const nextReview = document.getElementById("nextReview");
  const prevReview = document.getElementById("prevReview");
  let reviewIndex = Math.max(
    0,
    reviews.findIndex((review) => review.classList.contains("active"))
  );

  if (reviews.length) {
    function showReview(index) {
      reviewIndex = (index + reviews.length) % reviews.length;
      reviews.forEach((review, i) => {
        review.classList.toggle("active", i === reviewIndex);
        review.setAttribute("aria-hidden", String(i !== reviewIndex));
      });
    }

    showReview(reviewIndex);
    nextReview?.addEventListener("click", () => showReview(reviewIndex + 1));
    prevReview?.addEventListener("click", () => showReview(reviewIndex - 1));

    let timer = setInterval(() => showReview(reviewIndex + 1), 6000);
    const wrap = document.querySelector(".review-wrap");

    wrap?.addEventListener("mouseenter", () => clearInterval(timer));
    wrap?.addEventListener("mouseleave", () => {
      timer = setInterval(() => showReview(reviewIndex + 1), 6000);
    });
  }

  // FAQ accordion
  document.querySelectorAll(".faq button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq");
      if (!item) return;

      document.querySelectorAll(".faq").forEach((faq) => {
        if (faq !== item) {
          faq.classList.remove("open");
          faq.querySelector("button")?.setAttribute("aria-expanded", "false");
          const icon = faq.querySelector("button span");
          if (icon) icon.textContent = "+";
        }
      });

      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));

      const icon = button.querySelector("span");
      if (icon) icon.textContent = open ? "−" : "+";
    });
  });

  // Contact form -> WhatsApp
  const form = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const value = (id) => document.getElementById(id)?.value.trim() || "";

    const message = [
      "Hello YuviTech, I would like a free consultation.",
      "",
      `Name: ${value("name")}`,
      `Phone: ${value("phone")}`,
      `Email: ${value("email") || "Not provided"}`,
      `Service: ${document.getElementById("service")?.value || "Not selected"}`,
      `Details: ${value("details") || "Not provided"}`
    ].join("\n");

    const url = `https://wa.me/919149118131?text=${encodeURIComponent(message)}`;

    if (formMsg) {
      formMsg.textContent = "Opening WhatsApp with your enquiry…";
      formMsg.style.color = "#087e9d";
    }

    const popup = window.open(url, "_blank", "noopener,noreferrer");

    if (!popup && formMsg) {
      alert("Data send successfully")
      formMsg.textContent =
        "Data send successfully";
      formMsg.style.color = "#008000";
      form.reset()

    }
  });

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Back to top
  const topButton = document.getElementById("toTop");

  if (topButton) {
    const update = () => {
      topButton.classList.toggle("show", window.scrollY > 500);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
