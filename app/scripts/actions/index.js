import {createAction} from 'redux-actions';
import firebase from '../services/Firebase'


const receiveUsers = createAction('RECEIVE_USERS');

const login = (accInfo) => {
  return function(dispatch){
    dispatch(loginStart());
    firebase.auth().signInWithEmailAndPassword(accInfo.email, accInfo.password)
      .catch(function(error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        dispatch(loginFail());
      });
  }
};
const loginStart = createAction('LOGIN_START');
const loginSuccess = createAction('LOGIN_SUCCESS');
const loginFail = createAction('LOGIN_FAIL');

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




export {loadUsers, login}
