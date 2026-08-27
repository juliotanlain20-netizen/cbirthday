/**
 * =====================================================
 * PROJECT AURORA
 * OPTIMIZED CAKE ENGINE
 * =====================================================
 */

"use strict";

class CakeEngine {

    constructor() {
        this.scene = null;
        this.cake = null;
        this.button = null;

        this.candles = [];
        this.effects = new Set();

        this.finished = false;
        this.blown = false;
        this.eventsBound = false;
        this.runId = 0;

        this.wishText = [
            "Make a wish...",
            "Close your eyes",
            "and believe"
        ];

        this.currentWish = 0;

        this.isMobile = window.matchMedia(
            "(max-width: 768px), (pointer: coarse)"
        ).matches;

        this.reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.handleButtonClick = async event => {
            event.stopPropagation();

            if (this.blown) return;

            await this.blowCandles();
        };

        this.handleSceneClick = async () => {
            if (this.blown) return;

            await this.blowCandles();
        };
    }

    init() {
        /*
         * Scene dan cake adalah dua elemen berbeda.
         */
        this.scene =
            document.getElementById("celebration");

        this.cake =
            document.getElementById("cake");

        this.button =
            document.getElementById("blowBtn");

        if (!this.cake) return;

        /*
         * Fallback jika section celebration tidak ditemukan.
         */
        if (!this.scene) {
            this.scene = this.cake;
        }

        if (!window.gsap) {
            console.error(
                "CakeEngine membutuhkan GSAP."
            );

            return;
        }

        this.createCandles();
        this.bindEvents();
    }

    createCandles() {
        this.candles = [];

        const candles =
            this.cake.querySelectorAll(".candle");

        candles.forEach(candle => {
            const flame =
                candle.querySelector(".flame");

            if (!flame) return;

            this.candles.push({
                element: candle,
                flame
            });
        });
    }

    bindEvents() {
        if (this.eventsBound) return;

        if (this.button) {
            this.button.addEventListener(
                "click",
                this.handleButtonClick
            );
        }

        if (this.scene) {
            this.scene.addEventListener(
                "click",
                this.handleSceneClick
            );
        }

        this.eventsBound = true;
    }

    start() {
        if (!this.cake || !window.gsap) return;

        this.runId++;

        this.currentWish = 0;
        this.finished = false;
        this.blown = false;

        this.cleanupEffects();

        window.gsap.killTweensOf(this.cake);

        this.candles.forEach(candle => {
            window.gsap.killTweensOf(candle.flame);

            /*
             * Bersihkan transform dari proses sebelumnya.
             */
            window.gsap.set(candle.flame, {
                clearProps: "transform",
                opacity: 1
            });

            /*
             * HP mendapat api statis agar lebih ringan.
             * Desktop menggunakan animasi CSS flameFlicker.
             */
            candle.flame.style.animation =
                this.isMobile || this.reduceMotion
                    ? "none"
                    : "";
        });

        this.animateCake();
        this.showWish();
    }

    animateCake() {
        if (!this.cake) return;

        /*
         * Hentikan cakeFloat sementara agar tidak
         * bertabrakan dengan transform GSAP.
         */
        this.cake.style.animation = "none";

        const finalScale =
            this.isMobile ? .82 : 1;

        window.gsap.fromTo(
            this.cake,
            {
                scale: this.isMobile ? .65 : .7,
                opacity: 0,
                y: this.isMobile ? 50 : 80
            },
            {
                scale: finalScale,
                opacity: 1,
                y: 0,
                duration: this.reduceMotion ? .01 : 1.2,
                ease: "back.out(1.4)",

                onComplete: () => {
                    if (!this.isMobile) {
                        window.gsap.set(this.cake, {
                            clearProps:
                                "transform,opacity"
                        });

                        /*
                         * Jalankan kembali cakeFloat desktop.
                         */
                        this.cake.style.animation = "";
                    } else {
                        /*
                         * Pertahankan scale .82 di HP,
                         * tetapi bersihkan opacity.
                         */
                        window.gsap.set(this.cake, {
                            clearProps: "opacity"
                        });
                    }
                }
            }
        );
    }

