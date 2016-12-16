
function _RGBElementBackgroundColor(element, state) {
    const get_rgba_val = (key) => Math.round(state.get(key, 0) * 255);
    const [red, green, blue] = [get_rgba_val('red'), get_rgba_val('green'), get_rgba_val('blue')];
    element.style.background = `linear-gradient(to top, rgba(${red},${green},${blue},1), rgba(${red},${green},${blue},0))`;
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
    }
    render(state) {
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