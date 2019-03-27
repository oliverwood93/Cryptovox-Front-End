import React, { Component, Fragment } from 'react';
import Card from 'react-bootstrap/Card';

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
        this.deleteAudio()
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
        const { recordedNotRecognised, isRecorded, trackInfo } = this.props;

        return (
            <Card className="recording-section">
                {!recording && <button onClick={e => this.startRecording( e )}>Record</button>}
                {recording && <p>Recording...</p>}
                {trackInfo && isRecorded && (
                    <Fragment>
                        <p>
                            we recognised the track as {trackInfo.title} by {trackInfo.artist}
                        </p>
                    </Fragment>
                )}
                {recordedNotRecognised && !recording &&(
                    <Fragment>
                        <div key="audio">
                            <audio controls style={{ width: 200 }} src={audios} />
                        </div>
                        <p>
                            We have not recognised your recorded audio sample, if this is custom
                            content please upload file directly, otherwise please choose another
                            audio sample
                        </p>
                    </Fragment>
                )}
            </Card>
        );
    }
}
