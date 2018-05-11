import * as TYPES from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case TYPES.INIT_STORE:
      return action.payload.messages ? { ...action.payload.messages, toSend: {} } : {};
    case TYPES.ADD_MESSAGE_TO_SEND:
      return {
        ...state,
        toSend: {
          ...(state.toSend || {}),
          [action.payload.roomId]: [
            ...((state.toSend && state.toSend[action.payload.roomId]) || []),
            action.payload.message,
          ]
        }
      };
    case TYPES.ADD_MESSAGE:
      return {
        ...state,
        [action.payload.roomId]: [...(state[action.payload.roomId] || []), action.payload],
        toSend: {
          ...(state.toSend || {}),
          [action.payload.roomId]: state.toSend && state.toSend[action.payload.roomId] ?
            state.toSend[action.payload.roomId].filter(message => message !== action.payload.text) :
            [],
        }
      };
    case TYPES.READ_MESSAGES:
      return {
        ...state,
        [action.payload.roomId]: state[action.payload.roomId] ? state[action.payload.roomId].map(message => {
          if (message.userId !== action.payload.currentUserId) return { ...message, read: true };
          return message;
        }) : []
      };
    case TYPES.READ_MY_MESSAGES:
      return {
        ...state,
        [action.payload.roomId]: state[action.payload.roomId] ?
          state[action.payload.roomId].map(message => {
            if (message.userId === action.payload.currentUserId) return { ...message, read: true };
            return message;
          }) : []
      };
    case TYPES.RENEW_MESSAGE_STATE:
      return {
        ...state,
        [action.payload.roomId]: state[action.payload.roomId].map(message => {
          if (message._id === action.payload.message._id) return {
            ...message,
            read: action.payload.message.read
          };
          return message;
        })
      };
    case TYPES.FETCH_MESSAGES_SUCCESS:
      const fixedMessages = state[action.payload.roomId] ?
        action.payload.messages.filter(item => {
          for (let i = state[action.payload.roomId] - 1; i >=0; i--) {
            if (state[action.payload.roomId][i]._id === item._id) return false;
          }
          return true;
        }) :
        action.payload.messages;
      return {
        ...state,
        [action.payload.roomId]: [...(state[action.payload.roomId] || []), ...fixedMessages],
      };
    default: return state;
  }
};
