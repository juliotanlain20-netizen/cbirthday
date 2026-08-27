/**
 * =====================================================
 * PROJECT AURORA
 * LIGHTWEIGHT ENDING ENGINE
 * =====================================================
 */

"use strict";

class EndingEngine {

    constructor() {
        this.scene = null;
        this.moon = null;
        this.content = null;

        this.started = false;
        this.finished = false;
        this.prepared = false;

        this.reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    }

    init() {
        this.scene =
            document.getElementById("ending");

        if (!this.scene) return;

        this.moon =
            this.scene.querySelector(".moon");

        this.content =
            this.scene.querySelector(
                ".endingContent"
            );

        this.prepare();
    }

    prepare() {
        if (
            !this.moon ||
            !this.content
        ) {
            return;
        }

        this.prepared = true;

        /*
         * Hindari CSS moonFloat berjalan bersamaan.
         */
        this.moon.style.animation = "none";
        this.content.style.animation = "none";

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.moon
            );

            window.gsap.killTweensOf(
                this.content
            );

            window.gsap.set(this.moon, {
                autoAlpha: 0,
                scale: .9,
                y: 25
            });

            window.gsap.set(this.content, {
                autoAlpha: 0,
                y: 18
            });
        } else {
            this.moon.style.opacity = "0";
            this.moon.style.visibility =
                "hidden";

            this.content.style.opacity = "0";
            this.content.style.visibility =
                "hidden";
        }
    }

    start() {
        if (
            this.started ||
            !this.moon ||
            !this.content
        ) {
            return;
        }

        this.started = true;
        this.finished = false;

        if (!this.prepared) {
            this.prepare();
        }

        if (
            window.AudioManager &&
            typeof window.AudioManager.endingVolume ===
                "function"
        ) {
            window.AudioManager.endingVolume();
        }

        /*
         * Fallback tanpa GSAP.
         */
        if (
            !window.gsap ||
            this.reduceMotion
        ) {
            this.moon.style.opacity = "1";
            this.moon.style.visibility =
                "visible";

            this.content.style.opacity = "1";
            this.content.style.visibility =
                "visible";

            return;
        }

        /*
         * Bulan muncul secara singkat dan lembut.
         */
        window.gsap.to(this.moon, {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: "power2.out",
            overwrite: "auto",

            onComplete: () => {
                window.gsap.set(
                    this.moon,
                    {
                        clearProps: "transform"
                    }
                );
            }
        });

        /*
         * Tulisan mulai 0,25 detik setelah bulan.
         * Tidak perlu menunggu beberapa detik.
         */
        window.gsap.to(this.content, {
            autoAlpha: 1,
            y: 0,
            duration: .9,
            delay: .25,
            ease: "power2.out",
            overwrite: "auto",

            onComplete: () => {
                window.gsap.set(
                    this.content,
                    {
                        clearProps: "transform"
                    }
                );
            }
        });

        /*
         * StarEngine dibiarkan seperti semula.
         * Tidak ada createStars() dan tidak ada 500 bintang.
         */
    }

    async finish() {
        if (this.finished) return;

        this.finished = true;

        if (
            window.AudioManager &&
            typeof window.AudioManager.finalFade ===
                "function"
        ) {
            window.AudioManager.finalFade();
        }

        await Utils.sleep(6000);

        document.body.dataset.completed =
            "true";
    }

    reset() {
        this.started = false;
        this.finished = false;
        this.prepared = false;

        if (window.gsap) {
            window.gsap.killTweensOf(
                this.moon
            );

            window.gsap.killTweensOf(
                this.content
            );
        }

        this.prepare();

        delete document.body.dataset.completed;
    }

    destroy() {
        this.reset();

        this.scene = null;
        this.moon = null;
        this.content = null;
    }
}

window.EndingEngine =
    new EndingEngine();

console.log(
    "✓ Lightweight Ending Engine Loaded"
);