import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgb(0,191,243)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    height: 80,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3,
    elevation: 2,
    zIndex: 10
  },
  text: {
    color: '#fff',
    fontSize: 23,
    paddingBottom: 7
  },
  leftButton: {
    position: 'absolute',
    left: 0,
    bottom: 10
  },
  rightButton: {
    position: 'absolute',
    right: 0,
    bottom: 10
  }
});

function Header({ children, left, right, loading, online }) {
  return (
    <View style={styles.header}>
      <View style={styles.leftButton}>{left}</View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {loading && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 7, marginBottom: 7 }} />}
        <Text style={styles.text}>{children}</Text>
        {!loading && online && (<MaterialIcons
          name="fiber-manual-record"
          size={12}
          color="green"
          style={{ marginLeft: 4 }}
        />)}
      </View>
      <View style={styles.rightButton}>{right}</View>
    </View>
  );
}

export default Header;
