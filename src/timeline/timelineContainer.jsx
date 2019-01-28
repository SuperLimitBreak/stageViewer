// Notes on react use
// https://stackoverflow.com/questions/24147331/react-the-right-way-to-pass-form-element-state-to-sibling-parent-elements

require('./TimelineContainer.scss');

import React from 'react';

import { TimelineControls } from './controls/TimelineControls';
import { Timeline } from './timeline/timeline';


export class TimelineContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            cursorPosition: 0,
            selectionStart: 0,
            selectionEnd: 0,
            sequenceModuleName: 'unknown',
            cachebust: '',
        };
        this.onSelectTrack = this.onSelectTrack.bind(this);
        this.lightsCommand = this.lightsCommand.bind(this);

        this.onSeek = this.onSeek.bind(this);
        this.onUpdateState = this.onUpdateState.bind(this);

        this._lookup_sequenceModuleName = this._lookup_sequenceModuleName.bind(this);
    }

    _lookup_sequenceModuleName(sequenceModuleName) {
        // sigh ... we refer to `sequenceModuleName` in this js code as the KEY in the eventmap
        // this is NOT the sequenceModuleName that the lighting system uses. sequenceModuleName is the item called with light.start_sequence.
        // This function is a mapping between eventmap[sequenceModuleName]->func=light.start_sequence--scene with sequenceModuleName as a fallback
        // not brilliant
        for (let payload of this.props.eventmap.get(sequenceModuleName)) {
            if (payload.get('func') == 'lights.start_sequence' || payload.get('func') == 'lights.load_sequence') {
                if (payload.get('sequence_module_name')) {return payload.get('sequence_module_name');}
                if (payload.get('scene')) {return payload.get('scene');}  // legacy fallback - can be removed?
            }
        }
        return sequenceModuleName; // return fallback
    }

    onSelectTrack(sequenceModuleName) {
        console.log('sequenceModuleName', sequenceModuleName);
        if (!this.props.eventmap.has(sequenceModuleName)) {console.error(`${sequenceModuleName} not in eventmap`);}
        this.props.sendMessages(...this.props.eventmap.get(sequenceModuleName).map((payload)=>payload.map((v)=>{
            return (v == 'lights.start_sequence') ? 'lights.load_sequence' : v;
        })));
        this.setState({'sequenceModuleName': sequenceModuleName});  // TODO? unneeded? is handled in subscription_socket feedback.
    }

    lightsCommand(cmd, attrs={}) {
        console.log(`lights.${cmd}`, attrs);
        this.props.sendMessages(Object.assign({deviceid: 'lights', func: `lights.${cmd}`, sequence_module_name: this._lookup_sequenceModuleName(this.state.sequenceModuleName)}, attrs));
    }

    onSeek(timecode) {
        console.log('onSeek', timecode);
        this.lightsCommand('seek', {timecode: timecode});
    }

    onUpdateState(state) {
        this.setState(state);  //Object.assign(this.state, state)
    }

    render() {
        return (
            <div className='timeline_container'>
                <TimelineControls
                    sequenceModuleNames={[...this.props.eventmap.keySeq()]}
                    sequenceModuleName={this.state.sequenceModuleName}
                    onSelectTrack={this.onSelectTrack}
                    lightsCommand={this.lightsCommand}

                    playing={this.state.playing}
                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}

                    onUpdateState={this.onUpdateState}
                />
                <Timeline
                    ref={(child) => { this._timeline_react_component = child; }}

                    host={this.props.host}
                    pixelsPerSecond={this.props.pixelsPerSecond}

                    sequenceModuleName={this.state.sequenceModuleName}
                    cachebust={this.state.cachebust}

                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}

                    onSeek={this.onSeek}
                    onUpdateState={this.onUpdateState}
                />
            </div>
        );
    }
}
TimelineContainer.defaultProps = {
    sendMessages: ()=>{},
};
