/**
 * =====================================================
 * PROJECT AURORA
 * INTRO ENGINE
 * PART 1
 * =====================================================
 */

"use strict";

class IntroEngineCore {

    constructor() {
        this.scene = null;
        this.typing = null;
        this.hint = null;
        this.started = false;
        this.finished = false;
        this.skipped = false;
        this.timeline = null;
        this.messages = [
            "Some days...",
            // "are just ordinary.",
            // "But once every year...",
            // "One day belongs to one person.",
            // "Today...",
            // "is yours.",
            // "Happy Birthday."
        ];
        this.index = 0;
    }
    init() {
        this.scene = document.getElementById("intro");
        if (!this.scene) return;
        this.typing = document.getElementById("introTyping");
        this.hint = this.scene.querySelector(".scrollHint");
        this.bindEvents();
    }
    bindEvents() {
        document.addEventListener("keydown", e => {
            if (e.code === "Space") {
                this.skip();
            }
        });
    }
    async start() {

        if (this.started) return;

        this.started = true;
        this.finished = false;
        this.skipped = false;

        gsap.killTweensOf(".intro-content");

        gsap.set(".intro-content", {
            clearProps: "all",
            opacity: 1,
            scale: 1,
            visibility: "visible"
        });

        gsap.set(".intro-title", {
            clearProps: "all"
        });

        gsap.set(".intro-subtitle", {
            clearProps: "all"
        });

        this.cameraIn();

        this.playTimeline();
        gsap.killTweensOf(this.hint);

        if (this.hint) {
            gsap.set(this.hint, {
                opacity: 0,
                y: 0,
                display: "none"
            });
        }

        this.startAmbient();

        this.showHint(false);

        // await Utils.sleep(CONFIG.INTRO.FIRST_DELAY);
        await Utils.sleep(1800);

        await this.playSequence();

    }
    showHint(show = true) {

        if (!this.hint) return;

        gsap.killTweensOf(this.hint);

        gsap.to(this.hint, {

            opacity: show ? 0.7 : 0,

            duration: .5

        });

    }
    async playSequence() {
        for (let i = 0; i < this.messages.length; i++) {
            if (this.skipped) break;
            await this.type(this.messages[i]);
            await Utils.sleep(900);
            await this.erase();
            await Utils.sleep(400);
        }
        if (!this.skipped) {
            await this.finish();
        }
    }
    async type(text) {
        this.typing.innerHTML = "";
        for (let char of text) {
            if (this.skipped) return;
            this.typing.innerHTML += char;
            await Utils.sleep(CONFIG.INTRO.TYPE_SPEED);
        }
    }
    async erase() {
        const text = this.typing.innerHTML;
        for (let i = text.length; i >= 0; i--) {
            if (this.skipped) return;
            this.typing.innerHTML = text.substring(0, i);
            await Utils.sleep(20);
        }
    }
    async skip() {
        if (this.skipped || this.finished)
            return;
        this.skipped = true;
        if (this.typing) {
            this.typing.innerHTML = "";
        }
        await this.finish();

    }
    async finish() {
        if (this.finished) return;
        this.finished = true;
        await this.transitionOut();

    }

    async transitionOut() {

        await this.cinematicTransition();

        await SceneManager.show("unlock");

        if (window.AudioManager) {

            AudioManager.fadeIn();

            AudioManager.introVolume();

        }

    }

    /* =====================================================
     * INTRO CINEMATIC
     * PART 2
     * ===================================================== */

    createTimeline() {
        this.timeline = gsap.timeline({
            paused: true
        });
        this.timeline
            .from(".intro-title", {
                y: 10,
                opacity: 0,
                duration: 1.4,
                ease: "power4.out"
            })
            .from(".intro-subtitle", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=.8")
            .from("#introTyping", {
                opacity: 0,
                duration: .8
            }, "-=.3")
            .from(".scrollHint", {
                opacity: 0,
                y: 20,
                duration: .8
            });
    };
    playTimeline() {
        if (!this.timeline) {
            this.createTimeline();
        }
        this.timeline.restart();
    }
    animateBackground() {
        gsap.to("#aurora", {
            scale: 1.08,
            rotation: 4,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    pulseHint() {

        if (!this.hint) return;

        gsap.killTweensOf(this.hint);

        gsap.to(this.hint, {

            y: -8,

            opacity: .7,

            repeat: -1,

            yoyo: true,

            duration: 1.5,

            ease: "sine.inOut"

        });

    }
    animateTitle() {
        gsap.to(".intro-title", {
            y: -4,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    animateSubtitle() {
        gsap.to(".intro-subtitle", {
            opacity: .7,
            duration: 2,
            repeat: -1,
            yoyo: true

        });

    }
    startAmbient() {
        this.animateBackground();
        this.animateTitle();
        this.animateSubtitle();
        // this.pulseHint();
    }
    cameraIn() {

        return new Promise(resolve => {

            gsap.fromTo(

                ".intro-content",

                {
                    opacity: 0,
                    scale: 1.08
                },

                {
                    opacity: 1,
                    scale: 1,
                    duration: 2,
                    ease: "power3.out",
                    clearProps: "transform",
                    onComplete: resolve
                }

            );

        });

    }

    cameraOut() {

        return new Promise(resolve => {
            gsap.to(
                ".intro-content",
                {
                    opacity: 0,
                    scale: .96,
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: resolve
                }
            );
        });
    }

    flash() {
        const flash = document.getElementById("flash");
        if (!flash) return;
        gsap.fromTo(

            flash,

            {
                opacity: 0
            },

            {
                opacity: 1,
                duration: .15,
                repeat: 1,
                yoyo: true
            }
        );
    }
    showOverlay() {
        const overlay = document.getElementById("transitionOverlay");
        if (!overlay) return;
        gsap.to(overlay, {
            opacity: 1,
            duration: .6

        });

    }

    hideOverlay() {

        const overlay = document.getElementById("transitionOverlay");

        if (!overlay) return;

        gsap.to(overlay, {

            opacity: 0,

            duration: .6

        });

    }

    async cinematicTransition() {
        this.flash();
        await Utils.sleep(250);
        this.showOverlay();
        await Utils.sleep(600);
        await this.cameraOut();
        this.hideOverlay();

    }

    destroy() {

        if (this.timeline) {

            this.timeline.kill();

            this.timeline = null;

        }

        gsap.killTweensOf("*");

        gsap.set(".intro-content", {
            clearProps: "all"
        });

    }
    resetState() {

        this.finished = false;
        this.skipped = false;
        this.started = false;

        gsap.killTweensOf(".intro-content");
        gsap.killTweensOf(".intro-title");
        gsap.killTweensOf(".intro-subtitle");
        gsap.killTweensOf(".scrollHint");

        gsap.set(".intro-content", {
            clearProps: "all",
            opacity: 1,
            scale: 1,
            visibility: "visible"
        });

    }

};

window.IntroEngine = new IntroEngineCore();

console.log("✓ Intro Engine Part 1 Loaded");