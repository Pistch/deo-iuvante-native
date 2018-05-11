import React from 'react';
import { Text, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import Avatar from './Avatar';

function UsersListItem({ name, selected, onPress, _id, avatarUrl }) {
  const styles = StyleSheet.create({
    container: {
      height: 90,
      borderColor: '#ccc',
      borderBottomWidth: 1,
      width: '100%',
      flexDirection: 'row',
      backgroundColor: selected ? 'rgba(0,191,243,.2)' : 'transparent'
    }
  });

  return (
    <TouchableWithoutFeedback onPress={() => onPress(_id)}>
      <View style={styles.container}>
        <Avatar size={85} src={avatarUrl}/>
        <Text>{name}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default UsersListItem;
