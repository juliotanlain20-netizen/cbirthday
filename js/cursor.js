/**
 * =====================================================
 * PROJECT AURORA
 * CURSOR ENGINE
 * PART 1
 * =====================================================
 */

"use strict";

class CursorEngine {

    constructor() {

        this.cursor = null;
        this.dot = null;

        this.enabled = !(
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0
        );

        this.mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        this.position = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        this.dotPosition = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        this.speed = .18;
        this.dotSpeed = .38;

        this.visible = true;
        this.hovering = false;
        this.clicked = false;
        this.paused = false;

        this.animationFrame = null;

        this.interactiveSelector =
            `
            button,
            a,
            input,
            textarea,
            select,
            [data-cursor],
            .clickable,
            .gallery-item,
            .memory-card,
            .photo-card,
            .glass-card,
            .next-btn,
            .btn
            `;

    }

    init() {

        if (!this.enabled)
            return;

        this.cursor =
            document.getElementById("cursor");

        this.dot =
            document.getElementById("cursor-dot");

        if (!this.cursor || !this.dot)
            return;

        gsap.set(this.cursor, {
            xPercent: -50,
            yPercent: -50
        });

        gsap.set(this.dot, {
            xPercent: -50,
            yPercent: -50
        });

        this.bindEvents();

        this.animate();

    }

    bindEvents() {

        window.addEventListener(
            "mousemove",
            this.onMove.bind(this),
            { passive: true }
        );

        window.addEventListener(
            "mousedown",
            this.onDown.bind(this)
        );

        window.addEventListener(
            "mouseup",
            this.onUp.bind(this)
        );

        window.addEventListener(
            "mouseleave",
            () => this.hide()
        );

        window.addEventListener(
            "mouseenter",
            () => this.show()
        );

        window.addEventListener(
            "blur",
            () => this.hide()
        );

        window.addEventListener(
            "focus",
            () => this.show()
        );

        document.addEventListener(
            "mouseover",
            e => {

                const target =
                    e.target.closest(
                        this.interactiveSelector
                    );

                if (target) {

                    this.expand();

                }

            }
        );

        document.addEventListener(
            "mouseout",
            e => {

                const target =
                    e.target.closest(
                        this.interactiveSelector
                    );

                if (target) {

                    this.shrink();

                }

            }
        );

    }

    onMove(e) {

        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

    }

    onDown() {
        this.ripple();
        this.clicked = true;

        gsap.to(this.cursor, {

            scale: .78,
            duration: .15

        });

        gsap.to(this.dot, {

            scale: 1.8,
            duration: .15

        });

    }

    onUp() {

        this.clicked = false;

        gsap.to(this.cursor, {

            scale: this.hovering ? 1.8 : 1,
            duration: .25

        });

        gsap.to(this.dot, {

            scale: 1,
            duration: .25

        });

    }

    animate() {
        if (this.paused)
            return;

        this.position.x = Utils.lerp(
            this.position.x,
            this.mouse.x,
            this.speed
        );

        this.position.y = Utils.lerp(
            this.position.y,
            this.mouse.y,
            this.speed
        );

        this.dotPosition.x = Utils.lerp(
            this.dotPosition.x,
            this.mouse.x,
            this.dotSpeed
        );

        this.dotPosition.y = Utils.lerp(
            this.dotPosition.y,
            this.mouse.y,
            this.dotSpeed
        );

        gsap.set(this.cursor, {

            x: this.position.x,
            y: this.position.y

        });

        gsap.set(this.dot, {

            x: this.dotPosition.x,
            y: this.dotPosition.y

        });
        if (Math.random() > .72) {
            this.createTrail();
        }
        this.animationFrame =
            requestAnimationFrame(
                () => this.animate()
            );

    }

    show() {

        if (!this.visible)
            this.visible = true;

        gsap.to(
            [this.cursor, this.dot],
            {
                opacity: 1,
                duration: .25
            }
        );

    }

    hide() {

        this.visible = false;

        gsap.to(
            [this.cursor, this.dot],
            {
                opacity: 0,
                duration: .25
            }
        );

    }

    expand() {

        this.hovering = true;

        gsap.to(this.cursor, {

            scale: 1.8,
            borderColor: "#74cfff",
            duration: .25,
            ease: "power2.out"

        });

        gsap.to(this.dot, {

            scale: .7,
            duration: .25

        });

    }

    shrink() {

        this.hovering = false;

        gsap.to(this.cursor, {

            scale: 1,
            borderColor: "rgba(255,255,255,.7)",
            duration: .25

        });

        gsap.to(this.dot, {

            scale: 1,
            duration: .25

        });

    }
    pulse() {

        gsap.fromTo(

            this.cursor,

            {
                scale: this.hovering ? 1.8 : 1
            },

            {
                scale: this.hovering ? 2.1 : 1.25,
                repeat: 1,
                yoyo: true,
                duration: .4,
                ease: "sine.inOut"
            }

        );

    }

    ripple(x = this.mouse.x, y = this.mouse.y) {

        const ripple =
            document.createElement("span");

        ripple.className = "cursor-ripple";

        document.body.appendChild(ripple);

        gsap.set(ripple, {

            left: x,
            top: y,
            xPercent: -50,
            yPercent: -50,
            scale: .2,
            opacity: .5

        });

        gsap.to(ripple, {

            scale: 3,
            opacity: 0,
            duration: .7,
            ease: "power2.out",

            onComplete() {

                ripple.remove();

            }

        });

    }

    createTrail() {

        const trail =
            document.createElement("span");

        trail.className = "cursor-trail";

        document.body.appendChild(trail);

        gsap.set(trail, {

            left: this.mouse.x,
            top: this.mouse.y,
            xPercent: -50,
            yPercent: -50

        });

        gsap.to(trail, {

            scale: 2,
            opacity: 0,
            duration: .8,
            ease: "power2.out",

            onComplete() {

                trail.remove();

            }

        });

    }

    magnetic(target) {

        if (!target)
            return;

        const rect =
            target.getBoundingClientRect();

        const cx =
            rect.left + rect.width / 2;

        const cy =
            rect.top + rect.height / 2;

        gsap.to(target, {

            x: (this.mouse.x - cx) * .08,
            y: (this.mouse.y - cy) * .08,
            duration: .25

        });

    }

    resetMagnetic(target) {

        if (!target)
            return;

        gsap.to(target, {

            x: 0,
            y: 0,
            duration: .35,
            ease: "power2.out"

        });

    }

    setColor(color) {

        if (!this.cursor)
            return;

        this.cursor.style.borderColor =
            color;

        this.dot.style.background =
            color;

    }

    pause() {

        this.paused = true;

        cancelAnimationFrame(
            this.animationFrame
        );

    }

    resume() {

        if (!this.paused)
            return;

        this.paused = false;

        this.animate();

    }

    destroy() {

        cancelAnimationFrame(
            this.animationFrame
        );

        window.removeEventListener(
            "mousemove",
            this.onMove
        );

    }

}

window.CursorEngine =
    new CursorEngine();

console.log(
    "✓ Cursor Engine Loaded"
);