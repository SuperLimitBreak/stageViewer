const Immutable = require('immutable');

export class LightManager {
    constructor(subscription_socket) {
        this.lights = new Map();
        subscription_socket.addOnMessageListener((msg) => this.onMessage(msg));
        subscription_socket.addSubscriptions(['light_visulisation']);
    }

    bindLight(name, data, CSS3DObject) {
        this.lights.set(name, new Light(CSS3DObject, data));
    }

    onMessage(msg) {
        if (msg.func == 'lightState') {
            this.render(msg.data);
        }
    }

    render(state) {
        for (let [name, light_state] of Immutable.fromJS(state)) {
            const light = this.lights.get(name);
            if (!light) {continue;}
            light.render(light_state);
        }
    }
}

class Light {
    constructor(CSS3DObject, data) {
        this.CSS3DObject = CSS3DObject;
        this.device = data.get('device');
    }
    render(state) {
        const render_function = renderers.get(this.device);
        if (!render_function) {return;}
        render_function(this.CSS3DObject, state);
    }
}

const renderers = new Immutable.Map({
    RGBLight: (CSS3DObject, data)=>{
        console.log(data);
        const red, green, blue = for (let [key, value] of data) {}
        CSS3DObject.element.style.background = `linear-gradient(to top, rgba(${data.red*255},${data.green*255},${data.blue*255},1), rgba(${data.red*255},${data.green*255},${data.blue*255},0));`;
    },
    RGBStripLight: (CSS3DObject, data)=>{

    },
    EffectRGBLight:(CSS3DObject, data)=>{

    },
    Smoke:(CSS3DObject, data)=>{

    },
});
