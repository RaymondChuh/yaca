
const users = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_USERS':
      console.log(action,state);
    default:
      return state;
  }
}

export default users
