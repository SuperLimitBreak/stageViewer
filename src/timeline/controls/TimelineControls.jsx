// The control buttons play, pause, stop
// the current track (as dropdown, linked to eventmap)
// the current timecodes (timecode and beats/bars), timesigniture
// this component sits above the timeline

import React from 'react';

import { TrackSelection } from './TrackSelection';
import { Timecode } from './Timecode';

require('./TimelineControls.scss');


export class TimelineControls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playing: false,
        }
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onStop = this.onStop.bind(this);
    }

    onPlay() {
        this.props.lightsCommand('start_sequence', {sequence_module_name: this.props.sequenceModuleName, timecode: this.props.cursorPosition});
        this.setState({playing: true});
    }

    onPause() {
        this.props.lightsCommand('pause');
        this.setState({playing: false});
    }

    onStop() {
        this.props.lightsCommand('pause');
        this.props.lightsCommand('seek', {timecode: 0});
        this.setState({playing: false});
    }

    render() {
        return (
            <div className="timeline_controls">
                {
                    this.state.playing ?
                        <button className="timeline_pause" onClick={this.onPause}></button>
                        :
                        <button className="timeline_play" onClick={this.onPlay}></button>
                }
                <button className="timeline_stop" onClick={this.onStop}></button>

                <Timecode name="cursorPosition" position={this.props.cursorPosition} />
                <Timecode name="selectionStart" position={this.props.selectionStart} />
                <Timecode name="selectionEnd" position={this.props.selectionEnd} />
                <div>4/4</div>

                <TrackSelection
                    sequenceModuleNames={this.props.sequenceModuleNames}
                    sequenceModuleName={this.props.sequenceModuleName}
                    onSelectTrack={this.props.onSelectTrack}
                />
            </div>
        );
    }
}
TimelineControls.defaultProps = {
    lightsCommand: ()=>{}
};
