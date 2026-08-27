/**
 * =====================================================
 * PROJECT AURORA
 * OPTIMIZED STORY ENGINE
 * =====================================================
 */

"use strict";

class StoryEngine {

    constructor() {
        this.scene = null;
        this.container = null;
        this.title = null;
        this.text = null;
        this.progress = null;

        this.nextButton = null;
        this.previousButton = null;

        this.current = 0;
        this.typing = false;
        this.transitioning = false;
        this.finishedTyping = false;
        this.finished = false;

        this.typingToken = 0;
        this.showToken = 0;
        this.autoPlayToken = 0;

        this.eventsBound = false;

        this.ambientCreated = false;
        this.ambientWrapper = null;
        this.ambientTweens = [];

        this.dynamicElements = new Set();

        this.touchStartX = 0;
        this.touchStartY = 0;
        this.ignoreClickUntil = 0;

        this.isMobile = window.matchMedia(
            "(max-width: 768px), (pointer: coarse)"
        ).matches;

        this.reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.story = [
            {
                title: "A Special Day",
                text:
                    "Some moments deserve a little more than just a simple greeting."
            },
            {
                title: "Twenty",
                text:
                    "Today marks another beautiful chapter of your journey. Twenty years of memories, dreams, laughter, and countless little moments that shaped who you are."
            },
            {
                title: "Keep Shining",
                text:
                    "I hope life continues to bring you reasons to smile, people who appreciate you, and opportunities that lead you closer to your dreams."
            },
            {
                title: "A Little Reminder",
                text:
                    "Never forget that you are someone valuable. The world is brighter because you exist in it."
            },
            {
                title: "Your Day",
                text:
                    "So today, celebrate yourself. Eat something sweet, make a wish, and enjoy every little happiness that comes your way."
            },
            {
                title: "Happy Birthday",
                text:
                    "Happy 20th Birthday, Chika. May this new chapter bring you endless happiness, peace, and beautiful surprises."
            }
        ];

        this.handleSceneClick = event => {
            if (!this.isStoryActive()) return;

            if (Date.now() < this.ignoreClickUntil) {
                return;
            }

            /*
             * Tombol punya event sendiri.
             */
            if (
                event.target.closest(
                    ".story-next, .story-prev"
                )
            ) {
                return;
            }

            this.next();
        };

        this.handleNextClick = event => {
            event.stopPropagation();

            if (!this.isStoryActive()) return;

            this.next();
        };

        this.handlePreviousClick = event => {
            event.stopPropagation();

            if (!this.isStoryActive()) return;

            this.previous();
        };

        this.handleKeydown = event => {
            if (!this.isStoryActive()) return;

            if (event.key === "ArrowRight") {
                this.next();
            }

            if (event.key === "ArrowLeft") {
                this.previous();
            }
        };

        this.handleTouchStart = event => {
            const touch =
                event.changedTouches[0];

            this.touchStartX = touch.screenX;
            this.touchStartY = touch.screenY;
        };

        this.handleTouchEnd = event => {
            const touch =
                event.changedTouches[0];

            const differenceX =
                this.touchStartX - touch.screenX;

            const differenceY =
                this.touchStartY - touch.screenY;

            /*
             * Pastikan gerakannya horizontal,
             * bukan scroll vertikal.
             */
            if (
                Math.abs(differenceX) < 70 ||
                Math.abs(differenceX) <=
                    Math.abs(differenceY)
            ) {
                return;
            }

            /*
             * Mencegah click setelah swipe
             * memindahkan cerita sekali lagi.
             */
            this.ignoreClickUntil =
                Date.now() + 400;

            if (differenceX > 0) {
                this.next();
            } else {
                this.previous();
            }
        };
    }

    init() {
        console.log("===== STORY INIT =====");

        this.scene =
            document.getElementById("story");

        if (!this.scene) {
            console.warn(
                "Story scene tidak ditemukan."
            );

            return;
        }

        this.container =
            this.scene.querySelector(
                ".story-wrapper"
            );

        this.title =
            document.getElementById(
                "storyTitle"
            );

        this.text =
            document.getElementById(
                "storyText"
            );

        this.progress =
            this.scene.querySelector(
                ".story-bar"
            );

        this.nextButton =
            this.scene.querySelector(
                ".story-next"
            );

        this.previousButton =
            this.scene.querySelector(
                ".story-prev"
            );

        if (
            !this.container ||
            !this.title ||
            !this.text
        ) {
            console.warn(
                "Elemen utama StoryEngine tidak lengkap."
            );

            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        if (
            this.eventsBound ||
            !this.scene
        ) {
            return;
        }

        this.scene.addEventListener(
            "click",
            this.handleSceneClick
        );

        if (this.nextButton) {
            this.nextButton.addEventListener(
                "click",
                this.handleNextClick
            );
        }

        if (this.previousButton) {
            this.previousButton.addEventListener(
                "click",
                this.handlePreviousClick
            );
        }

        document.addEventListener(
            "keydown",
            this.handleKeydown
        );

        this.scene.addEventListener(
            "touchstart",
            this.handleTouchStart,
            { passive: true }
        );

        this.scene.addEventListener(
            "touchend",
            this.handleTouchEnd,
            { passive: true }
        );

        this.eventsBound = true;
    }

    isStoryActive() {
        if (
            typeof SceneManager === "undefined" ||
            typeof SceneManager.is !== "function"
        ) {
            return true;
        }

        return SceneManager.is("story");
    }

    async start() {
        if (
            !this.container ||
            !this.title ||
            !this.text
        ) {
            return;
        }

        console.log("STORY START");

        this.showToken++;
        this.typingToken++;
        this.autoPlayToken++;

        this.current = 0;
        this.typing = false;
        this.transitioning = false;
        this.finishedTyping = false;
        this.finished = false;

        await this.prepare();

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.container
            );

            window.gsap.set(
                this.container,
                {
                    opacity: 1,
                    clearProps: "transform"
                }
            );
        }

