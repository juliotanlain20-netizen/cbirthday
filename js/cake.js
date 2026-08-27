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
        this.confettiFrame = null;
        this.confettiTimer = null;
        this.confettiTween = null;

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
        if (this.blown || this.finished) return;

        this.blown = true;

        const activeRun = this.runId;

        this.candles.forEach(candle => {
            if (!candle.flame) return;

            candle.flame.style.animation = "none";
            gsap.killTweensOf(candle.flame);

            gsap.to(candle.flame, {
                opacity: 0,
                scale: 0.2,
                y: -20,
                duration: this.reduceMotion ? 0 : 0.4,
                ease: "power2.out",
                overwrite: true
            });
        });

        this.showWish();

        /*
         * Tetap jalankan audio dari event pengguna.
         */
        if (window.AudioManager) {
            AudioManager.cakeVolume();
        }

        /*
         * Confetti dijalankan setelah respons klik sempat dilukis.
         */
        this.scheduleConfetti(activeRun);

        await Utils.sleep(1200);

        if (activeRun !== this.runId) return;

        this.showWish();

        await Utils.sleep(1300);

        if (activeRun !== this.runId) return;

        await this.finish();
    }
    scheduleConfetti(activeRun) {
        if (this.reduceMotion) return;

        if (this.confettiFrame) {
            cancelAnimationFrame(this.confettiFrame);
        }

        if (this.confettiTimer) {
            clearTimeout(this.confettiTimer);
        }

        /*
         * requestAnimationFrame berjalan sebelum paint.
         * setTimeout membuat confetti dimulai setelah paint tersebut.
         */
        this.confettiFrame = requestAnimationFrame(() => {
            this.confettiFrame = null;

            this.confettiTimer = setTimeout(() => {
                this.confettiTimer = null;

                if (
                    activeRun !== this.runId ||
                    !this.blown ||
                    this.finished
                ) {
                    return;
                }

                this.createConfetti();
            }, 0);
        });
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

        const configuredAmount =
            Number(CONFIG.CAKE.CONFETTI) || 0;

        /*
         * 8 cukup untuk HP.
         * Desktop dibatasi 28.
         */
        const amount = Math.min(
            configuredAmount,
            this.isMobile ? 8 : 28
        );

        if (amount <= 0) return;

        const fragment = document.createDocumentFragment();
        const pieces = [];
        const movement = [];

        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;

        for (let i = 0; i < amount; i++) {
            const piece = document.createElement("span");

            piece.className = "confetti";

            piece.style.left = `${startX}px`;
            piece.style.top = `${startY}px`;
            piece.style.willChange = "transform, opacity";

            const angle = Math.random() * Math.PI * 2;
            const distance = Utils.random(
                80,
                this.isMobile ? 230 : 400
            );

            movement.push({
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance + 220,
                scale: Utils.random(0.5, 1.2),
                rotation: Utils.random(-360, 360),
                duration: Utils.random(1.2, 2)
            });

            pieces.push(piece);
            this.effects.add(piece);
            fragment.appendChild(piece);
        }

        document.body.appendChild(fragment);

        /*
         * Satu operasi set dan satu tween batch,
         * bukan satu tween terpisah per confetti.
         */
        gsap.set(pieces, {
            scale: index => movement[index].scale
        });

        this.confettiTween = gsap.to(pieces, {
            x: index => movement[index].x,
            y: index => movement[index].y,
            rotation: index => movement[index].rotation,
            duration: index => movement[index].duration,
            opacity: 0,
            stagger: 0.01,
            ease: "power2.out",

            onComplete: () => {
                pieces.forEach(piece => {
                    piece.remove();
                    this.effects.delete(piece);
                });

                this.confettiTween = null;
            }
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
        if (this.confettiFrame) {
            cancelAnimationFrame(this.confettiFrame);
            this.confettiFrame = null;
        }

        if (this.confettiTimer) {
            clearTimeout(this.confettiTimer);
            this.confettiTimer = null;
        }

        /*
         * Hentikan animasi confetti yang sedang berjalan.
         */
        if (this.confettiTween) {
            this.confettiTween.kill();
            this.confettiTween = null;
        }

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