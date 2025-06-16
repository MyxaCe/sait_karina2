// Инициализация библиотеки анимаций
AOS.init({
    duration: 800,
    offset: 100,
    once: true
});

// Кастомный курсор
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    if (cursor && cursorFollower) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    }
});

// Эффект при наведении на кнопки и ссылки
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        if (cursor && cursorFollower) {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        }
    });
    
    element.addEventListener('mouseleave', () => {
        if (cursor && cursorFollower) {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        }
    });
});

// Магнитный эффект для кнопок
document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// Класс для анимации счетчиков
class CounterAnimation {
    constructor(element, targetNumber, duration = 2000) {
        this.element = element;
        this.targetNumber = targetNumber;
        this.duration = duration;
        this.startTime = null;
        this.currentNumber = 0;
    }

    animate(currentTime) {
        if (!this.startTime) this.startTime = currentTime;
        const progress = (currentTime - this.startTime) / this.duration;

        if (progress < 1) {
            this.currentNumber = Math.floor(this.targetNumber * progress);
            this.element.textContent = this.currentNumber;
            requestAnimationFrame(this.animate.bind(this));
        } else {
            this.element.textContent = this.targetNumber;
        }
    }

    start() {
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Инициализация счетчиков достижений
function initAchievementCounters() {
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.achievement-number');
                counters.forEach(counter => {
                    const targetNumber = parseInt(counter.closest('.achievement-item').dataset.count);
                    new CounterAnimation(counter, targetNumber).start();
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.3
    });

    const achievementsSection = document.querySelector('.achievements');
    if (achievementsSection) {
        observer.observe(achievementsSection);
    }
}

// Класс для слайдера отзывов
class TestimonialsSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials-wrapper');
        this.slides = document.querySelectorAll('.testimonial-item');
        this.prevBtn = document.querySelector('.nav-prev');
        this.nextBtn = document.querySelector('.nav-next');
        this.dots = document.querySelectorAll('.testimonials-dots .dot');
        this.currentSlide = 0;
        this.slidesLength = this.slides.length;
        this.autoplayInterval = null;
        
        if (!this.slider || !this.slides.length) return;
        
        this.init();
    }
    
    init() {
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
        }
        
