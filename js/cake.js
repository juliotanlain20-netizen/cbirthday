/**
 * =====================================================
 * PROJECT AURORA
 * CAKE ENGINE
 * PART 1
 * =====================================================
 */

"use strict";


class CakeEngine {
    constructor() {
        this.finished = false;
        this.scene = null;
        this.cake = null;
        this.candles = [];
        this.blown = false;
        this.confetti = [];
        this.wishText = [
            "Make a wish...",
            "Close your eyes",
            "and believe"
        ];
        this.currentWish = 0;

    }

    init() {
        this.scene =
            document.getElementById("cake");
        if (!this.scene)
            return;

        this.cake =
            this.scene;
        this.createCandles();
        this.bindEvents();
    }
    createCandles() {
        this.candles = [];
        const candles = this.scene.querySelectorAll(".candle");
        candles.forEach(candle => {
            const flame = candle.querySelector(".flame");
            this.candles.push({
                element: candle,
                flame: flame
            });
        });
    }
    bindEvents() {
        const btn = document.getElementById("blowBtn");
        if (btn) {
            btn.addEventListener("click", async () => {
                if (this.blown) return;
                await this.blowCandles();
            });
        }
        this.scene.addEventListener("click", async () => {
            if (this.blown) return;
            await this.blowCandles();
        });
    }
    start() {
        this.currentWish = 0;
        this.finished = false;
        this.blown = false;

        this.candles.forEach(candle => {
            gsap.set(candle.flame, {
                opacity: 1,
                scale: 1,
                y: 0
            });
        });

        this.animateCake();
        this.animateFlames();
        this.showWish();
    }
    animateCake() {
        if (!this.cake)
            return;
        gsap.fromTo(
            this.cake,
            {
                scale: .7,
                opacity: 0,
                y: 80
            },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "back.out"
            }
        );
    }
    animateFlames() {
        this.candles.forEach(
            candle => {
                gsap.to(
                    candle.flame,
                    {
                        scaleY: .8,
                        scaleX: .9,
                        duration:
                            Utils.random(0.4, 0.8),
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    }
                );
            }
        );
    }

    async blowCandles() {
        if (this.blown)
            return;
        this.blown = true;
        this.candles.forEach(
            candle => {
                gsap.to(
                    candle.flame,
                    {
                        opacity: 0,
                        scale: .2,
                        y: -20,
                        duration: .5,
                        ease: "power2.out"
                    }
                );
            }
        );
        this.showWish();
        this.createConfetti();
        AudioManager.cakeVolume();
        await Utils.sleep(2500);
        await this.finish();
    }
    showWish() {
        const text =
            document.querySelector(".celebration-wrapper h2");
        if (!text)
            return;
        text.innerHTML =
            this.wishText[
            this.currentWish
            ];
        this.currentWish++;
        if (
            this.currentWish >=
            this.wishText.length
        ) {
            this.currentWish = 0;
        }

        gsap.fromTo(

            text,

            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: .8
            }
        );

    }
    /**
     * =====================================================
     * CAKE ENGINE
     * PART 2
     * =====================================================
     */
    createConfetti() {
        const amount =
            CONFIG.CAKE.CONFETTI;
        for (
            let i = 0;
            i < amount;
            i++
        ) {
            const piece =
                document.createElement("span");
            piece.className =
                "confetti";
            document.body.appendChild(
                piece
            );
            const startX =
                window.innerWidth / 2;

            const startY =
                window.innerHeight / 2;
            const angle =
                Math.random() *
                Math.PI *
                2;
            const distance =
                Utils.random(
                    100,
                    500
                );
            gsap.set(
                piece,
                {

                    left: startX,
                    top: startY,
                    scale:
                        Utils.random(.5, 1.5)
                }
            );
            gsap.to(
                piece,
                {
                    x:
                        Math.cos(angle)
                        *
                        distance,
                    y:
                        Math.sin(angle)
                        *
                        distance
                        +
                        300,
                    rotation:
                        Utils.random(
                            -720,
                            720
                        ),
                    opacity: 0,

                    duration:
                        Utils.random(
                            1.5,
                            3
                        ),

                    ease: "power2.out",
                    onComplete() {
                        piece.remove();

                    }

                }

            );


        }


    }

    createSmoke() {
        this.candles.forEach(
            candle => {
                const smoke =
                    document.createElement(
                        "span"
                    );
                smoke.className =
                    "candle-smoke";
                candle.element.appendChild(
                    smoke
                );



                gsap.fromTo(

                    smoke,

                    {
                        opacity: .8,
                        y: 0,
                        scale: .5
                    },
                    {
                        opacity: 0,
                        y: -80,
                        scale: 1.5,
                        duration: 2,
                        ease: "power2.out"
                    }
                );

            }
        );
    }

    cakeGlow() {
        if (!this.cake)
            return;
        gsap.to(
            this.cake,

            {
                boxShadow:
                    `
            0 0 40px rgba(255,220,120,.5),
            0 0 100px rgba(255,220,120,.2)
            `,

                duration: 2,
                repeat: 1,
                yoyo: true
            }
        );
    }
    goldenParticles() {
        for (
            let i = 0;
            i < 50;
            i++
        ) {
            const particle =
                document.createElement(
                    "span"
                );
            particle.className =
                "gold-particle";
            document.body.appendChild(
                particle
            );
            gsap.set(

                particle,
                {
                    left:
                        window.innerWidth / 2,
                    top:
                        window.innerHeight / 2
                }
            );
            gsap.to(
                particle,
                {
                    x:
                        Utils.random(
                            -300,
                            300
                        ),
                    y:
                        Utils.random(
                            -300,
                            300
                        ),
                    opacity: 0,
                    scale:
                        Utils.random(
                            .2,
                            2
                        ),
                    duration:
                        Utils.random(
                            1,
                            2
                        ),
                    onComplete() {
                        particle.remove();
                    }
                }
            );
        }
    }
    async finish() {
        if (this.finished)
            return;
        this.finished = true;
        this.createSmoke();
        this.cakeGlow();
        this.goldenParticles();
        await Utils.sleep(
            2500
        );

        await SceneManager.flashTransition();
        await SceneManager.show(
            "gallery"
        );
        window.GalleryEngine.reveal();
    }

    destroy() {
        this.candles = [];
        this.confetti = [];
        gsap.killTweensOf(
            this.cake
        );
    }
}
window.CakeEngine =
    new CakeEngine();
console.log(
    "✓ Cake Engine Loaded"
);