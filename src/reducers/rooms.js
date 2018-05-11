import * as TYPES from '../actions/types';

const rooms = (
  state = {
    byId: {},
    allIds: [],
    loading: false,
  },
  action,
) => {
  switch (action.type) {
    case TYPES.INIT_STORE:
      if (!action.payload.rooms) return state;
      return({
        ...state,
        byId: action.payload.rooms.byId,
        allIds: action.payload.rooms.allIds,
      });
    case TYPES.FETCH_ROOM_START:
      return { ...state, loading: true };
    case TYPES.FETCH_ROOM_ERROR:
      return { ...state, loading: false };
    case TYPES.FETCH_ROOMS_SUCCESS: {
      const byId = {},
        allIds = [];
      action.payload.forEach((room) => {
        allIds.push(room._id);
        byId[room._id] = {
          ...room,
          unread: (state.byId && state.byId[room._id] && state.byId[room._id].unread) ?
            state.byId[room._id].unread : 0
        };
      });

      return ({
        ...state,
        allIds,
        loading: false,
        byId: { ...state.byId, ...byId },
      });
    }
    case TYPES.FETCH_ROOM_SUCCESS: {
      return ({
        ...state,
        loading: false,
        allIds: [...state.allIds, action.payload._id],
        byId: {
          ...state.byId,
          [action.payload._id]: action.payload
        },
      });
    }
    case TYPES.ROOM_UNREAD_MESSAGES_SET:
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload.roomId]: {
            ...state.byId[action.payload.roomId],
            unread: (typeof state.byId[action.payload.roomId].unread === 'number') ?
              (action.payload.count + state.byId[action.payload.roomId].unread) :
              action.payload.count,
          }
        }
      });
    case TYPES.ROOM_UNREAD_MESSAGES_DROP:
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload.roomId]: {
            ...state.byId[action.payload.roomId],
            unread: 0
          }
        }
      });
    case TYPES.ROOM_UNREAD_MESSAGES_INCREMENT:
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload.roomId]: {
            ...state.byId[action.payload.roomId],
            unread: state.byId[action.payload.roomId].unread ?
              state.byId[action.payload.roomId].unread + 1 : 1,
          }
        }
      });
    default: return state;
  }
};

export default rooms;
