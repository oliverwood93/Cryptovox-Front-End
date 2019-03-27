/* eslint-disable complexity */
import React, { Component } from 'react';
import { Link } from '@reach/router';
import { makeAPICalls } from '../utils/apiCalls';
import { Alert } from 'react-bootstrap';

function validate( username, password ) {
    return {
        username: username.length === 0,
        password: password.length === 0
    };
}

export default class Home extends Component {
    state = {
        showRegistration: false,
        userSignedIn: false,
        username: '',
        password: '',
        registerUsername: '',
        registerPassword: '',
        users: [],
        signInError: '',
        newUserError: ''
    };

    render() {
        const errors = validate( this.state.username, this.state.password );
        const isDisabled = Object.keys( errors ).some( x => errors[ x ] );
        const errors1 = validate(
            this.state.registerUsername,
            this.state.registerPassword
        );
        const isDisabled1 = Object.keys( errors1 ).some( x => errors1[ x ] );
        return (
            <div className="font">
                {!this.state.userSignedIn && (
                    <form onSubmit={this.handleSubmit} className="container1">
                        <input
                            type="text"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            required
                        />
                        <button disabled={isDisabled}>Login</button>
                        <p className="register">
                            Haven't got an account? Register{' '}
                            <Link to={'/'} onClick={this.handleRegister}>
                                {' '}
                                here.
                            </Link>
                        </p>
                    </form>
                )}
                {this.state.signInError !== '' && (
                    <Alert className="alert1" variant="danger">
                        {this.state.signInError}
                    </Alert>
                )}
                {this.state.showRegistration && !this.state.userSignedIn && (
                    <form
                        onSubmit={this.handleSubmit1}
                        className="modal-content animate"
                    >
                        <input
                            type="text"
                            placeholder="Username"
                            value={this.state.registerUsername}
                            onChange={this.handleUsernameRChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={this.state.registerPassword}
                            onChange={this.handlePasswordRChange}
                            required
                        />
                        <button className="homeButtons" disabled={isDisabled1}>Register</button>
                    </form>
                )}
                {this.state.newUserError !== '' && (
                    <Alert className="alert2" variant="danger">
                        {this.state.newUserError}
                    </Alert>
                )}
            </div>
        );
    }

    handleUsernameChange = event => {
        this.setState( { username: event.target.value, signInError: '' } );
    };

    handlePasswordChange = event => {
        this.setState( { password: event.target.value, signInError: '' } );
    };

    handleUsernameRChange = event => {
        this.setState( {
            registerUsername: event.target.value,
            newUserError: ''
        } );
    };

    handlePasswordRChange = event => {
        this.setState( {
            registerPassword: event.target.value,
            newUserError: ''
        } );
    };

    handleRegister = () => {
        this.setState( { showRegistration: true } );
    };

    handleSubmit = event => {
        const { username } = this.state;

        if ( !this.canBeSubmitted() ) {
            event.preventDefault();
            return;
        } else {
            event.preventDefault();

            const apiObj = {
                url: '/login',
                reqObjectKey: 'user_exists',
                method: 'post',
                data: {
                    username: this.state.username,
                    password: this.state.password
                }
            };
            makeAPICalls( apiObj )
                .then( userExists => {
                    if ( userExists ) {
                        localStorage.setItem( 'userLoggedIn', username );
                        this.setState( { userSignedIn: true }, () => {
                            this.props.handleLogin( );
                        } );
                    } else {
                        this.setState( {
                            signInError: 'Invalid username and/or password'
                        } );
                    }
                } )
                .catch( err => {
                    this.setState( {
                        signInError: 'Invalid username and/or password'
                    } );
                } );
        }
    };

    canBeSubmitted() {
        const errors = validate( this.state.username, this.state.password );
        const isDisabled = Object.keys( errors ).some( x => errors[ x ] );
        return !isDisabled;
    }

    handleSubmit1 = event => {
        const { registerUsername } = this.state;

        if ( !this.canBeSubmitted1() ) {
            event.preventDefault();
            return;
        } else {
            event.preventDefault();
            const apiObj = {
                url: '/users',
                reqObjectKey: 'user_added',
                method: 'post',
                data: {
                    username: this.state.registerUsername,
                    password: this.state.registerPassword
                }
            };
            makeAPICalls( apiObj )
                .then( userAdded => {
                    if ( userAdded ) {
                        localStorage.setItem( 'userLoggedIn', registerUsername );
                        this.setState( { userSignedIn: true }, () => {
                            this.props.handleLogin( ); 
                        } );
                    } else {
                        this.setState( {
                            newUserError:
                                'Username already exists, please sign in'
                        } );
                    }
                } )
                .catch( err => {
                    this.setState( {
                        newUserError: 'Username already exists, please sign in'
                    } );
                } );
        }
    };

    canBeSubmitted1() {
        const errors1 = validate(
            this.state.registerUsername,
            this.state.registerPassword
        );
        const isDisabled1 = Object.keys( errors1 ).some( x => errors1[ x ] );
        return !isDisabled1;
    }
}
