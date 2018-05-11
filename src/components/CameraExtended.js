import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20
  }
});

class CameraExtended extends Component {
  constructor(props) {
    super(props);

    this.takePhoto = this.takePhoto.bind(this);
    this.swapCameraTypes = this.swapCameraTypes.bind(this);
    this.switchFlash = this.switchFlash.bind(this);

    this.state = {
      type: false,
      flash: Camera.Constants.FlashMode.auto
    }
  }

  swapCameraTypes() {
    this.setState({
      type: !this.state.type
    });
  }

  switchFlash() {
    const types = [
      Camera.Constants.FlashMode.auto,
      Camera.Constants.FlashMode.on,
      Camera.Constants.FlashMode.off
    ],
      currentFlashIndex = types.indexOf(this.state.flash);

    this.setState({
      flash: currentFlashIndex === 2 ? types[0] : types[currentFlashIndex + 1]
    })
  }

  renderFlashButtonContent() {
    if (!this.state.type) return <MaterialIcons name="flash-off" size={60} color="#aaa" />;

    switch (this.state.flash) {
      case Camera.Constants.FlashMode.auto:
        return <MaterialIcons name="flash-auto" size={60} color="#fff" />;
      case Camera.Constants.FlashMode.on:
        return <MaterialIcons name="flash-on" size={60} color="#fff" />;
      case Camera.Constants.FlashMode.off:
        return <MaterialIcons name="flash-off" size={60} color="#fff" />;
    }
  }

  async takePhoto() {
    this.props.onPhoto(await this.camera.takePictureAsync({ base64: false }));
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.active}
        onRequestClose={this.props.close}
      >
        <Camera
          style={{ flex: 1 }}
          ratio="16:9"
          autoFocus="on"
          flashMode={this.state.flash}
          type={this.state.type ? Camera.Constants.Type.back : Camera.Constants.Type.front}
          ref={ref => { this.camera = ref; }}
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity onPress={this.swapCameraTypes}>
            <MaterialIcons name="autorenew" size={60} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.takePhoto}>
            <MaterialIcons name="photo-camera" size={80} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.switchFlash}>
            {this.renderFlashButtonContent()}
          </TouchableOpacity>
        </View>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={this.props.close}>
            <MaterialIcons name="close" size={50} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

export default CameraExtended;
