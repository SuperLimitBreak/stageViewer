// The control buttons play, pause, stop
// the current track (as dropdown, linked to eventmap)
// the current timecodes (timecode and beats/bars), timesignature
// this component sits above the timeline

import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { TrackSelection } from './TrackSelection';
import { Timecode } from './Timecode';

require('./TimelineControls.scss');


export class TimelineControls extends React.Component {

    constructor(props) {
        super(props);

        this.actionPlay = this.actionPlay.bind(this);
        this.actionPause = this.actionPause.bind(this);
        this.actionStop = this.actionStop.bind(this);
        this.actionFrameBack = this.actionFrameBack.bind(this);
        this.actionFrameForward = this.actionFrameForward.bind(this);
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        this._handleKeyEvent = {
            ',': this.actionFrameBack,
            '.': this.actionFrameForward,
            'home': this.actionStop,
            'esc': this.actionStop,
            'clear': this.actionStop,
            'space': () => (this.props.playing ? this.actionPause : this.actionPlay)(),
        };
    }

    handleKeyEvent(key, event) {
        this._handleKeyEvent[key]();
    }

    actionPlay() {
        this.props.onUpdateState({playing: true});
        this.props.lightsCommand('start_sequence', {timecode: this.props.cursorPosition});
    }

    actionPause() {
        this.props.onUpdateState({playing: false});
        this.props.lightsCommand('pause');
    }

    actionStop() {
        this.props.onUpdateState({playing: false});
        this.props.lightsCommand('pause');
        this.props.lightsCommand('seek', {timecode: 0});
    }

    actionFrameBack() {
        this.props.lightsCommand('seek', {timecode: this.props.cursorPosition, frame_offset: -1});
    }
    actionFrameForward() {
        this.props.lightsCommand('seek', {timecode: this.props.cursorPosition, frame_offset: +1});
    }

    render() {
        const timecodeFactory = (name) => {
            return <Timecode name={name} timecode={this.props[name]} bpm={this.props.bpm} timesignature={this.props.timesignature}/>;
        }

        return (
            <div className="timeline_controls">
                {
                    this.props.playing ?
                        <button className="timeline_pause" onClick={this.actionPause}></button>
                        :
                        <button className="timeline_play" onClick={this.actionPlay}></button>
                }
                <button className="timeline_stop" onClick={this.actionStop}></button>
                <button className="timeline_frame-back" onClick={this.actionFrameBack}></button>
                <button className="timeline_frame-forward" onClick={this.actionFrameForward}></button>
                <KeyboardEventHandler
                    handleKeys={[',', '.', 'home', 'space', 'esc', 'backspace', 'clear']}
                    onKeyEvent={this.handleKeyEvent}
                />

                <div className='timing_info'>
                    <div>{this.props.bpm}bpm</div>
                    <div>{this.props.timesignature}</div>
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
    timesignature: '4:4',
    lightsCommand: ()=>{},
};
