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
            this.timelineInstance.setState({
                cursorPosition: msg.timecode,
                name: msg.module_name,
                cachebust: msg.module_hash,
            });
            // If playing outside selection - send 'seek' to beginning of selection
            if (
                this.timelineInstance.hasSelection() &&
                !this.timelineInstance.inSelection(this.timelineInstance.state.cursorPosition)
            ) {
                this.timelineInstance.seek(this.timelineInstance.state.selectionStart);
            }
        }
        if (msg.func == 'scan_update_event') {
            console.log('scan_update_event', msg);
            this.timelineInstance.setState({
                name: msg.module_name,
                cachebust: msg.module_hash,
            });
        }
        if (msg.func == 'LightTiming.start') {
            //this.timelineInstance.setName(msg.scene);
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
            cachebust: '',
            imageWidth: 0,
            selectionStart: 0,
            selectionEnd: 0,
            selecting: null,
            zoom: 1,
        };
        this._timecode_to_px = this._timecode_to_px.bind(this);
        this._px_to_timecode = this._px_to_timecode.bind(this);
        this._mouseUp = this._mouseUp.bind(this);
        this._mouseDown = this._mouseDown.bind(this);
        this._mouseWheel = this._mouseWheel.bind(this);
        this._selectionUpdate = this._selectionUpdate.bind(this);
        this._selectionEnd = this._selectionEnd.bind(this);
        this.zoom = this.zoom.bind(this);
        this.seek = this.seek.bind(this);
        this.hasSelection = this.hasSelection.bind(this);
        this.inSelection = this.inSelection.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this._boundImageObjectNaturalWidth = this._boundImageObjectNaturalWidth.bind(this);
    }

    seek(timecode) {
        console.warn('seek must be overridden');
    }

    zoom(zoom) {
        this.setState({zoom: zoom});
    }

    inSelection(timecode) {
        return timecode > this.state.selectionStart && timecode < this.state.selectionEnd;
    }
    hasSelection() {
        return this.state.selecting!=null || this.state.selectionStart > 0 || this.state.selectionEnd > 0;
    }
    clearSelection() {
        this.setState({selectionStart: 0, selectionEnd: 0, selecting: null});
    }

    _mouseWheel(event) {
        this.zoom(this.state.zoom + (this.state.zoom * this.props.zoomInvert * event.deltaY / this.props.zoomFactor));
    }
    _mouseDown(event) {
        event.preventDefault();
        const pos = this._px_to_timecode(event.clientX);
        function bindMarkerDrag(_this, markerName) {
            if (
                Math.abs(event.clientX - _this._timecode_to_px(_this.state[`selection${markerName}`])) < _this.props.selectionThresholdPx
            ) {
                _this.setState({selecting: markerName});
                _this._selectionUpdate(event);
                return true;
            }
        }
        if (this.hasSelection()) {
            if (bindMarkerDrag(this, 'Start')) {return;}
            if (bindMarkerDrag(this, 'End')) {return;}
        }
        if (this.hasSelection() && this.inSelection(pos)) {
            return;
        }
        this.setState({selecting: 'End', selectionStart: pos, selectionEnd: pos});
    }
    _mouseUp(event) {
        event.preventDefault();
        const pos = this._px_to_timecode(event.clientX);
        if (
            this.state.selecting==null ||
            (
                this.state.selecting=='End' &&
                this._timecode_to_px(
                    Math.abs(this.state.selectionStart - this.state.selectionEnd)
                ) < this.props.selectionThresholdPx
            )
         ) {
            if (this.hasSelection() && !this.inSelection(pos)) {
                this.clearSelection();
            }
            this.seek(pos);
        }
        else {
            this._selectionEnd(event);
        }
    }
    _selectionUpdate(event) {
        event.preventDefault();
        if (this.state.selecting) {
            const pos = this._px_to_timecode(event.clientX);
            const state = {};
            const invertStartEnd = (markerName) => markerName == 'End' ? 'Start' : 'End';
            if (
                (this.state.selecting == 'End' && pos < this.state.selectionStart) ||
                (this.state.selecting == 'Start' && pos > this.state.selectionEnd)
            ) {
                state['selecting'] = invertStartEnd(this.state.selecting);
                state[`selection${this.state.selecting}`] = this.state[`selection${invertStartEnd(this.state.selecting)}`];
                state[`selection${invertStartEnd(this.state.selecting)}`] = pos;
            } else {
                state[`selection${this.state.selecting}`] = pos;
            }
            this.setState(state);
        }
    }
    _selectionEnd(event) {
        event.preventDefault();
        if (this.state.selecting) {
            this._selectionUpdate(event);
            this.setState({selecting: null});
        }
    }

    _px_to_timecode(px) {
        return px / (this.props.pixelsPerSecond * this.state.zoom);
    }
    _timecode_to_px(timecode) {
        return timecode * (this.props.pixelsPerSecond * this.state.zoom);
    }

    _boundImageObjectNaturalWidth(thisComponentInstance) {
        // CSS always enforces correct aspect ratio scaling unless absolute values are specified.
        // We want to scale 'height' but preserve naturalWidth. We have to enforce this width property manually with js
        this.setState({imageWidth: thisComponentInstance.target.naturalWidth});
    }

    render() {
        return (
            <div
                className={`timeline`}
                onMouseDown={this._mouseDown}
                onMouseLeave={this._selectionEnd}
                onMouseMove={this._selectionUpdate}
                onMouseUp={this._mouseUp}
                onWheel={this._mouseWheel}
                draggable='false'
            >
                <img
                    src={`http://${this.props.host}/${this.state.name}?cachebust=${this.state.cachebust}`}
                    style={{
                        width: `${this.state.imageWidth * this.state.zoom}px`,
                    }}
                    onLoad={this._boundImageObjectNaturalWidth}
                    draggable='false'
                />
                <div
                    className='selection'
                    style={{
                        left: `${this._timecode_to_px(this.state.selectionStart)}px`,
                        width: `${this._timecode_to_px(this.state.selectionEnd - this.state.selectionStart)}px`,
                    }}
                    draggable='false'
                ></div>
                <div
                    className='cursor'
                    style={{
                        left: `${this._timecode_to_px(this.state.cursorPosition)}px`,
                    }}
                    draggable='false'
                ></div>
            </div>
        );
    }
}
Timeline.defaultProps = {
    host: 'localhost',
    pixelsPerSecond: 8,
    selectionThresholdPx: 5,
    zoomFactor: 32,
    zoomInvert: -1,
};