        if (this.dots.length > 0) {
            this.dots[0].classList.add('active');
        }
        
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.slide('prev'));
            this.nextBtn.addEventListener('click', () => this.slide('next'));
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Автоматическая прокрутка
        this.startAutoplay();
        
        // Остановка автопрокрутки при наведении
        if (this.slider && this.slider.parentElement) {
            this.slider.parentElement.addEventListener('mouseenter', () => this.stopAutoplay());
            this.slider.parentElement.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.slide('next'), 5000);
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
    
    slide(direction) {
        // Убираем активный класс с текущего слайда и точки
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }
        
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.remove('active');
        }
        
        // Вычисляем новый индекс слайда
        if (direction === 'next') {
            this.currentSlide = (this.currentSlide + 1) % this.slidesLength;
        } else {
            this.currentSlide = (this.currentSlide - 1 + this.slidesLength) % this.slidesLength;
        }
        
        // Добавляем активный класс новому слайду и точке
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.add('active');
        }
    }
    
    goToSlide(index) {
        if (index === this.currentSlide) return;
        
        // Убираем активный класс с текущего слайда и точки
        if (this.slides[this.currentSlide] && this.dots[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');
        }
        
        // Устанавливаем новый индекс
        this.currentSlide = index;
        
        // Добавляем активный класс новому слайду и точке
        if (this.slides[this.currentSlide] && this.dots[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
        }
        
        // Сбрасываем автопрокрутку
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Класс для слайдера партнеров
class PartnersSlider {
    constructor() {
        this.slider = document.querySelector('.partners-slider');
        this.slides = document.querySelectorAll('.partner-item');
        this.slidesContainer = document.querySelector('.partners-slider-container');
        this.prevBtn = document.querySelector('.partners-prev');
        this.nextBtn = document.querySelector('.partners-next');
        this.currentPosition = 0;
        this.slideWidth = 0;
        this.visibleSlides = 5; // Количество видимых слайдов на десктопе
        this.autoplayInterval = null;
        
        if (!this.slider || !this.slides.length) return;
        
        this.init();
        this.setupResponsive();
    }
    
    init() {
        if (this.slides.length <= 0) return;
        
        // Вычисляем ширину слайда
        this.calculateSlideWidth();
        
        // Обработчики для кнопок навигации
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => this.slide('prev'));
            this.nextBtn.addEventListener('click', () => this.slide('next'));
        }
        
        // Автоматическая прокрутка
        this.startAutoplay();
        
        // Остановка автопрокрутки при наведении
        if (this.slider) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
            this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            this.calculateSlideWidth();
            this.setupResponsive();
            this.updateSliderPosition();
        });
    }
    
    calculateSlideWidth() {
        if (this.slides.length <= 0) return;
        
        // Получаем ширину контейнера
        const containerWidth = this.slider.clientWidth;
        
        // Определяем, сколько слайдов показывать в зависимости от ширины экрана
        if (window.innerWidth < 576) {
            this.visibleSlides = 1;
        } else if (window.innerWidth < 768) {
            this.visibleSlides = 2;
        } else if (window.innerWidth < 992) {
            this.visibleSlides = 3;
        } else if (window.innerWidth < 1200) {
            this.visibleSlides = 4;
        } else {
            this.visibleSlides = 5;
        }
        
        // Вычисляем ширину одного слайда
        this.slideWidth = containerWidth / this.visibleSlides;
        
        // Устанавливаем ширину для каждого слайда
        this.slides.forEach(slide => {
            slide.style.width = `${this.slideWidth}px`;
        });
    }
    
    setupResponsive() {
        // Адаптивность в зависимости от размера экрана
        if (window.innerWidth < 576) {
            this.visibleSlides = 1;
        } else if (window.innerWidth < 768) {
            this.visibleSlides = 2;
        } else if (window.innerWidth < 992) {
            this.visibleSlides = 3;
        } else if (window.innerWidth < 1200) {
            this.visibleSlides = 4;
        } else {
            this.visibleSlides = 5;
        }
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.slide('next'), 3000);
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
    
    slide(direction) {
        const maxPosition = this.slides.length * this.slideWidth - this.slider.clientWidth;
        
        if (direction === 'next') {
            this.currentPosition += this.slideWidth;
            
            // Если дошли до конца - возвращаемся в начало
            if (this.currentPosition > maxPosition) {
                this.currentPosition = 0;
            }
        } else {
            this.currentPosition -= this.slideWidth;
            
            // Если дошли до начала - переходим в конец
            if (this.currentPosition < 0) {
                this.currentPosition = maxPosition;
            }
        }
        
        this.updateSliderPosition();
    }
    
    updateSliderPosition() {
        if (this.slidesContainer) {
            this.slidesContainer.style.transform = `translateX(-${this.currentPosition}px)`;
        }
    }
}

// Класс для фильтрации партнеров
class PartnersFilter {
    constructor() {
        this.categoryButtons = document.querySelectorAll('.partner-category');
        this.partnerCards = document.querySelectorAll('.partner-card');
        
        if (!this.categoryButtons.length || !this.partnerCards.length) return;
        
        this.init();
    }
    
