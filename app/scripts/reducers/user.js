
const currentUser = (state = {}, action) => {
  switch (action.type) {
    case 'CHECK_USER_LOGIN_STATE_SUCCESS':
      return action.payload;
    default:
      return state;
  }
};

export {currentUser};
