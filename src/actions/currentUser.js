import api from '../api';

export const FETCH_CURRENT_USER_START = 'FETCH_CURRENT_USER_START';
export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';
export const FETCH_CURRENT_USER_FAILURE = 'FETCH_CURRENT_USER_FAILURE';
export const FETCH_CURRENT_USER_END = 'FETCH_CURRENT_USER_END';

export const fetchCurrentUser = () => (
  async (dispatch) => {
    dispatch({
      type: FETCH_CURRENT_USER_START,
    });

    try {
      const user = await api.getCurrentUser();

      dispatch({
        type: FETCH_CURRENT_USER_SUCCESS,
        data: user,
      });
    } catch (error) {
      dispatch({
        type: FETCH_CURRENT_USER_FAILURE,
        errorMessage: error.message,
      });
    }

    dispatch({
      type: FETCH_CURRENT_USER_END,
    });
  }
);

export const UPDATE_CURRENT_USER_START = 'UPDATE_CURRENT_USER_START';
export const UPDATE_CURRENT_USER_SUCCESS = 'UPDATE_CURRENT_USER_SUCCESS';
export const UPDATE_CURRENT_USER_FAILURE = 'UPDATE_CURRENT_USER_FAILURE';
export const UPDATE_CURRENT_USER_END = 'UPDATE_CURRENT_USER_END';

export const updateCurrentUser = values => (
  async (dispatch, getState) => {
    dispatch({
      type: UPDATE_CURRENT_USER_START,
    });

    try {
      const { currentUser } = getState();
      const updatedUser = await api.updateUser({ _id: currentUser.data._id, ...values });

      dispatch({
        type: UPDATE_CURRENT_USER_SUCCESS,
        data: updatedUser,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_CURRENT_USER_FAILURE,
        errorMessage: error.message,
      });
    }

    dispatch({
      type: UPDATE_CURRENT_USER_END,
    });
  }
);
