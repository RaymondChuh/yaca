
const users = (state = {currentUser:null}, action) => {
  switch (action.type) {
    case 'RECEIVE_USERS':
      console.log(action,state);
    case 'CHECK_USER_LOGIN_STATE_SUCCESS':
      return {currentUser: action.payload};
    default:
      return state;
  }
}

export default users
