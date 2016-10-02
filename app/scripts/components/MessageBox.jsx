import React from 'react';
import {connect} from 'react-redux';
import {sendMessage} from '../actions';

let messageArea;
const MessageBox = ({dispatch, selectedRoom, currentUser}) => (
  <form className="pure-form">
    <textarea className="pure-input pure-u-1" placeholder="Messages" ref={(e) => {messageArea=e;}}></textarea>
    <button type="submit" className="pure-button pure-u-1"
      onClick={(e) => {
        e.preventDefault();
        dispatch(sendMessage(messageArea.value, selectedRoom, currentUser));
      }}>Send</button>
  </form>
);

const mapStateToProps = state => ({selectedRoom:state.rooms.selectedRoom, currentUser: state.currentUser});

export default connect(mapStateToProps)(MessageBox);
