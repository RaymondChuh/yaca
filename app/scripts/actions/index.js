import {createAction} from 'redux-actions';
import appBackend from '../services/AppBackend'
import {push} from 'react-router-redux';
import googleAuthProvider from '../auth/GoogleAuthProvider';

const firebase = require('firebase');


const chkUserLoginState = () => {
  return function(dispatch) {
    dispatch(chkUserLoginStateStart());
    appBackend.auth().onAuthStateChanged(function(user) {
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


const logout = () => {
  return function(dispatch) {
    firebase.auth().signOut()
      .then(function(data) {
        dispatch(logoutSuccess());
        dispatch(push('/login'));
        console.log(data);
      }).catch(function(error) {
        dispatch(logoutFail());
        console.log(error);
      })
  }
};
const logoutSuccess = createAction('LOGOUT_SUCCESS');
const logoutFail = createAction('LOGOUT_FAIL');

/*** Google Auth ***/
const loginViaGoogle = () => {
  return function(dispatch) {
    dispatch(loginStart());
    firebase.auth().signInWithPopup(googleAuthProvider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      dispatch(loginSuccess(user));
      dispatch(push('/dialog'));
      console.log(user);
    }).catch(function(error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;
      dispatch(loginFail(error));
      console.log(error);
    });
  }
}

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

const sendMessage = (message, roomId, currentUser) => {
  return function(dispatch){
    let topush = {
      message,
      timestamp:firebase.database.ServerValue.TIMESTAMP,
      user: {
        uid: currentUser.uid
      }
    }
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


/*** Link other account together ***/
const linkOtherAccount = (accountType, currentUser) => {
  linkOtherAccountStart();
  console.log(accountType, currentUser);
  return function(dispatch) {

  }
}
const linkOtherAccountStart = createAction('LINK_OTHER_ACCOUNT_START');
const linkOtherAccountSuccess = createAction('LINK_OTHER_ACCOUNT_SUCCESS');

export {
  login,
  sendMessage,
  loadRecentMessage,
  chkUserLoginState,
  loginViaGoogle,
  linkOtherAccount,
  logout
}
