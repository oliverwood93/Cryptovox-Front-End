import axios from 'axios';
const BASE_URL = 'https://ssc-shumanator.herokuapp.com/api';

export const getUsers = () => {
    return axios.get( `${ BASE_URL }/users` );
};

export const getLoginDetails = data => {
    return axios.post( `${ BASE_URL }/login`, data );
};

export const addUser = data => {
    return axios.post( `${ BASE_URL }/users`, data );
};
