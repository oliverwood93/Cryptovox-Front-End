import React from 'react';
import Card from 'react-bootstrap/Card'

export default function FileToEncrypt( {
    fileSelectedHandler,
    fileUploadHandler,
    selectedFileToEncrypt,
    selectedAudioFile,
    recordedNotRecognised,
    isFileToEncryptSelected,
    isRecorded
} ) {
    console.log(isFileToEncryptSelected, selectedFileToEncrypt)
    return (
        <Card className="file-upload-section">
            <input
                disabled={
                    selectedAudioFile || ( !recordedNotRecognised && isRecorded ) ? false : true
                }
                type="file"
                onChange={fileSelectedHandler}
            />
            <button
                disabled={!selectedFileToEncrypt}
                onClick={() => fileUploadHandler( selectedFileToEncrypt )}
            >
                Click to Encrypt File
            </button>
        </Card>
    );
}
