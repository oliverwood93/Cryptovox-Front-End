import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid';
import '../App.css';
import Mic from '../components/Mic';
import AudioFileUpload from '../components/AudioFileUpload';
import FileToEncrypt from '../components/FileToEncrypt';
import { Tabs, Tab, Card } from 'react-bootstrap';

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
        isRecorded: false,
        activeTab: 'record'
    };
    audioSelectedHandler = event => {
        const audioFile = event.target.files[ 0 ];
        this.setState( {
            selectedAudioFile: audioFile,
            isRecorded: false,
            recordedNotRecognised: false,
            notRecognised: false,
            trackInfo: false
        } );
        this.audioUploadHandler( audioFile );
    };

    audioUploadHandler = ( file, isRecorded ) => {
        if ( !file ) return;
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
                        fileError: false,
                        recordedNotRecognised: false
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
        const file = event.target.files[ 0 ];
        this.setState( {
            selectedFileToEncrypt: file,
            isFileToEncryptSelected: true
        } );
    };

    fileUploadHandler = file => {
        const { workspace, switchToViewFiles } = this.props;
        const data = new FormData();
        data.append( 'file', file );
        data.append( 'filename', file.name ? file.name : `${ Date.now() }.ogg` );
        data.append( 'session_id', this.state.sessionId );
        data.append( 'bucket_name', workspace );
        axios
            .post( 'https://ssc-be.herokuapp.com/api/encryptFile', data )
            .then( ( { data } ) => {
                if ( data === 'encrypted' ) switchToViewFiles();
            } )
            .catch( response => {
                console.log( { status: response.status, msg: response.data.error } );
            } );
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
            isRecorded,
            activeTab
        } = this.state;
        return (
            <div className="encryption-container">
                <Tabs
                    activeKey={this.state.activeTab}
                    onSelect={activeTab => this.setState( { activeTab } )}
                >
                    <Tab eventKey="record" title="Record Audio Key">
                        <Card className="mic-encrypt-container">
                            <Mic className="encrypt-mic"
                                handleRecordedAudio={this.audioUploadHandler}
                                recordedNotRecognised={recordedNotRecognised}
                                isRecorded={isRecorded}
                                trackInfo={trackInfo}
                                isUploadPage={true}
                            />
                        </Card>
                    </Tab>

                    <Tab eventKey="upload" title="Upload Audio Key">
                        <AudioFileUpload
                            audioSelectedHandler={this.audioSelectedHandler}
                            selectedAudioFile={selectedAudioFile}
                            audioUploadHandler={this.audioUploadHandler}
                            trackInfo={trackInfo}
                            notRecognised={notRecognised}
                            fileError={fileError}
                            recordedNotRecognised={recordedNotRecognised}
                            isRecorded={isRecorded}
                        />
                    </Tab>

                    <Tab
                        eventKey="file"
                        title="Upload File To Encrypt"
                        disabled={( !selectedAudioFile && !isRecorded ) || recordedNotRecognised}
                    >
                        <FileToEncrypt
                            recordedNotRecognised={recordedNotRecognised}
                            selectedAudioFile={selectedAudioFile}
                            fileSelectedHandler={this.fileSelectedHandler}
                            fileUploadHandler={this.fileUploadHandler}
                            selectedFileToEncrypt={selectedFileToEncrypt}
                            isFileToEncryptSelected={isFileToEncryptSelected}
                            isRecorded={isRecorded}
                        />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
