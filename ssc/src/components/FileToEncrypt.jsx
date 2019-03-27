import React from 'react';

export default function FileToEncrypt( {
    fileSelectedHandler,
    fileUploadHandler,
    selectedFileToEncrypt,
    selectedAudioFile,
    recordedNotRecognised,
    isFileToEncryptSelected,
    isRecorded
} ) {
    return (
        <div className="file-upload-section">
            <input
                disabled={
                    selectedAudioFile || ( !recordedNotRecognised && isRecorded ) ? false : true
                }
                type="file"
                onChange={fileSelectedHandler}
            />
            <button
                disabled={!isFileToEncryptSelected}
                onClick={() => fileUploadHandler( selectedFileToEncrypt )}
            >
                Click to Encrypt File
            </button>
        </div>
    );
}
