import { mimeMap } from './mimeTypes';



export default function formatDownload( data, filename ) {
    const type = mimeMap[ filename.slice( -3 ) ];
    const url = window.URL.createObjectURL( new Blob( [ data  ], { type: type } ) );
    const link = document.createElement( 'a' );
    link.href = url;
    link.setAttribute( 'download', filename );
    document.body.appendChild( link );
    link.click();
}
