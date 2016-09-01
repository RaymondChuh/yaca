import React from 'react'
import {loadRecentMessage, loadChatRoom, loadChatRoomAndMessageSuccess} from '../actions'
import {connect} from 'react-redux'
import MessageBox from './MessageBox.jsx'
import MessageView from './MessageView.jsx'

const mapStateToProps = state => ({
  selectedRoom: state.rooms.selectedRoom,
  messages: state.messages
})

let messageScrollView;

const scrollToBottom = ele => {
  messageScrollView = ele;
  ele.scrollTop = ele.scrollHeight;
}

class DialogView extends React.Component {
  componentDidMount() {
    let pendingActions = [];
    console.log('dialog view did mount');
    pendingActions.push(this.props.dispatch(loadRecentMessage(this.props.selectedRoom)));
    pendingActions.push(this.props.dispatch(loadChatRoom(this.props.selectedRoom)));
    console.log(pendingActions);
    Promise.all(pendingActions).then(function(results){
      this.props.dispatch(loadChatRoomAndMessageSuccess(results));
      console.log(results);
    })
  }

  componentDidUpdate() {
      scrollToBottom(messageScrollView);
  }

  render() {
    return <div className="yaca-dialog-view">
      <div id="msgView" className="pure-g yaca-message-view"
        ref={ele => messageScrollView = ele}>
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
