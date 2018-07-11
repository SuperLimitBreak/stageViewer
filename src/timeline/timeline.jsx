import React from 'react';

require('./timeline.scss');


export class Timeline extends React.Component {

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
        this.rootElement = {scrollLeft: 0};
        this._timecode_to_px = this._timecode_to_px.bind(this);
        this._px_to_timecode = this._px_to_timecode.bind(this);
        this._mouseUp = this._mouseUp.bind(this);
        this._mouseDown = this._mouseDown.bind(this);
        this._mouseWheel = this._mouseWheel.bind(this);
        this._selectionUpdate = this._selectionUpdate.bind(this);
        this._selectionEnd = this._selectionEnd.bind(this);
        this.setZoom = this.setZoom.bind(this);
        this.seek = this.seek.bind(this);
        this.hasSelection = this.hasSelection.bind(this);
        this.inSelection = this.inSelection.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this._boundImageObjectNaturalWidth = this._boundImageObjectNaturalWidth.bind(this);
        this._event_to_timecode = this._event_to_timecode.bind(this);
    }

    seek(timecode) {
        console.warn('seek must be overridden');
    }

    setZoom(zoom) {
        this.setState({zoom: zoom});
    }

    inSelection(timecode) {
        return timecode >= this.state.selectionStart && timecode <= this.state.selectionEnd;
    }
    hasSelection() {
        return this.state.selecting!=null || this.state.selectionStart > 0 || this.state.selectionEnd > 0;
    }
    clearSelection() {
        this.setState({selectionStart: 0, selectionEnd: 0, selecting: null});
    }

    _event_to_timecode(event) {
        return this._px_to_timecode(this.rootElement.scrollLeft + event.clientX);
    }
    _mouseWheel(event) {
        event.preventDefault();  // Otherwise mousewheel (horizontal scroll) goes 'back' on browser
        if (event.ctrlKey) {
            const oldCursorTimecode = this._event_to_timecode(event);
            const newZoom = this.state.zoom + (this.state.zoom * this.props.zoomInvert * event.deltaY / this.props.zoomFactor);
            const newCursorPx = this._timecode_to_px(oldCursorTimecode, newZoom);
            this.setZoom(newZoom);  // Setting the state does not update `.state` immediately.
            this.rootElement.scrollLeft = newCursorPx - event.clientX;  // Keep cursor at focused timecode when zooming
        }
        else {  //if (event.shiftKey) {
            this.rootElement.scrollLeft += event.deltaX;
        }
    }
    _mouseDown(event) {
        event.preventDefault();
        const timecode = this._event_to_timecode(event);
        function bindMarkerDrag(_this, markerName) {
            if (
                _this._timecode_to_px(
                    Math.abs(timecode - _this.state[`selection${markerName}`])
                ) < _this.props.selectionThresholdPx
            ) {
                _this.setState({selecting: markerName});
                _this._selectionUpdate(event);
                return true;
            }
            return false;
        }
        if (this.hasSelection()) {
            if (bindMarkerDrag(this, 'Start')) {return;}
            if (bindMarkerDrag(this, 'End')) {return;}
        }
        if (this.hasSelection() && this.inSelection(timecode)) {
            return;
        }
        this.setState({selecting: 'End', selectionStart: timecode, selectionEnd: timecode});
    }
    _mouseUp(event) {
        event.preventDefault();
        const timecode = this._event_to_timecode(event);
        if (
            this.state.selecting==null ||
            (
                this.state.selecting=='End' &&
                this._timecode_to_px(
                    Math.abs(this.state.selectionStart - this.state.selectionEnd)
                ) < this.props.selectionThresholdPx
            )
        ) {
            if (this.hasSelection() && !this.inSelection(timecode)) {
                this.clearSelection();
            }
            this.seek(timecode);
        }
        else {
            this._selectionEnd(event);
        }
    }
    _selectionUpdate(event) {
        event.preventDefault();
        if (this.state.selecting) {
            const timecode = this._event_to_timecode(event);
            const state = {};
            const invertStartEnd = (markerName) => markerName == 'End' ? 'Start' : 'End';
            if (
                (this.state.selecting == 'End' && timecode < this.state.selectionStart) ||
                (this.state.selecting == 'Start' && timecode > this.state.selectionEnd)
            ) {
                state['selecting'] = invertStartEnd(this.state.selecting);
                state[`selection${this.state.selecting}`] = this.state[`selection${invertStartEnd(this.state.selecting)}`];
                state[`selection${invertStartEnd(this.state.selecting)}`] = timecode;
            } else {
                state[`selection${this.state.selecting}`] = timecode;
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

    _px_to_timecode(px, zoom_override=0) {
        const offset = 0;  //this.rootElement.scrollLeft +
        return (offset + px) / (this.props.pixelsPerSecond * (zoom_override || this.state.zoom));
    }
    _timecode_to_px(timecode, zoom_override=0) {
        return (timecode * (this.props.pixelsPerSecond * (zoom_override || this.state.zoom))); //- this.rootElement.scrollLeft;
    }

    _boundImageObjectNaturalWidth(thisComponentInstance) {
        // CSS always enforces correct aspect ratio scaling unless absolute values are specified.
        // We want to scale 'height' but preserve naturalWidth. We have to enforce this width property manually with js
        this.setState({imageWidth: thisComponentInstance.target.naturalWidth});
    }

    render() {
        return (
            <div
                className={'timeline'}
                onMouseDown={this._mouseDown}
                onMouseLeave={this._selectionEnd}
                onMouseMove={this._selectionUpdate}
                onMouseUp={this._mouseUp}
                onWheel={this._mouseWheel}
                draggable='false'
                ref={element => this.rootElement = element}
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
                        width: `${this._timecode_to_px(this.state.selectionEnd) - this._timecode_to_px(this.state.selectionStart)}px`,
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