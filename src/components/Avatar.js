import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

import { baseUrl } from '../config';

import { MaterialIcons } from '@expo/vector-icons';

function Avatar({ src, size = 100, local, unread }) {
  const styles = StyleSheet.create({
    avatarImage: {
      width: size,
      height: size,
      borderRadius: size / 2,
      zIndex: 0
    },
    unreadCountContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    unreadCountCircle: {
      width: size / 3,
      height: size / 3,
      borderRadius: size / 6,
      backgroundColor: 'rgb(0,191,243)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: size / 10
    },
    unreadCountText: {
      color: '#fff',
      fontSize: size / 5
    }
  });

  const source = {
    uri: local ? src : `${baseUrl}/avatars/${src}`
  };

  return (
    <View>
      {!src ? <MaterialIcons name='face' size={size} color="#aaa" /> :
        <Image source={source} style={styles.avatarImage} resizeMode="cover" />}
      {typeof unread === 'number' && unread > 0 &&
        <View style={styles.unreadCountContainer}>
          <View style={styles.unreadCountCircle}>
            <Text style={styles.unreadCountText}>{unread > 99 ? '99+' : unread}</Text>
          </View>
        </View>
      }
    </View>
  );
}

export default Avatar;
