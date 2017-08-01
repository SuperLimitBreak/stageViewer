const Immutable = require('immutable');

import deviceTypes from './devices';

export class LightManager {

    constructor(subscription_socket) {
        this.devices = new Map();
        subscription_socket.addOnMessageListener((msg) => this.onMessage(msg));
        subscription_socket.addSubscriptions(['light_visulisation', 'lights']);
    }

    bindLight(name, data, CSS3DObject) {
        this.devices.set(name, new deviceTypes[data.get('device')](CSS3DObject, data));
    }

    onMessage(msg) {
        if (msg.func == 'lightState') {
            this.render(msg.data.state);
        }
    }

    render(state) {
        for (let [name, device_state] of Immutable.fromJS(state)) {
            const device = this.devices.get(name);
            if (!device) {continue;}
            device.render(device_state);
        }
    }
}
