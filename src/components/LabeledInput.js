import React from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 5,
    width: '100%',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    width: '100%',
    height: 40,
    padding: 3
  },
  labelText: {
    color: '#226',
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 5
  }
});

function LabeledInput({ label, value, onChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{label}</Text>
      <TextInput
        underlineColorAndroid="rgba(0,0,0,0)"
        onChangeText={onChange}
        value={value}
        style={styles.inputField}
      />
    </View>
  );
}

export default LabeledInput;
