const hamburger = document.querySelector('#hamburger')
const navMenu = document.getElementById('nav-menu')

hamburger.addEventListener('click', function(){
    hamburger.classList.toggle('hamburger-active')
    navMenu.classList.toggle('hidden')

})

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
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
    });
    
});


// document.addEventListener('DOMContentLoaded', function() {
//     const parallaxBg = document.querySelector('#clients');
    
//     window.addEventListener('scroll', function() {
//         const scrollY = window.scrollY;
//         parallaxBg.style.transform = `translate3d(0, ${-scrollY * 0.5}px, 0)`;
//     });
// });
