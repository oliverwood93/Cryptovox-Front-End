import React, { Component } from 'react';
import axios from 'axios';
import uuid from 'uuid';
import '../App.css';
import Mic from '../components/Mic';
import AudioFileUpload from '../components/AudioFileUpload';
import FileToEncrypt from '../components/FileToEncrypt';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

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
        activeTab: 'record',
        recording: false
    };

    handleRecording = recording => {
        this.setState({ recording });
    };
    audioSelectedHandler = event => {
        const audioFile = event.target.files[0];
        this.setState({
            selectedAudioFile: audioFile,
            isRecorded: false,
            recordedNotRecognised: false,
            notRecognised: false,
            trackInfo: false
        });
        this.audioUploadHandler(audioFile);
    };

    audioUploadHandler = (file, isRecorded) => {
        if (!file) return;
        const sessionId = uuid.v1();
        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.name ? file.name : `${Date.now()}.ogg`);
        data.append('session_id', sessionId);
        if (isRecorded) data.append('isRecorded', isRecorded);
        this.setState({ sessionId, isRecorded });
        axios
            .post('https://ssc-be.herokuapp.com/api/audiokey', data)
            .then(({ data }) => {
                if (data.artist) {
                    this.setState({
                        trackInfo: data,
                        notRecognised: false,
                        fileError: false,
                        recordedNotRecognised: false
                    });
                } else if (data.notRecognised)
                    this.setState({
                        trackInfo: null,
                        notRecognised: true,
                        fileError: false,
                        recordedNotRecognised: false
                    });
                else if (data.fileError)
                    this.setState({
                        fileError: true,
                        trackInfo: null,
                        notRecognised: false,
                        recordedNotRecognised: false
                    });
                else if (data.recordedNotRecognised) {
                    this.setState({
                        fileError: false,
                        trackInfo: null,
                        notRecognised: false,
                        recordedNotRecognised: true
                    });
                }
            })
            .catch(err => console.log(err));
    };
    fileSelectedHandler = event => {
        const file = event.target.files[0];
        this.setState({
            selectedFileToEncrypt: file,
            isFileToEncryptSelected: true
        });
    };

    fileUploadHandler = file => {
        const { workspace, switchToViewFiles } = this.props;
        const data = new FormData();
        data.append('file', file);
        data.append('filename', file.name ? file.name : `${Date.now()}.ogg`);
        data.append('session_id', this.state.sessionId);
        data.append('bucket_name', workspace);
        axios
            .post('https://ssc-be.herokuapp.com/api/encryptFile', data)
            .then(({ data }) => {
                if (data === 'encrypted') switchToViewFiles();
            })
            .catch(response => {
                console.log({ status: response.status, msg: response.data.error });
            });
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
            recording
        } = this.state;
        return (
            <div className="encryption-container">
                <Tabs
                    activeKey={this.state.activeTab}
                    onSelect={activeTab => this.setState({ activeTab })}
                >
                    <Tab eventKey="record" title="Record Audio Key">
                        <Alert variant="primary">
                            If you wish to encrypt your audio file using a known song then you can
                            try recording a clip of your chosen song below
                        </Alert>
                        <Card className="mic-encrypt-container">
                            <Mic
                                className="encrypt-mic"
                                handleRecordedAudio={this.audioUploadHandler}
                                recordedNotRecognised={recordedNotRecognised}
                                isRecorded={isRecorded}
                                trackInfo={trackInfo}
                                isUploadPage={true}
                                handleRecording={this.handleRecording}
                                isEncryption={true}
                                recording={recording}
                            />
                        </Card>
                        {recordedNotRecognised && !recording && isRecorded && (
                            <Alert variant="warning">
                                We have not recognised your recorded audio sample, if this is custom
                                content please upload file directly, otherwise please choose another
                                audio sample
                            </Alert>
                        )}
                        {trackInfo && isRecorded && (
                            <Alert variant="success">
                                We recognised the track as {trackInfo.title} by {trackInfo.artist},
                                if this is correct please click on the Upload File To Encrypt
                            </Alert>
                        )}
                    </Tab>

                    <Tab eventKey="upload" title="Upload Audio Key">
                        <Alert variant="primary">
                            If you wish to encrypt using an audio file from your computer then
                            please choose a file below.
                        </Alert>

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

                        {trackInfo && !isRecorded && (
                            <Alert variant="success">
                                We recognised the track as {trackInfo.title} by {trackInfo.artist}{' '}
                                if this correct please click on the Upload File To Encrypt
                            </Alert>
                        )}
                        {notRecognised && !trackInfo && (
                            <Alert variant="warning">
                                We have not recognised this audio, if it is custom content and you
                                wish to proceed please click on the Upload File To Encrypt
                            </Alert>
                        )}
                        {fileError && (
                            <Alert variant="danger">
                                There has been an error with your file, please use a different audio
                                file
                            </Alert>
                        )}
                    </Tab>

                    <Tab
                        className="upload-file-tab"
                        eventKey="file"
                        title="Upload File To Encrypt"
                        disabled={(!selectedAudioFile && !isRecorded) || recordedNotRecognised}
                    >
                        <Alert variant="primary">
                            Please choose a file to encrypt and upload to CryptoVox
                        </Alert>
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
