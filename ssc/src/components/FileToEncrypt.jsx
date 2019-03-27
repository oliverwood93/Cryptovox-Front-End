import React from 'react';

export default function FileToEncrypt( {
    fileSelectedHandler,
    fileUploadHandler,
    selectedFileToEncrypt,
    selectedAudioFile,
    recordedNotRecognised,
    isFileToEncryptSelected
} ) {
    console.log( recordedNotRecognised, selectedAudioFile );
    return (
        <div>
            <input
                disabled={!selectedAudioFile}
                type="file"
                onChange={fileSelectedHandler}
            />
            <button
                disabled={selectedAudioFile || !recordedNotRecognised ? false : true}
                onClick={() => fileUploadHandler( selectedFileToEncrypt )}
            >
                Click to Encrypt File
            </button>
        </div>
    );
}
