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
import App from './app.jsx'
import LoginView from './components/LoginView.jsx'
import DialogView from './components/DialogView.jsx'

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
    routing: routerReducer
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
        <Route component={LoginView}>
            <IndexRoute component={EmailLoginForm}></IndexRoute>
        </Route>
        <Route component={DialogView}>
            <Route path='dialog' component={MessageBox}/>
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
