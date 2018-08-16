// Notes on react use
// https://stackoverflow.com/questions/24147331/react-the-right-way-to-pass-form-element-state-to-sibling-parent-elements

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
        this.onSelectTrack = this.onSelectTrack.bind(this);
        this.lightsCommand = this.lightsCommand.bind(this);

        this.updateSelection = this.updateSelection.bind(this);
    }

    onSelectTrack(eventname) {
        console.log('track selected', eventname);
        this.props.sendMessages(...this.props.eventmap.get(eventname).map((payload)=>payload.map((v, k)=>{
            return (v == 'lights.start_sequence') ? 'lights.load_sequence' : v;
        })));
        this.setState({name: eventname});  // TODO? is handled in subscription_socket feedback.
    }

    lightsCommand(cmd, attrs={}) {
        console.log(`lights.${cmd}`, attrs);
        this.props.sendMessages(Object.assign({deviceid: 'lights', func: `lights.${cmd}`}, attrs));
    }

    onSeek(timecode) {
        this.props.sendMessages({deviceid: 'lights', func: 'lights.seek', timecode: timecode});
    }

    updateSelection(state) {
        this.setState(state);  //Object.assign(this.state, state)
    }

    render() {
        return (
            <div>
                <TimelineControls
                    eventnames={[...this.props.eventmap.keySeq()]}
                    name={this.state.name}
                    onSelectTrack={this.onSelectTrack}
                    lightsCommand={this.lightsCommand}

                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}
                />
                <Timeline
                    host={this.props.host}
                    pixelsPerSecond={this.props.pixelsPerSecond}

                    name={this.state.name}
                    cachebust={this.state.cachebust}

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
    sendMessages: ()=>{},
};
