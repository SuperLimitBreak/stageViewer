
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
                sequenceModuleName: msg.sequence_module_name,
                cachebust: msg.module_hash,
                timsignature: msg.timsignature,
                bpm: msg.bpm,
                playing: msg.playing,
            });

            // If playing outside selection - send 'seek' to beginning of selection
            if (
                this.timelineContainerInstance._timeline_react_component.hasSelection() &&
                !this.timelineContainerInstance._timeline_react_component.inSelection(msg.timecode)
            ) {
                console.info(`state timecode ${msg.timecode} outside selector bounds - returning to selectionStart ${this.timelineContainerInstance.state.selectionStart}`);
                this.timelineContainerInstance.onSeek(this.timelineContainerInstance.state.selectionStart);
            }
        }
        if (msg.func == 'scan_update_event') {
            //console.log('scan_update_event', msg);
            this.timelineContainerInstance.setState({
                sequenceModuleName: msg.sequence_module_name,
                cachebust: msg.module_hash,
            });
        }
        if (msg.func == 'lights.start_sequence') {
            this.timelineContainerInstance.setState({
                sequenceModuleName: msg.sequence_module_name,
                cursorPosition: msg.timecode,
            });
        }
    }

}
