/**
 * =====================================================
 * PROJECT AURORA
 * UNLOCK ENGINE
 * PART 1
 * =====================================================
 */

"use strict";

class UnlockEngine {

    constructor() {

        this.scene = null;
        this.dayInput = null;
        this.monthInput = null;
        this.yearInput = null;
        this.button = null;
        this.error = null;
        this.shakeTarget = null;
        this.attempt = 0;
        this.correct = false;
        this.locked = false;
    }

    init() {

        this.scene = document.getElementById("unlock");
        if (!this.scene) return;
        this.dayInput = document.getElementById("day");
        this.monthInput = document.getElementById("month");
        this.yearInput = document.getElementById("year");
        this.button = document.getElementById("unlockBtn");
        this.error = document.getElementById("unlockError");
        this.shakeTarget = document.querySelector(".glass-card");
        this.bindEvents();
    }
    bindEvents() {
        if (this.button) {
            this.button.addEventListener("click", () => {
                this.validate();
            });
        }
        [
            this.dayInput,
            this.monthInput,
            this.yearInput
        ].forEach(input => {
            if (!input) return;
            input.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    this.validate();
                }
            });
        });
    }
    validate() {
        console.log("VALIDATE DIPANGGIL");
        if (this.locked) return;
        const day = Number(this.dayInput.value);
        const month = Number(this.monthInput.value);
        const year = Number(this.yearInput.value);
        if (
            day === CONFIG.RECIPIENT.BIRTHDAY.DAY &&
            month === CONFIG.RECIPIENT.BIRTHDAY.MONTH &&
            year === CONFIG.RECIPIENT.BIRTHDAY.YEAR
        ) {
            this.success();
        }
        else {
            this.failed();
        }
    }
    failed() {
        this.attempt++;
        this.showError();
        this.shake();
        this.flashRed();
        if (navigator.vibrate) {
            navigator.vibrate(120);
        }
    }
    showError() {
        if (!this.error) return;
        const messages = [
            "Hmm... not quite.",
            "tanggal lahirmu cil",
            "Close... but not today.",
            "A small hint: October.",
            "One more try.",
        ];
        this.error.innerHTML =
            messages[Math.min(
                this.attempt - 1,
                messages.length - 1
            )];
        gsap.fromTo(
            this.error,
            {
                opacity: 0,
                y: -10
            },
            {
                opacity: 1,
                y: 0,
                duration: .4
            }
        );
    }
    shake() {
        if (!this.shakeTarget) return;
        gsap.fromTo(
            this.shakeTarget,
            {
                x: -8
            },
            {
                x: 8,
                repeat: 5,
                yoyo: true,
                duration: .05,
                onComplete: () => {
                    gsap.set(
                        this.shakeTarget,
                        {
                            x: 0
                        }
                    );
                }
            }
        );
    }
    flashRed() {
        gsap.fromTo(
            this.scene,
            {
                filter: "brightness(1)"
            },
            {
                filter: "brightness(1.15)",
                duration: .15,
                repeat: 1,
                yoyo: true
            }
        );
    }
    async success() {
        console.log("SUCCESS");

        if (this.correct) return;
        this.correct = true;
        this.locked = true;
        window.State ??= {};
        window.State.unlocked = true;
        this.button.disabled = true;
        this.button.innerHTML = "Unlocked";
        gsap.to(this.button, {
            background: "#D8B46A",
            color: "#111",
            duration: .5
        });
        await Utils.sleep(700);
        await this.unlockAnimation();
    }
    /* =====================================================
 * UNLOCK SUCCESS ANIMATION
 * PART 2
 * ===================================================== */

    async unlockAnimation() {
        await this.glowCard();
        await Utils.sleep(300);
        this.breakGlass();
        this.createBurst();
        this.showSuccessMessage();
        if (
            window.AudioManager &&
            typeof window.AudioManager.storyVolume ===
            "function"
        ) {
            window.AudioManager.storyVolume();
        }
        await Utils.sleep(2200);
        await this.transitionToStory();
    }
    glowCard() {
        return gsap.to(
            this.shakeTarget,
            {
                boxShadow: `
                0 0 30px rgba(216,180,106,.35),
                0 0 80px rgba(216,180,106,.18)
            `,
                borderColor: "rgba(216,180,106,.6)",
                scale: 1.03,
                duration: .8,
                ease: "power2.out"
            }
        );
    }
    breakGlass() {
        if (!this.shakeTarget) return;
        this.shakeTarget.classList.add("glass-break");
        gsap.fromTo(
            this.shakeTarget,
            {
                filter: "brightness(1.8)"
            },
            {
                filter: "brightness(1)",
                duration: .8
            }
        );
    }
    createBurst() {
        const isMobile = window.matchMedia(
            "(max-width: 768px), (pointer: coarse)"
        ).matches;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) return;

        const total = isMobile ? 24 : 60;

        const fragment =
            document.createDocumentFragment();

        const particles = [];

        for (let i = 0; i < total; i++) {
            const particle =
                document.createElement("span");

            particle.className =
                "unlock-particle";

            particle.style.left =
                `${window.innerWidth / 2}px`;

            particle.style.top =
                `${window.innerHeight / 2}px`;

            fragment.appendChild(particle);
            particles.push(particle);
        }

        document.body.appendChild(fragment);

        particles.forEach(particle => {
            const angle =
                Math.random() * Math.PI * 2;

            const distance = Utils.random(
                isMobile ? 60 : 80,
                isMobile ? 150 : 220
            );

            gsap.set(particle, {
                opacity: 1,
                scale: Utils.random(.5, 1.3)
            });

            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,

                opacity: 0,
                rotation: Utils.random(-360, 360),

                duration: Utils.random(.8, 1.4),
                ease: "power3.out",

                onComplete: () => {
                    particle.remove();
                }
            });
        });
    }
    showSuccessMessage() {
        const message =
            document.createElement("div");

        message.className =
            "unlock-success-message";

        message.innerHTML =
            "Welcome.<br>The night is waiting.";

        document.body.appendChild(message);

        const isMobile = window.matchMedia(
            "(max-width: 768px), (pointer: coarse)"
        ).matches;

        /*
         * Desktop hanya meredupkan background.
         * HP tidak mengubah background sama sekali.
         */
        if (!isMobile) {
            gsap.to("#stars", {
                opacity: .35,
                duration: .5,
                overwrite: "auto"
            });

            gsap.to("#aurora", {
                opacity: .3,
                duration: .5,
                overwrite: "auto"
            });
        }

        gsap.fromTo(
            message,
            {
                opacity: 0,
                y: 30,
                scale: .95
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: .7,
                ease: "power3.out"
            }
        );

        gsap.to(message, {
            opacity: 0,
            delay: 1.6,
            duration: .6,

            onComplete: () => {
                message.remove();

                /*
                 * Hapus inline style GSAP.
                 * Setelah itu kembali mengikuti CSS final.
                 */
                gsap.set("#stars", {
                    clearProps: "opacity,filter"
                });

                gsap.set("#aurora", {
                    clearProps: "opacity,filter"
                });
            }
        });
    }
    async transitionToStory() {
        console.log("TRANSITION");

        await SceneManager.flashTransition();
        await SceneManager.overlayIn();
        await SceneManager.show("story");
        await window.StoryEngine.start();

        await SceneManager.overlayOut();
    }
    reset() {
        this.correct = false;
        this.locked = false;
        this.attempt = 0;
        if (this.button) {
            this.button.disabled = false;
            this.button.innerHTML = "Unlock";
        }
        if (this.error) {
            this.error.innerHTML = "";
        }
    }
    destroy() {
        this.reset();
    }
};

window.UnlockEngine = new UnlockEngine();
console.log("✓ Unlock Engine Loaded");