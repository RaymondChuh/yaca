import React from 'react'
import ReactDom from 'react-dom'

import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

// Reducers
import users from './reducers/users'
import login from './reducers/login'
import rooms from './reducers/rooms'

// Containers
import UserContainer from './containers/UserContainer.jsx'
import UserTable from './components/UserTable.jsx'
import EmailLoginForm from './components/EmailLoginForm.jsx'
import MessageBox from './components/MessageBox.jsx'

// Actions
import {loadUsers} from './actions'


const loggerMiddleware = createLogger();
var store = createStore(
  combineReducers({
    users,
    login,
    rooms
  }, {}),
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);
// store.dispatch({type:'init'});
// store.dispatch(loadUsers());
ReactDom.render(
  <Provider store={store}>
      <div>
        <EmailLoginForm></EmailLoginForm>
        <MessageBox></MessageBox>
      </div>
  </Provider>,
  document.getElementById('app')
);
