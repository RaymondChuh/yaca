import React from 'react';
import ReactDom from 'react-dom';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

// Reducers
import {currentUser} from './reducers/user';
import login from './reducers/login';
import rooms from './reducers/rooms';
import messages from './reducers/messages';

// Containers & components
import UserContainer from './containers/UserContainer.jsx';
import UserTable from './components/UserTable.jsx';
// import EmailLoginForm from './components/EmailLoginForm.jsx'
import App from './app.jsx';
import AuthView from './components/AuthView.jsx';
import DialogView from './components/DialogView.jsx';
import BlockLoading from './components/BlockLoading.jsx';
import AuthProviderList from './components/AuthProviderList.jsx';
import GoogleAuthForm from './components/GoogleAuthForm.jsx';



// Router
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {syncHistoryWithStore, routerReducer, routerMiddleware} from 'react-router-redux';



const loggerMiddleware = createLogger();

const middleware = routerMiddleware(hashHistory);

var store = createStore(
  combineReducers({
    currentUser,
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
        <Route component={AuthView}>
            <Route path='login' component={GoogleAuthForm}></Route>
            <Route path='auth-connect' component={AuthProviderList}></Route>
        </Route>
        <Route path='dialog' component={DialogView}></Route>
        <Route path='auth-connect' component={AuthProviderList}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
