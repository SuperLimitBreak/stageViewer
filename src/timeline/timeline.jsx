import React, { Component } from 'react';

require('./timeline.scss');

export class TimelineManager {

    constructor(subscription_socket, timelineInstance) {
        this.subscription_socket = subscription_socket;
        this.subscription_socket.addOnMessageListener((msg) => this.onMessage(msg));

        this.timelineInstance = timelineInstance;
        this.timelineInstance.seek = this.seek.bind(this);
    }

    onMessage(msg) {
        if (msg.func == 'lightState') {
            this.timelineInstance.setCursorPosition(msg.data.timecode);
        }
        if (msg.func == 'scan_update_event') {
            this.timelineInstance.setName('');
            this.timelineInstance.setName(msg.scene);
        }
        if (msg.func == 'LightTiming.start') {
            this.timelineInstance.setName(msg.scene);
        }
    }

    seek(timecode) {
        this.subscription_socket.sendMessages({deviceid: 'lights', func: 'lights.seek', timecode: timecode});
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
            selecting: null,
        };
        this._timecode_to_px = this._timecode_to_px.bind(this);
        this._px_to_timecode = this._px_to_timecode.bind(this);
        this._mouseUp = this._mouseUp.bind(this);
        this._mouseDown = this._mouseDown.bind(this);
        this._selectionStart = this._selectionStart.bind(this);
        this._selectionUpdate = this._selectionUpdate.bind(this);
        this._selectionEnd = this._selectionEnd.bind(this);
        this.seek = this.seek.bind(this);
        this.hasSelection = this.hasSelection.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
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

    setCursorPosition(timecode) {
        this.setState({cursorPosition: timecode});
    }

    seek(timecode) {
        console.warn('seek must be overridden');
    }

    hasSelection() {
        return this.state.selecting!=null || this.state.selectionStart > 0 || this.state.selectionEnd > 0;
    }
    clearSelection() {
        this.setState({selectionStart: 0, selectionEnd: 0, selecting: null});
    }

    _mouseDown(event) {
        function bindMarkerDrag(_this, markerName) {
            if (
                Math.abs(_this._px_to_timecode(event.clientX) - _this.state[`selection${markerName}`]) < 1
            ) {
                _this.setState({selecting: markerName});
                _this._selectionUpdate(event);
            }
        }
        if (this.hasSelection()) {
            bindMarkerDrag(this, 'Start');
            bindMarkerDrag(this, 'End');
        } else {
            this.setState({selecting: 'End', selectionStart: this._px_to_timecode(event.clientX)});
        }
    }
    _mouseUp(event) {
        if (
            this.state.selecting==null ||
            (
                this.state.selecting=='End' &&
                this._timecode_to_px(
                    Math.abs(this.state.selectionStart - this.state.selectionEnd)
                ) < 5
            )
         ) {
            this.clearSelection();
            this.seek(this._px_to_timecode(event.clientX));
        }
        else {
            this._selectionEnd(event);
        }
    }
    _selectionStart(event) {
    }
    _selectionUpdate(event) {
        if (this.state.selecting) {
            const state = {};
            state[`selection${this.state.selecting}`] = this._px_to_timecode(event.clientX);
            this.setState(state);
        }
    }
    _selectionEnd(event) {
        if (this.state.selecting) {
            this._selectionUpdate(event);
            this.setState({selecting: null});
        }
    }

    _px_to_timecode(px) {
        return px / (this.props.pixelsPerSecond * this.props.zoom);
    }
    _timecode_to_px(timecode) {
        return timecode * (this.props.pixelsPerSecond * this.props.zoom);
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
                    onMouseDown={this._mouseDown}
                    onMouseLeave={this._selectionEnd}
                    onMouseOut={this._selectionEnd}
                    onMouseMove={this._selectionUpdate}
                    onMouseUp={this._mouseUp}
                />
                <div
                    className='selection'
                    style={{
                        left: `${this._timecode_to_px(this.state.selectionStart)}px`,
                        width: `${this._timecode_to_px(this.state.selectionEnd - this.state.selectionStart)}px`,
                    }}
                ></div>
                <div
                    className='cursor'
                    style={{
                        left: `${this._timecode_to_px(this.state.cursorPosition)}px`,
                    }}
                ></div>
            </div>
        );
        // {this.props.cursorPosition}
        //<button onClick={this.setCursorPosition}>Set position</button>
    }
}
