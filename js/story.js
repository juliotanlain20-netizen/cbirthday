/**
 * =====================================================
 * PROJECT AURORA
 * STORY ENGINE
 * PART 1
 * =====================================================
 */

"use strict";


class StoryEngine {


    constructor() {
        this.ambientCreated = false;
        this.typingToken = 0;
        this.scene = null;
        this.container = null;
        this.title = null;
        this.text = null;
        this.progress = null;
        this.current = 0;
        this.typing = false;
        this.finishedTyping = false;
        this.story = [
            {
                title: "A Special Day",

                text:
                    "Some moments deserve a little more than just a simple greeting."
            },
            {
                title: "Twenty",
                text:
                    "Today marks another beautiful chapter of your journey. Twenty years of memories, dreams, laughter, and countless little moments that shaped who you are."
            },

            {
                title: "Keep Shining",
                text:
                    "I hope life continues to bring you reasons to smile, people who appreciate you, and opportunities that lead you closer to your dreams."
            },
            {
                title: "A Little Reminder",
                text:
                    "Never forget that you are someone valuable. The world is brighter because you exist in it."
            },
            {
                title: "Your Day",
                text:
                    "So today, celebrate yourself. Eat something sweet, make a wish, and enjoy every little happiness that comes your way."
            },
            {
                title: "Happy Birthday",
                text:
                    "Happy 20th Birthday, Chika. May this new chapter bring you endless happiness, peace, and beautiful surprises."
            }

        ];
    }
    init() {
        console.log("===== STORY INIT =====");
        this.scene = document.getElementById("story");
        this.container = this.scene.querySelector(".story-wrapper");
        this.title = document.getElementById("storyTitle");
        this.text = document.getElementById("storyText");
        this.enableSwipe();


        this.progress = this.scene.querySelector(".story-bar");

        this.bindEvents();
    }
    bindEvents() {
        this.scene.addEventListener("click", () => {
            if (!SceneManager.is("story")) return;
            this.next();
        });
        const next =
            this.scene.querySelector(".story-next");
        const prev =
            this.scene.querySelector(".story-prev");
        if (next) {
            next.addEventListener(
                "click",
                () => this.next()
            );
        }
        if (prev) {
            prev.addEventListener(
                "click",
                () => this.previous()
            );

        }

        document.addEventListener(
            "keydown",
            e => {
                if (!SceneManager.is("story"))
                    this.typing = false;
                return;

                if (e.key === "ArrowRight") {
                    this.next();
                }

                if (e.key === "ArrowLeft") {
                    this.previous();
                }
            }
        );
    }
    async start() {

        console.log("STORY START");

        this.current = 0;
        this.typing = false;
        this.finishedTyping = false;
        this.typingToken++;

        await this.prepare();

        gsap.killTweensOf(this.container);

        gsap.set(this.container, {
            opacity: 1,
            y: 0,
            clearProps: "transform"
        });

    }
    async show() {

        if (this.typing) return;
        const data = this.story[this.current];
        if (!data) return;
        this.finishedTyping = false;

        if (this.current > 0) {
            this.animateOut();
            await Utils.sleep(500);
        }
        this.title.textContent = data.title;
        this.text.innerHTML = "";
        this.updateProgress();
        await this.animateIn();
        await this.typeText(data.text);

    }

    // async start() {
    //     console.log("STORY START");
    //     this.current = 0;
    //     console.log("STORY START A");
    //     await this.prepare();
    //     console.log("STORY START B");
    //     gsap.killTweensOf(this.container);

    //     gsap.set(this.container, {
    //         opacity: 1,
    //         y: 0,
    //         clearProps: "transform"
    //     });
    //     await this.show();
    //     console.log("STORY START C");
    // }
    // async show() {
    //     console.log("SHOW STORY", this.current);
    //     if (this.typing) return;
    //     const data = this.story[this.current];
    //     if (!data) return;
    //     this.finishedTyping = false;
    //     // hanya scene kedua dst
    //     if (this.current > 0) {
    //         this.animateOut();
    //         await Utils.sleep(500);
    //     }
    //     console.log("SET TITLE");
    //     this.title.textContent = data.title;
    //     this.text.innerHTML = "";
    //     this.updateProgress();
    //     console.log("ANIMATE");
    //     await this.animateIn();
    //     console.log("TYPE");
    //     await this.typeText(data.text);
    // }
    async typeText(content) {
        for (const char of content) {
            if (!SceneManager.is("story")) {
                return;
            }
        }
        const token = ++this.typingToken;
        this.typing = true;
        this.text.innerHTML = "";
        for (const char of content) {
            if (token !== this.typingToken){
                return;}
            if (!SceneManager.is("story")){
                this.typing = false;
            return;}
            this.text.innerHTML += char;
            await Utils.sleep(CONFIG.STORY.TYPE_SPEED);
        }
        this.typing = false;
        this.finishedTyping = true;
    }
    next() {
        if (this.typing) {
            this.typingToken++;
            this.typing = false;
            this.text.innerHTML =
                this.story[this.current].text;
            this.finishedTyping = true;

            return;
        }
        if (
            this.current <
            this.story.length - 1
        ) {
            this.current++;
            this.show();
        }

        else {

            this.finish();

        }


    }

