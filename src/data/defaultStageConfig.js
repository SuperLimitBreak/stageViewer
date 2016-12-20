const Immutable = require('immutable');

export const DEFAULT_STAGE_CONFIG = Immutable.fromJS({
    screens: {
        front: {
            style: 'width: 720px; height: 512px; opacity: 0.5;',
            subscriptions: ['main', 'front'],
            position: {x:0, y: 256, z: 0}
        },
        rear: {
            style: 'width: 1280px; height: 920px;',
            subscriptions: ['rear'],
            position: {x:0, y: 460, z: -400}
        }
    },
    stage: {
        'stage_floor': {
            style: 'width: 2000px; height: 500px; background-color: #333; border: 1px solid #777;',
            rotation: {x: -90},
            position: {x: 0, y: 0, z: -250},
        },
        'stage_front': {
            style: 'width: 2000px; height: 100px; background-color: #333; border: 1px solid #777;',
            position: {x: 0, y: -50, z: 0},
        },
        'stage_back': {
            style: 'width: 2000px; height: 1100px; background-color: #333; border: 1px solid #777;',
            position: {x: 0, y: 550, z: -500},
        },
    },
    lights: {
        // Lead
        floorLarge1: {
            device: 'RGBStripLight', size: 8,
            style: 'width: 300px; height: 500px;',
            position: {x: 500, y: 200 , z: -200},
            rotation: {x: -45},
        },
        light7: {
            device: 'RGBLight',
            style: 'width: 100px; height: 300px;',
            position: {x: 500, y: 500 , z: -200},
            rotation: {x: 225},
        },
        // Rhythm
        light2: {
            device: 'RGBLight',
            style: 'width: 100px; height: 300px;',
            position: {x: -500, y: 500 , z: -200},
            rotation: {x: 225},
        },
        floorLarge2: {
            device: 'RGBStripLight', size: 8,
            style: 'width: 300px; height: 500px;',
            position: {x: -500, y: 200 , z: -200},
            rotation: {x: -45},
        },
        // Drum
        light1: {
            device: 'RGBLight',
            style: 'width: 100px; height: 300px;',
            position: {x: 300, y: 500, z: -400},
            rotation: {x: -45},
        },
        floor4: {
            device: 'RGBStripLight', size: 3,
            style: 'width: 200px; height: 500px;',
            position: {x: 400, y: 200 , z: -400},
            rotation: {y: 90, z:0},
        }

        // Bass

        // Piano

        // Vocal

    }
});
