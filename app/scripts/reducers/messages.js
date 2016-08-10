const messages = (state=[], action) => {
    switch (action.type) {
      case 'LOAD_RECENT_MESSAGE_SUCCESS':
          console.log(action.payload);
          let msgs = [];
          action.payload.forEach((childSnapshot) => {
            msgs.push(Object.assign({}, {id:childSnapshot.key}, childSnapshot.val()));
            console.log(childSnapshot.key);
            console.log(childSnapshot.val());
          })
          return msgs;
      default:
          return state;
    }
}


export default messages;
