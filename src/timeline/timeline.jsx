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
        Object.assign(props, {
            name:'',
            host:'localhost',
            pixelsPerSecond:8,
            zoom:1,
            selectionThresholdPx:5,
        }, props);
        console.log(props);
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
        event.preventDefault();
        console.log('_mouseDown', event);
        const pos = this._px_to_timecode(event.clientX);
        function bindMarkerDrag(_this, markerName) {
            if (
                Math.abs(event.clientX - _this._timecode_to_px(_this.state[`selection${markerName}`])) < _this.props.selectionThresholdPx
            ) {
                console.log(`dragging ${markerName}`);
                _this.setState({selecting: markerName});
                _this._selectionUpdate(event);
                return true;
            }
        }
        if (this.hasSelection()) {
            console.log('hasSelection');
            if (bindMarkerDrag(this, 'Start')) {return;}
            if (bindMarkerDrag(this, 'End')) {return;}
        }
        console.log('startingSelection');
        this.setState({selecting: 'End', selectionStart: pos, selectionEnd: pos});
    }
    _mouseUp(event) {
        event.preventDefault();
        //const ss = this._timecode_to_px(Math.abs(this.state.selectionStart - this.state.selectionEnd));
        //console.log(`_mouseUp selection_size:${ss}`, event);
        if (
            this.state.selecting==null ||
            (
                this.state.selecting=='End' &&
                this._timecode_to_px(
                    Math.abs(this.state.selectionStart - this.state.selectionEnd)
                ) < this.props.selectionThresholdPx
            )
         ) {
            console.log('seek');
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
        event.preventDefault();
        //console.log(`_selectionUpdate ${this._px_to_timecode(event.clientX)}`);
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
                console.log(`_selectionUpdate selecting start:${this.state.selectionStart} end:${this.state.selectionEnd}`);
                state[`selection${this.state.selecting}`] = pos;
            }
            this.setState(state);
        }
    }
    _selectionEnd(event) {
        event.preventDefault();
        console.log('_selectionEnd', event);
        if (this.state.selecting) {
            this._selectionUpdate(event);
            console.log('_selectionEnd null');
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
            <div
                className={`timeline`}
                onMouseDown={this._mouseDown}
                onMouseLeave={this._selectionEnd}
                onMouseMove={this._selectionUpdate}
                onMouseUp={this._mouseUp}
                draggable='false'
            >
                <img
                    src={`http://${this.props.host}/${this.state.name}?${this.state.cacheBust}`}
                    style={{
                        width: `${this.state.imageWidth * this.props.zoom}px`,
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
        // {this.props.cursorPosition}
        //<button onClick={this.setCursorPosition}>Set position</button>
    }
}
