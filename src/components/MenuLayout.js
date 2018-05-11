import React, { Component } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { ImagePicker, Permissions, BlurView } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

import { baseUrl } from '../config';

import { updateCurrentUser } from '../actions/currentUser';

import DefaultAppLayout from './DefaultAppLayout';
import LabeledInput from './LabeledInput';
import CameraExtended from './CameraExtended';
import IconButton from './IconButton';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
    paddingTop: 10
  },
  popupWindow: {
    width: '80%',
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.3,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 10
  },
  popupBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupGag: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5
  },
  hintText: {
    fontSize: 12,
    color: '#aaa',
    paddingTop: 5
  }
});

class MenuLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.user.name,
      phone: props.user.phone,
      email: props.user.email,
      avatarUrl: props.user.avatarUrl,
      modal: false,
      camera: false
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePhone = this.updatePhone.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.submitNewData = this.submitNewData.bind(this);
    this.pickNewAvatar = this.pickNewAvatar.bind(this);
    this.turnSelectSourceModal = this.turnSelectSourceModal.bind(this);
    this.openCamera = this.openCamera.bind(this);
    this.getPhotoFromCamera = this.getPhotoFromCamera.bind(this);
  }

  updateUsername(val) {
    this.setState({
      name: val
    });
  }

  updatePhone(val) {
    this.setState({
      phone: val
    });
  }

  updateEmail(val) {
    this.setState({
      email: val
    });
  }

  submitAvatar() {
    if (this.avatar) {
      this.setState({ loading: true });
      return fetch(baseUrl + '/upload-avatar', {
        method: 'POST',
        body: this.avatar
      })
        .then(() => {
          this.setState({ loading: false });
          this.submitNewData();
        })
        .catch(err => console.log(err));
    }
  }

  async submitNewData() {
    await this.props.updateCurrentUser({
      name: this.state.name,
      phone: this.state.phone,
      email: this.state.email,
    });

    if (this.props.user.avatarUrl || this.props.firstTime) Actions.chatsList();
  }

  turnSelectSourceModal() {
    this.setState({ modal: !this.state.modal });
  }

  async pickNewAvatar() {
    this.setState({ modal: false });

    const permissions = await Permissions.getAsync(Permissions.CAMERA_ROLL);

    if (permissions.status !== 'granted') {
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    const newAvatar = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!newAvatar.type) return;

    const avatarFormData = new FormData(newAvatar);

    avatarFormData.append('image', {
      ...newAvatar,
      type: 'image/jpeg',
      name: 'photo.jpg'
    });
    this.avatar = avatarFormData;

    this.setState({
      avatarUrl: newAvatar.uri
    });

    this.submitAvatar();
  }

  async openCamera() {
    this.setState({ modal: false });

    const permissionsRoll = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (permissionsRoll.status !== 'granted') {
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    const permissionsCamera = await Permissions.getAsync(Permissions.CAMERA);
    if (permissionsCamera.status !== 'granted') {
      await Permissions.askAsync(Permissions.CAMERA);
    }

    this.setState({ camera: true });
  }

  getPhotoFromCamera(newAvatar) {
    const avatarFormData = new FormData(newAvatar);

    avatarFormData.append('image', {
      ...newAvatar,
      type: 'image/jpeg',
      name: 'photo.jpg'
    });
    this.avatar = avatarFormData;

    this.setState({
      avatarUrl: newAvatar.uri,
      camera: false
    });
    this.submitAvatar();
  }

  render() {
    return (
      <DefaultAppLayout
        left={this.state.name && this.props.user.name ? <IconButton icon="chevron-left" onPress={() => Actions.pop()} text="Back" /> : undefined}
        title="Your profile"
      >
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity onPress={this.turnSelectSourceModal}>
              <Avatar src={this.state.avatarUrl} size={150} local={this.avatar} />
            </TouchableOpacity>
            {!this.state.loading && <Text style={styles.hintText}>Tap on avatar to change it</Text>}

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modal}
              onRequestClose={this.turnSelectSourceModal}
            >
              <BlurView tint="default" intensity={80} style={styles.popupBlur}>
                <View style={styles.popupWindow}>
                  <TouchableOpacity onPress={this.pickNewAvatar}>
                    <View style={{ alignItems: 'center' }}>
                      <MaterialIcons name="folder" size={80} color="#aaa" />
                      <Text style={styles.hintText}>Pick from storage</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.hintText}>or</Text>
                  <TouchableOpacity onPress={this.openCamera}>
                    <View style={{ alignItems: 'center' }}>
                      <MaterialIcons name="photo-camera" size={80} color="#aaa" />
                      <Text style={styles.hintText}>Take photo</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.popupGag}>
                  <TouchableOpacity onPress={this.turnSelectSourceModal} style={{ flex: 1 }} />
                </View>
              </BlurView>
            </Modal>

            <CameraExtended
              active={this.state.camera}
              close={() => this.setState({ camera: false })}
              onPhoto={this.getPhotoFromCamera}
            />

            <LabeledInput
              label="Your name:"
              value={this.state.name}
              onChange={this.updateUsername}
            />
            <LabeledInput
              label="Your phone number:"
              value={this.state.phone}
              onChange={this.updatePhone}
            />
            <LabeledInput
              label="Your email:"
              value={this.state.email}
              onChange={this.updateEmail}
            />
            <View style={{ marginTop: 10 }}>
              {!this.props.updating && !this.state.loading ? (<IconButton
                text="Save"
                icon="save"
                size={26}
                onPress={!this.state.name ? () => {} : this.submitNewData}
                background={!this.state.name ? '#aaa' : undefined}
              />) :
                (<ActivityIndicator size="large" color="rgb(0,191,243)" />)}
              {this.state.loading && <Text style={styles.hintText}>Uploading new avatar...</Text>}
              {this.props.updating && <Text style={styles.hintText}>Saving profile data...</Text>}
            </View>
          </View>
        </ScrollView>
      </DefaultAppLayout>
    )
  }
}

function mapStateToProps(state) {
  return ({
    user: state.currentUser.data,
    updating: state.currentUser.isUpdating,
  });
}

export default connect(mapStateToProps, { updateCurrentUser })(MenuLayout);
