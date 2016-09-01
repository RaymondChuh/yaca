const messages = (state=[], action) => {
    switch (action.type) {
      case 'LOAD_RECENT_MESSAGE_SUCCESS':
          let msgs = [];
          Object.keys(action.payload).forEach(msgId => {
            msgs.push(Object.assign({}, {id:msgId}, action.payload[msgId]));
          })
          return msgs;
      default:
          return state;
    }
}


export default messages;
