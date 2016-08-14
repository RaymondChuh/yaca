import React from 'react';
import {loginViaGoogle} from '../actions';
import {connect} from 'react-redux';

const GoogleAuthForm = ({dispatch}) => {
    return (
      <div>
        <p>You are not login. </p>
        <button type="button" className="pure-button pure-button-primary"
          onClick={() => {dispatch(loginViaGoogle())}}>
          Login via Google
        </button>
      </div>
    )
}

export default connect()(GoogleAuthForm);
