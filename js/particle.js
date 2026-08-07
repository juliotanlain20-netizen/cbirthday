/**
 * =====================================================
 * PROJECT AURORA
 * PARTICLE ENGINE
 * =====================================================
 */

"use strict";


class ParticleEngine {


    constructor(){


        this.container = null;

        this.particles = [];

        this.running = false;


    }





    init(){


        this.container =
        document.createElement("div");


        this.container.className =
        "particle-container";


        document.body.appendChild(
            this.container
        );


    }





    create(options={}){


        const particle =
        document.createElement("span");



        particle.className =
        "particle";



        const size =
        options.size ||
        Utils.random(3,8);



        const color =
        options.color ||
        "#ffffff";



        Object.assign(

            particle.style,

            {

                width:size+"px",

                height:size+"px",

                background:color,

                left:
                (options.x ??
                window.innerWidth/2)
                +"px",

                top:
                (options.y ??
                window.innerHeight/2)
                +"px"

            }

        );



        this.container.appendChild(
            particle
        );



        this.animate(

            particle,

            options

        );


    }





    animate(element,options){


        const angle =
        Utils.random(
            0,
            Math.PI*2
        );



        const distance =
        options.distance ||
        Utils.random(
            80,
            300
        );



        const x =
        Math.cos(angle)
        *
        distance;



        const y =
        Math.sin(angle)
        *
        distance;



        gsap.to(

            element,

            {

                x,

                y,

                opacity:0,

                rotation:
                Utils.random(
                    -360,
                    360
                ),

                scale:
                Utils.random(
                    .2,
                    1.8
                ),


                duration:
                options.duration ||
                Utils.random(
                    1,
                    2
                ),


                ease:
                "power3.out",


                onComplete(){

                    element.remove();

                }

            }

        );


    }





    burst(amount=100,options={}){


        for(
            let i=0;
            i<amount;
            i++
        ){


            this.create(options);


        }


    }





    sparkle(x,y){


        this.burst(

            40,

            {

                x,

                y,

                color:"#D8B46A",

                size:
                Utils.random(
                    2,
                    5
                ),

                distance:
                Utils.random(
                    40,
                    120
                )

            }

        );


    }





    confetti(){


        const colors=[

            "#D8B46A",

            "#ffffff",

            "#7FAEFF",

            "#ff9eb5"

        ];



        for(
            let i=0;
            i<250;
            i++
        ){


            this.create(

                {

                    x:
                    window.innerWidth/2,


                    y:
                    window.innerHeight/3,


                    color:
                    colors[
                        Utils.randomInt(
                            0,
                            colors.length-1
                        )
                    ],


                    size:
                    Utils.random(
                        5,
                        12
                    ),


                    distance:
                    Utils.random(
                        150,
                        500
                    ),


                    duration:
                    Utils.random(
                        2,
                        4
                    )

                }

            );


        }


    }





    magicDust(){


        setInterval(()=>{


            this.create(

                {

                    x:
                    Utils.random(
                        0,
                        window.innerWidth
                    ),


                    y:
                    window.innerHeight+20,


                    color:
                    "rgba(255,255,255,.8)",


                    size:
                    Utils.random(
                        1,
                        4
                    ),


                    distance:
                    Utils.random(
                        50,
                        200
                    )


                }

            );



        },250);



    }





    clear(){


        this.container.innerHTML="";


    }





    destroy(){


        this.clear();


        this.container.remove();


    }



}

window.ParticleEngine =
new ParticleEngine();
console.log(
"✓ Particle Engine Loaded"
);