import * as TYPES from './types';
import api from '../api';

import { fetchUsers } from './users';

export const fetchRooms = () => async (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_ROOM_START });

  return api.getRooms()
    .then(rooms => {
      const usersFromStore = getState().users.byId,
        usersToFetch = [];

      rooms.forEach(({ users }) => {
        users.forEach(uId => {
          if (!usersFromStore[uId] && usersToFetch.indexOf(uId) === -1) usersToFetch.push(uId);
        });
      });

      if (usersToFetch[0]) fetchUsers(usersToFetch)(dispatch, getState);

      dispatch({
        type: TYPES.FETCH_ROOMS_SUCCESS,
        payload: rooms
      });
      return rooms.map(room => room._id);
    });
};

export const fetchRoom = roomId => (
  async (dispatch, getState) => {
    dispatch({
      type: TYPES.FETCH_ROOM_START,
    });

    try {
      const payload = await api.getRoom(roomId),
        usersFromStore = getState().users.byId,
        usersToFetch = [];

      payload.users.forEach(uId => {
        if (!usersFromStore[uId] && usersToFetch.indexOf(uId) === -1) usersToFetch.push(uId);
      });

      if (usersToFetch[0]) fetchUsers(usersToFetch)(dispatch, getState);

      dispatch({
        type: TYPES.FETCH_ROOM_SUCCESS,
        payload,
      });
    } catch (e) {
      dispatch({
        type: TYPES.FETCH_ROOM_ERROR,
        payload: e.message,
      });
    } finally {
      dispatch({
        type: TYPES.FETCH_ROOM_END,
      });
    }
  }
);

export const dropUnreadCount = roomId => (
  (dispatch) => {
    dispatch({
      type: TYPES.ROOM_UNREAD_MESSAGES_DROP,
      payload: { roomId }
    });
  }
);

export const incrementUnreadCount = roomId => (
  (dispatch) => {
    dispatch({
      type: TYPES.ROOM_UNREAD_MESSAGES_INCREMENT,
      payload: { roomId }
    });
  }
);

export const markAllUnreadMessages = (roomId, currentUserId) => (
  async (dispatch) => {
    await api.markAllUnreadMessages(roomId)
      .then(d => {
        dispatch({
          type: TYPES.READ_MESSAGES,
          payload: {
            roomId,
            currentUserId
          }
        });
      })
      .catch(e => {
        setTimeout(() => markAllUnreadMessages(roomId, currentUserId)(dispatch), 10000);
      });
  }
);
