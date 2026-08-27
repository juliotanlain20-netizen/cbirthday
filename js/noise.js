/**
 * =====================================================
 * PROJECT AURORA
 * OPTIMIZED NOISE ENGINE
 * =====================================================
 */

"use strict";

class NoiseEngine {

    constructor() {
        this.element = null;

        /*
         * Nilai normal sesuai CSS final.
         */
        this.strength = .02;
        this.maxStrength = .04;

        this.enabled = false;

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
        this.element = document.getElementById("noise");

        if (!this.element) return;

        /*
         * Noise tidak dijalankan di HP atau reduced motion.
         */
        if (this.disabled) {
            this.element.style.display = "none";
            this.element.style.animationPlayState = "paused";

            this.enabled = false;
            return;
        }

        this.enable();
    }

    enable() {
        if (
            !this.element ||
            this.disabled
        ) {
            return;
        }

        this.enabled = true;

        this.element.style.display = "";
        this.element.style.opacity =
            String(this.strength);

        /*
         * Jalankan kembali animasi CSS.
         */
        this.element.style.animationPlayState = "running";
    }

    disable() {
        if (!this.element) return;

        this.enabled = false;

        this.element.style.opacity = "0";

        /*
         * Opacity 0 saja tidak menghentikan animasi.
         */
        this.element.style.animationPlayState = "paused";
    }

    setStrength(value) {
        const parsedValue = Number(value);

        if (!Number.isFinite(parsedValue)) {
            console.warn(
                "Noise strength harus berupa angka."
            );

            return;
        }

        /*
         * Batasi supaya noise tidak terlalu kuat.
         */
        this.strength = Math.min(
            Math.max(parsedValue, 0),
            this.maxStrength
        );

        if (
            this.element &&
            this.enabled &&
            !this.disabled
        ) {
            this.element.style.opacity =
                String(this.strength);
        }
    }

    destroy() {
        this.disable();
        this.element = null;
    }
}

window.NoiseEngine = new NoiseEngine();

console.log("✓ Optimized Noise Engine Loaded");