    init() {
        // Добавляем обработчики событий для кнопок фильтрации
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс со всех кнопок
                this.categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Добавляем активный класс текущей кнопке
                button.classList.add('active');
                
                // Фильтруем карточки
                const category = button.textContent.trim();
                this.filterCards(category);
            });
        });
    }
    
    filterCards(category) {
        this.partnerCards.forEach(card => {
            // Сначала показываем все карточки с анимацией
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

// Класс для фильтрации технологий
class TechnologiesFilter {
    constructor() {
        this.categoryButtons = document.querySelectorAll('.tech-category');
        this.techCards = document.querySelectorAll('.tech-card');
        
        if (!this.categoryButtons.length || !this.techCards.length) return;
        
        this.init();
    }
    
    init() {
        // Добавляем обработчики событий для кнопок фильтрации
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс со всех кнопок
                this.categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Добавляем активный класс текущей кнопке
                button.classList.add('active');
                
                // Фильтруем карточки
                const category = button.dataset.category;
                this.filterCards(category);
            });
        });
    }
    
    filterCards(category) {
        this.techCards.forEach(card => {
            // Сначала показываем все карточки с анимацией
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

// Класс для управления переводами
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'uk';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations(this.currentLang);
        this.updateLanguageSwitch();
        this.translatePage();

        document.querySelectorAll('.lang-switch a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }    async loadTranslations(lang) {
        try {
            // Простые встроенные переводы для избежания CORS проблем
            if (lang === 'uk') {
                this.translations = {
                    "nav": {
                        "home": "Головна",
                        "advantages": "Переваги", 
                        "services": "Послуги",
                        "technologies": "Технології",
                        "workflow": "Як ми працюємо",
                        "testimonials": "Відгуки",
                        "contacts": "Контакти"
                    }
                };
            } else {
                this.translations = {
                    "nav": {
                        "home": "Home",
                        "advantages": "Advantages",
                        "services": "Services", 
                        "technologies": "Technologies",
                        "workflow": "How we work",
                        "testimonials": "Testimonials",
                        "contacts": "Contacts"
                    }
                };
            }
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            // Загружаем резервные переводы
            this.translations = {
                "nav": {
                    "home": "Головна",
                    "advantages": "Переваги",
                    "services": "Послуги",
                    "workflow": "Як ми працюємо",
                    "testimonials": "Відгуки",
                    "contacts": "Контакти"
                }
                // ... добавьте другие переводы по умолчанию
            };
        }
    }

    async switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        await this.loadTranslations(lang);
        this.updateLanguageSwitch();
        this.translatePage();
    }

    updateLanguageSwitch() {
        const langCurrent = document.querySelector('.lang-current');
        if (langCurrent) {
            langCurrent.textContent = this.currentLang.toUpperCase() + ' ';
            const arrow = document.createElement('span');
            arrow.className = 'arrow-down';
            langCurrent.appendChild(arrow);
        }

        document.querySelectorAll('.lang-switch a').forEach(link => {
            if (link.getAttribute('data-lang') === this.currentLang) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    translatePage() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    getTranslation(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], this.translations);
    }
}

// Инициализация наблюдателя за анимациями при скролле
function initAnimationObserver() {
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.advantage-card, .achievement-item, .testimonial-item, .service-card, .workflow-step, .partner-item')
        .forEach(element => {
            element.classList.add('animate-ready');
            animateOnScroll.observe(element);
        });
}

// Улучшенные эффекты при наведении на элементы
function initHoverEffects() {
    document.querySelectorAll('.btn, .advantage-card, .achievement-item, .service-card, .partner-item')
        .forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                element.style.setProperty('--mouse-x', `${x}px`);
                element.style.setProperty('--mouse-y', `${y}px`);
            });
        });
}

// Инициализация мобильного меню
function initMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    let isMenuOpen = false;
    
    if (!burgerMenu || !mainNav) return;
    
    burgerMenu.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        // Переключение навигации
        mainNav.style.display = isMenuOpen ? 'block' : 'none';
        
        // Анимация бургер-меню
        const spans = burgerMenu.querySelectorAll('span');
        if (spans && spans.length >= 3) {
            spans[0].style.transform = isMenuOpen ? 'rotate(45deg) translate(8px, 8px)' : '';
            spans[1].style.opacity = isMenuOpen ? '0' : '1';
            spans[2].style.transform = isMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : '';
        }
        
        // Запрет скролла при открытом меню на мобильном
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });
    
    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                burgerMenu.click();
            }
        });
    });
}

// Параллакс эффект для hero секции с анимированными кругами
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const circles = document.querySelectorAll('.circle');
    
    if (!hero || !circles.length) return;
    
    // Эффект при движении мыши
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = hero.getBoundingClientRect();
        
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        
        circles.forEach((circle, index) => {
            const speed = (index + 1) * 20;
            const xPos = x * speed;
            const yPos = y * speed;
            circle.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    });
    
    // Эффект при скролле
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        circles.forEach((circle, index) => {
            const speed = (index + 1) * 0.2;
            circle.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// Инициализация языкового переключателя
function initLangSwitcher() {
    const langSwitch = document.querySelector('.lang-switch');
    const langCurrent = langSwitch ? langSwitch.querySelector('.lang-current') : null;
    const langList = langSwitch ? langSwitch.querySelector('.lang-list') : null;
    
    if (!langSwitch || !langCurrent || !langList) return;
    
    langCurrent.addEventListener('click', (e) => {
        e.stopPropagation();
        langList.style.display = langList.style.display === 'block' ? 'none' : 'block';
    });
    
    document.addEventListener('click', () => {
        if (langList) langList.style.display = 'none';
    });
    
    const langLinks = langList.querySelectorAll('a');
    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Обновление активного языка
            langLinks.forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            // Обновление текста кнопки
            const newLang = link.textContent.trim();
            langCurrent.textContent = newLang + ' ';
            
            // Добавление стрелки
            const arrow = document.createElement('span');
            arrow.className = 'arrow-down';
            langCurrent.appendChild(arrow);
            
            // Скрытие списка
            langList.style.display = 'none';
        });
    });
}

