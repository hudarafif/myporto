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
const PROJECTS_CACHE_KEY = "myporto_projects_cache_v1";
const INITIAL_PORTFOLIO_LIMIT = 6;
const PORTFOLIO_STEP = 3;
const MOBILE_MEDIA_QUERY = window.matchMedia("(max-width: 767px)");
const portfolioState = {
    projects: [],
    visibleCount: INITIAL_PORTFOLIO_LIMIT,
    selectedCategory: "All",
    swiperInstance: null,
    isMobileSlider: MOBILE_MEDIA_QUERY.matches
};

function fetchJsonWithTimeout(url, timeoutMs = 8000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, { signal: controller.signal })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }
            return res.json();
        })
        .finally(() => clearTimeout(timeoutId));
}

function getProjectCategory(project) {
    return project.category || "Other";
}

function getFilteredProjects() {
    if (portfolioState.selectedCategory === "All") {
        return portfolioState.projects;
    }
    return portfolioState.projects.filter(
        (project) => getProjectCategory(project) === portfolioState.selectedCategory
    );
}

function buildProjectCard(project) {
    const category = getProjectCategory(project);
    return `
            <div class="project-card rounded-lg shadow-md overflow-hidden bg-white dark:bg-slate-700 max-w-sm mx-auto flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div class="overflow-hidden">
                <img src="${project.image}" alt="${project.title}"
                  class="w-full h-48 object-cover transition duration-300 hover:scale-110"
                  loading="lazy" decoding="async">
              </div>
              <div class="p-4 flex flex-col flex-1">
                <span class="inline-block mb-2 text-xs font-semibold text-purple-600 dark:text-purple-300">${category}</span>
                <h3 class="font-semibold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">${project.title}</h3>
                <p class="text-slate-500 text-sm line-clamp-3">${project.description}</p>
                <div class="mt-4 flex justify-end">
                  <a href="${project.link}" target="_blank"
                    class="inline-flex items-center gap-2 font-medium text-sm text-white bg-slate-600 py-2 px-4 rounded-md hover:opacity-80">
                    <img src="./dist/img/clients/icons8-info.svg" alt="details-icon" class="inline-block ml-2 h-4 w-4" loading="lazy" decoding="async">
                    <span>Details</span>
                  </a>
                </div>
              </div>
            </div>
        `;
}

function renderCategoryFilters() {
    const filterContainer = document.getElementById("portfolio-filters");
    if (!filterContainer) return;

    const categories = ["All", ...new Set(portfolioState.projects.map(getProjectCategory))];
    const chips = categories.map((category) => {
        const isActive = portfolioState.selectedCategory === category;
        const classes = isActive
            ? "bg-purple-600 text-white"
            : "bg-slate-700 text-slate-200 hover:bg-slate-600";
        return `<button type="button" data-category="${category}" class="portfolio-filter-chip ${classes} text-xs md:text-sm font-medium py-1.5 px-3 rounded-full transition">${category}</button>`;
    }).join("");

    filterContainer.innerHTML = chips;
}

function initOrUpdatePortfolioSwiper() {
    if (!portfolioState.isMobileSlider || !window.Swiper) return;
    const container = document.querySelector("#portfolio-grid.swiper");
    if (!container) return;

    if (portfolioState.swiperInstance) {
        portfolioState.swiperInstance.update();
        return;
    }

    portfolioState.swiperInstance = new Swiper("#portfolio-grid.swiper", {
        slidesPerView: 1.08,
        spaceBetween: 14,
        centeredSlides: false,
        pagination: {
            el: "#portfolio-mobile-pagination",
            clickable: true
        },
        breakpoints: {
            500: {
                slidesPerView: 1.2
            },
            640: {
                slidesPerView: 1.35
            }
        }
    });
}

function destroyPortfolioSwiper() {
    if (portfolioState.swiperInstance) {
        portfolioState.swiperInstance.destroy(true, true);
        portfolioState.swiperInstance = null;
    }
}

