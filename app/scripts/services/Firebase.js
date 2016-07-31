let firebase = require('firebase');

const config = {
  apiKey: 'AIzaSyB7OMUSPAuaL8ge5-nB3zmiKIN8uobwrHY',
  authDomain: 'resplendent-torch-1132.firebaseapp.com',
  databaseURL: 'https://resplendent-torch-1132.firebaseio.com',
  storageBucket: 'resplendent-torch-1132.appspot.com',
};

const mainApp = firebase.initializeApp(config);

export default mainApp;
