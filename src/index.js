import 'core-js/fn/object/assign';
const Immutable = require('immutable');
require('normalize.css/normalize.css');

import 'index.html';
require('./styles/main.scss');

import {SubscriptionSocketReconnect, ScreenMessageRouter, utils} from 'displayTrigger';

import Config from './data/three.config';
import ThreeMain from './three/main';


// ----------------------------------------------------------------------------

const body = document.getElementsByTagName('body').item(0);

const DEFAULT_STAGE_CONFIG = Immutable.fromJS({

});

function initStage(data) {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.height = '100%';
    container.style.width = '100%';
    body.appendChild(container);

    const three = new ThreeMain(container);

    const dom = document.createElement('div');
    dom.style['z-index'] = 1;
    dom.style.height = '100px';
    dom.style.width = '100px';
    dom.style.backgroundColor = 'red';
    const CSS3DObject = new THREE.CSS3DObject(dom);
    CSS3DObject.position.x = 0;
    CSS3DObject.position.y = 0;
    CSS3DObject.position.z = 0;

    three.scene.add(CSS3DObject);
}

const config_url = `/data/stage_${utils.getUrlParameter('stage_config') || 'default'}.json`;
fetch(config_url).then(response => {
    return response.json();
}).then(data => {
    initStage(Immutable.fromJS(data));
}).catch(error => {
    console.error(`Unable to load ${config_url} for stage config. Falling back to default`);
    initStage(DEFAULT_STAGE_CONFIG);
});
