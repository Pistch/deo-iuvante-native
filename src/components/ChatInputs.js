import React from 'react';
import { Keyboard, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo';

import IconButton from './IconButton';

function ChatInputs(props) {
  const styles = StyleSheet.create({
    footer: {
      position: 'absolute',
      left: 0,
      bottom: props.bottomOffset,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
      height: 80,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2
      },
      shadowOpacity: 0.1,
      elevation: 2,
      zIndex: 10,
      borderColor: '#ccc',
      borderTopWidth: 1
    },
    inputField: {
      backgroundColor: '#fff',
      flex: 1,
      paddingHorizontal: 5,
      marginLeft: 7,
      fontSize: 15,
      height: 60,
      borderRadius: 6,
      borderColor: '#ccc',
      borderWidth: 1
    }
  });

  const onSendButtonPress = () => {
    props.sendMessage();
    Keyboard.dismiss();
  };

  return (
    <LinearGradient
      colors={['#fff', '#dadada']}
      style={styles.footer}
    >
      <TextInput
        onChangeText={props.onChangeText}
        value={props.messageText}
        style={styles.inputField}
        underlineColorAndroid="rgba(0,0,0,0)"
        onSubmitEditing={onSendButtonPress}
        blurOnSubmit
        onBlur={() => Keyboard.dismiss()}
        placeholder="Enter your message..."
      />
      <IconButton
        icon="send"
        background="transparent"
        color="#00cc66"
        size={30}
        onPress={onSendButtonPress}
      />
    </LinearGradient>
  );
}

export default ChatInputs;