function updatePortfolioControls() {
    const loadMoreBtn = document.getElementById("portfolio-load-more");
    const showLessBtn = document.getElementById("portfolio-show-less");
    const mobilePagination = document.getElementById("portfolio-mobile-pagination");
    if (!loadMoreBtn || !showLessBtn) return;

    const total = getFilteredProjects().length;
    const visible = portfolioState.visibleCount;

    if (mobilePagination) {
        mobilePagination.classList.toggle("hidden", !portfolioState.isMobileSlider);
    }

    if (portfolioState.isMobileSlider) {
        loadMoreBtn.classList.add("hidden");
        showLessBtn.classList.add("hidden");
        return;
    }

    if (total <= INITIAL_PORTFOLIO_LIMIT) {
        loadMoreBtn.classList.add("hidden");
        showLessBtn.classList.add("hidden");
        return;
    }

    loadMoreBtn.classList.toggle("hidden", visible >= total);
    showLessBtn.classList.toggle("hidden", visible <= INITIAL_PORTFOLIO_LIMIT);
}

function renderProjects(animateNewCount = 0) {
    const portfolioContainer = document.getElementById("portfolio-grid");
    if (!portfolioContainer) return;

    const filteredProjects = getFilteredProjects();
    portfolioState.visibleCount = Math.min(portfolioState.visibleCount, Math.max(filteredProjects.length, INITIAL_PORTFOLIO_LIMIT));
    const visibleProjects = portfolioState.isMobileSlider
        ? filteredProjects
        : filteredProjects.slice(0, portfolioState.visibleCount);
    const html = visibleProjects.map(buildProjectCard).join("");

    if (portfolioState.isMobileSlider) {
        destroyPortfolioSwiper();
        portfolioContainer.className = "swiper xl:w-10/12 xl:mx-auto px-4";
        portfolioContainer.style.minHeight = "";
        portfolioContainer.innerHTML = `
            <div class="swiper-wrapper">
                ${visibleProjects.map(project => `<div class="swiper-slide">${buildProjectCard(project)}</div>`).join("")}
            </div>
        `;
    } else {
        destroyPortfolioSwiper();
        portfolioContainer.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:w-10/12 xl:mx-auto px-4";
        portfolioContainer.style.minHeight = "400px";
        portfolioContainer.innerHTML = html;
    }

    renderCategoryFilters();
    updatePortfolioControls();
    initOrUpdatePortfolioSwiper();

    if (portfolioState.isMobileSlider) {
        return;
    }

    if (animateNewCount > 0 && window.gsap) {
        const cards = portfolioContainer.querySelectorAll(".project-card");
        const start = Math.max(0, cards.length - animateNewCount);
        const newCards = Array.from(cards).slice(start);
        gsap.from(newCards, {
            y: 18,
            opacity: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: "power2.out",
            immediateRender: false
        });
        return;
    }

    if (!window.gsap || !window.ScrollTrigger) return;
    ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars && trigger.vars.id === "portfolio-cards") {
            trigger.kill();
        }
    });
    gsap.killTweensOf(".project-card");
    gsap.set(".project-card", { opacity: 1, y: 0 });
    gsap.from(".project-card", {
        scrollTrigger: {
            id: "portfolio-cards",
            trigger: "#portfolio-grid",
            start: "top 85%",
            once: true,
        },
        y: 24,
        opacity: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: "power2.out",
        immediateRender: false,
        overwrite: "auto",
        onComplete: () => gsap.set(".project-card", { clearProps: "opacity,transform" })
    });
}

