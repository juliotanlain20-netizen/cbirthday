/**
 * =====================================================
 * PROJECT AURORA
 * OPTIMIZED BLESSING ENGINE
 * ACT VI
 * =====================================================
 */

"use strict";

class BlessingEngine {

    constructor() {
        this.scene = null;
        this.title = null;
        this.textElement = null;
        this.nextButton = null;

        this.index = 0;
        this.finished = false;
        this.typing = false;
        this.busy = false;
        this.eventsBound = false;

        this.runToken = 0;
        this.typingToken = 0;

        this.ambientElements = [];
        this.ambientTweens = [];

        this.isMobile = window.matchMedia(
            "(max-width: 768px), (pointer: coarse)"
        ).matches;

        this.reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.messages = [
            "Before you go...",

            "Once again, Happy 20th Birthday, Chika.",

            "May this new chapter bring you endless happiness, gentle peace, and little moments worth remembering.",

            "May you always find reasons to smile, even on days that feel a little heavier.",

            "I hope life brings you kind people, beautiful surprises, and dreams that slowly become reality.",

            "May you never lose your kindness, your courage, or the light that makes you who you are.",

            "Keep growing, keep shining, and never stop believing in yourself.",

            "And above all, may God walk beside you through every season of life, protect your heart, guide your steps, and bless every dream you carry.",

            "May your twenties be filled with love, laughter, meaningful memories, and stories you'll one day look back on with a grateful heart.",

            "Thank you for taking a little journey through this page.",

            "Happy Birthday, Chika.",

            "May God bless you, always."
        ];

        this.handleNextClick = async event => {
            event.stopPropagation();

            await this.next();
        };
    }

    init() {
        this.scene =
            document.getElementById("blessing");

        if (!this.scene) {
            console.warn(
                "Blessing scene tidak ditemukan."
            );

            return;
        }

        this.title =
            this.scene.querySelector(
                "#blessingTitle"
            );

        this.textElement =
            this.scene.querySelector(
                "#blessingText"
            );

        this.nextButton =
            this.scene.querySelector(
                "#continueEnding"
            );

        if (
            !this.title ||
            !this.textElement ||
            !this.nextButton
        ) {
            console.warn(
                "Elemen BlessingEngine tidak lengkap."
            );

            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        if (
            this.eventsBound ||
            !this.nextButton
        ) {
            return;
        }

        this.nextButton.addEventListener(
            "click",
            this.handleNextClick
        );

        this.eventsBound = true;
    }

    isBlessingActive() {
        if (
            typeof SceneManager === "undefined" ||
            typeof SceneManager.is !== "function"
        ) {
            return true;
        }

        return SceneManager.is("blessing");
    }

    async start() {
        if (
            !this.title ||
            !this.textElement ||
            !this.nextButton
        ) {
            return;
        }

        const activeRun = ++this.runToken;

        this.typingToken++;

        this.index = 0;
        this.finished = false;
        this.typing = false;
        this.busy = true;

        this.clearAmbient();

        /*
         * Reset text.
         */
        this.textElement.textContent = "";

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.textElement
            );

            window.gsap.set(
                this.textElement,
                {
                    opacity: 1,
                    y: 0
                }
            );
        }

        /*
         * Tombol benar-benar disembunyikan
         * selama judul awal tampil.
         */
        this.nextButton.textContent =
            "Continue";

        this.nextButton.style.display =
            "none";

