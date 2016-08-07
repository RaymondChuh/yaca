import React from 'react'
import {login} from '../actions'
import {connect} from 'react-redux'


const EmailLoginForm = ({dispatch, onSubmit}) => {
  let emailInput, passwordInput;
  return   <form className="pure-form pure-form-aligned">
          <div className="pure-control-group">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" placeholder="Email" ref={(e) => emailInput = e}/>
          </div>
          <div className="pure-control-group">
            <label htmlFor="password">Password:</label>
            <input id="password" type="password" placeholder="Password" ref={(e) => passwordInput = e}/>
          </div>
          <div className="pure-control-group">
            <label htmlFor="remember"></label>
            <input id="remember" type="checkbox"/> Remember me
          </div>
          <div className="pure-controls">
            <button type="submit" className="pure-button pure-button-primary"
              onClick={(e) => {e.preventDefault(); dispatch(login({email:emailInput.value, password:passwordInput.value}));} }>
              Login
            </button>
          </div>
   </form>

}


export default connect()(EmailLoginForm)
