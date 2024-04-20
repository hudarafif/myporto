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

// document.addEventListener('DOMContentLoaded', function() {
//     const parallaxBg = document.querySelector('#clients');
    
//     window.addEventListener('scroll', function() {
//         const scrollY = window.scrollY;
//         parallaxBg.style.transform = `translate3d(0, ${-scrollY * 0.5}px, 0)`;
//     });
// });
