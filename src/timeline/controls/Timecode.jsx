import React from 'react';

import {timestamp_to_timecode} from 'calaldees_libs/es6/timecode';

require('./Timecode.scss');

export class Timecode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="timecode">
                <input type="text" name={`${this.props.name}_beatsbar`} value={timestamp_to_timecode(this.props.timecode, this.props.bpm, this.props.timesigniture)} />
                <input type="text" name={`${this.props.name}_timecode`} value={(this.props.timecode).toFixed(2)} />
            </div>
        );
    }
}