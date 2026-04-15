// Hamburger Menu Logic
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('mobile-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger-active');
        navMenu.classList.toggle('hidden');
    });
}

// Auto-close menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('hamburger-active');
        navMenu.classList.add('hidden');
    });
});

// Scroll to Top Logic
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTop = document.getElementById('to-top');
    if (!scrollToTop) return;

    let isTicking = false;
    const toggleScrollTopVisibility = () => {
        if (window.scrollY > 500) {
            scrollToTop.style.display = 'block';
        } else {
            scrollToTop.style.display = 'none';
        }
        isTicking = false;
    };

    window.addEventListener('scroll', function() {
        if (!isTicking) {
            window.requestAnimationFrame(toggleScrollTopVisibility);
            isTicking = true;
        }
    }, { passive: true });

    scrollToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Contact Form (EmailJS)
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        emailjs.sendForm('service_92to05c', 'template_dt1wm5o', this)
            .then(() => {
                alert('Message sent successfully!');
                form.reset();
            }, (err) => {
                alert('Oops! Something went wrong...', err);
            });
    });
}

// Blog Articles from API
const refreshBtn = document.getElementById("refresh-btn");

async function loadArticles() {
    try {
        const res = await fetch("https://dev.to/api/articles?tag=javascript");
        const articles = await res.json();
        const blogContainer = document.getElementById("blog-articles");
        
        if (!blogContainer) return;
        const html = articles.slice(0, 6).map(article => `
            <div class="w-full px-4 lg:w-1/2 xl:w-1/3 blog-card">
              <div class="bg-white dark:bg-slate-700 rounded-xl overflow-hidden shadow-lg mb-10 transform transition duration-300 hover:shadow-2xl">
                <img src="${article.social_image}" alt="${article.title}" class="w-full">
                <div class="py-8 px-6">
                  <h3>
                    <a href="${article.url}" target="_blank"
                       class="block mb-3 font-semibold text-slate-900 dark:text-white text-xl hover:text-purple-600 truncate">
                       ${article.title}
                    </a>
                  </h3>
                  <p class="font-medium text-base text-slate-500 mb-6">
                    ${article.description || "No description available."}
                  </p>
                  <a href="${article.url}" target="_blank"
                     class="font-medium text-sm text-white bg-purple-600 py-2 px-4 rounded-lg hover:opacity-80">
                     Read More
                  </a>
                </div>
              </div>
            </div>
          `
        ).join("");

        blogContainer.innerHTML = html;

        // Animate new cards
        gsap.from(".blog-card", {
            scrollTrigger: "#blog",
            y: 50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        });

    } catch (err) {
        console.error("❌ Gagal ambil artikel:", err);
    }
}

/**
 * Projects from JSON
 */
async function loadProjects() {
    try {
        const res = await fetch("data/projects.json");
        const projects = await res.json();
        const portfolioContainer = document.getElementById("portfolio-grid");
        
        if (!portfolioContainer) return;
        portfolioContainer.innerHTML = "";

        const html = projects.map(project => `
            <div class="project-card rounded-lg shadow-md overflow-hidden bg-white dark:bg-slate-700 max-w-sm mx-auto flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div class="overflow-hidden">
                <img src="${project.image}" alt="${project.title}"
                  class="w-full h-48 object-cover transition duration-300 hover:scale-110" loading="lazy">
              </div>
              <div class="p-4 flex flex-col flex-1">
                <h3 class="font-semibold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">${project.title}</h3>
                <p class="text-slate-500 text-sm line-clamp-3">${project.description}</p>
                <div class="mt-4 flex justify-end">
                  <a href="${project.link}" target="_blank"
                    class="inline-flex items-center gap-2 font-medium text-sm text-white bg-slate-600 py-2 px-4 rounded-md hover:opacity-80">
                    <img src="./dist/img/clients/icons8-info.svg" alt="details-icon" class="inline-block ml-2 h-4 w-4">
                    <span>Details</span>
                  </a>
                </div>
              </div>
            </div>
        `).join("");

        portfolioContainer.innerHTML = html;

        // Re-run animation for new cards
        gsap.from(".project-card", {
            scrollTrigger: {
                trigger: "#portfolio-grid",
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        });

    } catch (err) {
        console.error("❌ Gagal ambil project:", err);
    }
}

// Initialize Content
async function init() {
    // Prioritaskan portfolio lokal agar section ini tampil lebih cepat
    await loadProjects();
    // Ambil artikel setelah render utama selesai agar initial paint lebih ringan
    setTimeout(() => {
        loadArticles();
    }, 100);
}

init();

if (refreshBtn) {
    setTimeout(() => refreshBtn.classList.remove("hidden"), 60000);
    refreshBtn.addEventListener("click", () => {
        loadArticles();
        refreshBtn.classList.add("hidden");
    });
}

/**
 * GSAP ANIMATIONS
 */
document.addEventListener("DOMContentLoaded", () => {
    // Register Plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Navbar Animation
    gsap.from("#header", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    });

    // 2. Hero Section Entrance
    const heroTl = gsap.timeline();
    heroTl.from("#home div.z-10 > div", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    })
    .from("#home p.font-porto", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.6")
    .from("#home p.text-lg", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from("#home button", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.6");

    // 3. Text Rotation Animation
    const texts = gsap.utils.toArray("#text-rotate span");
    if (texts.length > 0) {
        let tl = gsap.timeline({ repeat: -1 });
        texts.forEach((text, i) => {
            tl.to(text, {
                duration: 0.8,
                y: "0%",
                opacity: 1,
                ease: "power3.out"
            })
            .to(text, {
                duration: 0.8,
                y: "-100%",
                opacity: 0,
                ease: "power3.in",
                delay: 2
            }, "+=0.2");
        });
    }

    // 4. Section Reveals (Staggered)
    // Portfolio dikecualikan agar tidak bentrok dengan animasi kartu project sendiri.
    const sections = ["#about", "#stack", "#blog", "#contact"];
    sections.forEach(section => {
        gsap.from(`${section} .container > div`, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            ease: "power3.out"
        });
    });

    // 5. Portfolio Cards Stagger (Handled in loadProjects)

    // 6. Tech Stack Floating Animation
    // Tunda animasi infinite sampai section stack terlihat.
    if (!prefersReducedMotion) {
        gsap.utils.toArray("#stack .group").forEach((icon, i) => {
            gsap.to(icon, {
                y: -10,
                repeat: -1,
                yoyo: true,
                duration: 2 + Math.random(),
                ease: "sine.inOut",
                delay: i * 0.2,
                scrollTrigger: {
                    trigger: "#stack",
                    start: "top 85%",
                    toggleActions: "play pause play pause"
                }
            });
        });
    }

    // 7. Parallax Background effect for Hero
    if (!prefersReducedMotion) {
        gsap.to("#home", {
            scrollTrigger: {
                trigger: "#home",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            backgroundPositionY: "50%"
        });
    }
});
