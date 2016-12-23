const Immutable = require('immutable');

export const DEFAULT_STAGE_CONFIG = Immutable.fromJS({
    screens: {
        front: {
            display: {width: 720, height: 512, style: 'opacity: 0.5;'},
            subscriptions: ['main', 'front'],
            position: {x:0, y: 256, z: 0}
        },
        rear: {
            display: {width: 1280, height: 920},
            subscriptions: ['rear'],
            position: {x:0, y: 460, z: -400}
        }
    },
    stage: {
        'stage_floor': {
            display: {width: 2000, height: 500, style: 'background-color: #333; border: 1px solid #777;'},
            rotation: {x: -90},
            position: {x: 0, y: 0, z: -250},
        },
        'stage_front': {
            display: {width: 2000, height: 100, style: 'background-color: #333; border: 1px solid #777;'},
            position: {x: 0, y: -50, z: 0},
        },
        'stage_back': {
            display: {width: 2000, height: 1100, style: 'background-color: #333; border: 1px solid #777;'},
            position: {x: 0, y: 550, z: -500},
        },
    },
    lights: {
        /*
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
        */
        // Drum
        light1: {
            device: 'RGBLight',
            display: {
                pivot: 'top',
                width: 100, height: 300,
                style: 'border: 1px solid red;',
            },
            position: {x: 300, y: 500, z: -400},
            rotation: {x: -45},
        },
        floor4: {
            device: 'RGBStripLight', size: 3,
            display: {
                pivot: 'top',
                width: 200, height: 500,
                style: 'border: 1px solid green;',
            },
            position: {x: 400, y: 200 , z: -400},
            rotation: {y: 90, z:0},
        }

        // Bass

        // Piano

        // Vocal

    }
});
