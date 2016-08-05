import {createAction} from 'redux-actions';
import firebase from '../services/Firebase'


const receiveUsers = createAction('RECEIVE_USERS');

const login = (accInfo) => {
  return function(dispatch){
    dispatch(loginStart());
    firebase.auth().signInWithEmailAndPassword(accInfo.email, accInfo.password)
      .then(function(user){
        console.log('success login', user);
        dispatch(loginSuccess(user));
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
    let msg = firebase.database().ref('/messages/'+roomId).push({message, timestamp:Date.now()});
    console.log('message id', msg.key);
  }
};
const sendMessageSuccess = createAction('SEND_MESSAGE_SUCCESS');

const loadUsers = () => {
  return function(dispatch) {
    let users = firebase.database().ref('/users');
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




export {loadUsers, login, sendMessage}
