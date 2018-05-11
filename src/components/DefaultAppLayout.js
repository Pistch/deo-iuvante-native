import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Header from './Header';

function DefaultAppLayout({ title, left, right, children, loading, online }) {
  return (
    <View style={styles.container}>
      <Header
        right={right}
        left={left}
        loading={loading}
        online={online}
      >
        {title}
      </Header>
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }
});

export default DefaultAppLayout;
