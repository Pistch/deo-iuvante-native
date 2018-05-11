import * as actionTypes from '../actions/currentUser';
import * as TYPES from '../actions/types';

const INITITAL_STATE = { data: {}, isFetching: false, isUpdating: false };

export default (state = INITITAL_STATE, action) => {
  switch (action.type) {
    case TYPES.INIT_STORE:
      return ({
        ...state,
        data: action.payload.currentUser ? action.payload.currentUser.data : {},
      });
    case actionTypes.FETCH_CURRENT_USER_START:
      return {
        ...state,
        isFetching: true,
      };
    case actionTypes.UPDATE_CURRENT_USER_START:
      return {
        ...state,
        isUpdating: true,
      };
    case actionTypes.FETCH_CURRENT_USER_SUCCESS:
    case actionTypes.UPDATE_CURRENT_USER_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case actionTypes.FETCH_CURRENT_USER_FAILURE:
    case actionTypes.UPDATE_CURRENT_USER_FAILURE:
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    case actionTypes.FETCH_CURRENT_USER_END:
      return {
        ...state,
        isFetching: false,
      };
    case actionTypes.UPDATE_CURRENT_USER_END:
      return {
        ...state,
        isUpdating: false,
      };
    default:
      return state;
  }
};
