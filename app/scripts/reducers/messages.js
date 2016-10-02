const messages = (state=[], action) => {
    switch (action.type) {
      // case 'LOAD_RECENT_MESSAGE_SUCCESS':
      //     let msgs = [];
      //     Object.keys(action.payload).forEach(msgId => {
      //       msgs.push(Object.assign({}, {id:msgId}, action.payload[msgId]));
      //     })
      //     return msgs;
      case 'LOAD_CHAT_ROOM_AND_MESSAGE_SUCCESS':
          let room = action.payload.chatRoom,
              displayMsgs;
          // Enrich each message with message sender detail
          displayMsgs = Object.keys(action.payload.recentMessages)
            .map(ffMsgId => {
              let displayMsg,
                  ffMsg = action.payload.recentMessages[ffMsgId];
              displayMsg = Object.assign({}, {id: ffMsgId}, ffMsg);
              // Show message sender as 'Unknown' if sender is not found
              if (room.users[ffMsg.cuid]) {
                displayMsg.user = room.users[ffMsg.cuid];
              } else {
                displayMsg.user = {
                  displayName: 'Unknown'
                };
              }
              return displayMsg;
            });
          return displayMsgs;
      default:
          return state;
    }
};


export default messages;
