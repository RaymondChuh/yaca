import React from 'react'
import {loadRecentMessage} from '../actions'
import {connect} from 'react-redux'
import MessageBox from './MessageBox.jsx'
import MessageView from './MessageView.jsx'

const mapStateToProps = state => ({
  selectedRoom: state.rooms.selectedRoom,
  messages: state.messages
})

class DialogView extends React.Component {
  componentDidMount() {
    console.log('dialog view did mount');
    this.props.dispatch(loadRecentMessage(this.props.selectedRoom));
  }
  render() {
    return <div className="yaca-dialog-view">
      <div className="pure-g yaca-message-view">
        <div className="pure-u-2-24"></div>
        <div className="pure-u-20-24">
          <MessageView messages={this.props.messages}></MessageView>
        </div>
        <div className="pure-u-2-24"></div>
      </div>
      <div className="pure-g yaca-message-box">
          <div className="pure-u-2-24"></div>
          <div className="pure-u-20-24">
            <MessageBox></MessageBox>
          </div>
          <div className="pure-u-2-24"></div>
      </div>
    </div>
  }
}


export default connect(mapStateToProps)(DialogView)