function bindPortfolioControls() {
    const loadMoreBtn = document.getElementById("portfolio-load-more");
    const showLessBtn = document.getElementById("portfolio-show-less");
    const filterContainer = document.getElementById("portfolio-filters");
    if (!loadMoreBtn || !showLessBtn || !filterContainer) return;

    loadMoreBtn.addEventListener("click", () => {
        const previousVisible = portfolioState.visibleCount;
        const totalFiltered = getFilteredProjects().length;
        portfolioState.visibleCount = Math.min(
            portfolioState.visibleCount + PORTFOLIO_STEP,
            totalFiltered
        );
        const newlyAdded = portfolioState.visibleCount - previousVisible;
        renderProjects(newlyAdded);
    });

    showLessBtn.addEventListener("click", () => {
        portfolioState.visibleCount = Math.min(INITIAL_PORTFOLIO_LIMIT, portfolioState.projects.length);
        renderProjects(0);
        const portfolioSection = document.getElementById("portfolio");
        if (portfolioSection) {
            portfolioSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    filterContainer.addEventListener("click", (event) => {
        const target = event.target.closest(".portfolio-filter-chip");
        if (!target) return;
        const nextCategory = target.getAttribute("data-category");
        if (!nextCategory) return;

        portfolioState.selectedCategory = nextCategory;
        portfolioState.visibleCount = INITIAL_PORTFOLIO_LIMIT;
        renderProjects(0);
    });

    const handleViewportChange = (event) => {
        portfolioState.isMobileSlider = event.matches;
        portfolioState.visibleCount = INITIAL_PORTFOLIO_LIMIT;
        renderProjects(0);
    };

    if (typeof MOBILE_MEDIA_QUERY.addEventListener === "function") {
        MOBILE_MEDIA_QUERY.addEventListener("change", handleViewportChange);
    } else if (typeof MOBILE_MEDIA_QUERY.addListener === "function") {
        MOBILE_MEDIA_QUERY.addListener(handleViewportChange);
    }
}

async function loadArticles() {
    try {
        const articles = await fetchJsonWithTimeout("https://dev.to/api/articles?tag=javascript", 7000);
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
        if (window.gsap) {
            gsap.from(".blog-card", {
                scrollTrigger: "#blog",
                y: 50,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });
        }

    } catch (err) {
        console.error("❌ Gagal ambil artikel:", err);
    }
}

/**
 * Projects from JSON
 */
async function loadProjects() {
    const portfolioContainer = document.getElementById("portfolio-grid");
    if (!portfolioContainer) return;

    // Instant first paint from local cache (if available).
    const cached = localStorage.getItem(PROJECTS_CACHE_KEY);
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
                portfolioState.projects = parsed.map((project) => ({
                    ...project,
                    category: project.category || "Web"
                }));
                if (!["All", ...new Set(portfolioState.projects.map(getProjectCategory))].includes(portfolioState.selectedCategory)) {
                    portfolioState.selectedCategory = "All";
                }
                portfolioState.visibleCount = Math.min(INITIAL_PORTFOLIO_LIMIT, parsed.length);
                renderProjects(0);
            }
        } catch (err) {
            console.warn("Invalid cached projects data:", err);
        }
    }

    try {
        const projects = await fetchJsonWithTimeout("data/projects.json", 6000);
        if (!Array.isArray(projects)) {
            throw new Error("Invalid projects format");
        }

        portfolioState.projects = projects.map((project) => ({
            ...project,
            category: project.category || "Web"
        }));
        if (!["All", ...new Set(portfolioState.projects.map(getProjectCategory))].includes(portfolioState.selectedCategory)) {
            portfolioState.selectedCategory = "All";
        }
        portfolioState.visibleCount = Math.min(INITIAL_PORTFOLIO_LIMIT, projects.length);
        renderProjects(0);
        localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(portfolioState.projects));
    } catch (err) {
        console.error("❌ Gagal ambil project:", err);
        if (!cached) {
            portfolioContainer.innerHTML = `
                <div class="col-span-full text-center py-20 opacity-70">
                    Failed to load projects. Please refresh the page.
                </div>
            `;
        }
    }
}

// Initialize Content
async function init() {
    bindPortfolioControls();
    // Prioritaskan portfolio lokal agar section ini tampil lebih cepat
    loadProjects();
    // Ambil artikel setelah render utama selesai agar initial paint lebih ringan
    setTimeout(() => {
        loadArticles();
    }, 300);
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
    if (!window.gsap || !window.ScrollTrigger || !window.TextPlugin) {
        return;
    }

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
