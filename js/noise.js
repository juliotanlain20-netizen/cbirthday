class NoiseEngine{

    constructor(){

        this.element=null;

    }

    init(){

        this.element=document.getElementById("noise");

    }

    enable(){

        this.element.style.opacity=".04";

    }

    disable(){

        this.element.style.opacity="0";

    }

    setStrength(value){

        this.element.style.opacity=value;

    }

}

window.NoiseEngine=new NoiseEngine();

console.log("✓ Noise Engine Loaded");