import {zip} from 'calaldees_libs/es6/core';


export function _getRGBElementBackground(state) {
    let [red, green, blue] = [state.get('red', 0), state.get('green', 0), state.get('blue', 0)];
    //const max = Math.max(red, green, blue);
    //if (!max) {return '';}
    [red, green, blue] = [(red)*255, (green)*255, (blue)*255];
    return `linear-gradient(to bottom, rgba(${red},${green},${blue},${0.5}), rgba(${red},${green},${blue},0))`;
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
        this.CSS3DObject.element.style.background = _getRGBElementBackground(state);
    }
}

export class RGBStripLight extends BaseDevice {
    constructor(CSS3DObject, data) {
        super(CSS3DObject, data);
        const width_percent = (1/data.get('size'))*100;
        for (let i=0 ; i<data.get('size') ; i++) {
            const div = document.createElement('div');
            div.style = `display: inline-block; height: 100%; width: ${width_percent}%`;
            CSS3DObject.element.appendChild(div);
        }
    }
    render(state) {
        for (let [light_state, element] of zip(state, this.CSS3DObject.element.childNodes)) {
            element.style.background = _getRGBElementBackground(light_state);
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
