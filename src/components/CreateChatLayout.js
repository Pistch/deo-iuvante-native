import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import api from '../api';
import { fetchRoom } from '../actions/rooms';

import DefaultAppLayout from './DefaultAppLayout';
import UsersListItem from './UsersListItem';
import IconButton from './IconButton';

class CreateChatLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUsers: {}
    };
    this.selectUser = this.selectUser.bind(this);
    this.submitRoom = this.submitRoom.bind(this);
  }

  selectUser(id) {
    let mark = true;

    if (this.state.selectedUsers[id]) mark = false;

    this.setState({
      selectedUsers: {
        ...this.state.selectedUsers,
        [id]: mark
      }
    })
  }

  submitRoom() {
    let users = [];

    for (let key in this.state.selectedUsers) {
      if (this.state.selectedUsers[key]) users.push(key);
    }

    api.createRoom({ users })
      .then(async ({ _id }) => {
        await this.props.fetchRoom(_id);
        Actions.chatRoom({ roomId: _id });
      });
  }

  render() {
    return (
      <DefaultAppLayout
        left={<IconButton text="Back" icon="chevron-left" onPress={() => Actions.pop()} />}
        right={<IconButton icon="done" onPress={this.submitRoom} />}
        title="Select users"
      >
        <FlatList
          data={this.props.users}
          renderItem={({item}) => (<UsersListItem
            {...item}
            selected={this.state.selectedUsers[item._id]}
            onPress={this.selectUser}
          />)}
          keyExtractor={({ _id }) => _id}
          extraData={this.state}
        />
      </DefaultAppLayout>
    )
  }
}

function mapStateToProps(state) {
  const users = Object.values(state.users.byId).filter(({ _id }) => _id !== state.currentUser.data._id);

  return ({
    users
  });
}

export default connect(mapStateToProps, { fetchRoom })(CreateChatLayout);
