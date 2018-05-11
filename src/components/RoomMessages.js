import React from 'react';
import { View, Text, PanResponder, Animated } from 'react-native';

import { throttle } from 'lodash';

import MessageBubble from './MessageBubble'

class RoomMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bottom: 0,
      tapPositionDifference: 0,
    }
  }

  componentWillMount() {
    this.scrollbarOpacity = new Animated.Value(0);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        if (this.props.height <= this.scrollableHeight) {
          Animated.timing(this.scrollbarOpacity, { toValue: 1, duration: 300 }).start();
        }

        this.setState({
          tapPositionDifference: 0,
        })
      },
      onPanResponderMove: throttle((evt, gestureState) => {
        this.setState({
          tapPositionDifference: gestureState.dy
        });
      }, 30),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        const maxScroll = this.scrollableHeight - this.props.height;
        let resultingPosition = this.state.bottom - this.state.tapPositionDifference;

        if (resultingPosition > 0) resultingPosition = 0;
        if (resultingPosition < -maxScroll) resultingPosition = -maxScroll;
        if (maxScroll < 0) resultingPosition = 0;

        this.setState({
          bottom: resultingPosition,
          tapPositionDifference: 0
        });
        Animated.timing(this.scrollbarOpacity, { toValue: 0, delay: 700, duration: 300 }).start();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        Animated.timing(this.scrollbarOpacity, { toValue: 0, delay: 700, duration: 300 }).start();
        // TODO: cancel gesture
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  renderMessages() {
    const messagesArray = [];
    for (let i = this.props.messages.length - 1; i >= 0 ; i--) {
      const item = this.props.messages[i];
      messagesArray.push(<MessageBubble
        key={item._id}
        text={item.text}
        isOwner={item.userId === this.props.currentUserId}
        avatar={item.user.avatar}
        username={item.user.name}
        time={item.time}
        state={item.state}
      />);
    }

    return messagesArray;
  }

  render() {
    if (!this.props.messages[0]) return (
      <View style={{flex: 1, height: this.props.height, paddingTop: 45, alignItems: 'center'}}>
        <Text style={{color: '#aaa'}}>No messages</Text>
      </View>
    );

    const { height } = this.props,
      bottomScroll = this.state.bottom - this.state.tapPositionDifference,
      scrollablePartStyles = {
        position: 'absolute',
        bottom: bottomScroll,
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 7,
        flexDirection: 'column-reverse',
        zIndex: 0
      },
      scrollBarHeight = this.props.height >= this.scrollableHeight ?
        '100%' : Math.pow(this.props.height, 2) / this.scrollableHeight,
      scrollbarStyles = {
        position: 'absolute',
        width: 5,
        height: scrollBarHeight,
        backgroundColor: 'rgba(0,0,0,.5)',
        borderRadius: 5,
        bottom: (-this.props.height * (bottomScroll / this.scrollableHeight)),
        right: 2,
        opacity: this.scrollbarOpacity
      };

    return (
      <View {...this._panResponder.panHandlers} style={{height}}>
        <View style={scrollablePartStyles} onLayout={l => this.scrollableHeight = l.nativeEvent.layout.height}>
          {this.renderMessages()}
        </View>
        <Animated.View style={scrollbarStyles} />
      </View>
    );
  }
}

export default RoomMessages;
