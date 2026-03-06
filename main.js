document.addEventListener("DOMContentLoaded", () => {
  // CUSTOM CURSOR
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });
  function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // SCROLL PROGRESS BAR
  const progressBar = document.getElementById("progress-bar");
  window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / total) * 100 + "%";
  });

  // NAVBAR SHRINK
  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  // PARTICLE SYSTEM
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["#c8102e", "#f4c300", "#ffffff", "#ff4466"];

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : Math.random() > 0.5 ? -5 : H + 5;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 1.6 + 0.4;
      this.alpha = Math.random() * 0.45 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = 300 + Math.random() * 500;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (
        this.life > this.maxLife ||
        this.x < -10 ||
        this.x > W + 10 ||
        this.y < -10 ||
        this.y > H + 10
      )
        this.reset();
    }
    draw() {
      const fade =
        Math.min(this.life / 40, 1) *
        Math.min((this.maxLife - this.life) / 40, 1);
      ctx.save();
      ctx.globalAlpha = this.alpha * fade;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = [];
  for (let i = 0; i < 180; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 90) * 0.1;
          ctx.strokeStyle = "#c8102e";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // TYPED TEXT
  const nameEl = document.getElementById("typed-name");
  const text = "Future United States Marine";
  let idx = 0;
  function type() {
    if (idx <= text.length) {
      nameEl.textContent = text.slice(0, idx++);
      setTimeout(type, 65);
    } else {
      setTimeout(() => {
        idx = 0;
        setTimeout(type, 500);
      }, 4000);
    }
  }
  setTimeout(type, 2200);

  // SCROLL FADE IN
  const fadeEls = document.querySelectorAll(
    ".fade-in, .fade-in-left, .fade-in-right"
  );
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), i * 80);
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeEls.forEach((el) => scrollObserver.observe(el));

  // COUNT UP
  const countEls = document.querySelectorAll(".count-up");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const start = performance.now();
          function step(now) {
            const p = Math.min((now - start) / 1800, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  countEls.forEach((el) => countObserver.observe(el));

  // SALUTE BUTTON + BURST
  const saluteBtn = document.querySelector(".salute-btn");
  if (saluteBtn) {
    let clicked = false;
    saluteBtn.addEventListener("click", () => {
      if (clicked) return;
      clicked = true;
      saluteBtn.textContent = "🎖️ OORAH! SEMPER FI, DEVIL DOG!";
      saluteBtn.style.background = "#f4c300";
      saluteBtn.style.color = "#000";
      saluteBtn.style.boxShadow = "0 0 60px rgba(244,195,0,0.9)";
      fireBurst(saluteBtn);
      setTimeout(() => {
        saluteBtn.textContent = "🫡 SEMPER FI, SGT. HARRISON";
        saluteBtn.style.background = "";
        saluteBtn.style.color = "";
        saluteBtn.style.boxShadow = "";
        clicked = false;
      }, 3500);
    });
  }

  function fireBurst(btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 22; i++) {
      const div = document.createElement("div");
      div.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:6px;height:6px;border-radius:50%;background:${
        i % 2 === 0 ? "#f4c300" : "#c8102e"
      };pointer-events:none;z-index:99999;transform:translate(-50%,-50%);`;
      document.body.appendChild(div);
      const angle = (i / 22) * Math.PI * 2;
      const dist = 70 + Math.random() * 80;
      div.animate(
        [
          { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${
              Math.cos(angle) * dist
            }px),calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`,
            opacity: 0,
          },
        ],
        { duration: 750, easing: "ease-out" }
      ).onfinish = () => div.remove();
    }
  }

  // PARALLAX ON EGA
  const ega = document.querySelector(".ega-container");
  window.addEventListener("scroll", () => {
    if (ega) ega.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  });

  // ACTIVE NAV HIGHLIGHT
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.style.color = "";
            if (link.getAttribute("href") === "#" + entry.target.id)
              link.style.color = "#f4c300";
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => navObserver.observe(s));
});
