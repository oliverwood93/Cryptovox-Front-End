import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid';
import '../App.css';
import Mic from '../components/Mic';
import AudioFileUpload from '../components/AudioFileUpload';
import FileToEncrypt from '../components/FileToEncrypt';

export default class Encryption extends Component {
    state = {
        selectedAudioFile: null,
        selectedFileToEncrypt: null,
        sessionId: null,
        trackInfo: null,
        notRecognised: false,
        recordedNotRecognised: false,
        fileError: false
    };
    audioSelectedHandler = event => {
        this.setState( { selectedAudioFile: event.target.files[ 0 ] } );
    };

    audioUploadHandler = ( file, isRecorded ) => {
        const sessionId = uuid.v1();
        const data = new FormData();
        data.append( 'file', file );
        data.append( 'filename', file.name ? file.name : `${ Date.now() }.ogg` );
        data.append( 'session_id', sessionId );
        if ( isRecorded ) data.append( 'isRecorded', isRecorded );
        this.setState( { sessionId } );
        axios
            .post( 'http://localhost:5000/api/audiokey', data )
            .then( ( { data } ) => {
                if ( data.artist ) {
                    this.setState( {
                        trackInfo: data,
                        notRecognised: false,
                        fileError: false
                    } );
                } else if ( data.notRecognised )
                    this.setState( {
                        trackInfo: null,
                        notRecognised: true,
                        fileError: false,
                        recordedNotRecognised: false
                    } );
                else if ( data.fileError )
                    this.setState( {
                        fileError: true,
                        trackInfo: null,
                        notRecognised: false,
                        recordedNotRecognised: false
                    } );
                else if ( data.recordedNotRecognised ) {
                    this.setState( {
                        fileError: false,
                        trackInfo: null,
                        notRecognised: false,
                        recordedNotRecognised: true
                    } );
                }
            } )
            .catch( err => console.log( err ) );
    };
    fileSelectedHandler = event => {
        this.setState( { selectedFileToEncrypt: event.target.files[ 0 ] } );
    };

    fileUploadHandler = file => {
        const data = new FormData();
        data.append( 'file', file );
        data.append( 'filename', file.name ? file.name : `${ Date.now() }.ogg` );
        data.append( 'session_id', this.state.sessionId );
        data.append( 'bucket_name', 'workspace4567' );
        axios.post( 'http://localhost:5000/api/encryptFile', data ).then( data => {
            console.log( data );
        } ).catch( ( { response } ) => console.log( { status: response.status, msg: response.data.error } ) );
    };

    render() {
        const {
            trackInfo,
            notRecognised,
            fileError,
            selectedAudioFile,
            recordedNotRecognised,
            selectedFileToEncrypt
        } = this.state;

        return (
            // console.log(trackInfo)
            <div>
                <AudioFileUpload
                    audioSelectedHandler={this.audioSelectedHandler}
                    selectedAudioFile={selectedAudioFile}
                    audioUploadHandler={this.audioUploadHandler}
                    trackInfo={trackInfo}
                    handleAcceptAudio={this.handleAcceptAudio}
                    notRecognised={notRecognised}
                    fileError={fileError}
                    recordedNotRecognised={recordedNotRecognised}
                />
                <Mic handleRecordedAudio={this.audioUploadHandler} />
                <FileToEncrypt selectedAudioFile={selectedAudioFile}
                    fileSelectedHandler={this.fileSelectedHandler}
                    fileUploadHandler={this.fileUploadHandler}
                    selectedFileToEncrypt={selectedFileToEncrypt}
                />
            </div>
        );
    }
}
