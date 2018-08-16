export class TimelineManager {

    constructor(subscription_socket, eventmap, timelineContainerInstance) {
        this.subscription_socket = subscription_socket;
        this.subscription_socket.addOnMessageListener((msg) => this.onMessage(msg));

        this.timelineContainerInstance = timelineContainerInstance;
        this.eventmap = eventmap;

        //this.timelineInstance = timelineContainerInstance.timeline;
        //this.timelineInstance.seek = this.seek.bind(this);

        //debugger;
        //console.log('fuckbuckets', this.timelineContainerInstance.controls.track_selection.selectTrack);
        //timelineContainerInstance.controls.track_selection.selectTrack = this.selectTrack.bind(this);
    }

    onMessage(msg) {
        if (msg.func == 'lightState') {
            this.timelineContainerInstance.setState({
                cursorPosition: msg.timecode,
                name: msg.module_name,
                cachebust: msg.module_hash,
            });
            // If playing outside selection - send 'seek' to beginning of selection
            /*
            TODO: Reinstate this functionality
            if (
                this.timelineInstance.hasSelection() &&
                !this.timelineInstance.inSelection(this.timelineInstance.state.cursorPosition)
            ) {
                this.seek(this.timelineInstance.state.selectionStart);
            }
            */
        }
        if (msg.func == 'scan_update_event') {
            //console.log('scan_update_event', msg);
            this.timelineInstance.setState({
                name: msg.module_name,
                cachebust: msg.module_hash,
            });
        }
        if (msg.func == 'lights.start_sequence') {
            this.timelineInstance.setState({
                name: msg.scene,
                cursorPosition: msg.timecode,
            });
        }
    }

    seek(timecode) {
        this.subscription_socket.sendMessages({deviceid: 'lights', func: 'lights.seek', timecode: timecode});
    }

}
