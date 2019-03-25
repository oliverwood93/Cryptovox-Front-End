import React, { Component, Fragment } from 'react';
import axios from 'axios';
import uuid from 'uuid';
import '../app.css';
import Mic from '../components/Mic';
import DragAndDrop from '../components/DragAndDrop';

export default class Encryption extends Component {
    state = {
        selectedFile: null,
        sessionId: null,
        trackInfo: null,
        notRecognised: false,
        fileError: false
    };
    fileSelectedHandler = event => {
        this.setState( { selectedFile: event.target.files[ 0 ] } );
    };

    fileUploadHandler = file => {
        const sessionId = uuid.v1();
        const data = new FormData();
        data.append( 'file', file );
        data.append( 'filename', file.name ? file.name : `${ Date.now() }.ogg` );
        data.append( 'session_id', sessionId );
        console.dir( data );
        axios
            .post( 'http://localhost:5000/api/audiokey', data )
            .then( ( { data } ) => {
                if ( data.artist ) {
                    this.setState( {
                        sessionId,
                        trackInfo: data,
                        notRecognised: false,
                        fileError: false
                    } );
                }
                if ( data.notRecognised )
                    this.setState( { trackInfo: null, notRecognised: true, fileError: false } );
                if ( data.fileError )
                    this.setState( { fileError: true, trackInfo: null, notRecognised: false } );
            } )
            .catch( err => console.log( err ) );
    };
    handleAcceptAudio = () => {
        axios.post();
    };

    render() {
        const { trackInfo, notRecognised, fileError, selectedFile } = this.state;
        return (
            <div>
                <input type="file" onChange={this.fileSelectedHandler} />
                <button onClick={() => this.fileUploadHandler( selectedFile )}>Upload Audio</button>
                {navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (
                    <Mic handleRecordedAudio={this.fileUploadHandler} />
                )}
                <DragAndDrop fileSelectedHandler={this.fileSelectedHandler} fileName={selectedFile} />

                {trackInfo && (
                    <Fragment>
                        <p>
                            we recognised the track as {trackInfo.title} by {trackInfo.artist}
                        </p>
                        <button onClick={this.handleAcceptAudio}>Approve</button>
                    </Fragment>
                )}
                {notRecognised && (
                    <Fragment>
                        <p>
                            we have not recognised this audio if it is custom content and you would
                            still like to use it please upload the file directly.
                        </p>
                        <button onClick={this.handleAcceptAudio}>Approve</button>
                    </Fragment>
                )}
                {fileError && (
                    <Fragment>
                        <p>
                            There has been an error with your file, please use a different audio
                            file
                        </p>
                        <button onClick={this.handleAcceptAudio}>Approve</button>
                    </Fragment>
                )}
            </div>
        );
    }
}
