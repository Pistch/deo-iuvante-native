import * as TYPES from './types';
import api from '../api';

export const fetchMessages = roomId => (
  async (dispatch, getState) => {
    dispatch({
      type: TYPES.FETCH_MESSAGES_START,
    });

    try {
      const state = getState(),
        messagesQuantity = state.messages && state.messages[roomId] ? state.messages[roomId].length : 0,
        from = state.messages[roomId] &&
        state.messages[roomId][messagesQuantity - 1] &&
        state.messages[roomId][messagesQuantity - 1]._id;
        unreadMessages = state.messages && state.messages[roomId] && state.messages[roomId]
          .filter(m => !m.read)
          .map(m => m._id);

      const query = { roomId };

      if (from) query.from = from;

      if (unreadMessages && unreadMessages[0]) {
        api.getMessagesState(unreadMessages)
          .then(res => {
            res.forEach(item => {
              dispatch({
                type: TYPES.RENEW_MESSAGE_STATE,
                payload: { roomId, message: item }
              });
            });
          });
      }

      const payload = await api.getMessages(query);

      dispatch({
        type: TYPES.FETCH_MESSAGES_SUCCESS,
        payload: {
          roomId,
          messages: payload,
        },
      });

      if (payload.length) {
        dispatch({
          type: TYPES.ROOM_UNREAD_MESSAGES_SET,
          payload: {
            roomId,
            count: payload.filter(m => m.userId !== state.currentUser.data._id).length
          }
        })
      }
    } catch (e) {
      dispatch({
        type: TYPES.FETCH_MESSAGES_FAILURE,
        payload: e.message,
      });
    } finally {
      dispatch({
        type: TYPES.FETCH_MESSAGES_END,
      });
    }
  }
);

export const addMessage = payload => ({
  type: TYPES.ADD_MESSAGE,
  payload,
});

export const sendMessage = (roomId, message, doNotAddMe) => (
  async (dispatch) => {
    if (!doNotAddMe) {
      dispatch({
        type: TYPES.ADD_MESSAGE_TO_SEND,
        payload: {
          roomId,
          message
        }
      });
    }

    let payload;
    try {
      payload = await api.sendMessage({ roomId, text: message });
      console.log('going to add sent message:');
      dispatch(addMessage(payload));
    } catch (e) {
      console.log('was not able to send a message: ', e);
      sendMessage(roomId, message, true)(dispatch);
    }
  }
);

export const readMyMessages = (roomId, currentUserId) => (
  (dispatch) => {
    dispatch({
      type: TYPES.READ_MY_MESSAGES,
      payload: { roomId, currentUserId }
    });
  }
);
