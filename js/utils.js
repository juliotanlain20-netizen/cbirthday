/**
 * =====================================================
 * PROJECT AURORA
 * UTILS
 * =====================================================
 */

"use strict";

const Utils = {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    lerp(start, end, amount) {
        return start + (end - start) * amount;
    },
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },
    degToRad(deg) {
        return deg * Math.PI / 180;
    },
    radToDeg(rad) {
        return rad * 180 / Math.PI;
    },
    distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    },
    uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
            .replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                const v = c === "x" ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    },
    debounce(callback, delay = 250) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => callback(...args), delay);
        };
    },
    throttle(callback, limit = 100) {
        let waiting = false;
        return (...args) => {
            if (waiting) return;
            callback(...args);
            waiting = true;
            setTimeout(() => waiting = false, limit);
        };
    },
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    },
    qs(selector, parent = document) {
        return parent.querySelector(selector);
    },
    qsa(selector, parent = document) {
        return [...parent.querySelectorAll(selector)];
    },
    create(tag, className = "") {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    },
    css(element, styles = {}) {
        Object.assign(element.style, styles);
    },
    fadeIn(element, duration = .8) {
        gsap.to(element, {
            opacity:1,
            duration
        });
    },
    fadeOut(element, duration = .8) {
        gsap.to(element, {
            opacity:0,
            duration
        });
    },
    preloadImages() {
        const images = [...document.images];
        return Promise.all(
            images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            })
        );
    },
    preloadAudio(audio) {
        return new Promise(resolve => {
            audio.addEventListener("canplaythrough", resolve, {
                once:true
            });
        });
    },
    isMobile() {
        return window.innerWidth <= 768;
    },
    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },
    isDesktop() {
        return window.innerWidth > 1024;
    },
    viewport() {
        return {
            width:window.innerWidth,
            height:window.innerHeight
        };
    },
    waitFor(condition, interval = 50) {
        return new Promise(resolve => {
            const timer = setInterval(() => {
                if (condition()) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
    },
    once(element, event, callback) {
        element.addEventListener(event, callback, {
            once:true
        });
    },
    removeChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    formatNumber(number) {
        return number.toLocaleString();
    },
    monthName(month) {
        const months = [
            "January","February","March",
            "April","May","June",
            "July","August","September",
            "October","November","December"
        ];
        return months[month - 1];
    },
    lockScroll() {
        document.body.style.overflow = "hidden";
    },
    unlockScroll() {
        document.body.style.overflow = "";
    }
};
window.Utils = Utils;
window.sleep = Utils.sleep;
window.random = Utils.random;
window.clamp = Utils.clamp;
window.lerp = Utils.lerp;

console.log("✓ Utils Loaded");