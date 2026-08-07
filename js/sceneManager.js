/**
 * PROJECT AURORA
 * SCENE MANAGER
 * =====================================================
 */

"use strict";
const SceneManager = {
    current: 0,
    transitioning: false,
    duration: 1.2,
    scenes: [],
    overlay: null,
    flash: null,

    init() {

        this.scenes = [...document.querySelectorAll(".scene")];
        this.overlay = document.getElementById("transitionOverlay");
        this.flash = document.getElementById("flash");

        this.hideAll();

        this.show(0, false);
    },
    hideAll() {
        this.scenes.forEach(scene => {
            scene.classList.remove("active");
            scene.style.opacity = 0;
            scene.style.pointerEvents = "none";
            scene.style.filter = "blur(12px)";
        });
    },
    async show(target, animate = true) {
        if (this.transitioning) return;
        this.transitioning = true;
        const index = this.resolve(target);
        if (index === -1) {
            this.transitioning = false;
            return;
        }
        const currentScene = this.scenes[this.current];
        const nextScene = this.scenes[index];
        if (currentScene && animate) {
            await this.leave(currentScene);
        }
        this.current = index;
        await this.enter(nextScene, animate);
        this.transitioning = false;
        gsap.to("#stars", {
            filter: "blur(10px)",
            duration: .6
        });

        gsap.to("#aurora", {
            filter: "blur(80px)",
            duration: .6
        });
        gsap.to("#stars", {
            filter: "blur(0px)",
            duration: .6
        });

        gsap.to("#aurora", {
            filter: "blur(70px)",
            duration: .6
        });
    },
    async next() {
        if (this.current >= this.scenes.length - 1) return;
        await this.show(this.current + 1);
    },

    async previous() {
        if (this.current <= 0) return;
        await this.show(this.current - 1);

    },
    async enter(scene, animate) {

        scene.classList.add("active");
        scene.style.display = "flex";
        scene.style.pointerEvents = "auto";

        if (!animate) {
            scene.style.opacity = 1;
            scene.style.filter = "blur(0)";
            return;
        }

        // khusus story
        if (scene.id === "story") {
            scene.style.opacity = 1;
            scene.style.filter = "blur(0)";
            return;
        }

        gsap.fromTo(
            scene,
            {
                opacity: 0,
                scale: .97,
                filter: "blur(12px)"
            },
            {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: this.duration,
                ease: "power3.out"
            }
        );

        await Utils.sleep(this.duration * 1000);
    },
    async leave(scene) {
        scene.style.pointerEvents = "none";
        gsap.to(
            scene,
            {
                opacity: 0,
                scale: .98,
                filter: "blur(12px)",
                duration: .8,
                ease: "power2.inOut"
            }
        );
        await Utils.sleep(800);
        scene.classList.remove("active");
        gsap.set(scene, {
            display: "none"
        });
    },
    async flashTransition() {
        if (!this.flash) return;
        gsap.fromTo(
            this.flash,
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: .15,
                yoyo: true,
                repeat: 1
            }
        );
        await Utils.sleep(350);
    },
    async overlayIn() {
        if (!this.overlay) return;
        gsap.to(
            this.overlay,
            {
                opacity: 1,
                duration: .5
            }
        );
        await Utils.sleep(500);
    },
    async overlayOut() {
        if (!this.overlay) return;
        gsap.to(
            this.overlay,
            {
                opacity: 0,
                duration: .5
            }
        );
        await Utils.sleep(500);
    },
    resolve(target) {
        if (typeof target === "number") {
            return target;
        }
        return this.scenes.findIndex(scene => scene.id === target);
    },
    currentScene() {
        return this.scenes[this.current];
    },
    currentId() {
        return this.currentScene().id;
    },
    is(name) {
        return this.currentId() === name;
    },
    async jump(name) {
        await this.show(name);
    },
    lock() {
        this.transitioning = true;
    },
    unlock() {
        this.transitioning = false;
    },
    destroy() {
        this.scenes.forEach(scene => {
            gsap.killTweensOf(scene);
        });
    }
};
window.SceneManager = SceneManager;