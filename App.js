import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import { Router, Scene } from 'react-native-router-flux';

import { MaterialIcons } from '@expo/vector-icons';

import ChatRoomLayout from './src/components/ChatRoomLayout';
import ChatsListLayout from './src/components/ChatsListLayout';
import CreateChatLayout from './src/components/CreateChatLayout';
import MenuLayout from './src/components/MenuLayout';

import reducer from './src/reducers';
import Subscriber from './src/helpers/Subscriber';
import { saveState, initializeStore } from './src/helpers/persistStore';

export const store = createStore(
  reducer,
  {},
  applyMiddleware(thunkMiddleware, saveState)
);

initializeStore(store.dispatch);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      storeReady: store.getState().worker.ready,
      openProfileSettings: true,
    };
    this.unsubscribe = store.subscribe(this.setReady.bind(this));
  }

  setReady() {
    const state = store.getState();
    if (!state.worker.ready) return;
    const username = state.currentUser &&
      state.currentUser.data &&
      state.currentUser.data.name;
    this.setState({
      storeReady: true,
      openProfileSettings: !username,
    });
    this.unsubscribe();
  }

  render() {
    if (!this.state.storeReady) return null;

    return (
      <Provider store={store}>
        <React.Fragment>
          <Subscriber />
          <Router>
            <Scene key="root" hideNavBar>
              <Scene
                initial={this.state.openProfileSettings}
                key="menu"
                component={MenuLayout}
              />
              <Scene
                initial={!this.state.openProfileSettings}
                key="chatsList"
                component={ChatsListLayout}
              />
              <Scene
                key="createChat"
                component={CreateChatLayout}
              />
              <Scene
                key="chatRoom"
                component={ChatRoomLayout}
              />
            </Scene>
          </Router>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
