/**
 * =====================================================
 * PROJECT AURORA
 * GALLERY ENGINE
 * =====================================================
 */"use strict";
class GalleryEngine {
    constructor() {
        this.scene = null;
        this.photos = [];
        this.finished = false;
        this.viewer = null;
        this.current = 0; this.opened = false; this.mouse = {
            x: 0, y: 0
        };
        this.nextButton = null;
    }
    init() {
        console.log("Gallery init");
        this.scene = document.getElementById("gallery");
        if (!this.scene) return;

        this.cards = [
            ...this.scene.querySelectorAll(".photo")
        ];

        const letters = {
            "Growth": `
        <p>
            Maybe not everyone gets to see this side of you. Quiet effort, long hours, and countless little things that make you who you are.
        </p>

    `,
            "Pocket-Sized": `
        <p>
            I wonder what little Chika dreamed about back then. Whatever those dreams were, I hope she'd be proud of the wonderful person you've become today.Happy 20th Birthday, little one.
        </p>
    `,

            "Cute": `
        <p>
            Some smiles never really change. This one still feels just as warm as the first time I saw it. I hope life never takes away this part of you.
        </p>
    `,

            "Beautiful": `
         <p>
            There are probably prettier photos. But somehow... This one has always felt the most "you" to me.
        </p>
    `,

            "Radiance": `
        <p>
            Some people simply have a way of brightening a room without trying.This photo reminds me of that kind of light. Quiet, gentle, and unforgettable.
        </p>

    `,

            "Stunning": `
        <p>
            I don't think this one needs an explanation.
        </p>
    `
        };

        this.photos = this.cards.map(card => {

            const caption = card.querySelector("span").textContent.trim();

            return {
                src: card.querySelector("img").src,
                caption,
                letter: letters[caption] || ""
            };

        });

        this.nextButton = document.getElementById("galleryNext");

        this.bindEvents();
    }
    async finish() {
        if (this.finished)
            return;
        this.finished = true;
        if (this.viewer) {
            this.close();
            await Utils.sleep(450);
        }
        await SceneManager.flashTransition();
        await SceneManager.show("blessing");
        await Utils.sleep(300);
        window.BlessingEngine.start();

    }
    bindEvents() {

        if (this.nextButton) {
            this.nextButton.addEventListener(
                "click",
                () => this.finish()
            );
        }

        this.cards.forEach((card, index) => {

            card.addEventListener(
                "click",
                () => this.open(index)
            );

            card.addEventListener(
                "mouseenter",
                () => this.hover(card, true)
            );

            card.addEventListener(
                "mouseleave",
                () => this.hover(card, false)
            );

        });

        window.addEventListener(
            "mousemove",
            e => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.parallax();

            }
        );

        document.addEventListener(
            "keydown",
            e => {
                if (!this.opened)
                    return;
                switch (e.key) {
                    case "Escape":
                        this.close();
                        break;
                    case "ArrowRight":
                        this.next();
                        break;
                    case "ArrowLeft":
                        this.previous();
                        break;
                }
            }
        );
    }
    hover(card, state) {
        if (state) {
            gsap.to(card, {
                scale: 1.12,
                rotateY: 10,
                z: 60,
                duration: .4,
                ease: "power3.out"
            });
        }
        else {
            gsap.to(card, {
                scale: 1,
                rotateY: 0,
                z: 0,
                duration: .4
            });
        }
    }
    parallax() {
        if (!this.cards) return;
        this.cards.forEach(card => {
            const depth = .02;
            gsap.to(card, {
                x:
                    (this.mouse.x - window.innerWidth / 2)
                    * depth,
                y:
                    (this.mouse.y - window.innerHeight / 2)
                    * depth,
                duration: 1
            });
        });
    }
    reveal() {
        if (!this.cards) return;
        gsap.fromTo(
            this.cards,
            {
                opacity: 0,
                y: 80,
                rotate: 0
            },
            {
                opacity: 1,
                y: 0,
                stagger: .15,
                duration: 1,
                ease: "power3.out"
            }
        );
    }
    open(index, force = false) {
        if (this.opened && !force) return;
        if (this.viewer) {
            this.viewer.remove();
            this.viewer = null;
        }
        this.opened = true;
        this.current = index;
        if (!this.photos[index])
            return;
        const photo = this.photos[index];
        this.viewer = document.createElement("div");
        this.viewer.className = "image-viewer";
        this.viewer.innerHTML = `
    <div class="viewer-content">

        <button class="viewer-prev">
            &#10094;
        </button>

        <img src="${photo.src}">

        <button class="viewer-next">
            &#10095;
        </button>

        <div class="viewer-content">

    <h2>${photo.caption}</h2>

    <div class="viewer-letter">
        ${photo.letter}
    </div>

</div>

    </div>
`;
        document.body.appendChild(this.viewer);
        this.viewer
            .querySelector(".viewer-prev")
            .addEventListener("click", e => {

                e.stopPropagation();
                this.previous();

            });

        this.viewer
            .querySelector(".viewer-next")
            .addEventListener("click", e => {

                e.stopPropagation();
                this.next();

            });
        gsap.fromTo(
            this.viewer,
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: .5
            }
        );

        this.viewer.addEventListener(
            "click",
            () => this.close()
        );
    }
    close() {
        if (!this.viewer) return;
        gsap.to(
            this.viewer,
            {
                opacity: 0,
                duration: .4,
                onComplete: () => {
                    this.viewer.remove();
                    this.viewer = null;
                    this.opened = false;
                }
            }
        );
    }
    next() {
        let index = this.current + 1;
        if (index >= this.photos.length)
            index = 0;
        this.open(index, true);
    }
    previous() {
        let index = this.current - 1;
        if (index < 0) index = this.photos.length - 1;
        this.open(index, true);
    } destroy() {
        this.cards = [];
        this.photos = [];
    }
}
window.GalleryEngine = new GalleryEngine();
console.log("✓ Gallery Engine Loaded");