import React from 'react'
import {connect} from 'react-redux'
import {sendMessage} from '../actions'

let messageArea;
const MessageBox = ({dispatch, selectedRoom}) => (
  <form className="pure-form">
    <textarea className="pure-input-1-2" placeholder="Messages" ref={(e) => {messageArea=e}}></textarea>
    <button type="submit" className="pure-button"
      onClick={(e) => {e.preventDefault(); dispatch(sendMessage(messageArea.value, selectedRoom))}}>Search</button>
  </form>
)

const mapStateToProps = state => ({selectedRoom:state.rooms.selectedRoom})

export default connect(mapStateToProps)(MessageBox)
