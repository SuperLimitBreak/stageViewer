import React from 'react';


export class Timecode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="timecode">
                <div><input type="text" name={`${this.props.name}_beatsbar`} value="0.0.0" /></div>
                <div><input type="text" name={`${this.props.name}_timecode`} value={this.props.timecode} /></div>
            </div>
        );
    }
}