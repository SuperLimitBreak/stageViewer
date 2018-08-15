//import 'core-js/fn/object/assign';  // TODO: Not needed?
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
import { Object } from 'core-js';


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
        function onSelectTrack(eventname) {
            console.log('track selected', eventname);
            subscription_socket.sendMessages(...eventmap.get(eventname));
        }
        function lightsCommand(cmd, attrs={}) {
            console.log(`lights.${cmd}`, attrs);
            subscription_socket.sendMessages(Object.assign({deviceid: 'lights', func: `lights.${cmd}`}, attrs));
        }
        function onSeek(timecode) {
            subscription_socket.sendMessages({deviceid: 'lights', func: 'lights.seek', timecode: timecode});
        }
        const timelineContainerInstance = render(
            <TimelineContainer
                host={'localhost:23487'}
                pixelsPerSecond={8}
                eventnames={eventmap.keySeq()}
                onSelectTrack={onSelectTrack}
                lightsCommand={lightsCommand}
            />,
            document.getElementById('timeline')
        );
        const timelineManager = new TimelineManager(subscription_socket, eventmap, timelineContainerInstance);
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