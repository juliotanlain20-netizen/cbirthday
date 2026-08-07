/**
 * =====================================================
 * PROJECT AURORA
 * BLESSING ENGINE
 * ACT VI
 * =====================================================
 */

"use strict";


class BlessingEngine {
    constructor() {
        this.scene = null;
        this.textElement = null;
        this.nextButton = null;
        this.index = 0;
        this.finished = false;
        this.messages = [
            "Before you go...",
            // "Once again, Happy 20th Birthday, Chika.",
            // "May this new chapter bring you endless happiness, gentle peace, and little moments worth remembering.",
            // "May you always find reasons to smile, even on days that feel a little heavier.",
            // "I hope life brings you kind people, beautiful surprises, and dreams that slowly become reality.",
            // "May you never lose your kindness, your courage, or the light that makes you who you are.",
            // "Keep growing, keep shining, and never stop believing in yourself.",
            // "And above all, may God walk beside you through every season of life, protect your heart, guide your steps, and bless every dream you carry.",
            // "May your twenties be filled with love, laughter, meaningful memories, and stories you'll one day look back on with a grateful heart.",
            // "Thank you for taking a little journey through this page.",
            // "Happy Birthday, Chika.",
            // "May God bless you, always."

        ];

    }

    init() {
        this.scene = document.getElementById("blessing");
        if (!this.scene) return;
        this.textElement =
            this.scene.querySelector("#blessingText");
        this.nextButton =
            this.scene.querySelector("#continueEnding");
        console.log(this.textElement);
        console.log(this.nextButton);

        this.bindEvents();
    }

    bindEvents() {
        if (this.nextButton) {
            this.nextButton.addEventListener(
                "click",
                () => this.next()
            );
        }
    }

    async start() {
        this.index = 0;
        this.finished = false;
        this.textElement.innerHTML = "";
        this.nextButton.innerHTML = "Continue";
        this.nextButton.style.pointerEvents = "none";
        const title = document.getElementById("blessingTitle");
        gsap.set(title, { opacity: 1 });
        await Utils.sleep(1500);
        await gsap.to(title, {
            opacity: 0,
            y: -20,
            duration: 0.6
        });
        title.style.display = "none";
        this.createAmbient();
        await this.showNext();
    }




    async showNext() {
        console.log("SHOW NEXT", this.index);
        if (this.index >= this.messages.length) {

            this.finish();
            return;

        }
        gsap.set(this.nextButton, {
            opacity: 0,
            pointerEvents: "none"
        });
        this.textElement.innerHTML = "";
        await this.type(
            this.messages[this.index]
        );
        this.index++;
        gsap.to(this.nextButton, {
            opacity: 1,
            duration: .5
        });
        this.nextButton.style.pointerEvents = "auto";
        if (this.index === this.messages.length) {
            this.nextButton.innerHTML = "Finish";
        } else {
            this.nextButton.innerHTML = "Continue";
        }
    }
    async type(text) {
        console.log("TYPE START", text);
        if (!this.textElement) return;
        this.textElement.innerHTML = "";
        for (const char of text) {
            this.textElement.innerHTML += char;
            await Utils.sleep(45);
        }
    }
    async next() {
        console.log("NEXT DIPANGGIL");
        console.log("NEXT", this.index);
        this.nextButton.style.pointerEvents = "none";
        await gsap.to(
            this.textElement,
            {
                opacity: 0,
                y: -20,
                duration: .4
            }
        );
        this.textElement.innerHTML = "";

        gsap.set(
            this.textElement,
            {
                opacity: 1,
                y: 0
            }
        );

        await this.showNext();

    }


    createAmbient() {

        // Hapus ambient lama
        this.scene.querySelectorAll(".ambient-word").forEach(el => el.remove());

        const words = [
            "hope",
            "dream",
            "smile",
            "future",
            "happiness",
            "shine",
            "beautiful"
        ];

        words.forEach(word => {

            const el = document.createElement("span");
            el.className = "ambient-word";
            el.textContent = word;

            this.scene.appendChild(el);

            gsap.set(el, {
                x: Utils.random(-400, 400),
                y: Utils.random(-250, 250),
                opacity: 0
            });

            gsap.to(el, {
                opacity: 0.65,
                duration: 2
            });

            gsap.to(el, {
                y: "-=80",
                duration: Utils.random(5, 10),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }
    async finish() {
        if (this.finished) return;
        this.finished = true;
        window.State.blessingFinished = true;
        await gsap.to(
            this.textElement,
            {
                opacity: 0,
                duration: 1
            }
        );

        await Utils.sleep(1500);
        await SceneManager.show("ending");
        window.EndingEngine.start();

    }

    destroy() {
        this.index = 0;
        this.finished = false;
    }
}
window.BlessingEngine = new BlessingEngine();
console.log("✓ Blessing Engine Loaded");