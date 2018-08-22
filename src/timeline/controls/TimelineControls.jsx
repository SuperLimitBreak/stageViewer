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
        const timecodeFactory = (name) => {
            return <Timecode name={name} timecode={this.props[name]} bpm={this.props.bpm} timesigniture={this.props.timesigniture}/>;
        }

        return (
            <div className="timeline_controls">
                {
                    this.state.playing ?
                        <button className="timeline_pause" onClick={this.onPause}></button>
                        :
                        <button className="timeline_play" onClick={this.onPlay}></button>
                }
                <button className="timeline_stop" onClick={this.onStop}></button>

                <div className='timing_info'>
                    <div>{this.props.bpm}bpm</div>
                    <div>{this.props.timesigniture.beats}/{this.props.timesigniture.bar}</div>
                </div>

                {timecodeFactory("cursorPosition")}
                {timecodeFactory("selectionStart")}
                {timecodeFactory("selectionEnd")}

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
    bpm: 120,
    timesigniture: {beats: 4, bar: 4},
    lightsCommand: ()=>{}
};
