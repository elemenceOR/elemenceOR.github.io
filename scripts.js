document.addEventListener('DOMContentLoaded', () => {
    let menu = document.querySelector('#menu-icon');
    let navlist = document.querySelector('.navlist');

    // Improve menu toggle
    menu.addEventListener('click', () => {
        menu.classList.toggle('bx-x');
        navlist.classList.toggle('active');
    });

    // Close menu when a nav item is clicked
    document.querySelectorAll('.navlist a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('bx-x');
            navlist.classList.remove('active');
        });
    });

    // Close menu on scroll (existing behavior)
    window.addEventListener('scroll', () => {
        menu.classList.remove('bx-x');
        navlist.classList.remove('active');
    });

    // ScrollReveal configuration
    const sr = ScrollReveal({
        distance: '40px',
        duration: 2600,
        reset: true,
        mobile: true // Ensure animations work on mobile
    });

    sr.reveal('.home-text', {delay: 300, origin: 'bottom'});
    sr.reveal('.about, .service, .projects, .contact', {delay: 100, origin: 'bottom'});
});