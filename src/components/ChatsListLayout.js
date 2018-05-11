import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import DefaultAppLayout from './DefaultAppLayout';
import ChatsListItem from './ChatsListItem';
import IconButton from './IconButton';

class ChatsListLayout extends Component {
  titleText() {
    if (!this.props.networkState) return 'Connecting...';
    if (this.props.loading) return 'Updating...';
    return 'Your chats';
  }

  render() {
    const { loading } = this.props;

    return (
      <DefaultAppLayout
        right={!loading && this.props.networkState ? (<IconButton icon="add" onPress={() => Actions.createChat()} />) : null}
        left={!loading && this.props.networkState ? (<IconButton icon="perm-identity" onPress={() => Actions.menu()} />) : null}
        title={this.titleText()}
        loading={this.props.loading || !this.props.networkState}
      >
        {!this.props.rooms[0] ? (<View
          style={{flex: 1, paddingTop: 45, alignItems: 'center'}}>
          <Text style={{color: '#aaa'}}>You have no chats yet</Text>
          <IconButton text="Create one" onPress={() => Actions.createChat()}/>
        </View>) :
        (<FlatList
          data={this.props.rooms}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (<ChatsListItem
            {...item}
            currentUserId={this.props.currentUser._id}
          />)}
        />)}
      </DefaultAppLayout>
    )
  }
}

function mapStateToProps(state) {
  return ({
    rooms: state.rooms.allIds.map(id => {
      const room = state.rooms.byId[id],
        lastMessage = state.messages[id] &&
          state.messages[id][state.messages[id].length - 1];

      if (lastMessage) {
        lastMessage.userName = state.users.byId[lastMessage.userId] &&
          state.users.byId[lastMessage.userId].name;
      }

      if (room.users.length < 3) {
        if (room.users.length > 1) {
          const anotherUserId = room.users.filter(uId => uId !== state.currentUser.data._id)[0];
          room.name = state.users.byId[anotherUserId] && state.users.byId[anotherUserId].name;
          room.avatarUrl = state.users.byId[anotherUserId] && state.users.byId[anotherUserId].avatarUrl;
          room.online = state.users.byId[anotherUserId] && state.users.byId[anotherUserId].online;
        } else {
          room.name = 'You alone ):';
          room.avatarUrl = state.currentUser.data.avatarUrl;
        }
      }

      return ({
        ...room,
        lastMessage,
      });
    }).sort((m1, m2) => {
      if (!m1.lastMessage) {
        if (!m2.lastMessage) return 0;
        return 1;
      } else {
        if (!m2.lastMessage) return -1;
        return (m2.lastMessage.time - m1.lastMessage.time);
      }
    }),
    networkState: state.worker.networkState,
    loading: state.rooms.loading && state.currentUser.isFetching,
    currentUser: state.currentUser.data
  });
}

export default connect(mapStateToProps)(ChatsListLayout);
