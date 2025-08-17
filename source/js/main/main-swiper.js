// main-swiper.js - исправленная версия с проверками
import Swiper from 'swiper';
import 'swiper/css';
import { Navigation, Autoplay } from 'swiper/modules';

console.log('Swiper module loaded');

function checkSwiperElements() {
    const container = document.querySelector('.main__videos-wrapper');
    const nextEl = document.querySelector('.videos__button-next');
    const prevEl = document.querySelector('.videos__button-prev');
    
    return {
        container,
        nextEl,
        prevEl,
        exists: !!container
    };
}

function initSwiper() {
    console.log('Trying to initialize swiper...');
    
    const elements = checkSwiperElements();
    
    if (!elements.exists) {
        console.log('Swiper elements not found, skipping swiper initialization');
        return;
    }

    try {
        const { container, nextEl, prevEl } = elements;
        
        new Swiper(container, {
            modules: [Navigation, Autoplay],
            direction: 'vertical',
            loop: true,
            speed: 500,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl,
                prevEl,
            },
            slidesPerView: 3,
            spaceBetween: 20,
        });

        console.log('Swiper initialized successfully');
        
    } catch (error) {
        console.error('Error initializing swiper:', error);
    }
}

// Инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwiper);
} else {
    initSwiper();
}

export default { initSwiper };