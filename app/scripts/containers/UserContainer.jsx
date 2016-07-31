import React from 'react'
import {connect} from 'react-redux'


class UserContainer extends React.Component {
  render() {
    console.log(this);
    return <div/>;
  }
}

export default connect((state)=>state)(UserContainer) 
