import React, { Component, Fragment } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import mic from '../resources/mic.png';

export default class Mic extends Component {
    state = {
        recording: false,
        audios: null,
        blob: null
    };

    async componentDidMount() {
        const stream = await navigator.mediaDevices.getUserMedia( { audio: true } );
        this.mediaRecorder = new MediaRecorder( stream );
        this.chunks = [];
        this.mediaRecorder.ondataavailable = e => {
            if ( e.data && e.data.size > 0 ) {
                this.chunks.push( e.data );
            }
        };
    }

    startRecording( e ) {
        this.deleteAudio();
        e.preventDefault();
        this.chunks = [];
        this.mediaRecorder.start( 10 );
        this.setState( { recording: true } );
        setTimeout( () => {
            this.mediaRecorder.stop();
            this.setState( { recording: false } );
            this.saveAudio();
        }, 7000 );
    }

    saveAudio() {
        const blob = new Blob( this.chunks, { type: 'audio/ogg; codecs=opus' } );
        const audioURL = window.URL.createObjectURL( blob );
        const audios = audioURL;
        this.setState( { audios, blob } );
        this.props.handleRecordedAudio( blob, true );
    }

    deleteAudio() {
        this.setState( { audios: null, blob: null } );
    }

    render() {
        const { recording, audios } = this.state;
        const { recordedNotRecognised, isRecorded, trackInfo, isUploadPage } = this.props;

        return (
            <div className={isUploadPage ? 'encrypt-mic' : 'recording-section'}>
                {!recording && (
                    <img
                        className={isUploadPage ? 'encrypt-mic-logo' : "record-img"}
                        src={mic}
                        alt="record"
                        onClick={e => this.startRecording( e )}
                    />
                )}
                {recording && (
                    <Spinner className="recording-ani" animation="grow" variant="danger" />
                )}
                {trackInfo && isRecorded && (
                    <Fragment>
                        <p>
                            we recognised the track as {trackInfo.title} by {trackInfo.artist}
                        </p>
                    </Fragment>
                )}
                {recordedNotRecognised && !recording && (
                    <Fragment>
                        {/* <div key="audio" className="playback"> */}
                        <audio key="audio" className="playback" controls src={audios} />
                      
                        <p className="not-recog-msg">
                            We have not recognised your recorded audio sample, if this is custom
                            content please upload file directly, otherwise please choose another
                            audio sample
                        </p>
                    </Fragment>
                )}
            </div>
        );
    }
}
