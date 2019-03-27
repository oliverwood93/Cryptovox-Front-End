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
        isFileToEncryptSelected: false,
        sessionId: null,
        trackInfo: null,
        notRecognised: false,
        recordedNotRecognised: false,
        fileError: false,
        isRecorded: false
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
        this.setState( { sessionId, isRecorded } );
        axios
            .post( 'https://ssc-be.herokuapp.com/api/audiokey', data )
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
        this.setState( {
            selectedFileToEncrypt: event.target.files[ 0 ],
            isFileToEncryptSelected: true
        } );
    };

    fileUploadHandler = file => {
        const { workspace } = this.props;
        const data = new FormData();
        data.append( 'file', file );
        data.append( 'filename', file.name ? file.name : `${ Date.now() }.ogg` );
        data.append( 'session_id', this.state.sessionId );
        data.append( 'bucket_name', workspace );
        axios
            .post( 'https://ssc-be.herokuapp.com/api/encryptFile', data )
            .then( data => {
                console.log( data );
            } )
            .catch( ( { response } ) =>
                console.log( { status: response.status, msg: response.data.error } )
            );
    };

    render() {
        const {
            trackInfo,
            notRecognised,
            fileError,
            selectedAudioFile,
            recordedNotRecognised,
            selectedFileToEncrypt,
            isFileToEncryptSelected,
            isRecorded
        } = this.state;

        return (
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
                <FileToEncrypt
                    recordedNotRecognised={recordedNotRecognised}
                    selectedAudioFile={selectedAudioFile}
                    fileSelectedHandler={this.fileSelectedHandler}
                    fileUploadHandler={this.fileUploadHandler}
                    selectedFileToEncrypt={selectedFileToEncrypt}
                    isFileToEncryptSelected={isFileToEncryptSelected}
                    isRecorded={isRecorded}
                />
            </div>
        );
    }
}
