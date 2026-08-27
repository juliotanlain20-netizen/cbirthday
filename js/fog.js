/**
 * =====================================================
 * PROJECT AURORA
 * OPTIMIZED FOG ENGINE
 * =====================================================
 */

"use strict";

class FogEngine {

    constructor() {
        this.element = null;

        this.maxOpacity = .25;

        this.isMobile = window.matchMedia(
            "(max-width: 768px), (pointer: coarse)"
        ).matches;

        this.reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.disabled =
            this.isMobile ||
            this.reduceMotion;
    }

    init() {
        this.element = document.getElementById("fog");

        if (!this.element) return;

        /*
         * Fog dimatikan sepenuhnya di HP.
         */
        if (this.disabled) {
            this.element.style.display = "none";
            return;
        }

        /*
         * Fallback apabila GSAP belum dimuat.
         */
        if (!window.gsap) {
            this.element.style.opacity = this.maxOpacity;
            return;
        }

        /*
         * Mulai dari transparan.
         */
        window.gsap.set(this.element, {
            opacity: 0
        });

        window.gsap.to(this.element, {
            opacity: this.maxOpacity,
            duration: 2,
            ease: "power2.out",
            overwrite: "auto"
        });
    }

    fadeIn() {
        if (
            !this.element ||
            this.disabled
        ) {
            return;
        }

        if (!window.gsap) {
            this.element.style.opacity = this.maxOpacity;
            return;
        }

        window.gsap.to(this.element, {
            opacity: this.maxOpacity,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto"
        });
    }

    fadeOut() {
        if (
            !this.element ||
            this.disabled
        ) {
            return;
        }

        if (!window.gsap) {
            this.element.style.opacity = 0;
            return;
        }

        window.gsap.to(this.element, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto"
        });
    }

    destroy() {
        if (
            this.element &&
            window.gsap
        ) {
            window.gsap.killTweensOf(this.element);
        }

        this.element = null;
    }
}

window.FogEngine = new FogEngine();
console.log("✓ Optimized Fog Engine Loaded");