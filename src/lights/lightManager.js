const Immutable = require('immutable');

import deviceTypes from './devices';


export class LightManager {

    constructor(subscription_socket, timeline_element) {
        this.devices = new Map();
        subscription_socket.addOnMessageListener((msg) => this.onMessage(msg));
        subscription_socket.addSubscriptions(['light_visulisation', 'lights']);

        this.timeline_img = timeline_element.getElementsByTagName('img').item(0);
        // CSS always enforces correct aspect ratio scaling unless absolute values are specified.
        // We want to scale 'height' but preserve naturalWidth. We have to enforce this width property manually with js
        this.timeline_img.onload = () => {this.timeline_img.style.width = `${this.timeline_img.naturalWidth}px`};

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
                this.timeline_img.src = '';
                this.refresh_timeline();
            }
        }
        if (msg.func == 'LightTiming.start') {
            this.timeline_name = msg.scene;
            this.refresh_timeline();
        }
    }

    refresh_timeline() {
        if (!this.timeline_img.src.includes(this.timeline_name)) {
            // There is no image.reload(). The only workaround is cachebust
            // This defeats any attempt to etag cache. (Not happy).
            this.timeline_img.src = `http://localhost:23487/${this.timeline_name}?${new Date().getTime()}`;
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
