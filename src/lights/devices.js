import {es6_core} from 'displayTrigger';


function _RGBElementBackgroundColor(element, state) {
    let [red, green, blue] = [state.get('red', 0), state.get('green', 0), state.get('blue', 0)];
    const max = Math.max(red, green, blue);
    if (!max) {return;}
    [red, green, blue] = [(red/max)*255, (green/max)*255, (blue/max)*255];
    element.style.background = `linear-gradient(to top, rgba(${red},${green},${blue},${max}), rgba(${red},${green},${blue},0))`;
}

class BaseDevice {
    constructor(CSS3DObject, data) {
        this.CSS3DObject = CSS3DObject;
    }
    render(state) {}
}

export class RGBLight extends BaseDevice {
    constructor(CSS3DObject, data) {
        super(CSS3DObject, data);
    }
    render(state) {
        _RGBElementBackgroundColor(this.CSS3DObject.element, state);
    }
}

export class RGBStripLight extends BaseDevice {
    constructor(CSS3DObject, data) {
        super(CSS3DObject, data);
        console.log(data);
        const width_percent = (1/data.get('size'))*100;
        for (let i=0 ; i<data.get('size') ; i++) {
            const div = document.createElement('div');
            div.style = `display: inline-block; height: 100%; width: ${width_percent}%`;
            CSS3DObject.element.appendChild(div)
        }
    }
    render(state) {
        for (let [light_state, div] of es6_core.zip(state, this.CSS3DObject.element.childNodes)) {
          _RGBElementBackgroundColor(div, light_state);
        }
    }
}

export class EffectRGBLight extends BaseDevice {
    constructor(CSS3DObject, data) {
        super(CSS3DObject, data);
    }
    render(state) {
    }
}

export class Smoke extends BaseDevice {
    constructor(CSS3DObject, data) {
        super(CSS3DObject, data);
    }
    render(state) {
    }
}

export default {RGBLight, RGBStripLight, EffectRGBLight, Smoke};