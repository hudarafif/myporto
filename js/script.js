const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');

});
// navbar auto nutup
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('hamburger-active'); // balikin ikon jadi burger
    navMenu.classList.add('hidden'); // sembunyiin menu
  });
});

window.onscroll = function(){
    const header = document.querySelector('header')
    const fixedNav = header.offsetTop;

    if(window.pageYOffset > fixedNav){
        header.classList.add('navbar-fixed')
    } else{
        header.classList.remove('navbar-fixed')
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const scrollToTop = document.getElementById('to-top');

    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            scrollToTop.style.display = 'block';
        } else {
            scrollToTop.style.display = 'none';
        }
    });

    scrollToTop.addEventListener('click', function() {
        // Smooth scrolling
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
});

const form = document.getElementById('contact-form');

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



const refreshBtn = document.getElementById("refresh-btn");

async function loadArticles() {
  try {
    const res = await fetch("https://dev.to/api/articles?tag=javascript");
    const articles = await res.json();

    const blogContainer = document.getElementById("blog-articles");
    blogContainer.innerHTML = "";

    articles.slice(0, 6).forEach(article => {
      blogContainer.innerHTML += `
        <div class="w-full px-4 lg:w-1/2 xl:w-1/3">
          <div class="bg-white dark:bg-slate-700 rounded-xl overflow-hidden shadow-lg mb-10">
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
      `;
    });
  } catch (err) {
    console.error("❌ Gagal ambil artikel:", err);
  }
}

// Load pertama
loadArticles();

// Timer: setelah 5 menit, munculin tombol refresh
setTimeout(() => {
  refreshBtn.classList.remove("hidden");
}, 60000); // 300000 ms = 5 menit

// Klik tombol refresh → reload artikel & sembunyiin lagi tombolnya
refreshBtn.addEventListener("click", () => {
  loadArticles();
  refreshBtn.classList.add("hidden");

  // Timer lagi setelah 5 menit
  setTimeout(() => {
    refreshBtn.classList.remove("hidden");
  }, 60000);
});

  // Hero animasi pas load
  window.addEventListener("load", () => {
    const hero = document.getElementById("hero-container");
    hero.classList.remove("opacity-0", "translate-y-60");
    hero.classList.add("opacity-100", "translate-y-0");
  });

 document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(SplitText), 
  gsap.registerPlugin(ScrollTrigger);
let split = SplitText.create(".hero-paragraph", { type: "chars, words, lines" });
  gsap.from(split.chars, {
  y: 100,
  autoAlpha: 0,
  stagger: 0.05
  });
let spin = gsap.to(".img", {
  scrollTrigger: {
    trigger: "#about",
    start: "top center",
    end: "+=600",
    scrub: 1,
    markers: false,
  },
  rotation: 360, 
  ease: "none",
});
});

gsap.from("#home h1", { y: 60, opacity: 0, duration: 1, ease: "power3.out" });
gsap.from("#home p", { y: 40, opacity: 0, delay: 0.3, duration: 1, ease: "power2.out" });
// gsap.from("#home a", { y: 30, opacity: 0, delay: 0.6, duration: 1, ease: "power2.out" });

document.addEventListener("DOMContentLoaded", () => {
    const texts = gsap.utils.toArray("#text-rotate span");
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
        delay: 1.5
      }, "+=0.2");
    });
  });

// gsap.from("#stack img", {
//   scrollTrigger: "#stack",
//   y: 50,
//   opacity: 0,
//   duration: 2,
//   stagger: 0.5,
//   ease: "power3.out"
// });
