const axios = require( 'axios' );
const { BASE_URL } = require( '../utils/url' );

const translateMethod = method => {
    const methodTranslation = {
        get: 'fetch',
        post: 'create',
        patch: 'update',
        put: 'update',
        delete: 'delete'
    };
    return methodTranslation[ method ];
};
export const makeAPICalls = ( {
    url,
    reqObjectKey,
    params,
    data,
    method,
    multiRes,
    cancelToken
} ) => {
    const instance = axios.create( {
        baseURL: `${ BASE_URL }`,
        url,
        params,
        method,
        data,
        cancelToken
    } );
    const action = translateMethod( method );
    const genericMsg = `Could not ${ action } ${ reqObjectKey }. Contact Support.`;

    if ( method === 'delete' ) {
        return new Promise( ( resolve, reject ) => {
            instance
                .request()
                .then( ( { status } ) => {
                    resolve( status );
                } )
                .catch( res => {
                    const err = res.data ? res.data.error : genericMsg;
                    reject( err );
                } );
        } );
    } else if ( multiRes ) {
        return new Promise( ( resolve, reject ) => {
            instance
                .request()
                .then( ( { data } ) => {
                    resolve( data );
                } )
                .catch( res => {
                    const err = res.data ? res.data.error : genericMsg;
                    reject( err );
                } );
        } );
    } else {
        return new Promise( ( resolve, reject ) => {
            instance
                .request()
                .then( ( { data: { [ reqObjectKey ]: value } } ) => {
                    resolve( value );
                } )
                .catch( res => {
                    const err = res.data ? res.data.error : genericMsg;
                    reject( err );
                } );
        } );
    }
};