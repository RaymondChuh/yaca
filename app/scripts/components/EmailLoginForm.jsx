import React from 'react'
import {login} from '../actions'
import {connect} from 'react-redux'


const EmailLoginForm = ({dispatch, onSubmit}) => {
  let emailInput, passwordInput;
  return   <form className="pure-form">
          <input type="email" placeholder="Email" ref={(e) => emailInput = e}/>
          <input type="password" placeholder="Password" ref={(e) => passwordInput = e}/>

          <label htmlFor="remember">
              <input id="remember" type="checkbox"/> Remember me
          </label>

          <button type="submit" className="pure-button pure-button-primary"
            onClick={(e) => {e.preventDefault(); dispatch(login({email:emailInput.value, password:passwordInput.value}));} }>
            Sign in
          </button>
   </form>

}


export default connect()(EmailLoginForm)
