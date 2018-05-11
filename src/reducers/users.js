import * as TYPES from '../actions/types';

export default (
  state = {
    byId: {},
    fetching: false,
    errorMsg: null,
  },
  action,
) => {
  switch (action.type) {
    case TYPES.INIT_STORE:
      return ({
        ...state,
        byId: action.payload.users ? action.payload.users.byId : {},
      });
    case TYPES.FETCH_USERS_START: {
      return ({
        ...state,
        fetching: true,
      });
    }
    case TYPES.FETCH_USERS_END: {
      return ({
        ...state,
        fetching: false,
      });
    }
    case TYPES.FETCH_USERS_ERROR: {
      return ({
        ...state,
        errorMsg: action.error,
      });
    }
    case TYPES.FETCH_USER_SUCCESS: {
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: action.payload,
        },
      });
    }
    case TYPES.FETCH_USERS_SUCCESS: {
      return ({
        ...state,
        byId: action.payload.reduce((accum, user) => ({
          ...accum,
          [user._id]: user,
        }), { ...state.byId }),
      });
    }
    case TYPES.USER_STATUS_CHANGE:
      if (!state.byId[action.payload.userId]) return state;
      return ({
        ...state,
        byId: {
          ...state.byId,
          [action.payload.userId]: {
            ...state.byId[action.payload.userId],
            online: action.payload.online
          }
        }
      });
    default: return state;
  }
};

