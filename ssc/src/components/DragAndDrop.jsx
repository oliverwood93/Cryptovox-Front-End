import React from 'react'

export default function DragAndDrop({fileSelectedHandler, selectedFile}) {
  const input = document.getElementById("fileElem")
  return (
    
      <div id="drop-area">
        <form className="my-form">
          <p>
            Upload a file with the file dialog or by dragging and
            dropping into the dashed region
            </p>
          <input type="file" id="fileElem" onChange={fileSelectedHandler} />
          <label className="button" htmlFor="fileElem">
            Select a files
          </label>
         {selectedFile && <p>{selectedFile.name}</p>}
        </form>
    </div>
  )
}
