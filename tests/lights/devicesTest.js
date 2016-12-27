const Immutable = require('immutable');

import devices from 'src/lights/devices';
import {_getRGBElementBackground} from 'src/lights/devices';

describe('Devices', function() {
    it('Should convert color values to rgba correctly',()=>{
        const background = _getRGBElementBackground(Immutable.fromJS({red: 0, green: 0, blue: 0}));
        expect(background).toBe('fail');
    });
});
