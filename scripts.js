// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
    }
});


// Particle effect for hero section
const createParticles = () => {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = '#6366f1';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.5;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s infinite linear`;
        hero.appendChild(particle);
    }
};

// Initialize particles
createParticles();

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Change hamburger icon to X when menu is open
        const icon = navToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = 'bx bx-x';
        } else {
            icon.className = 'bx bx-menu';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.querySelector('i').className = 'bx bx-menu';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.querySelector('i').className = 'bx bx-menu';
        }
    });
}

// CV dropdown toggle
const cvBtn = document.getElementById('cv-btn');
const cvMenu = document.getElementById('cv-menu');

if (cvBtn && cvMenu) {
    cvBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = cvBtn.getAttribute('aria-expanded') === 'true';
        cvBtn.setAttribute('aria-expanded', String(!expanded));
        cvMenu.classList.toggle('open');
        cvMenu.setAttribute('aria-hidden', String(expanded));
    });

    // Close CV menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!cvBtn.contains(e.target) && !cvMenu.contains(e.target)) {
            cvMenu.classList.remove('open');
            cvMenu.setAttribute('aria-hidden', 'true');
            cvBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cvMenu.classList.remove('open');
            cvMenu.setAttribute('aria-hidden', 'true');
            cvBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// --- i18n: load translations from JSON then apply ---
let translations = null;

async function loadTranslations() {
    try {
        const res = await fetch('translations.json', { cache: 'no-store' });
        translations = await res.json();
    } catch (err) {
        console.error('Failed to load translations.json', err);
        translations = { en: {} };
    }
}

function applyTranslations(lang) {
    if (!translations) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = (translations[lang] && translations[lang][key]) || (translations['en'] && translations['en'][key]) || '';
        if (text.includes('<br>')) el.innerHTML = text; else el.textContent = text;
    });

    document.documentElement.lang = lang;
    localStorage.setItem('site_lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();

    // wire up language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang || 'en';
            applyTranslations(lang);
        });
    });

    const saved = localStorage.getItem('site_lang');
    if (saved) {
        applyTranslations(saved);
    } else {
        // detect browser language; if it's German (de) use German, otherwise default to English
        const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || 'en').toLowerCase();
        const preferred = navLang.startsWith('de') ? 'de' : 'en';
        applyTranslations(preferred);
    }

    // populate footer year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // animate footer underline for a subtle unique touch
    const underline = document.querySelector('.signature-underline');
    if (underline) {
        // slight delay so it doesn't compete with initial page animations
        setTimeout(() => underline.classList.add('animate'), 650);
    }

    // Hide navbar when leaving the home section, show when entering
    const navbar = document.querySelector('.navbar');
    const home = document.getElementById('home');
    if (navbar && home) {
        const navObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // home visible -> show navbar
                    navbar.classList.remove('hidden');
                } else {
                    // home not visible -> hide navbar
                    navbar.classList.add('hidden');
                }
            });
        }, { threshold: 0.05 });
        navObs.observe(home);
    }

    // Back to top button
    const backWidget = document.getElementById('back-to-top-widget');
    if (backWidget) {
        backWidget.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Show the widget when NOT in the #home section (hide while #home is visible)
        const homeSection = document.getElementById('home');
        let idleTimer = null;
        const IDLE_DELAY = 4000; // ms

        const showWidget = () => {
            backWidget.classList.remove('idle-hide');
            backWidget.classList.add('show', 'flash');
            backWidget.setAttribute('aria-hidden', 'false');
            // remove flash after animation completes
            const removeFlash = () => backWidget.classList.remove('flash');
            backWidget.addEventListener('animationend', removeFlash, { once: true });

            // reset idle timer
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                backWidget.classList.add('idle-hide');
            }, IDLE_DELAY);
        };

        const hideWidget = () => {
            backWidget.classList.remove('show', 'flash');
            backWidget.classList.add('idle-hide');
            backWidget.setAttribute('aria-hidden', 'true');
            if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
        };

        const resetIdle = () => {
            // user interacted -> keep widget visible and reset timer
            if (backWidget.classList.contains('show')) {
                backWidget.classList.remove('idle-hide');
                if (idleTimer) clearTimeout(idleTimer);
                idleTimer = setTimeout(() => backWidget.classList.add('idle-hide'), IDLE_DELAY);
            }
        };

        if (homeSection) {
            const obsHome = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // home is visible -> hide widget
                        hideWidget();
                    } else {
                        // home not visible -> show widget
                        showWidget();
                    }
                });
            }, { threshold: 0.05 });
            obsHome.observe(homeSection);
        } else {
            // fallback: show widget after scrolling down a bit
            const toggleByScroll = () => {
                if (window.scrollY > 200) showWidget(); else hideWidget();
            };
            window.addEventListener('scroll', toggleByScroll);
            toggleByScroll();
        }

        // reset idle timer on user activity
        ['scroll', 'mousemove', 'touchstart', 'keydown'].forEach(evt => window.addEventListener(evt, resetIdle, { passive: true }));
    }

    // Populate latest commit info from GitHub (public repo)
    const commitEl = document.getElementById('latest-commit');
    if (commitEl) {
        // repo owner/name — adjust if your repo differs
        const repoOwner = 'elemenceOR';
        const repoName = 'elemenceOR.github.io';
        const commitsApi = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=1`;

        fetch(commitsApi, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data[0]) {
                    const c = data[0];
                    const sha = c.sha.slice(0, 7);
                    const author = (c.commit.author && c.commit.author.name) || (c.author && c.author.login) || 'unknown';
                    const iso = c.commit.author.date;
                    const dateFull = new Date(iso).toLocaleString();
                    const message = (c.commit && c.commit.message) ? c.commit.message.split('\n')[0] : '';
                    const link = c.html_url;

                    // Set link with tooltip (commit message) and friendly text
                    const a = document.createElement('a');
                    a.href = link;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.title = message;
                    a.innerHTML = `Commit <strong>${sha}</strong> • ${author} • ${dateFull}`;
                    // clear existing and append
                    commitEl.innerHTML = '';
                    commitEl.appendChild(a);
                }
            })
            .catch(err => {
                // leave default link in place (view source link)
                console.debug('Could not load latest commit info', err);
            });
    }
});