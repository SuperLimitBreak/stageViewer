
import React from 'react';

import { TimelineControls } from './controls/TimelineControls';
import { Timeline } from './timeline/timeline';

export class TimelineContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cursorPosition: 0,
            selectionStart: 0,
            selectionEnd: 0,
            name: 'unknown',
            cachebust: '',
        };
        this.updateSelection = this.updateSelection.bind(this);
    }

    updateSelection(state) {
        this.setState(state);  //Object.assign(this.state, state)
    }

    render() {
        return (
            <div>
                <TimelineControls
                    eventnames={this.props.eventnames}
                    onSelectTrack={this.props.onSelectTrack}

                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}
                />
                <Timeline
                    host={this.props.host}
                    pixelsPerSecond={this.props.pixelsPerSecond}

                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}

                    updateSelection={this.updateSelection}
                />;
            </div>
        );
    }
}
TimelineContainer.defaultProps = {
    eventnames: [],
    onSelectTrack: ()=>{},
};
