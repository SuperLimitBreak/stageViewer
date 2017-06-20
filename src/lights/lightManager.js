const Immutable = require('immutable');

import deviceTypes from './devices';


export class LightManager {

    constructor(subscription_socket, timeline_img) {
        this.timeline_img = timeline_img;
        this.devices = new Map();
        subscription_socket.addOnMessageListener((msg) => this.onMessage(msg));
        subscription_socket.addSubscriptions(['light_visulisation', 'lights']);
        this.timeline_name = '';
    }

    bindLight(name, data, CSS3DObject) {
        this.devices.set(name, new deviceTypes[data.get('device')](CSS3DObject, data));
    }

    onMessage(msg) {
        if (msg.func == 'lightState') {
            this.render(msg.data);
        }
        if (msg.func == 'scan_update_event') {
            if (msg.sequence_files.includes(this.timeline_name)) {
                this.refresh_timeline();
            }
        }
        if (msg.func == 'LightTiming.start') {
            this.timeline_name = msg.scene;
            this.refresh_timeline();
        }
    }

    refresh_timeline() {
        this.timeline_img.src = `http://localhost:23487/${this.timeline_name}`;
        console.log(this.timeline_img.src);
    }

    render(state) {
        for (let [name, device_state] of Immutable.fromJS(state)) {
            const device = this.devices.get(name);
            if (!device) {continue;}
            device.render(device_state);
        }
    }
}
