import 'core-js/fn/object/assign';

import THREELib from 'three-js';
const THREE = THREELib(['EffectComposer']);

import {ScreenMessageRouter} from 'displayTrigger';
//import {SubscriptionSocketReconnect} from 'ext/displayTrigger/socket/websocket';
//import {getUrlParameter} from 'ext/displayTrigger/utils/utils';

const Immutable = require('immutable');

require('normalize.css/normalize.css');
require('./styles/main.scss');

console.log(ScreenMessageRouter);

const body = document.getElementsByTagName('body').item(0);

const DEFAULT_SCENE_CONFIG = Immutable.fromJS({

});

//const screenMessageRouter = new ScreenMessageRouter(
//    new SubscriptionSocketReconnect()
//);

function initScreens(config) {
    for (let [screen_name, screen_data] of config) {
        //screenMessageRouter.bindScreen(screen_name, element, Array.from(screen_data.get('subscriptions')));
    }
}

const config_url = '' ; // `/assets/stage/${getUrlParameter('stage_config') || 'default'}.json`;
fetch(config_url).then(response => {
    return response.json();
}).then(data => {
    initScreens(Immutable.fromJS(data));
}).catch(error => {
    console.error(`Unable to load ${config_url} for display_config. Falling back to default`, error);
    initScreens(DEFAULT_SCENE_CONFIG);
});
