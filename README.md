# Cryptovox

This is a secure file sharing [website](https://cryptovox.netlify.com/) that allows you to encrypt files using audio. The backend API to this website is available [here](https://ssc-be.herokuapp.com/api) for which the git can be found [here](https://github.com/theshumanator/nc-be-finalproject). 


## Getting Started

### Prerequisites

It is assumed that VS code (or another appropriate alternative) runs on your machine. 

You also need node (at least v11.0.0) and npm (at least version 6.4.1) installed on your machine.

### Installing

#### Get the code

Fork the project from git. Then copy the git url and in the appropriate folder on your machine:

```
git clone <url from git>
```
This will create the project on your local machine. Open the project in VS code (or alternative app).

#### Install dependencies

Run the following to install body-parser, chai, express, nodemon, knex, mocha, pg & supertest. 

```
npm install 
```

Once all required dependencies are installed, you can check the node_modules folder (which should be created now) to see if the folders for each of these libraries exists.

## Running the app

To run the app:
```
npm start
```

## Tech used

### Front end

#### Frameworks
The front-end was developed using React with some components taken from React Bootstrap.

#### Testing
Testing was done with Cypress. Given the limited time, not all of the test cases were incorporated.

### Back end
The backend was written entirely in Python. The database holding the workspace, user and files info is Postgres and Flask was used to build the server. Tavern was used for testing.

### Sprint management
A Trello board was used to track the todo list with 2 daily standups.

## Team

* **Lizzie** - [Coddzilla](https://github.com/Coddzilla)
* **Ollie** - [oliverwood93](https://github.com/oliverwood93)
* **Shumanator** - [theshumanator](https://github.com/theshumanator)
* **Will** - [WillemTaylor](https://github.com/WillemTaylor)
* **Yuvraj** - [yuvi1401](https://github.com/yuvi1401)


