import React from 'react';

export default function FileToEncrypt( {
    fileSelectedHandler,
    fileUploadHandler,
    selectedFileToEncrypt,
    selectedAudioFile
} ) {
    console.log(selectedAudioFile)
    return (
        <div>
            <input
                disabled={selectedAudioFile? false : true}
                type="file"
                onChange={fileSelectedHandler}
            />
            <button
                disabled={selectedAudioFile ? false : true}
                onClick={() => fileUploadHandler( selectedFileToEncrypt )}
            >
                Click to Encrypt File
            </button>
        </div>
    );
}
