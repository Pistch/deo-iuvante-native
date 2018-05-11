import { AsyncStorage } from 'react-native';
import { INIT_STORE } from '../actions/types';

export const saveState  = function saveState({ getState }) {
  return next => action => {
    const state = getState();
    if (!state.worker.ready) return next(action);
    for (let key in state) {
      AsyncStorage.setItem(key, JSON.stringify(state[key]));
    }
    next(action);
  }
};

export const initializeStore = async function (dispatch, clear) {
  if (clear) await AsyncStorage.clear();

  const parts = await AsyncStorage.getAllKeys(),
    partsValues = await Promise.all(parts.map(name => AsyncStorage.getItem(name))),
    resultingStore = {};

  parts.forEach((item, i) => resultingStore[item] = JSON.parse(partsValues[i]));

  dispatch({
    type: INIT_STORE,
    payload: resultingStore
  });
};
