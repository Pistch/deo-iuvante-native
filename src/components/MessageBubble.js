import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

//import Avatar from './Avatar';
import prettyDate from '../helpers/prettyDate';

function MessageBubble(props) {
  const styles = StyleSheet.create({
    bubble: {
      padding: 5,
      backgroundColor: props.isOwner ? '#18a0e2' : '#eee',
      borderRadius: 5,
      minWidth: '40%',
      maxWidth: '90%',
    },
    container: {
      width: '100%',
      flexDirection: props.isOwner ? 'row-reverse' : 'row',
      justifyContent: 'flex-start',
      marginVertical: 2
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 5,
      maxWidth: '100%'
    },
    usernameText: {
      color: props.isOwner ? 'white' : 'black',
      fontSize: 15,
      fontWeight: 'bold',
      maxWidth: '85%'
    },
    timemark: {
      color: props.isOwner ? 'white' : 'black',
      fontSize: 10,
      marginHorizontal: 5,
      fontStyle: 'italic'
    },
    messageText: {
      color: props.isOwner ? 'white' : 'black',
      fontSize: 16
    }
  });

  /* {!props.isOwner && <Avatar src={props.avatar} size={30} />} */
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.messageHeader}>
          <Text style={styles.usernameText}>{props.isOwner ? 'You' : props.username}</Text>
          <Text style={styles.timemark}>{prettyDate(props.time)}</Text>
        </View>

        <Text style={styles.messageText}>{props.text}</Text>
      </View>
      <View style={{ marginHorizontal: 5, justifyContent: 'flex-end' }}>
        {props.state === 0 && <ActivityIndicator size="small" color="#18a0e2" />}
        {props.state === 1 && <MaterialIcons name="done" size={20} color="#aaa" />}
        {props.state === 2 && <MaterialIcons name="done-all" size={20} color="green" />}
      </View>
    </View>
  );
}

export default MessageBubble;
