import React from 'react';
import { connect } from 'react-redux';
import { Notifications, Permissions } from 'expo';

import { addMessage, fetchMessages, readMyMessages } from '../actions/messages';
import { fetchRooms, fetchRoom, incrementUnreadCount } from '../actions/rooms';
import { fetchCurrentUser } from '../actions/currentUser';
import { fetchUsers, changeUserStatus } from '../actions/users';
import { networkFail, networkRestore } from '../actions/worker';

import api from '../api';

class Subscriber extends React.Component {
  constructor(props) {
    super(props);

    this.receiveMessage = this.receiveMessage.bind(this);
    this.onReconnect = this.onReconnect.bind(this);
  }

  componentDidMount() {
    api.onConnect(this.onReconnect);
    api.onDisconnect(this.props.networkFail);
    api.onMessage(this.receiveMessage);
    api.onUserChangeStatus(this.props.changeUserStatus);
    const updateRoom = ({ roomId }) => {
      this.props.fetchRoom(roomId);
    };

    api.onUserJoinedRoom(updateRoom);
    api.onUserLeavedRoom(updateRoom);
    api.onMessagesRead((payload) => {
      if (payload.userId && (payload.userId !== this.props.currentUserId)) this.props.readMyMessages(payload.roomId, this.props.currentUserId);
    });
    api.onNewRoom(roomId => this.props.fetchRoom(roomId));
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then(async (perm) => {
        let resPermState = perm.status === 'granted' ||
          perm.allowsAlert ||
          perm.allowsBadge ||
          perm.allowsSound;

        if (!resPermState) {
          const permAfterAsking = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          resPermState = permAfterAsking.status === 'granted' ||
            permAfterAsking.allowsAlert ||
            permAfterAsking.allowsBadge ||
            permAfterAsking.allowsSound;
        }

        this.setState({ notifications: resPermState });
      })
  }

  componentWillUnmount() {
    api.offMessage();
    api.offMessagesRead();
  }

  onReconnect() {
    this.props.networkRestore();
    this.getInitialData();
  }

  getInitialData() {
    this.props.fetchCurrentUser();
    this.props.fetchUsers();
    this.props.fetchRooms()
      .then(rooms => {
        rooms.forEach(roomId => this.props.fetchMessages(roomId));
      });
  }

  receiveMessage(message) {
    if (message.userId === this.props.currentUserId) return;
    if (this.state.notifications) {
      Notifications.presentLocalNotificationAsync({
        title: this.props.users[message.userId] ?
          this.props.users[message.userId].name || 'New user' :
          'New message',
        body: message.text,
        ios: {
          sound: true
        },
        android: {
          sound: true
        }
      });
    }
    this.props.incrementUnreadCount(message.roomId);
    this.props.addMessage(message);
  }

  render() {
    return null;
  }
}

export default connect((state) =>({
  users: state.users.byId,
  currentUserId: state.currentUser.data._id,
}),{
  addMessage,
  readMyMessages,
  fetchRooms,
  fetchRoom,
  incrementUnreadCount,
  fetchMessages,
  fetchCurrentUser,
  fetchUsers,
  changeUserStatus,
  networkFail,
  networkRestore
})(Subscriber);

