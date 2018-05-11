import * as TYPES from './types';

export const networkFail = () => dispatch => dispatch({
  type: TYPES.NETWORK_WENT_DOWN
});

export const networkRestore = () => dispatch => {
  dispatch({
    type: TYPES.NETWORK_WENT_UP
  });
};

