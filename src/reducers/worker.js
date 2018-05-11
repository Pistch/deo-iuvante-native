import * as TYPES from '../actions/types';

import api from '../api';

const INITIAL_STATE = {
  ready: false,
  networkState: api.ready,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.INIT_STORE:
      return {
        ...state,
        ready: true
      };
    case TYPES.NETWORK_WENT_DOWN:
      return ({
        ...state,
        networkState: false
      });
    case TYPES.NETWORK_WENT_UP:
      return ({
        ...state,
        networkState: true
      });
    default: return state;
  }
}
