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
    const elements = checkCarouselElements();
    if (!elements.exists) {
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

        var sX, nX, desX = 0, tX = 0;

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

            this.onpointerup = function () {
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

        setTimeout(init, 1000);

    } catch {}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

export default { initCarousel };