        /*
         * Bagian ini hilang pada kode sebelumnya.
         */
        await this.show(true);
    }

    async show(initial = false) {
        if (
            this.transitioning ||
            !this.story[this.current]
        ) {
            return;
        }

        const token = ++this.showToken;
        const data = this.story[this.current];

        /*
         * Hentikan typing halaman sebelumnya.
         */
        this.typingToken++;
        this.typing = false;
        this.transitioning = true;
        this.finishedTyping = false;

        if (!initial) {
            await this.animateOut();
        }

        if (token !== this.showToken) {
            this.transitioning = false;
            return;
        }

        this.title.textContent = data.title;
        this.text.textContent = "";

        this.updateProgress();

        await this.animateIn();

        if (token !== this.showToken) {
            this.transitioning = false;
            return;
        }

        this.transitioning = false;

        await this.typeText(data.text);
    }

    async typeText(content) {
        const token = ++this.typingToken;

        this.typing = true;
        this.finishedTyping = false;

        this.text.textContent = "";

        if (this.reduceMotion) {
            this.text.textContent = content;
            this.typing = false;
            this.finishedTyping = true;
            return;
        }

        /*
         * Text node lebih ringan daripada
         * innerHTML += char.
         */
        const textNode =
            document.createTextNode("");

        this.text.appendChild(textNode);

        const configuredSpeed =
            Number(CONFIG.STORY.TYPE_SPEED);

        const typingSpeed =
            Number.isFinite(configuredSpeed)
                ? Math.max(configuredSpeed, 16)
                : 45;

        let renderedText = "";

        for (const character of content) {
            if (
                token !== this.typingToken ||
                !this.isStoryActive()
            ) {
                this.typing = false;
                return;
            }

            renderedText += character;
            textNode.nodeValue = renderedText;

            await Utils.sleep(typingSpeed);
        }

        if (token !== this.typingToken) return;

        this.typing = false;
        this.finishedTyping = true;
    }

    completeTyping() {
        const data = this.story[this.current];

        if (!data) return;

        this.typingToken++;

        this.typing = false;
        this.finishedTyping = true;

        this.text.textContent = data.text;
    }

    next() {
        if (this.transitioning || this.finished) {
            return;
        }

        /*
         * Klik pertama saat typing hanya
         * menyelesaikan tulisan.
         */
        if (this.typing) {
            this.completeTyping();
            return;
        }

        if (
            this.current <
            this.story.length - 1
        ) {
            this.current++;
            this.show();

            return;
        }

        this.finish();
    }

    previous() {
        if (this.transitioning || this.finished) {
            return;
        }

        /*
         * Hentikan typing lama sebelum kembali.
         */
        if (this.typing) {
            this.typingToken++;
            this.typing = false;
        }

        if (this.current > 0) {
            this.current--;
            this.show();
        }
    }

    updateProgress() {
        if (!this.progress) return;

        const percentage =
            (
                (this.current + 1) /
                this.story.length
            ) * 100;

        this.progress.style.width =
            `${percentage}%`;
    }

    animateIn() {
        if (
            !window.gsap ||
            this.reduceMotion
        ) {
            this.container.style.opacity = "1";
            return Promise.resolve();
        }

        window.gsap.killTweensOf(
            this.container
        );

        return new Promise(resolve => {
            window.gsap.fromTo(
                this.container,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: this.isMobile
                        ? .45
                        : .75,
                    ease: "power3.out",
                    onComplete: resolve
                }
            );
        });
    }

    animateOut() {
        if (
            !window.gsap ||
            this.reduceMotion
        ) {
            this.container.style.opacity = "0";
            return Promise.resolve();
        }

        window.gsap.killTweensOf(
            this.container
        );

        return new Promise(resolve => {
            window.gsap.to(
                this.container,
                {
                    opacity: 0,
                    y: -20,
                    duration: this.isMobile
                        ? .25
                        : .4,
                    ease: "power2.in",
                    onComplete: resolve
                }
            );
        });
    }

    createAmbientWords() {
        /*
         * Tidak dibuat di HP.
         */
        if (
            this.isMobile ||
            this.reduceMotion
        ) {
            return;
        }

        if (this.ambientCreated) {
            this.ambientTweens.forEach(
                tween => tween.resume()
            );

            return;
        }

        this.ambientCreated = true;

        const words = [
            "memories",
            "dreams",
            "smiles",
            "hope",
            "future",
            "happiness",
            "beautiful",
            "twenty"
        ];

        const positions = [
            { left: 15, top: 18 },
            { left: 82, top: 18 },
            { left: 15, top: 42 },
            { left: 82, top: 42 },
            { left: 18, top: 70 },
            { left: 82, top: 70 },
            { left: 50, top: 12 },
            { left: 50, top: 86 }
        ];

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "ambient-words";

        this.scene.appendChild(wrapper);

        this.ambientWrapper = wrapper;

        words.forEach((word, index) => {
            const span =
                document.createElement("span");

            span.className = "ambient-word";
            span.textContent = word;

            span.style.left =
                `${positions[index].left}%`;

            span.style.top =
                `${positions[index].top}%`;

            wrapper.appendChild(span);

            if (window.gsap) {
                const tween =
                    window.gsap.to(span, {
                        x: Utils.random(-12, 12),
                        y: Utils.random(-20, 20),
                        opacity: .2,
                        duration:
                            Utils.random(7, 11),
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });

                this.ambientTweens.push(tween);
            }
        });
    }

    pauseAmbientWords() {
        this.ambientTweens.forEach(
            tween => tween.pause()
        );
    }

    async prepare() {
        this.createAmbientWords();

        /*
         * cameraMove() tidak dijalankan.
         * Background-position yang bergerak terus
         * menyebabkan repaint layar penuh.
         */
    }

    async autoPlay(interval = 6000) {
        const token = ++this.autoPlayToken;

        while (
            token === this.autoPlayToken &&
            this.isStoryActive()
        ) {
            await Utils.sleep(interval);

            if (
                token !== this.autoPlayToken ||
                !this.isStoryActive()
            ) {
                return;
            }

            if (
                !this.typing &&
                !this.transitioning
            ) {
                this.next();
            }
        }
    }

    showQuote(content) {
        const quote =
            document.createElement("div");

        quote.className = "story-quote";
        quote.textContent = content;

        document.body.appendChild(quote);
        this.dynamicElements.add(quote);

        const removeQuote = () => {
            quote.remove();
            this.dynamicElements.delete(quote);
        };

        if (!window.gsap || this.reduceMotion) {
            setTimeout(removeQuote, 3000);
            return;
        }

        window.gsap.timeline({
            onComplete: removeQuote
        })
            .fromTo(
                quote,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: .6
                }
            )
            .to(
                quote,
                {
                    opacity: 0,
                    duration: .6
                },
                "+=3"
            );
    }

    async finish() {
        if (this.finished) return;

        this.finished = true;

        this.typingToken++;
        this.showToken++;
        this.autoPlayToken++;

        this.typing = false;
        this.transitioning = false;

        this.pauseAmbientWords();

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.container
            );
        }

        if (
            typeof SceneManager !== "undefined" &&
            typeof SceneManager.flashTransition ===
                "function"
        ) {
            await SceneManager.flashTransition();
        }

        await Utils.sleep(500);

        if (
            typeof SceneManager !== "undefined" &&
            typeof SceneManager.show ===
                "function"
        ) {
            await SceneManager.show(
                "celebration"
            );
        }
    }

    reset() {
        this.typingToken++;
        this.showToken++;
        this.autoPlayToken++;

        this.current = 0;
        this.typing = false;
        this.transitioning = false;
        this.finishedTyping = false;
        this.finished = false;

        if (this.text) {
            this.text.textContent = "";
        }
    }

    destroy() {
        this.reset();
        this.pauseAmbientWords();

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.container
            );

            this.ambientTweens.forEach(
                tween => tween.kill()
            );
        }

        this.ambientTweens = [];

        if (this.ambientWrapper) {
            this.ambientWrapper.remove();
            this.ambientWrapper = null;
        }

        this.dynamicElements.forEach(element => {
            if (window.gsap) {
                window.gsap.killTweensOf(element);
            }

            element.remove();
        });

        this.dynamicElements.clear();

        if (
            this.scene &&
            this.eventsBound
        ) {
            this.scene.removeEventListener(
                "click",
                this.handleSceneClick
            );

            this.scene.removeEventListener(
                "touchstart",
                this.handleTouchStart
            );

            this.scene.removeEventListener(
                "touchend",
                this.handleTouchEnd
            );
        }

        if (
            this.nextButton &&
            this.eventsBound
        ) {
            this.nextButton.removeEventListener(
                "click",
                this.handleNextClick
            );
        }

        if (
            this.previousButton &&
            this.eventsBound
        ) {
            this.previousButton.removeEventListener(
                "click",
                this.handlePreviousClick
            );
        }

        document.removeEventListener(
            "keydown",
            this.handleKeydown
        );

        this.eventsBound = false;
        this.ambientCreated = false;
    }
}

window.StoryEngine =
    new StoryEngine();

console.log("✓ Optimized Story Engine Loaded");