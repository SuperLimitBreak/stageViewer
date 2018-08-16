// The control buttons play, pause, stop
// the current track (as dropdown, linked to eventmap)
// the current timecodes (timecode and beats/bars), timesigniture
// this component sits above the timeline

import React from 'react';

import { TrackSelection } from './TrackSelection';

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
        this.props.lightsCommand('start_sequence', {scene: this.props.name, timecode: this.props.cursorPosition});
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
        let play_pause = this.state.playing ?
            <button className="timeline_pause" onClick={this.onPause}></button>
            :
            <button className="timeline_play" onClick={this.onPlay}></button>
        ;
        return (
            <div className="timeline_controls">
                {play_pause}
                <button className="timeline_stop" onClick={this.onStop}></button>
                <div><input type="text" name="position_bar" value="0.0.0" /></div>
                <div><input type="text" name="position_timecode" value={this.props.cursorPosition} /></div>
                <div><input type="text" name="selectionStart" value={this.props.selectionStart} /></div>
                <div><input type="text" name="selectionEnd" value={this.props.selectionEnd} /></div>
                <div>4/4</div>
                <TrackSelection
                    eventnames={this.props.eventnames}
                    name={this.props.name}
                    onSelectTrack={this.props.onSelectTrack}
                />
            </div>
        );
    }
}
TimelineControls.defaultProps = {
    lightsCommand: ()=>{}
};
