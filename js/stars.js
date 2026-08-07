/**
 * =====================================================
 * PROJECT AURORA
 * STARS ENGINE
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

        this.starCount = CONFIG.STARS.COUNT;

        this.mouse = {

            x: this.width / 2,
            y: this.height / 2

        };

        this.animationId = null;

    }

    init() {

        this.canvas = document.getElementById("stars");

        if (!this.canvas) return;

        this.ctx = this.canvas.getContext("2d");

        this.resize();

        this.createStars();

        this.bindEvents();

        this.animate();

    }
    bindEvents() {
        window.addEventListener(
            "resize",
            Utils.debounce(() => {
                this.resize();
                this.createStars();
            }, 150)
        );
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

    }

    resize() {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    createStars() {
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Utils.random(0, this.width),
                y: Utils.random(0, this.height),
                radius: Utils.random(
                    CONFIG.STARS.MIN_SIZE,
                    CONFIG.STARS.MAX_SIZE
                ),
                alpha: Utils.random(.08, .35),
                velocity: Utils.random(.002, .01),
                direction: Math.random() > .5 ? 1 : -1,
                depth: Utils.random(.2, 1),
                twinkle: Utils.random(0, Math.PI * 2)
            });
        }
    }
    animate() {
        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );
        this.drawStars();
        this.animationId = requestAnimationFrame(
            () => this.animate()
        );
    }
    drawStars() {

        this.stars.forEach(star => {

            star.twinkle += star.velocity;
            star.alpha +=
                Math.sin(star.twinkle)
                * .01
                * star.direction;
            star.alpha = Utils.clamp(
                star.alpha,
                .08,
                35
            );
            const offsetX =
                (this.mouse.x - this.width / 2)
                * 0.01
                * star.depth;
            const offsetY =
                (this.mouse.y - this.height / 2)
                * 0.01
                * star.depth;
            this.ctx.beginPath();
            this.ctx.arc(
                star.x + offsetX,
                star.y + offsetY,
                star.radius,
                0,
                Math.PI * 2
            );
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = "rgba(220,230,255,.3)";
            this.ctx.fillStyle =
                `rgba(255,255,255,${star.alpha})`;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.shadowColor = "transparent";
        });
    }
    addStar(x, y) {
        this.stars.push({
            x,
            y,
            radius: Utils.random(1, 3),
            alpha: 1,
            velocity: .01,
            direction: 1,
            depth: 1,
            twinkle: 0
        });
    }
    removeLastStar() {
        this.stars.pop();
    }
    clear() {
        this.stars = [];
    }
    destroy() {
        cancelAnimationFrame(this.animationId);
        this.clear();
    }
    
}
window.StarEngine = new StarEngine();
console.log("✓ Star Engine Loaded");