// Clean version of main.js for Connect Line website

// Initialize AOS library
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });
}

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// Header scroll behavior
let lastScroll = 0;
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Mobile menu
function initMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mainNav = document.querySelector('.main-nav');
    
    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }
}

// Partners Filter
class PartnersFilter {
    constructor() {
        this.categoryButtons = document.querySelectorAll('.partner-category');
        this.partnerCards = document.querySelectorAll('.partner-card');
        
        if (!this.categoryButtons.length || !this.partnerCards.length) return;
        
        this.init();
    }
    
    init() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const category = button.textContent.trim();
                this.filterCards(category);
            });
        });
    }
    
    filterCards(category) {
        this.partnerCards.forEach(card => {
            if (category === 'Всі') {
                card.style.display = '';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
            } else {
                const cardCategory = card.dataset.category;
                if (cardCategory === category) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    }
}

// Technologies Filter
class TechnologiesFilter {
    constructor() {
        this.categoryButtons = document.querySelectorAll('.tech-category');
        this.techCards = document.querySelectorAll('.tech-card');
        
        if (!this.categoryButtons.length || !this.techCards.length) return;
        
        this.init();
    }
    
    init() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const category = button.dataset.category;
                this.filterCards(category);
            });
        });
    }
    
    filterCards(category) {
        this.techCards.forEach(card => {
            if (category === 'all') {
                card.style.display = '';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                const cardCategory = card.dataset.category;
                if (cardCategory === category) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    }
}

// Testimonials Slider
class TestimonialsSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials-slider');
        this.items = document.querySelectorAll('.testimonial-item');
        this.dots = document.querySelectorAll('.testimonials-dots .dot');
        this.prevBtn = document.querySelector('.nav-prev');
        this.nextBtn = document.querySelector('.nav-next');
        
        if (!this.items.length) return;
        
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play
        setInterval(() => this.nextSlide(), 5000);
    }
    
    goToSlide(index) {
        this.items.forEach(item => item.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        this.items[index].classList.add('active');
        this.dots[index].classList.add('active');
        
        this.currentIndex = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goToSlide(prevIndex);
    }
}

// Achievement counters
function initAchievementCounters() {
    const counters = document.querySelectorAll('.achievement-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.closest('.achievement-item').dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Відправляється...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert('Повідомлення надіслано! Ми зв\'яжемося з вами найближчим часом.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        }
    });
}

// Дополнительные утилиты для Connect Line
function addSmoothScrolling() {
    // Плавная прокрутка для всех ссылок якорей
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

// Добавить эффекты появления для элементов
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Наблюдать за элементами
    document.querySelectorAll('.tech-card, .partner-card, .advantage-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initAchievementCounters();
    initContactForm();
    
    // Initialize classes
    new PartnersFilter();
    new TechnologiesFilter();
    new TestimonialsSlider();
    
    // Initialize utilities
    addSmoothScrolling();
    addScrollAnimations();
    
    console.log('Connect Line website initialized successfully!');
});
