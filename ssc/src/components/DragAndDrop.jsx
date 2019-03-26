import React from 'react'

export default function DragAndDrop({fileSelectedHandler, selectedFile}) {
  const input = document.getElementById("fileElem")
  return (
    
      <div id="drop-area">
      <form className="my-form" onDrop={fileSelectedHandler}>
        {!selectedFile ? <p>
            Upload a file with the file dialog or by dragging and
          dropping into the dashed region
            </p> : <h1>{selectedFile.name}</h1>}
          <input type="file" id="fileElem" />
          <label className="button" htmlFor="fileElem">
            Select a files
          </label>
         
        </form>
    </div>
  )
}
