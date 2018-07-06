export class TimelineManager {

    constructor(subscription_socket, timelineInstance) {
        this.subscription_socket = subscription_socket;
        this.subscription_socket.addOnMessageListener((msg) => this.onMessage(msg));

        this.timelineInstance = timelineInstance;
        this.timelineInstance.seek = this.seek.bind(this);
    }

    onMessage(msg) {
        if (msg.func == 'lightState') {
            this.timelineInstance.setState({
                cursorPosition: msg.timecode,
                name: msg.module_name,
                cachebust: msg.module_hash,
            });
            // If playing outside selection - send 'seek' to beginning of selection
            if (
                this.timelineInstance.hasSelection() &&
                !this.timelineInstance.inSelection(this.timelineInstance.state.cursorPosition)
            ) {
                this.timelineInstance.seek(this.timelineInstance.state.selectionStart);
            }
        }
        if (msg.func == 'scan_update_event') {
            //console.log('scan_update_event', msg);
            this.timelineInstance.setState({
                name: msg.module_name,
                cachebust: msg.module_hash,
            });
        }
        if (msg.func == 'LightTiming.start') {
            //this.timelineInstance.setName(msg.scene);
        }
    }

    seek(timecode) {
        this.subscription_socket.sendMessages({deviceid: 'lights', func: 'lights.seek', timecode: timecode});
    }
}
