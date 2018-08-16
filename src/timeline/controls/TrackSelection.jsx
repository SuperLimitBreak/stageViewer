import React from 'react';


export class TrackSelection extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.props.onSelectTrack(this.props.sequenceModuleNames[0]);
    }

    handleChange(event) {
        this.props.onSelectTrack(event.target.value);
    }

    render() {
        return (
            <form>
                <label>
                    Track:
                    <select value={this.props.sequenceModuleName} onChange={this.handleChange}>
                        {this.props.sequenceModuleNames.map(sequenceModuleName => (
                            <option value={sequenceModuleName} key={sequenceModuleName}>{sequenceModuleName}</option>
                        ))}
                    </select>
                </label>
            </form>
        );
    }
}