import React from 'react';


export class TrackSelection extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.props.onSelectTrack(this.props.eventnames[0]);
    }

    handleChange(event) {
        this.props.onSelectTrack(event.target.value);
    }

    render() {
        return (
            <form>
                <label>
                    Track:
                    <select value={this.props.name} onChange={this.handleChange}>
                        {this.props.eventnames.map(eventname => (
                            <option value={eventname} key={eventname}>{eventname}</option>
                        ))}
                    </select>
                </label>
            </form>
        );
    }
}