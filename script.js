// ========================================
// Slice Game - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarScroll();
    initButtonEffects();
    initGameCards();
    initSmoothScroll();
});

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate sections on scroll
    const animatedElements = document.querySelectorAll('.game-card, .news-card, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 14, 39, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 14, 39, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// Button Effects
// ========================================
function initButtonEffects() {
    const playButtons = document.querySelectorAll('.btn-play');
    const wishlistButton = document.querySelector('.btn-wishlist');

    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            createRipple(e, button);

            // Simulate game launch
            setTimeout(() => {
                showNotification('게임을 준비하고 있습니다...', 'info');
            }, 300);
        });
    });

    if (wishlistButton) {
        wishlistButton.addEventListener('click', (e) => {
            e.preventDefault();
            createRipple(e, wishlistButton);

            setTimeout(() => {
                showNotification('위시리스트에 추가되었습니다!', 'success');
                wishlistButton.innerHTML = '✓ 위시리스트에 추가됨';
                wishlistButton.style.background = 'rgba(0, 240, 255, 0.2)';
                wishlistButton.style.borderColor = 'var(--primary-color)';
                wishlistButton.style.color = 'var(--primary-color)';
            }, 300);
        });
    }
}

// ========================================
// Ripple Effect
// ========================================
function createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-animation 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Game Cards Interactive Effects
// ========================================
function initGameCards() {
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });

        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) { // Only on desktop
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    const colors = {
        success: '#00ff87',
        error: '#ff006e',
        info: '#00f0ff'
    };

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(22, 33, 62, 0.95);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        border-left: 4px solid ${colors[type]};
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slide-in-right 0.3s ease-out;
        font-weight: 500;
        backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slide-out-right 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slide-in-right {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slide-out-right {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ========================================
// Parallax Effect for Hero Section
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 500);
    }
});

// ========================================
// Dynamic Grid Animation
// ========================================
function animateGridOverlay() {
    const grid = document.querySelector('.grid-overlay');
    if (!grid) return;

    let position = 0;
    setInterval(() => {
        position += 0.5;
        if (position >= 50) position = 0;
        grid.style.transform = `translate(${position}px, ${position}px)`;
    }, 50);
}

// ========================================
// Stats Counter Animation
// ========================================
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const text = element.textContent;

    // Skip if it's not a number
    if (isNaN(text.replace('+', ''))) return;

    const target = parseInt(text.replace('+', ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = text;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (text.includes('+') ? '+' : '');
        }
    }, 16);
}

// Initialize counter animation
setTimeout(animateCounters, 500);

// ========================================
// Console Easter Egg
// ========================================
console.log('%c🎮 Slice Game', 'color: #00f0ff; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to Slice Game! 🚀', 'color: #7b2ff7; font-size: 16px;');
console.log('%cInterested in joining our team? Contact us!', 'color: #00ff87; font-size: 14px;');

// ========================================
// Performance Monitoring
// ========================================
window.addEventListener('load', () => {
    if (window.performance) {
        const loadTime = window.performance.timing.domContentLoadedEventEnd -
                        window.performance.timing.navigationStart;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
    }
});
