import 'core-js/fn/object/assign';
const Immutable = require('immutable');
require('normalize.css/normalize.css');

import 'index.html';
require('./styles/main.scss');

import {SubscriptionSocketReconnect, ScreenMessageRouter, utils} from 'displayTrigger';

import Config from './data/three.config';
import Main from './three/main';


// ----------------------------------------------------------------------------

const body = document.getElementsByTagName('body').item(0);

const DEFAULT_STAGE_CONFIG = Immutable.fromJS({

});

function initStage(data) {
    new Main(body)
}

const config_url = `/data/stage_${utils.getUrlParameter('stage_config') || 'default'}.json`;
fetch(config_url).then(response => {
    return response.json();
}).then(data => {
    initStage(Immutable.fromJS(data));
}).catch(error => {
    console.error(`Unable to load ${config_url} for stage config. Falling back to default`, error);
    initStage(DEFAULT_STAGE_CONFIG);
});
