import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  Dimensions,
  Platform,
} from 'react-native';
import YouTube, { YouTubeStandaloneIOS, YouTubeStandaloneAndroid } from 'react-native-youtube';
const videoArray = [ 'ikY9WpmekRY','effXAxgxXb0','wkDiOCIX_xA','7CFLm1SL5EU', 'RxqUJzwFG_I','L8uEFW3FKBs']


export default class HelloWorldApp extends React.Component {
  state = {
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isPlaying: false,
    isLooping: true,
    duration: 0,
    currentTime: 0,
    fullscreen: false,
    containerMounted: false,
    containerWidth: null,
  };

  render() {
    return (
      <ScrollView
        style={styles.container}
        onLayout={({ nativeEvent: { layout: { width } } }) => {
          if (!this.state.containerMounted) this.setState({ containerMounted: true });
          if (this.state.containerWidth !== width) this.setState({ containerWidth: width });
        }}
      >
        <Text style={styles.welcome}>The following exercises can improve  gait, balance, tremor, flexibility, grip strength and motor co-ordination</Text>
        <Text style = {styles.welcome}> Do the following exercises regularly and you can test your improvement in the response screen. If your reaction time and misses decrease along with an increase in hits your co-ordination is improving.</Text>
        <View  style = {styles.videoContainer}>
          <YouTube
            ref={component => {
              this._youTubeRef = component;
            }}
            apiKey="AIzaSyDAA-UngkC_JIvA-hRLUSmWalAL1TafTJE"
            videoIds= {videoArray}
            style={[
              { height: PixelRatio.roundToNearestPixel(this.state.containerWidth / (16 / 9)) },
              styles.player,
            ]}
          />
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this._youTubeRef && this._youTubeRef.previousVideo()}
            >
              <Text style={styles.buttonText}>Previous Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this._youTubeRef && this._youTubeRef.nextVideo()}
            >
              <Text style={styles.buttonText}>Next Video</Text>
            </TouchableOpacity>
          </View>
   
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  videoContainer:{
    marginBottom : 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color : 'white'
  },
  buttonGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
  },
  buttonTextSmall: {
    fontSize: 15,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  player: {
    alignSelf: 'stretch',
    marginVertical: 10,
  },
});