const messages = (state=[], action) => {
    switch (action.type) {
      case 'LOAD_RECENT_MESSAGE_SUCCESS':
          let msgs = [];
          action.payload.forEach((childSnapshot) => {
            msgs.push(Object.assign({}, {id:childSnapshot.key}, childSnapshot.val()));
          })
          return msgs;
      default:
          return state;
    }
}


export default messages;
