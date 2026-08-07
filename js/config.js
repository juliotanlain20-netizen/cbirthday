/**
 * =====================================================
 * PROJECT AURORA
 * CONFIGURATION
 * =====================================================
 */

"use strict";

window.CONFIG = {

    APP: {
        NAME: "Project Aurora",
        VERSION: "1.0.0",
        AUTHOR: "Julio",
        DEBUG: true
    },
    RECIPIENT: {
        NAME: "Chika",
        AGE: 20,
        BIRTHDAY: {
            DAY: 1,
            MONTH: 10,
            YEAR: 2006
        }
    },
    INTRO: {
        LOADER_TIME: 2500,
        FIRST_DELAY: 2500,
        TYPE_SPEED: 45,
        NEXT_DELAY: 1700
    },
    STORY: {
        TYPE_SPEED: 35,
        NEXT_DELAY: 1200
    },
    MUSIC: {
        VOLUME: .35,
        FADE_DURATION: 4000
    },
    STARS: {
        COUNT: 120,
        MIN_SIZE: .5,
        MAX_SIZE: 2,
        TWINKLE_SPEED: .6
    },
    CURSOR: {
        SIZE: 18,
        SCALE: 2
    },
    GALLERY: {
        PARALLAX: 25,
        ROTATION: 8
    },
    CAKE: {
        CANDLES: 2,
        CONFETTI: 250
    },
    COLORS: {
        BG:"#060913",
        GOLD:"#D8B46A",
        WHITE:"#F5F5F5",
        BLUE:"#7FAEFF"
    },
    METEOR: {
    MIN_INTERVAL: 1200,
    MAX_INTERVAL: 3500,
    MIN_SIZE: 1,
    MAX_SIZE: 3,
    MIN_SPEED: 5,
    MAX_SPEED: 10,
    MIN_LENGTH: 120,
    MAX_LENGTH: 260,
    OPACITY: .85
}
};
window.State = {
    unlocked: false,
    introFinished: false,
    storyStarted: false,
    galleryOpened: false,
    blessingFinished: false,
    endingFinished: false

};