// Прелоадер
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (!preloader) return;

    // Функция скрытия прелоадера
    const hidePreloader = () => {
        preloader.classList.add('hidden');
        document.body.style.overflow = ''; // Разблокируем скролл
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    };

    // Блокируем скролл пока отображается прелоадер
    document.body.style.overflow = 'hidden';

    // Массив промисов для отслеживания загрузки
    const loadPromises = [
        // Ждем загрузку DOM
        new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        }),
        // Ждем загрузку изображений
        new Promise(resolve => {
            const images = document.querySelectorAll('img');
            let loadedImages = 0;
            
            if (images.length === 0) resolve();
            
            images.forEach(img => {
                if (img.complete) {
                    loadedImages++;
                    if (loadedImages === images.length) resolve();
                } else {
                    img.addEventListener('load', () => {
                        loadedImages++;
                        if (loadedImages === images.length) resolve();
                    });
                    img.addEventListener('error', () => {
                        loadedImages++;
                        if (loadedImages === images.length) resolve();
                    });
                }
            });
        })
    ];

    // Ждем выполнения всех промисов
    Promise.all(loadPromises)
        .then(hidePreloader)
        .catch(hidePreloader);

    // Страховка - скрываем прелоадер через 5 секунд в любом случае
    setTimeout(hidePreloader, 5000);
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация прелоадера
    initPreloader();
    
    // Инициализация менеджера переводов
    const languageManager = new LanguageManager();
      // Инициализация particles.js для hero секции (если элемент существует)
    const particlesContainer = document.getElementById('particles-js');
    if (typeof particlesJS !== 'undefined' && particlesContainer) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#1A54D9'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.1,
                    random: false,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#1A54D9',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.3
                        }
                    },
                    push: {
                        particles_nb: 3
                    }
                }
            },
            retina_detect: true
        });
    }

    // Остальные инициализации
    new TestimonialsSlider();
    new PartnersSlider();
    new PartnersFilter();
    new TechnologiesFilter();
    initAchievementCounters();
    initAnimationObserver();
    initHoverEffects();
    initMobileMenu();
    initLangSwitcher();
    initHeroParallax();

    // Инициализация кастомного курсора
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Эффект при наведении на кнопки и ссылки
        document.querySelectorAll('a, button').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursorFollower.style.transform = 'scale(1.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
    
    // Магнитный эффект для кнопок
    document.querySelectorAll('.magnetic').forEach(button => {
        if (button) {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация прелоадера
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });    // Инициализация particles.js (если элемент существует)
    const particlesElement = document.getElementById('particles-js');
    if (typeof particlesJS !== 'undefined' && particlesElement) {
        particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#1746A2'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#1746A2',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            }        },
        retina_detect: true
    });
    }

    // Появление/исчезновение шапки при скролле
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            header.classList.remove('scroll-down');
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

    // Анимация чисел в секции достижений
    function animateNumbers() {
        const achievementItems = document.querySelectorAll('.achievement-item');
        
        achievementItems.forEach(item => {
            const number = item.querySelector('.achievement-number');
            const target = parseInt(item.dataset.count);
            let current = 0;
            const increment = target / 100;
            const interval = 20;
            
            const timer = setInterval(() => {
                current += increment;
                number.textContent = Math.floor(current);
                
                if (current >= target) {
                    number.textContent = target;
                    clearInterval(timer);
                }
            }, interval);
        });
    }

    // Запуск анимации чисел при появлении секции в поле зрения
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    });

    const achievements = document.querySelector('.achievements');
    if (achievements) {
        observer.observe(achievements);
    }

    // Слайдер отзывов
    const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dotsContainer = document.querySelector('.testimonials-dots');
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');
    let currentIndex = 0;

    function showTestimonial(index) {
        if (!testimonialItems.length) return;

        testimonialItems.forEach(item => {
            item.classList.remove('active');
        });
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        if (index >= testimonialItems.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = testimonialItems.length - 1;
        } else {
            currentIndex = index;
        }

        if (testimonialItems[currentIndex]) {
            testimonialItems[currentIndex].classList.add('active');
            const activeDot = document.querySelector(`.dot[data-index="${currentIndex}"]`);
            if (activeDot) {
                activeDot.classList.add('active');
            }
        }
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            showTestimonial(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            showTestimonial(currentIndex + 1);
        });
    }

    // Создаем точки для навигации
    if (testimonialItems.length && dotsContainer) {
        testimonialItems.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.setAttribute('data-index', index);
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
            
            dotsContainer.appendChild(dot);
        });

        // Автоматическое переключение слайдов
        setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 5000);
    }

    // Обработка отправки формы
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь должна быть логика отправки формы на сервер
            
            // Показываем модальное окно успешной отправки
            successModal.style.display = 'flex';
            
            // Очищаем форму
            contactForm.reset();
        });
    }

    // Закрытие модального окна
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // Фильтрация партнеров
    const partnerCategories = document.querySelectorAll('.partner-category');
    const partnerCards = document.querySelectorAll('.partner-card');

    partnerCategories.forEach(category => {
        category.addEventListener('click', () => {
            const selectedCategory = category.textContent;

            partnerCategories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');

            partnerCards.forEach(card => {
                if (selectedCategory === 'Всі' || card.dataset.category === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Вакансии
    const vacancyBtns = document.querySelectorAll('.vacancy-btn');
    const vacancyModal = document.getElementById('vacancyModal');
    const modalCloseBtn = document.getElementById('modalClose');
    const vacancyForm = document.getElementById('vacancyForm');

    vacancyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            vacancyModal.style.display = 'flex';
        });
    });

    modalCloseBtn.addEventListener('click', () => {
        vacancyModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === vacancyModal) {
            vacancyModal.style.display = 'none';
        }
    });

    vacancyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Здесь должна быть логика отправки формы
        vacancyModal.style.display = 'none';
        alert('Дякуємо за відгук! Ми зв\'яжемося з вами найближчим часом.');
    });
});

