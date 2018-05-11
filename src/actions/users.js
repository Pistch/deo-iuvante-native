import * as TYPES from './types';
import api from '../api';

export const fetchUsers = (ids) => (
  async (dispatch) => {
    dispatch({
      type: TYPES.FETCH_USERS_START,
    });

    try {
      const payload = await api.getUsers({ _id: ids });

      dispatch({
        type: TYPES.FETCH_USERS_SUCCESS,
        payload,
      });
    } catch (error) {
      dispatch({
        type: TYPES.FETCH_USERS_ERROR,
        error,
      });
    } finally {
      dispatch({
        type: TYPES.FETCH_USERS_END,
      });
    }
  }
);

export const changeUserStatus = (statusObj) => (dispatch) => {
  dispatch({
    type: TYPES.USER_STATUS_CHANGE,
    payload: {
      userId: statusObj.userId,
      online: statusObj.status
    }
  });
};

export const fetchUser = id => (
  async (dispatch) => {
    dispatch({
      type: TYPES.FETCH_USERS_START,
    });

    try {
      const payload = await api.getUser(id);

      dispatch({
        type: TYPES.FETCH_USER_SUCCESS,
        payload,
      });
    } catch (error) {
      dispatch({
        type: TYPES.FETCH_USERS_ERROR,
        error,
      });
    } finally {
      dispatch({
        type: TYPES.FETCH_USERS_END,
      });
    }
  }
);
