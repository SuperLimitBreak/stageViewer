import 'core-js/fn/object/assign';
require('normalize.css/normalize.css');

import 'index.html';
require('./styles/main.scss');

import {SubscriptionSocketReconnect, ScreenMessageRouter, utils} from 'displayTrigger';

import * as THREE from 'three';
import ThreeMain from './three/main';
import {initStage} from './stage/stageBuilder';


// -----------------------------------------------------------------------------

const body = document.getElementsByTagName('body').item(0);

// Three.js CSSRenderer --------------------------------------------------------

const container = document.createElement('div');
container.style.position = 'absolute';
container.style.height = '100%';
container.style.width = '100%';
body.appendChild(container);

const three = new ThreeMain(container);

const screenMessageRouter = new ScreenMessageRouter(
    new SubscriptionSocketReconnect()
);

function _initStage(config) {
    return initStage(three, screenMessageRouter, config);
}

// Fallback Config -------------------------------------------------------------

const config_url = `/data/stage_${utils.getUrlParameter('stage_config') || 'default'}.json`;
fetch(config_url).then(response => {
    return response.json();
}).then(data => {
    _initStage(Immutable.fromJS(data));
}).catch(error => {
    console.error(`Unable to load ${config_url} for stage config. Falling back to default`);
    _initStage(null);
});
