import React from 'react';


export class TrackSelection extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {value: ''};
        console.log(this.props.eventnames);
    }

    handleChange(event) {
        const eventname = event.target.value;
        this.setState({value: eventname});
        this.props.onSelectTrack(eventname);
    }

    render() {
        return (
            <form>
                <label>
                    Track:
                    <select value={this.state.value} onChange={this.handleChange}>
                        {this.props.eventnames.map(eventname => (
                            <option value={eventname} key={eventname}>{eventname}</option>
                        ))}
                    </select>
                </label>
            </form>
        );
    }
}