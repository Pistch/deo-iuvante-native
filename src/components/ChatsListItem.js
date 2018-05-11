import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { MaterialIcons } from '@expo/vector-icons';

import prettyDate from '../helpers/prettyDate';

import Avatar from './Avatar';

function ChatsListItem({ name, _id, lastMessage, avatarUrl, unread, online, currentUserId }) {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: 90,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      padding: 5
    },
    textInfoContainer: {
      flex: 1,
      height: '100%',
      justifyContent: 'space-between',
      marginLeft: 5,
      paddingVertical: 3
    },
    firstRow: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    chatName: {
      fontSize: 17
    },
    lastMessageText: {
      fontSize: 14,
      color: '#777'
    }
  });

  let lastMessageTextWithUsername = lastMessage ?
    `${lastMessage.userName}: ${lastMessage.text}` :
    'No messages yet';

  if (lastMessageTextWithUsername.length > 90) {
    lastMessageTextWithUsername = lastMessageTextWithUsername.slice(0, 80) + '...';
  }

  return (
    <TouchableHighlight
      onPress={() => Actions.chatRoom({ roomId: _id })}
      underlayColor="rgba(0,191,243,.2)"
    >
      <View style={styles.container}>
        <Avatar size={70} src={avatarUrl} unread={unread} />
        <View style={styles.textInfoContainer}>
          <View style={styles.firstRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.chatName}>{name}</Text>
              {online === true && (
                <View style={{ marginLeft: 3 }}>
                  <MaterialIcons name="fiber-manual-record" size={12} color="green" />
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row' }}>
              {lastMessage && currentUserId === lastMessage.userId && (
                <View style={{ marginRight: 5 }}>
                  {lastMessage && !lastMessage.read && <MaterialIcons name="done" size={16} color="#aaa" />}
                  {lastMessage && lastMessage.read && <MaterialIcons name="done-all" size={16} color="green" />}
                </View>
              )}
              <Text style={styles.lastMessageText}>
                {lastMessage ? prettyDate(lastMessage.time, true) : ''}
              </Text>
            </View>
          </View>

          <Text style={styles.lastMessageText}>
            { lastMessageTextWithUsername }
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}

export default ChatsListItem;
