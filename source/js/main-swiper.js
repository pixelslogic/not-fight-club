import Swiper from 'swiper';
import 'swiper/css';
import { Navigation, Autoplay } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.main__videos-wrapper');
  if (!container) return;

  const nextEl = document.querySelector('.videos__button-next');
  const prevEl = document.querySelector('.videos__button-prev');

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
});
