import React from 'react';
import {linkOtherAccount} from '../actions';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  };
};


class AuthProviderList extends React.Component{
    constructor() {
        super();
        this.state = {
          selectedAuthProvider: ''
        };
    }

    handleOptionChange(e) {
      this.setState({selectedAuthProvider: e.target.value});
    }

    render() {
      let {currentUser, dispatch} = this.props;
      return (
        <form className="pure-form">
          <p>Choose any of below authentication approach to link your other login to current user.</p>
          <label htmlFor="option-one" className="pure-checkbox">
              <input id="option-one" type="radio" name="optionsRadios" value="facebook" onChange={this.handleOptionChange.bind(this)}/>
              &nbsp;Facebook
          </label>
          <label htmlFor="option-two" className="pure-radio">
              <input id="option-two" type="radio" name="optionsRadios" value="google" onChange={this.handleOptionChange.bind(this)}/>
              &nbsp;Google
          </label>
          <div className="pure-controls">
            <button type="button" className="pure-button pure-button-primary"
              onClick={(e) => {dispatch(linkOtherAccount(e.target.value, currentUser));} }>
              Next
            </button>
          </div>
        </form>
      );
    }
}



export default connect(mapStateToProps)(AuthProviderList);
