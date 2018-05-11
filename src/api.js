import io from 'socket.io-client';
import * as EVENTS from './server/messages';

import { baseUrl } from './config';
import { store } from '../App';
import { networkRestore } from './actions/worker';
import { fetchCurrentUser } from './actions/currentUser';
import { fetchUsers } from './actions/users';
import { fetchRooms } from './actions/rooms';
import { fetchMessages } from './actions/messages';

class Api {
  constructor() {
    this.ready = false;

    this.reconnector = this.reconnector.bind(this);
    this.reconnector();
  }

  async reconnector() {
    try {
      await this.initializeConnection()
        .then(() => {
          this.ready = true;
          networkRestore()(store.dispatch);
          fetchCurrentUser()(store.dispatch);
          fetchUsers()(store.dispatch);
          fetchRooms()(store.dispatch, store.getState)
            .then(rooms => {
              rooms.forEach(roomId => fetchMessages(roomId)(store.dispatch, store.getState));
            });
        });
    } catch (e) {
      console.log(e);
      setTimeout(this.reconnector, 10000);
    }
  }

  initializeConnection() {
    return this._connectPromise = fetch(`${baseUrl}/api/auth`)
      .then(() => this._setupSocket())
      .then(() => this.subscribePostpointed());
  }

  /**
     * Await for connection
     *
     * @return {Promise<*>}
     */
  _setupSocket() {
    this.io = io(baseUrl, { timeout: 10000 });

    return new Promise((resolve) => {
      this.io.on('connect', resolve);
      this.io.on('connect_timeout', () => console.log('socket connection timeout'));
    });
  }

  /**
     * Request data and wait response
     *
     * @param {string} type message type from EVENTS
     * @param {*} [payload] any requested data
     *
     * @return {Promise<*>}
     * @private
     */
  async _requestResponse(type, payload) {
    if (!this.ready) return Promise.reject();

    await this._connectPromise;

    const requestId = Math.random();

    const resolver = (resolve, reject) => {
      this.io.on(type, (data) => {
        if (data.requestId === requestId) resolve(data.payload);
      });
      // setTimeout(() => {
      //   this.io.off(type, resolver);
      //   reject();
      // }, 25000);
    };

    this.io.emit(type, { requestId, payload });
    return new Promise(resolver)
      .then((data) => {
        this.io.off(type, resolver);
        return data;
      });
  }

  /**
     * Return current user information
     *
     * @return {Promise<User>}
     */
  async getCurrentUser() {
    return this._requestResponse(EVENTS.CURRENT_USER);
  }

  /**
     * Return all known users
     *
     * @param {{ [limit]: number, [_id]: string }} [filter] - you can pass next object here
     *
     * @return {Promise<Pagination<User>>}
     */
  async getUsers(filter) {
    return this._requestResponse(EVENTS.USERS, filter);
  }

  /**
     * Get information about user
     *
     * @param {string} userId
     * @return {Promise<User>}
     */
  async getUser(userId) {
    const userArray = await this.getUsers({ _id: [userId] });

    return userArray[0];
  }

  /**
     * Update user
     *
     * @param {User} user
     *
     * @returns {Promise<void>}
     */
  async updateUser(user) {
    return this._requestResponse(EVENTS.UPDATE_USER, user)
      .then((userResult) => {
        if (userResult.error) {
          throw new Error(userResult.error);
        }

        return userResult;
      });
  }

  /**
     * @param {Room} room
     *
     * @return {Promise<void>}
     */
  async createRoom(room) {
    return this._requestResponse(EVENTS.CREATE_ROOM, room)
      .then(async (roomResult) => {
        if (roomResult.error) {
          throw new Error(roomResult.error);
        }

        return roomResult;
      });
  }

  /**
     * Return room by id
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
  async getRoom(roomId) {
    const allRooms = await this.getRooms();

    return allRooms.filter(room => room._id === roomId)[0];
  }

  /**
     * Return list of rooms for current user
     *
     * @param {{ limit: number }} [filter]
     *
     * @return {Promise<Pagination<Room>>}
     */
  async getRooms() {
    return this._requestResponse(EVENTS.CURRENT_USER_ROOMS);
  }

