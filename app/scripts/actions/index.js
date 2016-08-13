import {createAction} from 'redux-actions';
import appBackend from '../services/AppBackend'
import {push} from 'react-router-redux'

const firebase = require('firebase');
const receiveUsers = createAction('RECEIVE_USERS');

const chkUserLoginState = () => {
  return function(dispatch){
    dispatch(chkUserLoginStateStart());
    appBackend.auth().onAuthStateChanged(function(user){
        if (user) {
          dispatch(push('/dialog'));
        } else {
          dispatch(push('/login'));
        }
        dispatch(chkUserLoginStateSuccess(user));
    });
  }
}
const chkUserLoginStateStart = createAction('CHECK_USER_LOGIN_STATE_START');
const chkUserLoginStateSuccess = createAction('CHECK_USER_LOGIN_STATE_SUCCESS');

/*** Login ***/
const login = (accInfo) => {
  return function(dispatch){
    dispatch(loginStart());
    appBackend.auth().signInWithEmailAndPassword(accInfo.email, accInfo.password)
      .then(function(user){
        console.log('success login', user);
        dispatch(loginSuccess(user));
        dispatch(push('/dialog'));
      })
      .catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        dispatch(loginFail(error));
      });
  }
};
const loginStart = createAction('LOGIN_START');
const loginSuccess = createAction('LOGIN_SUCCESS');
const loginFail = createAction('LOGIN_FAIL');

const sendMessage = (message, roomId) => {
  return function(dispatch){
    let topush = {message, timestamp:firebase.database.ServerValue.TIMESTAMP}
    let msg = appBackend.database().ref('/messages/'+roomId).push(topush, (data, error) => {
      console.log('push done', data, error);
    });
  }
};
const sendMessageSuccess = createAction('SEND_MESSAGE_SUCCESS');



/*** Message ***/
const loadRecentMessage = (roomId) => {
    return (dispatch) => {
        appBackend.database().ref('messages/'+roomId).on('value', (snapshot) => {
            dispatch(loadRecentMessageSuccess(snapshot));
        })
    }
}
const loadRecentMessageSuccess = createAction('LOAD_RECENT_MESSAGE_SUCCESS');

/*** User ***/
const loadUsers = () => {
  return function(dispatch) {
    let users = appBackend.database().ref('/users');
    let p = new Promise((resolve, reject) => {
      users.on('value', function(snapshot){
        console.log(snapshot.val());
        resolve(snapshot.val());
        dispatch(receiveUsers(snapshot.val()));
      }, function(e){
        console.log(e);
      })
    })
    return p;
  }
};




export {loadUsers, login, sendMessage, loadRecentMessage, chkUserLoginState}
