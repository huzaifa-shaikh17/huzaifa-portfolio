const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector(".site-header");

function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.innerHTML = `<i data-lucide="${theme === "dark" ? "sun" : "moon"}"></i>`;
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
  );
  localStorage.setItem("portfolio-theme", theme);
  lucide.createIcons();
}

setTheme(
  localStorage.getItem("portfolio-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),
);

themeToggle.addEventListener("click", () =>
  setTheme(document.body.classList.contains("dark") ? "light" : "dark"),
);

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  menuToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
  lucide.createIcons();
});

document.querySelectorAll(".nav-link").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }),
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element));

const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-link");
const scrollSpy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((item) =>
          item.classList.toggle(
            "active",
            item.getAttribute("href") === `#${entry.target.id}`,
          ),
        );
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px" },
);
sections.forEach((section) => scrollSpy.observe(section));

window.addEventListener(
  "scroll",
  () => header.classList.toggle("scrolled", window.scrollY > 10),
  { passive: true },
);

const filters = document.querySelectorAll(".filter-button");
const projects = document.querySelectorAll(".project-card");
filters.forEach((button) =>
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    projects.forEach((project) => {
      const visible = filter === "all" || project.dataset.category === filter;
      project.style.display = visible ? "" : "none";
    });
  }),
);

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  const formStatus = contactForm.querySelector(".form-status");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const recipient = contactForm.dataset.recipient;
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    formStatus.textContent = "Opening your email app...";
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
