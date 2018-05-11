import React, { Component } from 'react';
import { Dimensions, Keyboard, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { sendMessage } from '../actions/messages';
import { dropUnreadCount, markAllUnreadMessages } from '../actions/rooms';

import DefaultAppLayout from './DefaultAppLayout';
import IconButton from './IconButton';
import RoomMessages from './RoomMessages';
import ChatInputs from './ChatInputs';

class ChatRoomLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottomOffset: 0,
      messageToSend: '',
      messagesHeight: Dimensions.get('window').height - 160,
      menu: false
    };

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.keyboardShowHandler = this.keyboardShowHandler.bind(this);
    this.keyboardHideHandler = this.keyboardHideHandler.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    this.props.markAllUnreadMessages(this.props.room._id, this.props.currentUserId);
    Keyboard.addListener('keyboardDidShow', this.keyboardShowHandler);
    Keyboard.addListener('keyboardDidHide', this.keyboardHideHandler);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages.length < nextProps.messages.length) {
      this.props.markAllUnreadMessages(this.props.room._id, this.props.currentUserId);
    }
  }

  componentWillUnmount() {
    this.props.dropUnreadCount(this.props.room._id);
    Keyboard.removeListener('keyboardDidShow', this.keyboardShowHandler);
    Keyboard.removeListener('keyboardDidHide', this.keyboardHideHandler);
  }

  keyboardShowHandler(e) {
    this.setState({
      bottomOffset: e.endCoordinates.height,
      messagesHeight: Dimensions.get('window').height - (160 + e.endCoordinates.height),
    });
  }

  keyboardHideHandler() {
    this.setState({
      bottomOffset: 0,
      messagesHeight: Dimensions.get('window').height - 160
    });
  }

  updateMessage(value) {
    this.setState({
      messageToSend: value
    });
  }

  sendMessage() {
    this.props.sendMessage(this.props.room._id, this.state.messageToSend);
    this.setState({
      messageToSend: ''
    });
  }

  toggleMenu() {
    this.setState({
      menu: !this.state.menu
    })
  }

  render() {
    const roomTitle = this.props.room.users.length > 1 ?
      this.props.room.name :
      this.props.room.users[0] ? this.props.room.users[0].name : 'user',
      online = this.props.room.users.length === 1 &&
        this.props.room.users[0] &&
        this.props.room.users[0].online;

    return (
      <DefaultAppLayout
        left={<IconButton icon="chevron-left" onPress={() => Actions.reset('chatsList')} text="Back" />}
        right={<IconButton icon="more-vert" onPress={this.toggleMenu} />}
        title={roomTitle}
        online={online && !this.props.loading}
        loading={this.props.loading}
      >
        <RoomMessages
          messages={[...this.props.messages, ...this.props.pendingMessages]}
          height={this.state.messagesHeight}
          currentUserId={this.props.currentUserId}
        />
        <ChatInputs
          onChangeText={this.updateMessage}
          messageText={this.state.messageToSend}
          bottomOffset={this.state.bottomOffset}
          sendMessage={this.sendMessage}
        />
      </DefaultAppLayout>
    )
  }
}

const mapStateToProps = (state, { roomId }) => {
  const currentUser = state.currentUser.data,
    currentUserId = currentUser._id,
    messages = state.messages[roomId] ?
      state.messages[roomId]
        .map(message => ({
          ...message,
          user: state.users.byId[message.userId],
          state: message.read ? 2 : 1,
        }))
        .filter(message => typeof message !== 'undefined') :
      [],
    pendingMessages = state.messages.toSend && state.messages.toSend[roomId] ?
      (state.messages.toSend[roomId].map(message => {
        return ({
          _id: Math.random(),
          text: message,
          time: Date.now(),
          user: currentUser,
          userId: currentUserId,
          state: 0
        });
      }) || []) :
      [];

  return ({
    messages,
    pendingMessages,
    room: {
      ...state.rooms.byId[roomId],
      users: state.rooms.byId[roomId].users
        .filter(userId => userId !== currentUserId)
        .map(userId => state.users.byId[userId]),
    },
    currentUserId,
    loading: !state.worker.networkState || state.rooms.loading,
  });
};

export default connect(mapStateToProps, {
  sendMessage,
  dropUnreadCount,
  markAllUnreadMessages
})(ChatRoomLayout);