// Обработка технологий и форм (заменено с вакансий)
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем существование элементов перед добавлением обработчиков
    const techCategories = document.querySelectorAll('.tech-category');
    const techCards = document.querySelectorAll('.tech-card');
    
    // Инициализация фильтра технологий (дополнительная проверка)
    if (techCategories.length > 0 && techCards.length > 0) {
        console.log('Technologies section initialized');
    }
});

// Функция для всех форм
function initForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = 'Відправляється...';

                // Восстанавливаем кнопку через 2 секунды
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 2000);
            }
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация форм
    initForms();

    // Безопасная инициализация (проверяем существование элементов)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        console.log('Contact form found and ready');
    }
                }
                vacancyModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        modalClose.addEventListener('click', () => {
            vacancyModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        vacancyModal.addEventListener('click', (e) => {
            if (e.target === vacancyModal) {
                vacancyModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});



// Обработка форм
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем jQuery в проект
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
    document.head.appendChild(script);

    script.onload = function() {
        // Обработка всех форм
        $('form').on('submit', function(e) {
            e.preventDefault();
            
            const $form = $(this);
            const $submitButton = $form.find('button[type="submit"]');
            
            // Блокируем кнопку и меняем текст
            $submitButton.prop('disabled', true)
                .html('Відправляється...');

            // Собираем данные для отправки
            const data = {
                service_id: 'service_2i2scv9',
                template_id: 'template_xwsu4sr',
                user_id: 'JoLGVhHXtA4OtFzZq',
                template_params: {
                    'from_name': $form.find('#name').val(),
                    'from_email': $form.find('#email').val(),
                    'phone': $form.find('#phone').val(),
                    'message': $form.find('#message').val(),
                    'subject': 'Нова заявка з сайту'
                }
            };

            // Отправляем через API EmailJS
            $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json'
            })
            .done(function() {
                alert('Дякуємо за повідомлення! Ми зв\'яжемося з вами найближчим часом.');
                $form[0].reset();
                
                // Если это форма вакансии, закрываем модальное окно
                if ($form.attr('id') === 'vacancyForm') {
                    $('.vacancy-modal').removeClass('active');
                    $('body').css('overflow', '');
                }
            })
            .fail(function(error) {
                console.error('Помилка відправки:', error);
                alert('Виникла помилка при відправці. Будь ласка, спробуйте пізніше. ' + JSON.stringify(error));
            })
            .always(function() {
                // Возвращаем кнопку в исходное состояние
                $submitButton.prop('disabled', false)
                    .html($form.attr('id') === 'vacancyForm' ? 'Надіслати' : 'Відправити повідомлення');
            });
        });
    };
});

// Обработка кнопок вакансий
document.addEventListener('DOMContentLoaded', function() {
    const vacancyBtns = document.querySelectorAll('.vacancy-btn');
    
    vacancyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Получаем название вакансии
            const vacancyTitle = this.closest('.vacancy-card').querySelector('h3').textContent;
            
            // Находим контактную форму
            const contactForm = document.querySelector('.contact-form');
            
            if (contactForm) {
                // Плавно прокручиваем к форме
                contactForm.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center'
                });

                // Автоматически заполняем поле сообщения названием вакансии
                const messageField = contactForm.querySelector('#message');
                if (messageField) {
                    messageField.value = `Відгук на вакансію: ${vacancyTitle}`;
                }

                // Фокусируемся на первом поле ввода
                const firstInput = contactForm.querySelector('#name');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        });
    });
});