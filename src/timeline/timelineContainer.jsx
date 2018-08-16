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
            sequenceModuleName: 'unknown',
            cachebust: '',
        };
        this.onSelectTrack = this.onSelectTrack.bind(this);
        this.lightsCommand = this.lightsCommand.bind(this);

        this.updateSelection = this.updateSelection.bind(this);
    }

    onSelectTrack(sequenceModuleName) {
        console.log('sequenceModuleName', sequenceModuleName);
        if (!this.props.eventmap.has(sequenceModuleName)) {console.error(`${sequenceModuleName} not in eventmap`);}
        this.props.sendMessages(...this.props.eventmap.get(sequenceModuleName).map((payload)=>payload.map((v, k)=>{
            return (v == 'lights.start_sequence') ? 'lights.load_sequence' : v;
        })));
        this.setState({'sequenceModuleName': sequenceModuleName});  // TODO? is handled in subscription_socket feedback.
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
                    sequenceModuleNames={[...this.props.eventmap.keySeq()]}
                    sequenceModuleName={this.state.sequenceModuleName}
                    onSelectTrack={this.onSelectTrack}
                    lightsCommand={this.lightsCommand}

                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}
                />
                <Timeline
                    host={this.props.host}
                    pixelsPerSecond={this.props.pixelsPerSecond}

                    sequenceModuleName={this.state.sequenceModuleName}
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
