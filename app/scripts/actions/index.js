import {createAction} from 'redux-actions';
import appBackend from '../services/AppBackend'
import {push} from 'react-router-redux';
import googleAuthProvider from '../auth/GoogleAuthProvider';

const firebase = require('firebase');


const chkUserLoginState = () => {
  return function(dispatch) {
    dispatch(chkUserLoginStateStart());
    appBackend.auth().onAuthStateChanged(function(loginAcc) {
        if (loginAcc) {
          // check if login account has linked to a chat app user
          appBackend.database().ref('users')
            .orderByChild('uid')
            .equalTo(loginAcc.uid)
            .once('value').then((snapshot) => {
              let user = {
                    uid: loginAcc.uid,
                    photoURL: loginAcc.photoURL,
                    displayName: loginAcc.displayName
                  },
                  chatRoomUser = snapshot.val(),
                  newUserId, userId;
              // No chat app user exists, create new
              if (!chatRoomUser) {
                newUserId = appBackend.database().ref('users').push().key;
                user.id = newUserId;
                dispatch(createNewUser(user));
              } else {
              // Found existing chat app user, update it.
                userId = Object.keys(chatRoomUser)[0];
                user.id = userId;
                dispatch(updateExistingUser(user, userId));
              }
              dispatch(chkUserLoginStateSuccess(user));
            })
          dispatch(push('/dialog'));
        } else {
          dispatch(push('/login'));
        }

    });
  }
}
const chkUserLoginStateStart = createAction('CHECK_USER_LOGIN_STATE_START');
const chkUserLoginStateSuccess = createAction('CHECK_USER_LOGIN_STATE_SUCCESS');

const createNewUser = (user) => {
  return function(dispatch) {
      dispatch(createNewUserStart());
      appBackend.database().ref('users').push(user);
  }
}
const createNewUserStart = createAction('CREATE_USER_START');

const updateExistingUser = (user, chatRoomUserId) => {
  return function(dispatch) {
      let updates = {},
          baseUpdatePath = 'users/' + chatRoomUserId;
      dispatch(updateExistingUserStart());
      updates = Object.keys(user).reduce((updatePaths, key) => {
        updatePaths[baseUpdatePath + '/' + key] = user[key];
        return updatePaths;
      }, updates);
      appBackend.database().ref().update(updates);
  }
}
const updateExistingUserStart = createAction('UPDATE_USER_START');

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
      cuid: currentUser.id
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
  loadChatRoomAndMessageSuccess,
  loadChatRoom,
  chkUserLoginState,
  loginViaGoogle,
  linkOtherAccount,
  logout
}
