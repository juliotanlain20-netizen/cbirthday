/**
 * =====================================================
 * PROJECT AURORA
 * DOM ADAPTER
 * =====================================================
 */

"use strict";


class DOMAdapter {
    constructor() {
        this.body = document.body;
        this.scenes = {};

    }

    init() {
        this.createBaseLayers();
        this.createScenes();
        this.mapExistingElements();
        this.prepareCursor();
        this.prepareAudio();
        console.log("✓ DOM Adapter Loaded");
    }

    createBaseLayers() {
        if (!document.getElementById("meteor-container")) {

            const meteor =
                document.createElement("div");

            meteor.id = "meteor-container";

            document.body.appendChild(meteor);

        }
        if (!document.getElementById("fog")) {

            const fog = document.createElement("div");

            fog.id = "fog";

            document.body.prepend(fog);

        }

        if (!document.getElementById("noise")) {

            const noise = document.createElement("div");

            noise.id = "noise";

            document.body.prepend(noise);

        }

        if (!document.getElementById("meteor-container")) {

            const meteor = document.createElement("div");
            meteor.id = "meteor-container";
            document.body.prepend(meteor);
        }
        if (!document.getElementById("stars")) {
            const canvas =
                document.createElement("canvas");
            canvas.id = "stars";
            document.body.prepend(canvas);
        }
        // AURORA BACKGROUND
        if (!document.getElementById("aurora")) {
            const aurora =
                document.createElement("div");
            aurora.id = "aurora";
            document.body.prepend(
                aurora
            );
        }

        // TRANSITION OVERLAY
        if (!document.getElementById("transitionOverlay")) {
            const overlay =
                document.createElement("div");
            overlay.id =
                "transitionOverlay";
            document.body.appendChild(
                overlay
            );
        }
        // FLASH
        if (!document.getElementById("flash")) {
            const flash =
                document.createElement("div");
            flash.id = "flash";
            document.body.appendChild(
                flash
            );
        }
    }

    createScenes() {
        const required = [
            "intro",
            "unlock",
            "story",
            "celebration",
            "gallery",
            "blessing",
            "ending"
        ];
        required.forEach(id => {
            if (!document.getElementById(id)) {
                const section =
                    document.createElement("section");
                section.id = id;
                section.className =
                    "scene hidden-scene";
                document.body.appendChild(
                    section
                );
            }
        });
    }
    mapExistingElements() {
        /*
            HTML lama:

            lockScreen
            card
            cakeSvg
            wishes

            akan dipindahkan
            menjadi scene Aurora
        */
        const lock =
            document.getElementById(
                "lockScreen"
            );
        const unlock =
            document.getElementById(
                "unlock"
            );
        if (
            lock &&
            unlock
        ) {

            unlock.appendChild(
                lock
            );

        }
        const card =
            document.getElementById(
                "card"
            );
        const cake =
            document.getElementById(
                "celebration"
            );
        if (
            card &&
            cake
        ) {
            cake.appendChild(
                card
            );
        }
        this.scenes = {
            intro:
                document.getElementById(
                    "intro"
                ),
            unlock:
                document.getElementById(
                    "unlock"
                ),
            story:
                document.getElementById(
                    "story"
                ),
            cake:
                document.getElementById(
                    "celebration"
                ),
            gallery:
                document.getElementById(
                    "gallery"
                ),
            blessing:
                document.getElementById(
                    "blessing"
                ),
            ending:
                document.getElementById(
                    "ending"
                )
        };
    }
    prepareCursor() {
        if (
            document.getElementById(
                "cursor"
            )
        )
            return;
        const cursor =
            document.createElement(
                "div"
            );
        cursor.id = "cursor";
        const dot =
            document.createElement(
                "div"
            );
        dot.id = "cursor-dot";

        document.body.appendChild(
            cursor
        );
        document.body.appendChild(
            dot
        );
    }
    prepareAudio() {
        if (
            document.getElementById(
                "bgm"
            )
        )
            return;
        const audio =
            document.createElement(
                "audio"
            );
        audio.id = "bgm";
        audio.loop = true;
        audio.preload = "auto";
        document.body.appendChild(
            audio
        );
    }
    get(id) {
        return document.getElementById(
            id
        );
    }
    show(id) {
        const scene =
            this.get(id);
        if (!scene)
            return;
        scene.classList.remove(
            "hidden-scene"
        );
    }
    hide(id) {
        const scene =
            this.get(id);
        if (!scene)
            return;
        scene.classList.add(
            "hidden-scene"
        );
    }
}

window.DOMAdapter =
    new DOMAdapter();



console.log(
    "✓ DOM Adapter Ready"
);