import React from 'react';


export class TrackSelectionForm extends React.Component {
    constructor(props) {
        super(props);
        // TODO: assert proper.eventmap is map?
        this.handleChange = this.handleChange.bind(this);
        this.state = {value: ''};
        console.log([...props.eventmap.keys()]);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        console.log('track selected', event.target.value);
    }

    render() {
        return (
            <form>
                <label>
                    Track:<select value={this.state.value} onChange={this.handleChange}>
                        {this.props.eventmap.keySeq().map(eventname => (
                            <option value="{eventname}">{eventname}</option>
                        ))}
                    </select>
                </label>
            </form>
        );
    }
}