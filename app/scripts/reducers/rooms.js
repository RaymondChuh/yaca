const rooms = (state={selectedRoom:'r0'}, action) => {
  switch (action.type) {
    case 'LOAD_CHAT_ROOM_SUCCESS':
      return Object.assign({}, state, {
        [action.payload.id]: action.payload
      });
    default:
      return state;
  }
};

export default rooms;
