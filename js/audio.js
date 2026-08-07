/**
 * =====================================================
 * PROJECT AURORA
 * AUDIO MANAGER
 * =====================================================
 */

"use strict";

class AudioManagerCore{

    constructor() {

        this.audio = null;

        this.currentVolume = 0;

        this.targetVolume = CONFIG.MUSIC.VOLUME;

        this.muted = false;

        this.started = false;

        this.fading = false;

    }

    init() {

        this.audio = document.getElementById("bgm");

        if (!this.audio) {

            console.warn("Audio element not found.");

            return;

        }

        this.audio.volume = 0;

        this.audio.loop = true;

        this.bindEvents();

    }

    bindEvents() {

        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {

                this.pause();

            } else {

                this.resume();

            }

        });

    }

    async play() {

        if (!this.audio) return;

        if (this.started) return;

        try {

            await this.audio.play();

            this.started = true;

            this.fadeTo(this.targetVolume);

        } catch (err) {

            console.warn(err);

        }

    }

    pause() {

        if (!this.audio) return;

        this.audio.pause();

    }

    resume() {

        if (!this.audio) return;

        if (!this.started) return;

        this.audio.play().catch(() => {});

    }

    stop() {

        if (!this.audio) return;

        this.audio.pause();

        this.audio.currentTime = 0;

        this.started = false;

    }

    async fadeIn(duration = CONFIG.MUSIC.FADE_DURATION) {

        if (!this.started) {

            await this.play();

        }

        this.fadeTo(this.targetVolume, duration);

    }

    fadeOut(duration = CONFIG.MUSIC.FADE_DURATION) {

        this.fadeTo(0, duration);

    }

    fadeTo(volume, duration = 2000) {

        if (!this.audio) return;

        gsap.to(this.audio, {

            volume,

            duration: duration / 1000,

            ease: "power2.out"

        });

    }

    setVolume(volume) {

        if (!this.audio) return;

        volume = Utils.clamp(volume, 0, 1);

        this.audio.volume = volume;

    }

    increase(step = .05) {

        this.setVolume(this.audio.volume + step);

    }

    decrease(step = .05) {

        this.setVolume(this.audio.volume - step);

    }

    mute() {

        if (!this.audio) return;

        this.audio.muted = true;

        this.muted = true;

    }

    unmute() {

        if (!this.audio) return;

        this.audio.muted = false;

        this.muted = false;

    }

    toggleMute() {

        this.muted

            ? this.unmute()

            : this.mute();

    }

    introVolume() {

        this.fadeTo(.15, 2000);

    }

    storyVolume() {

        this.fadeTo(.35, 2500);

    }

    cakeVolume() {

        this.fadeTo(.45, 2500);

    }

    endingVolume() {

        this.fadeTo(.20, 3500);

    }

    finalFade() {

        this.fadeOut(6000);

    }

}

window.AudioManager = new AudioManagerCore();

console.log("✓ Audio Manager Loaded");