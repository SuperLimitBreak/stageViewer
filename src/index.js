import 'core-js/fn/object/assign';
const Immutable = require('immutable');
require('normalize.css/normalize.css');

import 'index.html';
require('./styles/main.scss');

import {SubscriptionSocketReconnect, ScreenMessageRouter, utils} from 'displayTrigger';

import * as THREE from 'three';
import ThreeMain from './three/main';


// -----------------------------------------------------------------------------

const body = document.getElementsByTagName('body').item(0);

// Three.js CSSRenderer --------------------------------------------------------

const container = document.createElement('div');
container.style.position = 'absolute';
container.style.height = '100%';
container.style.width = '100%';
body.appendChild(container);

const three = new ThreeMain(container);

// displayTrigger --------------------------------------------------------------

const screenMessageRouter = new ScreenMessageRouter(
    new SubscriptionSocketReconnect()
);

// Fallback Config -------------------------------------------------------------

const DEFAULT_STAGE_CONFIG = Immutable.fromJS({
    screens: {
        front: {
            style: 'width: 720px; height: 512px; opacity: 50%;',
            subscriptions: ['main', 'front'],
            z: 200,
        },
        rear: {
            style: 'width: 1280px; height: 920px;',
            subscriptions: ['rear'],
            z: -200,
        }
    },
    lights: {

    }
});

function initStage(config) {
    for (let [screen_name, screen_data] of config.get('screens')) {
        const screen_div = document.createElement('div');
        screen_div.style = screen_data.get('style', '');
        screenMessageRouter.bindScreen(screen_name, screen_div, Array.from(screen_data.get('subscriptions')));

        const CSS3DObject = new THREE.CSS3DObject(screen_div);
        for (let field of ['x', 'y', 'z']) {
            CSS3DObject.position[field] = screen_data.get(field) || 0;
        }
        three.scene.add(CSS3DObject);
    }
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
