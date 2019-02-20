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
            bpm: 120,
            timesignature: '4:4',
        };
        this.onSelectTrack = this.onSelectTrack.bind(this);
        this.lightsCommand = this.lightsCommand.bind(this);

        this.onSeek = this.onSeek.bind(this);
        this.onUpdateState = this.onUpdateState.bind(this);

        //this._lookup_sequenceModuleName = this._lookup_sequenceModuleName.bind(this);
    }

    // NOT USED?
    get sequenceModuleNames() {
        // sigh ... we refer to `sequenceModuleName` in this js code as the KEY in the eventmap
        // this is NOT the sequenceModuleName that the lighting system uses. sequenceModuleName is the item called with light.start_sequence.
        // This function is a mapping between eventmap[sequenceModuleName]->func=light.start_sequence--scene with sequenceModuleName as a fallback
        // not brilliant
        //const sequenceModuleName = this.state.sequenceModuleName;
        //const sequenceModuleName_lookup = 
        return this.props.eventmap.map((payloads, sequenceModuleName) => {
            for (let payload of payloads) {
                if (payload.get('func') == 'lights.start_sequence' || payload.get('func') == 'lights.load_sequence') {
                    if (payload.get('sequence_module_name')) {return payload.get('sequence_module_name');}
                    if (payload.get('scene')) {return payload.get('scene');}  // legacy fallback - can be removed?
                }
            }
            return sequenceModuleName;
        }).valueSeq();
        //return sequenceModuleName_lookup;
        //const temp = sequenceModuleName_lookup.merge(sequenceModuleName_lookup.flip());
        //const temp2 = temp.get(sequenceModuleName, sequenceModuleName);
        //console.log(`YAY sequenceModuleName ${sequenceModuleName} ${temp2}`, temp.toJS());
        //return temp2;
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
        const msgs = [];
        if (this.state.sequenceModuleName) {
            console.log(`lights.${cmd}`, attrs);
            msgs.push(Object.assign(
                {deviceid: 'lights', func: `lights.${cmd}`, sequence_module_name: this.state.sequenceModuleName},
                attrs,
            ));
        } else {
            console.debug(`suppressing lights.${cmd} command as sequenceModuleName not specified`, attrs);
        }
        if (cmd == 'pause') {
            msgs.push(
                {deviceid: 'audio', func: `audio.${cmd}`},
                {deviceid: 'video', func: `video.${cmd}`},
            );
        }
        this.props.sendMessages(...msgs);
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
                    sequenceModuleNames={[...this.props.eventmap.keySeq(), '']}
                    sequenceModuleName={this.state.sequenceModuleName}
                    onSelectTrack={this.onSelectTrack}
                    lightsCommand={this.lightsCommand}

                    playing={this.state.playing}
                    cursorPosition={this.state.cursorPosition}
                    selectionStart={this.state.selectionStart}
                    selectionEnd={this.state.selectionEnd}

                    bpm={this.state.bpm}
                    timesignature={this.state.timesignature}

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
