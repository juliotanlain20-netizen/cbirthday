// class FogEngine {

//     constructor() {

//         this.element = null;

//     }

//     init() {

//         this.element = document.getElementById("fog");

//         if (!this.element) return;

//         gsap.to(this.element, {
//             opacity: 1,
//             duration: 2,
//             ease: "power2.out"
//         });

//     }

//     fadeIn() {

//         gsap.to(this.element,{
//             opacity:1,
//             duration:1.5
//         });

//     }

//     fadeOut() {

//         gsap.to(this.element,{
//             opacity:0,
//             duration:1.5
//         });

//     }

// }

// window.FogEngine = new FogEngine();

// console.log("✓ Fog Engine Loaded");