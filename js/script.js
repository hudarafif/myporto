const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');

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
    const scrollToTop = document.getElementById('scrollToTop');

    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
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

const marquee = document.querySelector("#logo-marquee");
  let lastScrollX = 0;

  window.addEventListener("wheel", (e) => {
    if (e.deltaX > 0) {
      // user scroll kanan
      marquee.classList.remove("animate-marquee");
      marquee.classList.add("animate-marquee-reverse");
    } else if (e.deltaX < 0) {
      // user scroll kiri
      marquee.classList.remove("animate-marquee-reverse");
      marquee.classList.add("animate-marquee");
    }
  }, { passive: true });

// document.addEventListener('DOMContentLoaded', function() {
//     const parallaxBg = document.querySelector('#clients');
    
//     window.addEventListener('scroll', function() {
//         const scrollY = window.scrollY;
//         parallaxBg.style.transform = `translate3d(0, ${-scrollY * 0.5}px, 0)`;
//     });
// });

async function loadArticles() {
  try {
    const res = await fetch("https://dev.to/api/articles?tag=javascript");
    const articles = await res.json();
    console.log("✅ Articles fetched:", articles); // cek di console

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

loadArticles();

