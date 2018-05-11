import React from 'react';
import { View, FlatList } from 'react-native';

import MessageBubble from './MessageBubble'

class RoomMessages extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.messages.length !== nextProps.messages.length) {
      setImmediate(this.listEntity.scrollToEnd.bind(this.listEntity));
    }
  }

  render() {
    const {height, messages, currentUserId} = this.props;

    return (
      <View style={{height, paddingBottom: 3, paddingHorizontal: 3}}>
        <FlatList
          data={messages}
          renderItem={({item}) => <MessageBubble text={item.text} isOwner={item.userId === currentUserId} />}
          keyExtractor={item => item._id}
          ref={(r) => {
            this.listEntity = r;
          }}
        />
      </View>
    );
  }
}

export default RoomMessages;
