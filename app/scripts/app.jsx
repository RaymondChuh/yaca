import React from 'react';
import {connect} from 'react-redux';
import {logout} from './actions';
import {Link} from 'react-router';



const App = ({children, dispatch}) => {

  return (
  <div>
    <div className="pure-g yaca-app-header">
      <div className="pure-u-2-24"></div>
      <div className="pure-u-20-24"></div>
      <div className="pure-u-2-24">
        {/*
        <Link to={"/auth-connect"} className="pure-button pure-button-primary">Link Other Account</Link>
        */}
        <a href="" onClick={() => {dispatch(logout())}}>Logout</a>
      </div>
    </div>
    <div className="yaca-app-body">{children}</div>
  </div>
  )
}

export default connect()(App);