    async blowCandles() {
        if (
            this.blown ||
            !this.cake ||
            !window.gsap
        ) {
            return;
        }

        this.blown = true;

        const activeRun = this.runId;

        this.candles.forEach(candle => {
            /*
             * Matikan flameFlicker agar transform
             * tidak bertabrakan dengan GSAP.
             */
            candle.flame.style.animation = "none";

            window.gsap.killTweensOf(candle.flame);

            window.gsap.to(candle.flame, {
                opacity: 0,
                scale: .2,
                y: -20,
                duration: this.reduceMotion ? .01 : .5,
                ease: "power2.out"
            });
        });

        /*
         * Menampilkan teks kedua.
         */
        this.showWish();

        this.createConfetti();

        if (
            window.AudioManager &&
            typeof window.AudioManager.cakeVolume ===
                "function"
        ) {
            window.AudioManager.cakeVolume();
        }

        /*
         * Beri waktu sebelum teks ketiga.
         */
        await Utils.sleep(1200);

        if (activeRun !== this.runId) return;

        this.showWish();

        await Utils.sleep(1300);

        if (activeRun !== this.runId) return;

        await this.finish(activeRun);
    }

    showWish() {
        const text =
            this.scene.querySelector(
                ".celebration-wrapper h2"
            );

        if (!text) return;

        text.textContent =
            this.wishText[this.currentWish];

        this.currentWish =
            (this.currentWish + 1) %
            this.wishText.length;

        window.gsap.killTweensOf(text);

        window.gsap.fromTo(
            text,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: this.reduceMotion ? .01 : .7,
                ease: "power2.out",
                overwrite: "auto"
            }
        );
    }

    createConfetti() {
        if (this.reduceMotion) return;

        const configAmount =
            Number(CONFIG.CAKE.CONFETTI) || 30;

        const amount = Math.min(
            configAmount,
            this.isMobile ? 20 : 60
        );

        const fragment =
            document.createDocumentFragment();

        const pieces = [];

        const startX =
            window.innerWidth / 2;

        const startY =
            window.innerHeight / 2;

        for (let i = 0; i < amount; i++) {
            const piece =
                document.createElement("span");

            piece.className = "confetti";

            piece.style.left = `${startX}px`;
            piece.style.top = `${startY}px`;

            fragment.appendChild(piece);

            pieces.push(piece);
            this.effects.add(piece);
        }

        /*
         * Masukkan semua elemen dalam satu operasi DOM.
         */
        document.body.appendChild(fragment);

        pieces.forEach(piece => {
            const angle =
                Math.random() * Math.PI * 2;

            const distance =
                Utils.random(
                    this.isMobile ? 80 : 100,
                    this.isMobile ? 260 : 500
                );

            window.gsap.set(piece, {
                scale: Utils.random(.5, 1.25)
            });

            window.gsap.to(piece, {
                x:
                    Math.cos(angle) *
                    distance,

                y:
                    Math.sin(angle) *
                    distance +
                    (this.isMobile ? 180 : 300),

                rotation:
                    Utils.random(-540, 540),

                opacity: 0,

                duration:
                    Utils.random(1.4, 2.4),

                ease: "power2.out",

                onComplete: () => {
                    this.removeEffect(piece);
                }
            });
        });
    }

    createSmoke() {
        if (this.reduceMotion) return;

        this.candles.forEach(candle => {
            const smoke =
                document.createElement("span");

            smoke.className = "candle-smoke";

            candle.element.appendChild(smoke);
            this.effects.add(smoke);

            window.gsap.fromTo(
                smoke,
                {
                    opacity: .7,
                    y: 0,
                    scale: .5
                },
                {
                    opacity: 0,
                    y: this.isMobile ? -50 : -80,
                    scale: 1.4,
                    duration: this.isMobile ? 1.2 : 2,
                    ease: "power2.out",

                    onComplete: () => {
                        this.removeEffect(smoke);
                    }
                }
            );
        });
    }

    cakeGlow() {
        if (
            !this.cake ||
            this.isMobile ||
            this.reduceMotion
        ) {
            return;
        }

        window.gsap.to(this.cake, {
            boxShadow:
                "0 0 40px rgba(255,220,120,.5)," +
                "0 0 100px rgba(255,220,120,.2)",

            duration: 1.5,
            repeat: 1,
            yoyo: true,
            overwrite: "auto"
        });
    }

    goldenParticles() {
        if (this.reduceMotion) return;

        const amount =
            this.isMobile ? 12 : 32;

        const fragment =
            document.createDocumentFragment();

        const particles = [];

        const startX =
            window.innerWidth / 2;

        const startY =
            window.innerHeight / 2;

        for (let i = 0; i < amount; i++) {
            const particle =
                document.createElement("span");

            particle.className =
                "gold-particle";

            particle.style.left =
                `${startX}px`;

            particle.style.top =
                `${startY}px`;

            fragment.appendChild(particle);

            particles.push(particle);
            this.effects.add(particle);
        }

        document.body.appendChild(fragment);

        particles.forEach(particle => {
            window.gsap.to(particle, {
                x: Utils.random(
                    this.isMobile ? -180 : -300,
                    this.isMobile ? 180 : 300
                ),

                y: Utils.random(
                    this.isMobile ? -180 : -300,
                    this.isMobile ? 180 : 300
                ),

                opacity: 0,

                scale: Utils.random(.2, 1.5),

                duration: Utils.random(1, 1.8),

                ease: "power2.out",

                onComplete: () => {
                    this.removeEffect(particle);
                }
            });
        });
    }

    removeEffect(element) {
        if (!element) return;

        if (window.gsap) {
            window.gsap.killTweensOf(element);
        }

        element.remove();
        this.effects.delete(element);
    }

    cleanupEffects() {
        this.effects.forEach(element => {
            if (window.gsap) {
                window.gsap.killTweensOf(element);
            }

            element.remove();
        });

        this.effects.clear();
    }

    async finish(activeRun = this.runId) {
        if (
            this.finished ||
            activeRun !== this.runId
        ) {
            return;
        }

        this.finished = true;

        this.createSmoke();
        this.cakeGlow();
        this.goldenParticles();

        await Utils.sleep(2500);

        if (activeRun !== this.runId) return;

        if (
            window.SceneManager &&
            typeof window.SceneManager.flashTransition ===
                "function"
        ) {
            await window.SceneManager.flashTransition();
        }

        if (
            window.SceneManager &&
            typeof window.SceneManager.show ===
                "function"
        ) {
            await window.SceneManager.show("gallery");
        }

        if (
            window.GalleryEngine &&
            typeof window.GalleryEngine.reveal ===
                "function"
        ) {
            window.GalleryEngine.reveal();
        }
    }

    destroy() {
        this.runId++;

        this.cleanupEffects();

        if (window.gsap) {
            window.gsap.killTweensOf(this.cake);

            this.candles.forEach(candle => {
                window.gsap.killTweensOf(
                    candle.flame
                );
            });
        }

        if (
            this.button &&
            this.eventsBound
        ) {
            this.button.removeEventListener(
                "click",
                this.handleButtonClick
            );
        }

        if (
            this.scene &&
            this.eventsBound
        ) {
            this.scene.removeEventListener(
                "click",
                this.handleSceneClick
            );
        }

        this.eventsBound = false;
        this.candles = [];
    }
}

window.CakeEngine = new CakeEngine();

console.log("✓ Optimized Cake Engine Loaded");