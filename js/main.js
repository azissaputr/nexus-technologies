/* ============================================
   NEXUS TECHNOLOGIES - Main JavaScript
   Animations, Interactions & Particles
   + Custom Cursor, Splash FX, Smooth Optimize
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // PERFORMANCE: Throttle & RAF utilities
  // ========================================
  const throttle = (fn, ms) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= ms) { last = now; fn(...args); }
    };
  };
  let ticking = false;
  const onScroll = (callbacks) => {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { callbacks.forEach(fn => fn()); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
  };

  // ========================================
  // 1. CUSTOM CURSOR
  // ========================================
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  const isMobile = window.matchMedia('(max-width:768px)').matches || 'ontouchstart' in window;

  if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    }, { passive: true });

    // Smooth ring follow with lerp
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Interactive hover targets
    const hoverTargets = 'a, button, .filter-btn, .service-card, .portfolio-card, .team-card, .nav-cta, .btn-primary, .btn-secondary, .btn-submit, .testimonial-dots .dot';
    const textTargets = 'input, textarea';

    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('cursor-hover');
        ring.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      });
    });

    document.querySelectorAll(textTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('cursor-text');
        ring.classList.add('cursor-text');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('cursor-text');
        ring.classList.remove('cursor-text');
      });
    });

    // Click animation
    document.addEventListener('mousedown', () => {
      dot.classList.add('cursor-click');
      ring.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
      dot.classList.remove('cursor-click');
      ring.classList.remove('cursor-click');
    });
  } else {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }

  // ========================================
  // 2. SPLASH EFFECT ON SCROLL
  // ========================================
  const splashSections = document.querySelectorAll('#services, #portfolio, #team, #testimonials, #contact');
  const splashedSet = new Set();

  const triggerSplash = () => {
    splashSections.forEach(section => {
      if (splashedSet.has(section)) return;
      const rect = section.getBoundingClientRect();
      const trigger = rect.top < window.innerHeight * 0.6 && rect.bottom > 0;
      if (trigger) {
        splashedSet.add(section);
        const splash = document.createElement('div');
        splash.className = 'splash-reveal';
        splash.style.left = '50%';
        splash.style.top = '0';
        section.style.position = 'relative';
        section.appendChild(splash);
        // Force reflow then animate
        splash.offsetWidth;
        splash.classList.add('animate');
        splash.addEventListener('animationend', () => splash.remove());
      }
    });
  };

  // ========================================
  // 3. WAVE DIVIDERS (Splash between sections)
  // ========================================
  const waveSVG = `<svg class="splash-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
    <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,30 1440,50 L1440,120 L0,120Z"/>
  </svg>
  <svg class="splash-wave wave2" viewBox="0 0 1440 120" preserveAspectRatio="none">
    <path d="M0,60 C240,20 480,100 720,40 C960,0 1200,80 1440,30 L1440,120 L0,120Z"/>
  </svg>`;

  document.querySelectorAll('#services, #testimonials').forEach(sec => {
    const div = document.createElement('div');
    div.className = 'splash-container';
    div.innerHTML = waveSVG;
    sec.appendChild(div);
  });

  // ========================================
  // 4. NAVBAR SCROLL
  // ========================================
  const navbar = document.querySelector('.navbar');
  const handleNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  // ========================================
  // 5. MOBILE MENU
  // ========================================
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================
  // 6. SCROLL REVEAL (optimized with IntersectionObserver)
  // ========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback
    const revealOnScroll = () => {
      revealElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('active');
      });
    };
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();
  }

  // ========================================
  // 7. COUNTER ANIMATION
  // ========================================
  const counters = document.querySelectorAll('[data-count]');
  let counterDone = false;
  const animateCounters = () => {
    if (counterDone) return;
    const section = document.querySelector('.hero-stats');
    if (!section) return;
    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight - 50) {
      counterDone = true;
      counters.forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const duration = 1500;
        const startTime = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          current = Math.floor(easeOut(progress) * target);
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }
  };

  // ========================================
  // 8. PORTFOLIO FILTER
  // ========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioCards.forEach((card, i) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0,20px,0)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translate3d(0,0,0)';
          }, i * 80);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========================================
  // 9. TESTIMONIAL CAROUSEL
  // ========================================
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  let currentSlide = 0;
  const totalSlides = dots.length;
  const goToSlide = (i) => {
    currentSlide = i;
    if (track) track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  };
  dots.forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));
  setInterval(() => { if (totalSlides > 0) goToSlide((currentSlide + 1) % totalSlides); }, 5000);

  // ========================================
  // 10. PARTICLE BACKGROUND (optimized)
  // ========================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', throttle(resize, 200));

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '0,229,255' : '168,85,247';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    const count = Math.min(80, Math.floor(window.innerWidth / 18));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    const connectDist = 120;
    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = dx * dx + dy * dy;
          if (dist < connectDist * connectDist) {
            const alpha = 0.08 * (1 - Math.sqrt(dist) / connectDist);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Only animate when hero is visible
    let heroVisible = true;
    const heroSection = document.getElementById('hero');
    const heroObs = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && !animId) animate();
    }, { threshold: 0 });
    if (heroSection) heroObs.observe(heroSection);

    const animate = () => {
      if (!heroVisible) { animId = null; return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      animId = requestAnimationFrame(animate);
    };
    animate();
  }

  // ========================================
  // 11. SMOOTH SCROLL (anchor links)
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========================================
  // 12. FORM SUBMIT
  // ========================================
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      btn.textContent = 'Terkirim! ✓';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #10b981)';
      setTimeout(() => {
        btn.textContent = 'Kirim Pesan →';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // ========================================
  // 13. TYPED EFFECT
  // ========================================
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const words = ['Inovasi Digital', 'Solusi Teknologi', 'Transformasi Bisnis', 'Masa Depan'];
    let wordIdx = 0, charIdx = 0, deleting = false;
    const typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000;
    const type = () => {
      const word = words[wordIdx];
      if (deleting) {
        typedEl.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(type, 400); return; }
      } else {
        typedEl.textContent = word.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === word.length) { deleting = true; setTimeout(type, pauseTime); return; }
      }
      setTimeout(type, deleting ? deleteSpeed : typeSpeed);
    };
    type();
  }

  // ========================================
  // UNIFIED SCROLL HANDLER (via rAF)
  // ========================================
  onScroll([handleNavbar, animateCounters, triggerSplash]);
  // Initial calls
  handleNavbar();
  animateCounters();
  triggerSplash();
});
