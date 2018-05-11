import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

function IconButton({ children, text, icon, onPress, background, color, size }) {
  const styles = StyleSheet.create({
    button: {
      maxWidth: '100%',
      maxHeight: size ? (size + 14) : 35,
      padding: 7,
      margin: 4,
      borderRadius: 2,
      backgroundColor: background || 'rgb(0,191,243)',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    buttonText: {
      fontSize: size || 20,
      color: color || '#ffffff'
    }
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        {icon && (<MaterialIcons name={icon} size={size || 23} color={color || '#ffffff'} />)}
        {text && (<Text style={styles.buttonText}>{text}</Text>)}
      </View>
    </TouchableOpacity>
  )
}

export default IconButton;
