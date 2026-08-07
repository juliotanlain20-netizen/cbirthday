/**
 * =====================================================
 * PROJECT AURORA
 * ENDING ENGINE
 * =====================================================
 */

"use strict";
class EndingEngine {
    constructor() {
        this.scene = null;
        this.started = false;
        this.finished = false;
    }
    init() {
        this.scene =
            document.getElementById("ending");
        if (!this.scene)
            return;
    }
    async start() {
        if (this.started)
            return;
        this.started = true;
        AudioManager.endingVolume();
        await Utils.sleep(1000);
        this.revealMoon();
        this.revealCharacters();
        await Utils.sleep(1500);
        this.showMessage();
        this.enhanceStars();
    }
revealCharacters() {

    gsap.fromTo(
        ".foxCharacter",
        {
            opacity:0,
            x:-40,
            y:30
        },
        {
            opacity:1,
            x:0,
            y:0,
            duration:1.5,
            ease:"power3.out"
        }
    );

    gsap.fromTo(
        ".pigCharacter",
        {
            opacity:0,
            x:40,
            y:30
        },
        {
            opacity:1,
            x:0,
            y:0,
            duration:1.5,
            delay:.2,
            ease:"power3.out"
        }
    );
    gsap.to(".foxCharacter",{
    y:"-=4",
    duration:2.8,
    repeat:-1,
    yoyo:true,
    ease:"sine.inOut"
});

gsap.to(".pigCharacter",{
    y:"-=3",
    duration:3.2,
    repeat:-1,
    yoyo:true,
    ease:"sine.inOut"

});

}

    revealMoon() {
        const moon =
            document.querySelector(".moon");
        if (!moon)
            return;
        gsap.fromTo(
            moon,
            {
                scale: .5,
                opacity: 0,
                y: 100
            },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 2,
                ease: "power3.out"
            }
        );
        gsap.to(
            moon,
            {
                y: -15,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            }
        );
    }
    showMessage() {
        const message =
            document.querySelector(".endingContent");
        if (!message)
            return;
        gsap.fromTo(
            message,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 2,
                delay: .5
            }
        );

    }
    enhanceStars() {
        if (!window.StarEngine) return;
        CONFIG.STARS.COUNT = 500;
        window.StarEngine.starCount = CONFIG.STARS.COUNT;
        window.StarEngine.createStars();
    }
    async finish() {
        this.finished = true;
        AudioManager.finalFade();
        await Utils.sleep(6000);
        this.lock();
    }
    lock() {
        document.body.dataset.completed =
            "true";
    }
    reset() {
        this.started = false;
        this.finished = false;
        const moon = document.querySelector(".moon");
        const content = document.querySelector(".endingContent");
        gsap.set(moon, {
            opacity: 0
        });

        gsap.set(content, {
            opacity: 0
        });
    }
}
window.EndingEngine =
    new EndingEngine();
console.log(
    "✓ Ending Engine Loaded"
);