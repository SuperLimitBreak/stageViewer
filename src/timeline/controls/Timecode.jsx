import React from 'react';

require('./Timecode.scss');

export class Timecode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="timecode">
                <input type="text" name={`${this.props.name}_beatsbar`} value="0.0.0" />
                <input type="text" name={`${this.props.name}_timecode`} value={this.props.timecode} />
            </div>
        );
    }
}