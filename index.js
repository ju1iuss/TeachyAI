import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './services/trackPlayerService';
import App from './app';

AppRegistry.registerComponent('main', () => App);
TrackPlayer.registerPlaybackService(() => playbackService);

registerRootComponent(App); 