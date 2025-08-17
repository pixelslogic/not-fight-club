// main-carousel.js - исправленная версия с проверками
console.log('Carousel module loaded');

// Проверяем наличие элементов карусели
function checkCarouselElements() {
    const odrag = document.querySelector('.carousel__spin');
    const ground = document.querySelector('.carousel__ground');
    const soundBtn = document.getElementById('soundBtn');
    const audio = document.getElementById('main-music');
    
    return {
        odrag,
        ground,
        soundBtn,
        audio,
        exists: !!(odrag && ground)
    };
}

function initCarousel() {
    console.log('Trying to initialize carousel...');
    
    const elements = checkCarouselElements();
    
    if (!elements.exists) {
        console.log('Carousel elements not found, skipping carousel initialization');
        return;
    }

    try {
        var radius = 240;
        var autoRotate = true;
        var rotateSpeed = -60;
        var imgWidth = 120;
        var imgHeight = 170;

        var odrag = elements.odrag;
        var ospin = elements.odrag;
        var aImg = ospin.getElementsByTagName('img');
        
        if (!aImg || aImg.length === 0) {
            console.log('No carousel images found');
            return;
        }
        
        var aEle = [...aImg];

        ospin.style.width = imgWidth + "px";
        ospin.style.height = imgHeight + "px";

        var ground = elements.ground;
        ground.style.width = radius * 3 + "px";
        ground.style.height = radius * 3 + "px";

        function init(delayTime) {
            for (var i = 0; i < aEle.length; i++) {
                aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
                aEle[i].style.transition = "transform 1s";
                aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
            }
        }

        function applyTranform(obj) {
            obj.style.transform = "rotateY(" + (tX) + "deg)";
        }

        function playSpin(yes) {
            ospin.style.animationPlayState = (yes ? 'running' : 'paused');
        }

        var sX, sY, nX, nY, desX = 0, tX = 0;

        if (autoRotate) {
            var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
            ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
        }

        document.onpointerdown = function (e) {
            clearInterval(odrag.timer);
            e = e || window.event;
            var sX = e.clientX;

            this.onpointermove = function (e) {
                e = e || window.event;
                var nX = e.clientX;
                desX = nX - sX;
                tX += desX * 0.1;
                applyTranform(odrag);
                sX = nX;
            };

            this.onpointerup = function (e) {
                odrag.timer = setInterval(function () {
                    desX *= 0.95;
                    tX += desX * 0.1;
                    applyTranform(odrag);
                    playSpin(false);
                    if (Math.abs(desX) < 0.5) {
                        clearInterval(odrag.timer);
                        playSpin(true);
                    }
                }, 17);
                this.onpointermove = this.onpointerup = null;
            };

            return false;
        };

        // Инициализация с задержкой
        setTimeout(init, 1000);

        // Обработчик звука
        if (elements.soundBtn && elements.audio) {
            elements.soundBtn.addEventListener('click', function() {
                var audio = elements.audio;
                var icon = this.querySelector('.main__sound-icon');
                
                if (audio.paused) {
                    audio.play();
                    if (icon) icon.src = './assets/icon/sound-pause.svg';
                } else {
                    audio.pause();
                    if (icon) icon.src = './assets/icon/sound-play.svg';
                }
            });
        }

        console.log('Carousel initialized successfully with', aEle.length, 'images');
        
    } catch (error) {
        console.error('Error initializing carousel:', error);
    }
}

// Инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

export default { initCarousel };