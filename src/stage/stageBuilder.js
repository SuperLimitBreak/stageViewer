const Immutable = require('immutable');
import * as THREE from 'three';

const EMPTY_MAP = Immutable.Map();

function createCSS3DObject(data) {
    const get = (key1, key2, fallback=0) => data.get(key1, EMPTY_MAP).get(key2) || fallback;
    const position = (key2) => get('position', key2);
    const display = (key2) => get('display', key2);
    const degToRadians = (deg) => (deg / 360) * 2 * Math.PI;
    const rotation = (key2) => degToRadians(get('rotation', key2));

    const div = document.createElement('div');
    div.style = display('style') || '';
    div.style.width = `${display('width')}px`;
    div.style.height = `${display('height')}px`;
    const CSS3DObject = new THREE.CSS3DObject(div);

    let Object3D = CSS3DObject;
    if (display('pivot') == 'top') {
        CSS3DObject.position.y = -display('height')/2;
        Object3D = new THREE.Object3D();
        Object3D.add(CSS3DObject);
        Object3D.element = div;
    }

    Object3D.position.set(position('x'), position('y'), position('z'));
    Object3D.rotation.set(rotation('x'), rotation('y'), rotation('z'));
    return Object3D;
}

export function initStage(three, screenMessageRouter, lightManager, config) {
    if (!config) {
        console.error('initStage with no config');
        return;
        // TODO: default simple config?
        //config = DEFAULT_STAGE_CONFIG;
    }

    // screens - displayTrigger
    for (let [screen_name, screen_data] of config.get('screens', EMPTY_MAP)) {
        const CSS3DObject = createCSS3DObject(screen_data);
        three.scene.add(CSS3DObject);
        screenMessageRouter.bindScreen(screen_name, CSS3DObject.element, Array.from(screen_data.get('subscriptions')));
    }

    // stage
    for (let [item_name, item_data] of config.get('stage', EMPTY_MAP)) {
        const CSS3DObject = createCSS3DObject(item_data);
        three.scene.add(CSS3DObject);
    }

    // lights
    for (let [light_name, light_data] of config.get('lights', EMPTY_MAP)) {
        const CSS3DObject = createCSS3DObject(light_data);
        CSS3DObject.element.id = light_name;  // Could do this for screens and stage parts too ...
        three.scene.add(CSS3DObject);
        lightManager.bindLight(light_name, light_data, CSS3DObject);
    }

}
