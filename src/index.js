import 'core-js/fn/object/assign';

import THREELib from 'three-js';
const THREE = THREELib(['EffectComposer']);

const Immutable = require('immutable');

require('normalize.css/normalize.css');


//import {ScreenMessageRouter} from 'displayTrigger/src/screen/ScreenMessageRouter';
//console.log(ScreenMessageRouter);

import {ScreenMessageRouter} from 'displayTrigger';
//console.log(moose);
console.log(ScreenMessageRouter);

require('./styles/main.scss');

// ----------------------------------------------------------------------------

const body = document.getElementsByTagName('body').item(0);

const DEFAULT_SCENE_CONFIG = Immutable.fromJS({

});
