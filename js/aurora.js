/**
 * =====================================================
 * PROJECT AURORA
 * AURORA ENGINE
 * =====================================================
 */

"use strict";

class AuroraEngine {

    constructor() {

        this.element = null;

        this.mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
        this.position = {
            x: 0,
            y: 0
        };
        this.time = 0;
        this.speed = window.IS_MOBILE ? 0.02 : 0.03;
        this.animationFrame = null;

    }

    init() {
        this.element = document.getElementById("aurora");
        if (!this.element) return;
        this.bindEvents();
        this.animate();
    }
    bindEvents() {
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener(
            "resize",
            Utils.debounce(() => {
                this.mouse.x = window.innerWidth / 2;
                this.mouse.y = window.innerHeight / 2;
            }, 150)
        );
    }
    animate() {

        this.time += 0.003;
        this.position.x = Utils.lerp(
            this.position.x,
            (this.mouse.x - window.innerWidth / 2) * 0.015,
            this.speed
        );
        this.position.y = Utils.lerp(
            this.position.y,
            (this.mouse.y - window.innerHeight / 2) * 0.015,
            this.speed
        );

        const floatX = Math.sin(this.time * 1.8) * (window.IS_MOBILE ? 25 : 45);
        const floatY = Math.cos(this.time * 1.2) * (window.IS_MOBILE ? 20 : 35);
        const rotate = Math.sin(this.time) * (window.IS_MOBILE ? 4 : 8);
        const scale = 1
            + Math.sin(this.time * .8) * .03;
        this.element.style.transform = `
    translate(
        ${this.position.x + floatX}px,
        ${this.position.y + floatY}px
    )
    rotate(${rotate}deg)
`;
        this.element.style.opacity =

            0.55 + Math.sin(this.time * 1.5) * .08;

        this.animationFrame = requestAnimationFrame(

            () => this.animate()

        );

    }

    pause() {

        cancelAnimationFrame(this.animationFrame);

    }

    resume() {

        this.animate();

    }

    fadeIn(duration = 2) {

        gsap.to(this.element, {

            opacity: .6,

            duration

        });

    }

    fadeOut(duration = 2) {

        gsap.to(this.element, {

            opacity: 0,

            duration

        });

    }

    pulse() {

        gsap.fromTo(

            this.element,

            {

                scale: 1

            },

            {

                scale: 1.08,

                repeat: 1,

                yoyo: true,

                duration: 2,

                ease: "sine.inOut"

            }

        );

    }

    setColor(color) {

        this.element.style.background = color;

    }


}

window.AuroraEngine = new AuroraEngine();

console.log("✓ Aurora Engine Loaded");