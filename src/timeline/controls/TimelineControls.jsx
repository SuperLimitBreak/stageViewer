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
    }

    render() {
        return (
            <div class="timeline_controls">
                <div>&#9658; /  &#10073;&#10073;</div>
                <div>&#9724;</div>
                <div><input type="text" name="position_bar" value="0.0.0" /></div>
                <div><input type="text" name="position_timecode" value={this.props.cursorPosition} /></div>
                <div><input type="text" name="selectionStart" value={this.props.selectionStart} /></div>
                <div><input type="text" name="selectionEnd" value={this.props.selectionEnd} /></div>
                <div>4/4</div>
                <TrackSelection
                    eventnames={this.props.eventnames}
                    onSelectTrack={this.props.onSelectTrack}
                />
            </div>
        );
    }
}