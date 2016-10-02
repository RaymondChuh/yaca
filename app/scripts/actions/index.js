import {createAction} from 'redux-actions';
import appBackend from '../services/AppBackend';
import {push} from 'react-router-redux';
import googleAuthProvider from '../auth/GoogleAuthProvider';

const firebase = require('firebase');

const createNewUserStart = createAction('CREATE_USER_START');
const createNewUser = (user) => {
  return function(dispatch) {
      dispatch(createNewUserStart());
      appBackend.database().ref('users').push(user);
  };
};

const updateExistingUserStart = createAction('UPDATE_USER_START');
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
  };
};

const chkUserLoginStateStart = createAction('CHECK_USER_LOGIN_STATE_START');
const chkUserLoginStateSuccess = createAction('CHECK_USER_LOGIN_STATE_SUCCESS');
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
            });
          dispatch(push('/dialog'));
        } else {
          dispatch(push('/login'));
        }

    });
  };
};

const logoutSuccess = createAction('LOGOUT_SUCCESS');
const logoutFail = createAction('LOGOUT_FAIL');
const logout = () => {
  return function(dispatch) {
    firebase.auth().signOut()
      .then(function() {
        dispatch(logoutSuccess());
        dispatch(push('/login'));
      }).catch(function() {
        dispatch(logoutFail());
      });
  };
};

/*** Login ***/
const loginStart = createAction('LOGIN_START');
const loginSuccess = createAction('LOGIN_SUCCESS');
const loginFail = createAction('LOGIN_FAIL');
const login = (accInfo) => {
  return function(dispatch){
    dispatch(loginStart());
    appBackend.auth().signInWithEmailAndPassword(accInfo.email, accInfo.password)
      .then(function(user){
        dispatch(loginSuccess(user));
        dispatch(push('/dialog'));
      })
      .catch(function(error) {
        // let errorCode = error.code;
        // let errorMessage = error.message;
        dispatch(loginFail(error));
      });
  };
};

/*** Google Auth ***/
const loginViaGoogle = () => {
  return function(dispatch) {
    dispatch(loginStart());
    firebase.auth().signInWithPopup(googleAuthProvider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      dispatch(loginSuccess(user));
      dispatch(push('/dialog'));
    }).catch(function(error) {
      // Handle Errors here.
      // let errorCode = error.code;
      // let errorMessage = error.message;
      // The email of the user's account used.
      // let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      // let credential = error.credential;
      dispatch(loginFail(error));
    });
  };
};




const sendMessage = (message, roomId, currentUser) => {
  return function(){
    let topush = {
      message,
      timestamp:firebase.database.ServerValue.TIMESTAMP,
      cuid: currentUser.id
    };
    appBackend.database().ref('/messages/'+roomId).push(topush, (data, error) => {
      console.log('push done', data, error);
    });
  };
};




/*** Message ***/
const loadRecentMessageSuccess = createAction('LOAD_RECENT_MESSAGE_SUCCESS');
const loadRecentMessage = (roomId) => {
    return (dispatch) => {
        let p = new Promise(function(resolve){
          appBackend.database().ref('messages/'+roomId).on('value', (snapshot) => {
              let messages = snapshot.val();
              dispatch(loadRecentMessageSuccess(messages));
              resolve(messages);
          });
        });
        return p;
    };
};

const loadChatRoomSuccess = createAction('LOAD_CHAT_ROOM_SUCCESS');
const loadChatRoomAndMessageSuccess = createAction('LOAD_CHAT_ROOM_AND_MESSAGE_SUCCESS');
const loadChatRoom = (roomId) => {
  return dispatch => {
    let p = new Promise(function(resolve){
      appBackend.database().ref('rooms/'+roomId)
          .on('value', (snapshot) => {
            dispatch(loadChatRoomSuccess(snapshot.val()));
            resolve(snapshot.val());
          });
    });
    return p;
  };
};


/*** Link other account together ***/
const linkOtherAccountStart = createAction('LINK_OTHER_ACCOUNT_START');
const linkOtherAccount = (accountType, currentUser) => {
  linkOtherAccountStart();
  console.log(accountType, currentUser);
  return function() {

  };
};

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
};
