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
            "Close... but not today.",
            "A small hint: October.",
            "One more try.",
            "tanggal lahirmu cil"
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
        AudioManager.storyVolume();
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
        const total = 80;
        for (let i = 0; i < total; i++) {
            const p = document.createElement("span");
            p.className = "unlock-particle";
            document.body.appendChild(p);
            const angle = Math.random() * Math.PI * 2;
            const distance = Utils.random(80, 220);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            gsap.set(p, {
                left: window.innerWidth / 2,
                top: window.innerHeight / 2,
                opacity: 1,
                scale: Utils.random(.5, 1.6)
            });
            gsap.to(p, {
                x,
                y,
                opacity: 0,
                rotation: Utils.random(-360, 360),
                duration: Utils.random(.8, 1.6),
                ease: "power3.out",
                onComplete() {
                    p.remove();
                }
            });
        }
    }
    showSuccessMessage() {
        const message = document.createElement("div");
        message.className = "unlock-success-message";
        message.innerHTML =
            "Welcome.<br>The night is waiting.";
        document.body.appendChild(message);
         gsap.to("#stars", {
            filter: "blur(8px)",
            opacity: 0.25,
            duration: .6
        });

        gsap.to("#aurora", {
            filter: "blur(90px)",
            opacity: .35,
            duration: .6
        });
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
                duration: .8,
                ease: "power3.out"
            }
        );
        gsap.to(
            message,
            {
                opacity: 0,
                delay: 1.8,
                duration: .8,
                onComplete() {
                    message.remove();
                }
            }
        );
        
    }
    async transitionToStory() {
        console.log("TRANSITION");   
        await SceneManager.flashTransition();
        await SceneManager.overlayIn();
        await Utils.sleep(300);
        // reset StoryEngine
        await window.StoryEngine.start();
        // tampilkan scene
    await SceneManager.show("story");
        // setelah scene aktif baru tampilkan isi
        await window.StoryEngine.show();
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