    previous() {
        if (this.current > 0) {
            this.current--;
            this.show();
        }
    }
    updateProgress() {

        if (!this.progress)
            return;
        const percent =
            ((this.current + 1)
                /
                this.story.length)
            * 100;
        this.progress =
            this.scene.querySelector(".story-bar");
        this.progress.style.width =
            percent + "%";
    }
    async animateIn() {
        gsap.fromTo(
            this.container,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            }
        );
    }

    animateOut() {
        gsap.to(
            this.container,
            {
                opacity: 0,
                y: -30,
                duration: .5
            }
        );
    }

    /* =====================================================
 * STORY CINEMATIC SYSTEM
 * PART 2
 * ===================================================== */


    createAmbientWords() {

        if (this.ambientCreated) return;
        this.ambientCreated = true;
        const words = [
            "memories",
            "dreams",
            "smiles",
            "hope",
            "future",
            "happiness",
            "beautiful",
            "twenty"
        ];
        if (this.scene.querySelector(".ambient-words"))
            return;
        const wrapper =
            document.createElement("div");
        wrapper.className =
            "ambient-words";
        this.scene.appendChild(wrapper);
        const positions = [

            { left: 15, top: 18 },
            { left: 82, top: 18 },

            { left: 15, top: 42 },
            { left: 82, top: 42 },

            { left: 18, top: 70 },
            { left: 82, top: 70 },

            { left: 50, top: 12 },
            { left: 50, top: 86 }

        ];

        words.forEach((word, index) => {

            const span = document.createElement("span");

            span.className = "ambient-word";
            span.innerHTML = word;

            const pos = positions[index];

            span.style.left = pos.left + "%";
            span.style.top = pos.top + "%";

            wrapper.appendChild(span);

            gsap.to(span, {
                y: Utils.random(-25, 25),
                x: Utils.random(-15, 15),
                opacity: .25,
                duration: Utils.random(5, 8),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        });
    }
    cameraMove() {
        const scene =
            document.querySelector("#story");
        if (!scene)
            return;
        gsap.to(scene, {
            backgroundPosition:
                `${Utils.random(40, 60)}% ${Utils.random(40, 60)}%`,
            duration: 8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    }
    createPhoto(image) {
        const frame =
            document.createElement("div");
        frame.className =
            "story-photo";
        const img =
            document.createElement("img");
        img.src = image;
        frame.appendChild(img);
        this.scene.appendChild(frame);
        gsap.fromTo(
            frame,
            {
                opacity: 0,
                scale: .8,
                rotate: -10
            },
            {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 1,
                ease: "back.out"
            }
        );
    }
    enableSwipe() {
        let startX = 0;
        this.scene.addEventListener(
            "touchstart",
            e => {
                startX =
                    e.changedTouches[0].screenX;
            }
        );
        this.scene.addEventListener(
            "touchend",
            e => {
                let endX =
                    e.changedTouches[0].screenX;
                if (
                    startX - endX > 70
                ) {
                    this.next();
                }
                if (
                    endX - startX > 70
                ) {
                    this.previous();
                }
            }
        );
    }

    async autoPlay(interval = 6000) {
        while (
            SceneManager.is("story")
        ) {
            await Utils.sleep(interval);
            if (!this.typing) {
                this.next();
            }
        }
    }
    showQuote(text) {
        const quote =
            document.createElement("div");
        quote.className =
            "story-quote";
        quote.innerHTML =
            text;
        document.body.appendChild(
            quote
        );
        gsap.fromTo(
            quote,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            }
        );

        gsap.to(
            quote,
            {
                opacity: 0,
                delay: 4,
                duration: 1,
                onComplete() {

                    quote.remove();

                }
            }
        );
    }
    async prepare() {
        this.prepared = true;
        this.createAmbientWords();
        this.cameraMove();
    }
    async finish() {
        await SceneManager.flashTransition();
        await Utils.sleep(500);
        await SceneManager.show(
            "celebration"
        );
    }
    reset() {
        this.current = 0;
        this.typing = false;
        if (this.text)
            this.text.innerHTML = "";
    }
    destroy() {
        gsap.killTweensOf(
            this.container
        );
    }
}
window.StoryEngine =
    new StoryEngine();
console.log(
    "✓ Story Engine Part 1 Loaded"
);
