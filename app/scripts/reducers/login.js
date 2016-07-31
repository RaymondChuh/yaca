
const login = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log(state, action);
      return state;
      break;
    case 'INPUT_EMAIL':
      return {email: action.payload, password: state.password};
      break;
    case 'INPUT_PASSWORD':
        return {email: state.email, password: action.payload};
        break;
    default:
      return state;
  }
}

export default login;
