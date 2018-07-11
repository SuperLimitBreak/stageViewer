
import React from 'react';
import { TrackSelectionForm } from './controls/track_selection';
import { Timeline } from './timeline';

export class TimelineContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };

        this.timeline = <Timeline
            host={this.props.host}
            pixelsPerSecond={this.props.pixelsPerSecond}
        />;
        this.controls = <TrackSelectionForm
            eventmap={this.props.eventmap}
        />;

    }

    render() {
        return (
            <div>
                {this.controls}
                {this.timeline}
            </div>
        );
    }
}
TimelineContainer.defaultProps = {
};
