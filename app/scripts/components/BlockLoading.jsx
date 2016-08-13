import React from 'react';
import {chkUserLoginState} from '../actions';
import {connect} from 'react-redux';

class BlockLoading extends React.Component {
    componentDidMount() {
      console.log('block loading did mount');
      this.props.dispatch(chkUserLoginState());
    }
    render() {
      return <div className="pure-g yaca-vcenter">
        <div className="pure-u-1-3"></div>
        <div className="pure-u-1-3">
          Loading...
        </div>
        <div className="pure-u-1-3"></div>
      </div>

    }
}

export default connect()(BlockLoading);
