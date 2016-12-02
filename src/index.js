import 'core-js/fn/object/assign';

import THREELib from 'three-js';
const THREE = THREELib(['EffectComposer']);

const Immutable = require('immutable');

require('normalize.css/normalize.css');


import displayTrigger from 'displayTrigger';
console.log(displayTrigger);

require('./styles/main.scss');

// ----------------------------------------------------------------------------

const body = document.getElementsByTagName('body').item(0);

const DEFAULT_SCENE_CONFIG = Immutable.fromJS({

});
