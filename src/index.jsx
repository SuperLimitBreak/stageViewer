import 'core-js/fn/object/assign';
require('normalize.css/normalize.css');

import 'index.html';
require('./styles/main.scss');

const Immutable = require('immutable');
import * as THREE from 'three';
import React from 'react';
import {render} from 'react-dom';

import {SubscriptionSocketReconnect} from 'calaldees_libs/es6/websocket';
import {queryStringListOrInit} from 'calaldees_libs/es6/web';
import {ScreenMessageRouter} from 'displayTrigger';

import ThreeMain from './three/main';
import {LightManager} from './lights/lightManager';
import {initStage} from './stage/stageBuilder';

import {TimelineManager} from './timeline/timelineManager';
//import {Timeline} from './timeline/timeline';
import {TimelineContainer} from './timeline/timelineContainer';


const body = document.getElementsByTagName('body').item(0);
const subscription_socket = new SubscriptionSocketReconnect();


// Timeline --------------------------------------------------------------------


queryStringListOrInit(
    'path_eventmap',
    'eventmap',
    `${window.location.protocol}//${window.location.hostname}/eventmap/`,
    data => {
        const eventmap = Immutable.Map(Immutable.fromJS(data).map(item=>[item.get('name'), item.get('payload')]));
        //console.log(eventmap.toJS());
        const timelineContainerInstance = render(
            <TimelineContainer
                host={'localhost:23487'}
                pixelsPerSecond={8}
                eventmap={eventmap}
            />,
            document.getElementById('timeline')
        );
        const timelineManager = new TimelineManager(subscription_socket, timelineContainerInstance);
    },
    null,
    document.getElementById('timeline'),
);



// Stage -----------------------------------------------------------------------

queryStringListOrInit(
    'path_stageconfig',
    'stageconfig',
    `${window.location.protocol}//${window.location.hostname}/stageconfig/`,
    data => _initStage(Immutable.fromJS(data)),
    null,
    document.getElementById('three_scene'),
);

function _initStage(config) {
    const three = new ThreeMain(document.getElementById('three_scene'));
    const screenMessageRouter = new ScreenMessageRouter(subscription_socket);
    const lightManager = new LightManager(subscription_socket);

    return initStage(three, screenMessageRouter, lightManager, config);
}