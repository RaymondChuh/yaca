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
          dispatch(createOrUpdateUserInfo(user));
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

const createOrUpdateUserInfo = (user) => {
  return function(dispatch) {
    dispatch(createOrUpdateUserInfoStart());
    appBackend.database().ref('users').once('value').then((snapshot) => {
      let updatedUserInfo = {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName
      };
      if (!snapshot.val()) {
        appBackend.database().ref('users').push(updatedUserInfo);
      } else {
        appBackend.database().ref('users').set(updatedUserInfo);
      }
      dispatch(loadChatRoom('r0'));
    })
  }
}
const createOrUpdateUserInfoStart = createAction('CREATE_OR_UPDATE_USER_INFO_START');
const createOrUpdateUserInfoSuccess = createAction('CREATE_OR_UPDATE_USER_INFO_SUCCESS');

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
        let p = new Promise(function(resolve, reject){
          appBackend.database().ref('messages/'+roomId).on('value', (snapshot) => {
              let messages = snapshot.val();
              dispatch(loadRecentMessageSuccess(messages));
              resolve(messages);
          });
        });
        return p;
    }
}
const loadRecentMessageSuccess = createAction('LOAD_RECENT_MESSAGE_SUCCESS');

const loadChatRoom = (roomId) => {
  return dispatch => {
    let p = new Promise(function(resolve, reject){
      appBackend.database().ref('rooms/'+roomId)
          .on('value', (snapshot) => {
            dispatch(loadChatRoomSuccess(snapshot.val()));
            resolve(snapshot.val());
          });
    })
    return p;
  }
}
const loadChatRoomSuccess = createAction('LOAD_CHAT_ROOM_SUCCESS');
const loadChatRoomAndMessageSuccess = createAction('LOAD_CHAT_ROOM_AND_MESSAGE_SUCCESS');

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
  loadRecentMessageSuccess,
  loadChatRoom,
  chkUserLoginState,
  loginViaGoogle,
  linkOtherAccount,
  logout
}