        this.nextButton.style.pointerEvents =
            "none";

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.nextButton
            );

            window.gsap.set(
                this.nextButton,
                {
                    opacity: 0
                }
            );
        }

        /*
         * Title harus dikembalikan karena start
         * sebelumnya mengubah display menjadi none.
         */
        this.title.style.display = "";

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.title
            );

            window.gsap.set(this.title, {
                opacity: 1,
                y: 0,
                clearProps: "transform"
            });
        } else {
            this.title.style.opacity = "1";
        }

        await Utils.sleep(
            this.reduceMotion ? 100 : 1500
        );

        if (
            activeRun !== this.runToken ||
            !this.isBlessingActive()
        ) {
            this.busy = false;
            return;
        }

        await this.animateTitleOut();

        if (activeRun !== this.runToken) {
            this.busy = false;
            return;
        }

        this.title.style.display = "none";

        this.createAmbient();

        this.busy = false;

        await this.showNext(activeRun);
    }

    animateTitleOut() {
        if (
            !window.gsap ||
            this.reduceMotion
        ) {
            this.title.style.opacity = "0";
            return Promise.resolve();
        }

        return new Promise(resolve => {
            window.gsap.to(this.title, {
                opacity: 0,
                y: -20,
                duration: .6,
                ease: "power2.in",
                overwrite: "auto",
                onComplete: resolve
            });
        });
    }

    async showNext(
        activeRun = this.runToken
    ) {
        if (
            this.finished ||
            this.busy ||
            activeRun !== this.runToken
        ) {
            return;
        }

        if (
            this.index >=
            this.messages.length
        ) {
            await this.finish();
            return;
        }

        this.busy = true;

        /*
         * Tombol belum diperlihatkan
         * sebelum typing selesai.
         */
        this.nextButton.style.display =
            "none";

        this.nextButton.style.pointerEvents =
            "none";

        this.textElement.textContent = "";

        if (window.gsap) {
            window.gsap.set(
                this.textElement,
                {
                    opacity: 1,
                    y: 0
                }
            );
        }

        await this.type(
            this.messages[this.index],
            activeRun
        );

        if (
            activeRun !== this.runToken ||
            !this.isBlessingActive()
        ) {
            this.busy = false;
            return;
        }

        this.index++;

        this.nextButton.textContent =
            this.index === this.messages.length
                ? "Finish"
                : "Continue";

        this.nextButton.style.display =
            "block";

        this.nextButton.style.pointerEvents =
            "auto";

        if (window.gsap && !this.reduceMotion) {
            window.gsap.fromTo(
                this.nextButton,
                {
                    opacity: 0
                },
                {
                    opacity: 1,
                    duration: .4,
                    ease: "power2.out",
                    overwrite: "auto"
                }
            );
        } else {
            this.nextButton.style.opacity = "1";
        }

        this.busy = false;
    }

    async type(
        content,
        activeRun = this.runToken
    ) {
        if (!this.textElement) return;

        const token =
            ++this.typingToken;

        this.typing = true;

        this.textElement.textContent = "";

        if (this.reduceMotion) {
            this.textElement.textContent =
                content;

            this.typing = false;
            return;
        }

        /*
         * Lebih ringan daripada innerHTML +=.
         */
        const textNode =
            document.createTextNode("");

        this.textElement.appendChild(
            textNode
        );

        let renderedText = "";

        for (const character of content) {
            if (
                token !== this.typingToken ||
                activeRun !== this.runToken ||
                !this.isBlessingActive()
            ) {
                this.typing = false;
                return;
            }

            renderedText += character;
            textNode.nodeValue =
                renderedText;

            await Utils.sleep(45);
        }

        this.typing = false;
    }

    async next() {
        if (
            this.finished ||
            this.busy ||
            this.typing
        ) {
            return;
        }

        const activeRun =
            this.runToken;

        this.busy = true;

        this.nextButton.style.pointerEvents =
            "none";

        this.nextButton.style.display =
            "none";

        await this.animateTextOut();

        if (activeRun !== this.runToken) {
            this.busy = false;
            return;
        }

        this.textElement.textContent = "";

        if (window.gsap) {
            window.gsap.set(
                this.textElement,
                {
                    opacity: 1,
                    y: 0
                }
            );
        }

        this.busy = false;

        await this.showNext(activeRun);
    }

    animateTextOut() {
        if (
            !window.gsap ||
            this.reduceMotion
        ) {
            this.text.textElement.style.opacity = "0";
            return Promise.resolve();
        }

        return new Promise(resolve => {
            window.gsap.to(
                this.textElement,
                {
                    opacity: 0,
                    y: -20,
                    duration: .35,
                    ease: "power2.in",
                    overwrite: "auto",
                    onComplete: resolve
                }
            );
        });
    }

    createAmbient() {
        this.clearAmbient();

        /*
         * Ambient tidak dibuat di HP.
         */
        if (
            this.isMobile ||
            this.reduceMotion
        ) {
            return;
        }

        const words = [
            "hope",
            "dream",
            "smile",
            "future",
            "happiness",
            "shine",
            "beautiful"
        ];

        const ambientLayer =
            this.scene.querySelector(
                ".ambientLayer"
            ) || this.scene;

        words.forEach(word => {
            const element =
                document.createElement("span");

            element.className =
                "ambient-word";

            element.textContent = word;

            element.style.left =
                `${Utils.random(8, 92)}%`;

            element.style.top =
                `${Utils.random(10, 90)}%`;

            ambientLayer.appendChild(element);

            this.ambientElements.push(
                element
            );

            if (window.gsap) {
                const tween =
                    window.gsap.fromTo(
                        element,
                        {
                            opacity: 0,
                            y: 15
                        },
                        {
                            opacity: .16,
                            y: -25,
                            duration:
                                Utils.random(7, 12),
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        }
                    );

                this.ambientTweens.push(
                    tween
                );
            }
        });
    }

    clearAmbient() {
        this.ambientTweens.forEach(
            tween => tween.kill()
        );

        this.ambientTweens = [];

        this.ambientElements.forEach(
            element => element.remove()
        );

        this.ambientElements = [];
    }

    async finish() {
        if (this.finished) return;

        this.finished = true;
        this.busy = true;

        this.typingToken++;
        this.runToken++;

        this.typing = false;

        window.State ??= {};
        window.State.blessingFinished =
            true;

        this.nextButton.style.display =
            "none";

        this.nextButton.style.pointerEvents =
            "none";

        await this.animateTextOut();

        this.clearAmbient();

        await Utils.sleep(
            this.reduceMotion ? 100 : 1200
        );

        if (
            typeof SceneManager !== "undefined" &&
            typeof SceneManager.show ===
                "function"
        ) {
            await SceneManager.show(
                "ending"
            );
        }

        if (
            window.EndingEngine &&
            typeof window.EndingEngine.start ===
                "function"
        ) {
            window.EndingEngine.start();
        }

        this.busy = false;
    }

    destroy() {
        this.runToken++;
        this.typingToken++;

        this.clearAmbient();

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.title
            );

            window.gsap.killTweensOf(
                this.textElement
            );

            window.gsap.killTweensOf(
                this.nextButton
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

        this.index = 0;
        this.finished = false;
        this.typing = false;
        this.busy = false;
        this.eventsBound = false;
    }
}

window.BlessingEngine =
    new BlessingEngine();

console.log("✓ Optimized Blessing Engine Loaded");