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
import messages from './reducers/messages'

// Containers & components
import UserContainer from './containers/UserContainer.jsx'
import UserTable from './components/UserTable.jsx'
import EmailLoginForm from './components/EmailLoginForm.jsx'
import App from './app.jsx'
import LoginView from './components/LoginView.jsx'
import DialogView from './components/DialogView.jsx'
import BlockLoading from './components/BlockLoading.jsx'


// Router
import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import {syncHistoryWithStore, routerReducer, routerMiddleware} from 'react-router-redux'

// Actions
import {loadUsers} from './actions'


const loggerMiddleware = createLogger();

const middleware = routerMiddleware(hashHistory);

var store = createStore(
  combineReducers({
    users,
    login,
    rooms,
    routing: routerReducer,
    messages
  }),
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
    middleware
  )
);
const history = syncHistoryWithStore(hashHistory, store)

ReactDom.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={BlockLoading}></IndexRoute>
        <Route path='login' component={LoginView}>
            <Route component={EmailLoginForm}></Route>
        </Route>
        <Route path='dialog' component={DialogView}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
