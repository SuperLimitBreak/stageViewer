
export class LightManager {
    constructor() {
        this.lights = new Map();
    }

    bindLight(name, data, CSS3DObject) {
        this.lights.set(name, new Light(CSS3DObject, data));
    }

    render(state) {
        for (let [name, light_state] of state) {
            this.lights.get(name).render(light_state);
        }
    }
}

class Light {
    constructor(CSS3DObject, data) {
        this.CSS3DObject = CSS3DObject;
        this.device = data.device;
    }
    render(state) {
        renderers[this.device](this.CSS3DObject, state);
    }
}

const renderers = {
    RGBLight: (CSS3DObject, data)=>{
        CSS3DObject.element.style.background = `linear-gradient(to top, rgba(${data.red*255},${data.green*255},${data.blue*255},1), rgba(${data.red*255},${data.green*255},${data.blue*255},0));`;
    },
    RGBStripLight: (CSS3DObject, data)=>{

    },
    EffectRGBLight:(CSS3DObject, data)=>{

    },
    Smoke:(CSS3DObject, data)=>{

    },
};
