// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

// Parallax effect for hero
function handleParallax() {
    const heroBg = document.querySelector(".hero-bg");
    if (!heroBg) return;

    const scrolled = window.pageYOffset;
    heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
}

// Intersection Observer for fade-in animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in-section");
    fadeElements.forEach(el => observer.observe(el));
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize observers and effects
    initIntersectionObserver();
    initSmoothScroll();

    // Scroll events
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        handleParallax();
    });

    // Add load animation to hero content
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 100);
});

// Prevent right-click on images (optional protection)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Page transition effect
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});
