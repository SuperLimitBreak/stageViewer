import React, { Component } from 'react';

require('./timeline.scss');

export class TimelineManager {

    constructor(subscription_socket, timelineInstance) {
        //, document.getElementById('timeline')
        this.timelineInstance = timelineInstance;
        subscription_socket.addOnMessageListener((msg) => this.onMessage(msg));
    }

    onMessage(msg) {
        if (msg.func == 'lightState') {
            this.timelineInstance.setCursorPosition(msg.data.frame);
        }
        if (msg.func == 'scan_update_event') {
            this.timelineInstance.setName('');
            this.timelineInstance.setName(msg.scene);
        }
        if (msg.func == 'LightTiming.start') {
            this.timelineInstance.setName(msg.scene);
        }
    }
}

export class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            cursorPosition: 0,
            cacheBust: '',
            imageWidth: 0,
            selectionStart: 0,
            selectionEnd: 0,
        };
        this._px = this._px.bind(this);
        this.setName = this.setName.bind(this);
        this.setCursorPosition = this.setCursorPosition.bind(this);
        this._boundImageObjectNaturalWidth = this._boundImageObjectNaturalWidth.bind(this);
    }

    setName(name) {
        if (this.state.name != name) {
            this.setState({
                name: name,
                cacheBust: new Date().getTime(),
            });
        }
    }

    setCursorPosition(position) {
        this.setState({cursorPosition: position});
    }

    _px(value) {
        return value * this.props.pixelsPerSecond * this.props.zoom;
    }

    _boundImageObjectNaturalWidth(thisComponentInstance) {
        // CSS always enforces correct aspect ratio scaling unless absolute values are specified.
        // We want to scale 'height' but preserve naturalWidth. We have to enforce this width property manually with js
        this.setState({imageWidth: thisComponentInstance.target.naturalWidth});
    }

    render() {
        return (
            <div className={`timeline`}>
                <img
                    src={`http://${this.props.host}/${this.state.name}?${this.state.cacheBust}`}
                    style={{
                        width: `${this.state.imageWidth * this.props.zoom}px`,
                    }}
                    onLoad={this._boundImageObjectNaturalWidth}
                />
                <div
                    className='selection'
                    style={{
                        left: `${this._px(this.state.selectionStart)}px`,
                        width: `${this._px(this.state.selectionEnd - this.state.selectionStart)}px`,
                    }}
                ></div>
                <div
                    className='cursor'
                    style={{
                        left: `${this._px(this.state.cursorPosition)}px`,
                    }}
                ></div>
            </div>
        );
        // {this.props.cursorPosition}
        //<button onClick={this.setCursorPosition}>Set position</button>
    }
}
