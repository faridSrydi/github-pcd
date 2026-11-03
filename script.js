// ===== 1. TAHUN OTOMATIS DI FOOTER =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== 2. MODE GELAP / TERANG =====
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function applyTheme(theme, save) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  if (save) {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* penyimpanan tidak tersedia, abaikan */
    }
  }
}

function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (e) {
    return null;
  }
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(getSavedTheme() || (prefersDark ? "dark" : "light"), false);

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next, true);
});

// ===== 3. MENU HP (HAMBURGER) =====
const menuBtn = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navMenu.classList.remove("open"));
});

// ===== 4. EFEK KETIK PADA HERO =====
// Ubah isi array ini sesuai peran Anda
const roles = ["Mahasiswa Informatika", "Web Developer", "Pembelajar Teknologi"];
const typedEl = document.getElementById("typed");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1400); // jeda setelah kata selesai diketik
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(type, deleting ? 50 : 90);
}
type();

// ===== 5. ANIMASI MUNCUL SAAT SCROLL + BAR SKILL =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      // Isi bar skill sesuai atribut data-level
      entry.target.querySelectorAll(".bar span").forEach((bar) => {
        bar.style.width = bar.dataset.level + "%";
      });

      revealObserver.unobserve(entry.target); // animasi cukup sekali
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ===== 6. MENU AKTIF SESUAI POSISI SCROLL =====
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// ===== 7. FORM KONTAK (MEMBUKA APLIKASI EMAIL) =====
const form = document.getElementById("contact-form");
const EMAIL_TUJUAN = "emailkamu@contoh.com"; // ganti dengan email Anda

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent("Pesan dari " + name + " (Portfolio)");
  const body = encodeURIComponent(message + "\n\n- " + name);

  window.location.href = "mailto:" + EMAIL_TUJUAN + "?subject=" + subject + "&body=" + body;
});
