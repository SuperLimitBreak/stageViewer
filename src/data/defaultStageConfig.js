const Immutable = require('immutable');

export const DEFAULT_STAGE_CONFIG = Immutable.fromJS({
    screens: {
        front: {
            display: {
                width: 300,
                height: 200,
                style: 'opacity: 0.5;',
                pivot: 'top',
            },
            position: {x:0, y: 200, z: 100},
            subscriptions: ['main', 'front'],
        },
        rear: {
            display: {
                width: 350,
                height: 240,
                pivot: 'top',
            },
            position: {x:0, y: 250, z: -100},
            subscriptions: ['rear'],
        }
    },
    stage: {
        'stage_floor': {
            display: {
                width: 600,
                height: 300,
                style: 'background-color: #333; border: 1px solid #777;'
            },
            rotation: {x: -90},
            position: {x: 0, y: 0, z: 0},
        },
        'stage_front': {
            display: {
                width: 600,
                height: 50,
                style: 'background-color: #333; border: 1px solid #777;',
                pivot: 'top',
            },
            position: {x: 0, y: 0, z: 150},
        },
        'stage_back': {
            display: {
                width: 600,
                height: 300,
                style: 'background-color: #333; border: 1px solid #777;',
                pivot: 'top',
            },
            position: {x: 0, y: 300, z: -150},
        },
    },
    lights: {
        // Lead
        light7: {
            device: 'RGBLight',
            display: {
                pivot: 'top',
                width: 50, height: 200,
                style: 'border: 1px solid red;',
            },
            position: {x: 200, y: 240, z: 100},
            rotation: {x: 45},
        },
        floorLarge1: {
            device: 'RGBStripLight',
            size: 8,
            display: {
                pivot: 'top',
                width: 100, height: 200,
                style: 'border: 1px solid blue;',
            },
            position: {x: 200, y: 0, z: 100},
            rotation: {x: 135},
        },
        // Rhythm
        light2: {
            device: 'RGBLight',
            display: {
                pivot: 'top',
                width: 50, height: 200,
                style: 'border: 1px solid red;',
            },
            position: {x: -200, y: 240, z: 100},
            rotation: {x: 45},
        },
        floorLarge2: {
            device: 'RGBStripLight',
            size: 8,
            display: {
                pivot: 'top',
                width: 100, height: 200,
                style: 'border: 1px solid blue;',
            },
            position: {x: -200, y: 0, z: 100},
            rotation: {x: 135},
        },
        // Drum
        light1: {
            device: 'RGBLight',
            display: {
                pivot: 'top',
                width: 50, height: 200,
                style: 'border: 1px solid red;',
            },
            position: {x: 100, y: 200, z: -50},
            rotation: {x: 45},
        },
        floor4: {
            device: 'RGBStripLight', size: 3,
            display: {
                pivot: 'top',
                width: 60, height: 200,
                style: 'border: 1px solid green;',
            },
            position: {x: 50, y: 0 , z: -50},
            rotation: {x: 0, y: -45, z: 180},
        }

        // Bass

        // Piano

        // Vocal

    }
});
