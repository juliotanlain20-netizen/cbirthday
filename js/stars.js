/**
 * =====================================================
 * PROJECT AURORA
 * OPTIMIZED STARS ENGINE
 * =====================================================
 */

"use strict";

class StarEngine {

    constructor() {
        this.canvas = null;
        this.ctx = null;

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.stars = [];

        this.isMobile = window.matchMedia(
            "(max-width: 768px), (pointer: coarse)"
        ).matches;

        this.reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        /*
         * HP dibatasi maksimal 45 bintang.
         * Desktop dibatasi maksimal 120 bintang.
         */
        this.starCount = Math.min(
            CONFIG.STARS.COUNT,
            this.isMobile ? 45 : 120
        );

        /*
         * HP cukup 30 FPS.
         */
        this.targetFPS = this.isMobile ? 30 : 60;
        this.frameInterval = 1000 / this.targetFPS;

        this.lastFrameTime = 0;
        this.animationId = null;
        this.running = false;

        this.mouse = {
            x: this.width / 2,
            y: this.height / 2
        };

        /*
         * Callback dibuat satu kali.
         */
        this.animationLoop = timestamp => {
            this.animate(timestamp);
        };

        this.handleMouseMove = event => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        };

        this.handleResize = Utils.debounce(() => {
            const previousWidth = this.width;

            this.resize();

            /*
             * Buat ulang bintang hanya ketika lebar layar
             * benar-benar berubah, misalnya rotasi HP.
             */
            if (Math.abs(this.width - previousWidth) > 50) {
                this.createStars();
            }
        }, 250);

        this.handleVisibility = () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        };
    }

    init() {
        this.canvas = document.getElementById("stars");

        if (!this.canvas || this.running) return;

        this.ctx = this.canvas.getContext("2d", {
            alpha: true
        });

        this.resize();
        this.createStars();
        this.bindEvents();

        /*
         * Pengguna reduced motion mendapat bintang statis.
         */
        if (this.reduceMotion) {
            this.render();
            return;
        }

        this.start();
    }

    bindEvents() {
        window.addEventListener(
            "resize",
            this.handleResize
        );

        /*
         * Mouse parallax tidak diperlukan di HP.
         */
        if (!this.isMobile) {
            window.addEventListener(
                "mousemove",
                this.handleMouseMove
            );
        }

        document.addEventListener(
            "visibilitychange",
            this.handleVisibility
        );
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        /*
         * DPR sengaja tetap 1 agar ringan di HP
         * dengan layar beresolusi tinggi.
         */
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createStars() {
        this.stars = [];

        for (let i = 0; i < this.starCount; i++) {
            const baseAlpha = Utils.random(.08, .28);

            this.stars.push({
                x: Utils.random(0, this.width),
                y: Utils.random(0, this.height),

                radius: Utils.random(
                    CONFIG.STARS.MIN_SIZE,
                    CONFIG.STARS.MAX_SIZE
                ),

                baseAlpha,
                alpha: baseAlpha,

                velocity: Utils.random(.008, .025),
                depth: Utils.random(.2, 1),
                twinkle: Utils.random(0, Math.PI * 2)
            });
        }
    }

    start() {
        if (
            this.running ||
            this.reduceMotion ||
            !this.ctx
        ) {
            return;
        }

        this.running = true;
        this.lastFrameTime = performance.now();

        this.animationId = requestAnimationFrame(
            this.animationLoop
        );
    }

    stop() {
        this.running = false;

        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate(timestamp) {
        if (!this.running) return;

        this.animationId = requestAnimationFrame(
            this.animationLoop
        );

        const elapsed = timestamp - this.lastFrameTime;

        /*
         * Batasi frame rate.
         */
        if (elapsed < this.frameInterval) return;

        this.lastFrameTime =
            timestamp - (elapsed % this.frameInterval);

        this.render();
    }

    render() {
        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        this.drawStars();
    }

    drawStars() {
        const ctx = this.ctx;

        /*
         * Hitung offset hanya satu kali.
         */
        const offsetBaseX = this.isMobile
            ? 0
            : (this.mouse.x - this.width / 2) * .01;

        const offsetBaseY = this.isMobile
            ? 0
            : (this.mouse.y - this.height / 2) * .01;

        /*
         * Shadow dimatikan di HP.
         * Pada desktop cukup 4px.
         */
        ctx.shadowBlur = this.isMobile ? 0 : 4;
        ctx.shadowColor = "rgba(220,230,255,.25)";

        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];

            star.twinkle += star.velocity;

            /*
             * Alpha tidak lagi terus bertambah.
             */
            star.alpha = Utils.clamp(
                star.baseAlpha +
                Math.sin(star.twinkle) * .1,
                .05,
                .38
            );

            const x =
                star.x + offsetBaseX * star.depth;

            const y =
                star.y + offsetBaseY * star.depth;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                star.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(255,255,255,${star.alpha})`;

            ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
    }

    addStar(x, y) {
        /*
         * Hindari jumlah bintang bertambah tanpa batas.
         */
        const maximumStars = this.starCount + 15;

        if (this.stars.length >= maximumStars) return;

        this.stars.push({
            x,
            y,
            radius: Utils.random(1, 2),
            baseAlpha: .35,
            alpha: .35,
            velocity: .015,
            depth: 1,
            twinkle: 0
        });
    }

    removeLastStar() {
        this.stars.pop();
    }

    clear() {
        this.stars = [];

        if (this.ctx) {
            this.ctx.clearRect(
                0,
                0,
                this.width,
                this.height
            );
        }
    }

    destroy() {
        this.stop();
        this.clear();

        window.removeEventListener(
            "resize",
            this.handleResize
        );

        window.removeEventListener(
            "mousemove",
            this.handleMouseMove
        );

        document.removeEventListener(
            "visibilitychange",
            this.handleVisibility
        );
    }
}

window.StarEngine = new StarEngine();

console.log("✓ Optimized Star Engine Loaded");