  /**
     * Join current user to the room
     *
     * @param {string} userId
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
  async userJoinRoom(roomId) {
    return this._requestResponse(EVENTS.CURRENT_USER_JOIN_ROOM, { roomId });
  }

  /**
     * Current user leave the room
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
  async currentUserLeaveRoom(roomId) {
    return this._requestResponse(EVENTS.CURRENT_USER_LEAVE_ROOM, { roomId });
  }

  /**
     * Send message to the room
     *
     * @param {string} message
     *
     * @return {Promise<Message>}
     */
  async sendMessage(message) {
    return this._requestResponse(EVENTS.SEND_MESSAGE, message);
  }

  async getMessagesState(messages) {
    return this._requestResponse(EVENTS.MESSAGES_STATE, messages);
  }

  /**
   * Mark message as read
   *
   * @param {string} messageId
   *
   * @return object
   */
  async markMessageAsRead(messageId) {
    return this._requestResponse(EVENTS.MARK_AS_READ, messageId);
  }

  /**
   * Mark all unread messages in a Room as read;
   *
   * @param {string} roomId
   *
   * @return {Promise<>}
   */
  async markAllUnreadMessages(roomId) {
    return this._requestResponse(EVENTS.MARK_ALL_UNREAD, roomId);
  }

  /**
     * Return list of messages
     *
     * @param {{}} [filter]
     *
     * @return {Promise<Pagination<Message>>}
     */
  async getMessages(filter) {
    return this._requestResponse(EVENTS.MESSAGES, filter);
  }

  async subscribe(eventType, callback) {
    if (!this.io) {
      return this.postpointSubscription(eventType, callback);
    }

    await this._connectPromise;
    this.io.on(eventType, callback);
  }

  postpointSubscription(eventType, callback) {
    if (!this.postpointed) this.postpointed = [];
    this.postpointed.push([eventType, callback]);
  }

  subscribePostpointed() {
    if (!this.postpointed) return;
    for (let i = 0; i < this.postpointed.length; i++) {
      this.subscribe(...this.postpointed[i]);
    }
  }

  /**
     * Invoke callback, when someone change his status
     *
     * @param {function({userId: string, status: boolean})} callback
     *
     * @return Promise<void>
     */
  async onUserChangeStatus(callback) {
    this.subscribe(EVENTS.ONLINE, callback);
  }

  /**
     * Invoke callback, when someone joined one of your rooms
     *
     * @param {function({userId: string, roomId: string})} callback
     *
     * @return Promise<void>
     */
  async onUserJoinedRoom(callback) {
    this.subscribe(EVENTS.USER_JOINED, callback);
  }

  /**
     * Invoke callback, when someone leaved one of your rooms
     *
     * @param {function({userId: string, roomId: string})} callback
     *
     * @return Promise<void>
     */
  async onUserLeavedRoom(callback) {
    this.subscribe(EVENTS.USER_LEAVED, callback);
  }

  /**
     * Invoke callback, when someone joined one of your rooms
     *
     * @param {function(Message)} callback
     *
     * @return Promise<void>
     */
  async onMessage(callback) {
    this.subscribe(EVENTS.MESSAGE, callback);
  }


  offMessage() {
    this.io.off(EVENTS.MESSAGE);
  }

  async onMessageRead(callback) {
    this.subscribe(EVENTS.MARK_AS_READ, callback);
  }


  async onMessagesRead(callback) {
    this.subscribe(EVENTS.MARK_ALL_UNREAD, callback);
  }

  offMessagesRead() {
    this.io.off(EVENTS.MARK_ALL_UNREAD);
  }

  async onNewRoom(callback) {
    this.subscribe(EVENTS.NEW_ROOM, callback);
  }

  async onConnect(callback) {
    this.subscribe('connect', callback);
  }

  async onDisconnect(callback) {
    this.subscribe('disconnect', callback);
  }
}

export default new Api();
