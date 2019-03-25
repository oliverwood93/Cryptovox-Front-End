import React, { Component } from 'react';

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
        e.preventDefault();
        this.chunks = [];
        this.mediaRecorder.start( 10 );
        this.setState( { recording: true } );
    }

    stopRecording( e ) {
        e.preventDefault();
        this.mediaRecorder.stop();
        this.setState( { recording: false } );
        this.saveAudio();
    }

    saveAudio() {
        const blob = new Blob( this.chunks, { type: 'audio/ogg; codecs=opus' } );
        const audioURL = window.URL.createObjectURL( blob );
        const audios = audioURL;
        this.setState( { audios, blob } );
        this.props.handleRecordedAudio( blob );
    }

    deleteAudio() {
        this.setState( { audios: null, blob: null } );
    }

    render() {
        const { recording, audios } = this.state;

        return (
            // <div className="camera">
            //     <audio
            //         style={{ width: 400 }}
            //         ref={a => {
            //             this.audio = a;
            //         }}
            //     >
            //         <p>Audio stream not available. </p>
            //     </audio>
            //     <div>
            <div>
                {!recording && <button onClick={e => this.startRecording( e )}>Record</button>}
                {recording && (
                    <button
                        onClick={e => {
                            this.stopRecording( e );
                        }}
                    >
                        Stop
                    </button>
                )}

                <h3>Recorded audios:</h3>

                {audios && (
                    <div key="audio">
                        <audio controls style={{ width: 200 }} src={audios} />
                        <div>
                            <button onClick={() => this.deleteAudio()}>Delete</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
