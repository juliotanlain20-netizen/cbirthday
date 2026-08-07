/**
 * =====================================================
 * PROJECT AURORA
 * METEOR ENGINE
 * PART 1
 * =====================================================
 */

"use strict";

class MeteorEngine {

    constructor() {

        this.container = null;

        this.enabled = true;

        this.maxMeteor = 3;

        this.active = 0;

        this.timer = null;

        this.running = false;

    }

    init() {

        this.container =
            document.getElementById(
                "meteor-container"
            );

        if (!this.container)
            return;

        this.start();

    }

    start() {

        if (this.running)
            return;

        this.running = true;

        this.schedule();

    }

    stop() {

        this.running = false;

        clearTimeout(this.timer);

    }

    schedule() {

        if (!this.running)
            return;

        const delay =
            Utils.random(
                1800,
                4500
            );

        this.timer = setTimeout(() => {

            if (
                this.active <
                this.maxMeteor
            ) {

                this.spawn();

            }

            this.schedule();

        }, delay);

    }

    spawn() {

        this.active++;

        const meteor =
            document.createElement("span");

        meteor.className =
            "meteor";
        this.createTail(meteor);
        this.createHead(meteor);
        this.container.appendChild(
            meteor
        );

        const startX =
            Utils.random(
                window.innerWidth * .02,
                window.innerWidth *.9
                
            );

        const startY =
            Utils.random(
                -5,
                window.innerHeight * .25
            );

        const length =
            Utils.random(
                180,
                320
            );

        const duration =
            Utils.random(
                1.2,
                2.2
            );

        const distance =
            Utils.random(
                500,
                900
            );

        const angle =
            Utils.random(
                25,
                40
            );

        gsap.set(
            meteor,
            {
                left: startX,
                top: startY,
                width: length,
                rotation: angle,
                opacity: 2
            }
        );

        gsap.timeline({

            onComplete: () => {

                meteor.remove();

                this.active--;

            }

        })

            .to(meteor, {
                opacity: 1,
                duration: .15
            })

            .to(
                meteor,
                {
                    x: distance,
                    y: distance * .65,
                    opacity: 0,
                    duration: duration,
                    ease: "power2.out"
                },
                0
            );

    }
    spawnBurst(amount = 2) {

        for (let i = 0; i < amount; i++) {

            setTimeout(() => {

                if (this.active < this.maxMeteor + 2) {
                    this.spawn();
                }

            }, i * Utils.random(180, 350));

        }

    }

    randomColor() {

        const colors = [
            "#74cfff",
            "#5ffff4",
            "#a87cff",
            "#ffd46b",
            "#ffffff"
        ];

        return colors[
            Math.floor(
                Math.random() * colors.length
            )
        ];

    }

    createHead(meteor) {

        const head =
            document.createElement("span");

        head.className = "meteor-head";

        head.style.background =
            this.randomColor();

        meteor.appendChild(head);

    }

    createTail(meteor) {

        const tail =
            document.createElement("span");

        tail.className = "meteor-tail";

        tail.style.background =
            `linear-gradient(
                90deg,
                rgba(255,255,255,.95),
                ${this.randomColor()},
                transparent
            )`;

        meteor.appendChild(tail);

    }

    pause() {

        this.running = false;

        clearTimeout(
            this.timer
        );

    }

    resume() {

        if (this.running)
            return;

        this.running = true;

        this.schedule();

    }

    destroy() {

        this.pause();

        this.container
            ?.querySelectorAll(".meteor")
            .forEach(el => el.remove());

        this.active = 0;

    }

}

window.MeteorEngine =
    new MeteorEngine();

console.log(
    "✓ Meteor Engine Loaded"
);