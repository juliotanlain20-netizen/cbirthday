/**
 * =====================================================
 * PROJECT AURORA
 * MAIN APPLICATION
 * FINAL INTEGRATION
 * =====================================================
 */
"use strict";
window.IS_MOBILE = window.innerWidth <= 768;
// history.scrollRestoration = "manual";
// window.scrollTo(0, 0);
class AuroraApp {
    constructor() {
        this.loaded = false;
        this.engines = [
            DOMAdapter,
            SceneManager,
            window.StarEngine,
            window.AuroraEngine,
            AudioManager,
            IntroEngine,
            window.MeteorEngine,
            window.CursorEngine,
            window.UnlockEngine,
            window.StoryEngine,
            window.CakeEngine,
            window.GalleryEngine,
            window.BlessingEngine,
            window.EndingEngine,
            window.ParticleEngine,
            window.DOMAdapter,
        ];
    }
    async init() {
        console.count("APP INIT");
        if (this.loaded)
            return;
        console.log(
            "%cPROJECT AURORA STARTING...",
            "color:#D8B46A;font-size:16px;"
        );
        await this.loadingScreen();
        this.initEngines();
        this.bindGlobalEvents();
        await this.startExperience();
        this.loaded = true;
        console.log(
            "%c✓ AURORA READY",
            "color:#8AFF8A;font-size:16px;"
        );


    }

    initEngines() {

        this.engines.forEach(engine => {

            if (
                engine &&
                typeof engine.init === "function"
            ) {
                try {
                    engine.init();
                }
                catch (error) {
                    console.error(
                        "Engine error:",
                        engine,
                        error
                    );
                }
            }
        });

    }
    async startExperience() {
        // requestAnimationFrame(() => {
        //     window.scrollTo({
        //         top: 0,
        //         left: 0,
        //         behavior: "instant"
        //     });
        // });
        await Utils.sleep(500);
        await SceneManager.show(
            "intro"
        );
        IntroEngine.showHint(true);
        IntroEngine.pulseHint();

    }

    bindGlobalEvents() {

        document.addEventListener(
            "click",
            async () => {

                // Klik pertama = mulai intro
                if (!IntroEngine.started) {

                    // mulai musik
                    if (AudioManager && !AudioManager.started) {

                        if (typeof AudioManager.fadeIn === "function") {
                            AudioManager.fadeIn();
                        } else {
                            AudioManager.play();
                        }
                    }

                    gsap.to(".scrollHint", {
                        opacity: 0,
                        y: 20,
                        duration: 0.5,
                        ease: "power2.out",
                        onComplete: () => {
                            console.log("CLICK -> START INTRO");
                            IntroEngine.start();
                        }
                    });

                    return;
                }

            },
            { passive: true }
        );


        window.addEventListener(
            "beforeunload",
            () => {

                if (AudioManager) {
                    AudioManager.stop();
                }

            }
        );

    }
    async loadingScreen() {
        const loader =
            document.getElementById(
                "loader"
            );
        if (!loader)
            return;
        await Utils.sleep(
            800
        );
        gsap.to(
            loader,
            {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete() {
                    loader.remove();
                }
            }
        );
        await Utils.sleep(
            1000
        );
    }
    restart() {
        location.reload();
    }
    
}
window.App = new AuroraApp();
window.AuroraApp = window.App;
document.addEventListener(
    "DOMContentLoaded",
    () => {
        App.init();
    }
);
console.log(
    "✓ App Controller Loaded"
);
