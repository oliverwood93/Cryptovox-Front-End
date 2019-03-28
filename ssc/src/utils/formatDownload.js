import { mimeMap } from './mimeTypes';

import React from 'react';

function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export default function formatDownload( data, filename ) {
    // const bufferedData = str2ab(data)
    const type = mimeMap[ filename.slice( -3 ) ];
    // console.log( type, bufferedData );
    const url = window.URL.createObjectURL( new Blob( [ data  ], { type: type } ) );
    const link = document.createElement( 'a' );
    link.href = url;
    link.setAttribute( 'download', filename );
    document.body.appendChild( link );
    link.click();
}
