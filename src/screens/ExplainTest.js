

import React, {Component} from 'react';
import {StyleSheet,Text,TouchableOpacity,View,} from 'react-native';
import Video from 'react-native-video';
import {w,h} from '../api/Dimensions'

import KineticTremor from "../explanationVideos/kinetic_tremor.mp4";
import PosturalTremor from "../explanationVideos/postural_tremor.mp4";
import RestingTremor from "../explanationVideos/resting_tremor.mp4";

export default class VideoPlayer extends Component {

state = {
rate: 1,
volume: 1,
muted: false,
resizeMode: 'contain',
duration: 0.0,
currentTime: 0.0,
paused: false,
};

// video: KineticTremor;
//handle going back
handleBack = () =>{
    if(this.props.navigation.getParam('value')=== 1){
        this.props.navigation.navigate('StartTest1', {userName :this.props.navigation.getParam('userName') })
      }else if(this.props.navigation.getParam('value')===2){
        this.props.navigation.navigate('StartTest2', {userName :this.props.navigation.getParam('userName') })
      }else if(this.props.navigation.getParam('value')===3){
        this.props.navigation.navigate('StartTest3', {userName :this.props.navigation.getParam('userName') })
      }
}

onLoad = (data) => {
this.setState({ duration: data.duration });
};

onProgress = (data) => {
this.setState({ currentTime: data.currentTime });
};

onEnd = () => {
this.setState({ paused: true })
//this.video.seek(0)
};

onAudioBecomingNoisy = () => {
this.setState({ paused: true })
};

onAudioFocusChanged = (event) => {
this.setState({ paused: !event.hasAudioFocus })
};

getCurrentTimePercentage() {
if (this.state.currentTime > 0) {
  return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
}
return 0;
};

renderRateControl(rate) {
const isSelected = (this.state.rate === rate);

return (
  <TouchableOpacity onPress={() => { this.setState({ rate }) }}>
    <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
      {rate}x
    </Text>
  </TouchableOpacity>
);
}

renderResizeModeControl(resizeMode) {
const isSelected = (this.state.resizeMode === resizeMode);

return (
  <TouchableOpacity onPress={this.handleBack}>
    <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
      {resizeMode}
    </Text>
  </TouchableOpacity>
)
}

renderVolumeControl(volume) {
const isSelected = (this.state.volume === volume);

return (
  <TouchableOpacity onPress={() => { this.setState({ volume }) }}>
    <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
      {volume * 100}%
    </Text>
  </TouchableOpacity>
)
}

render() {
const flexCompleted = this.getCurrentTimePercentage() * 100;
const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
let videoTitle
if(this.props.navigation.getParam('value')=== 1){
  videoTitle = KineticTremor
}else if(this.props.navigation.getParam('value')===2){
    videoTitle = PosturalTremor
}else if(this.props.navigation.getParam('value')===3){
    videoTitle = RestingTremor
}
return (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.fullScreen}
      onPress={() => this.setState({ paused: !this.state.paused })}
    >
      <Video
        // ref={(ref: Video) => { this.video = ref }}
        /* For ExoPlayer */
        /* source={{ uri: 'http://www.youtube.com/api/manifest/dash/id/bf5bb2419360daf1/source/youtube?as=fmp4_audio_clear,fmp4_sd_hd_clear&sparams=ip,ipbits,expire,source,id,as&ip=0.0.0.0&ipbits=0&expire=19000000000&signature=51AF5F39AB0CEC3E5497CD9C900EBFEAECCCB5C7.8506521BFC350652163895D4C26DEE124209AA9E&key=ik0', type: 'mpd' }} */
        ref={(ref) => {
            this.player = ref
          }} 
        source={videoTitle}
        style={styles.fullScreen}
        rate={this.state.rate}
        paused={this.state.paused}
        volume={this.state.volume}
        muted={this.state.muted}
        resizeMode={this.state.resizeMode}
        onLoad={this.onLoad}
        onProgress={this.onProgress}
        onEnd={this.onEnd}
        onAudioBecomingNoisy={this.onAudioBecomingNoisy}
        onAudioFocusChanged={this.onAudioFocusChanged}
        repeat={false}
      />
    </TouchableOpacity>
    {/* <View style={styles.back}> 
          <TouchableOpacity onPress={() =>this.props.navigation.navigate('StartTest1', {userName :this.props.navigation.getParam('userName') })} style={styles.button}>
            <Text style ={styles.buttonText}>Back</Text>
          </TouchableOpacity>
    </View> */}
    <View style={styles.controls}>
      <View style={styles.generalControls}>
        <View style={styles.rateControl}>
          {this.renderRateControl(0.25)}
          {this.renderRateControl(0.5)}
          {this.renderRateControl(1.0)}
          {this.renderRateControl(1.5)}
          {this.renderRateControl(2.0)}
        </View>

        <View style={styles.volumeControl}>
          {this.renderVolumeControl(0.5)}
          {this.renderVolumeControl(1)}
          {this.renderVolumeControl(1.5)}
        </View>

        <View style={styles.resizeModeControl}>
          {this.renderResizeModeControl('back to test')}
          {/* {this.renderResizeModeControl('contain')}
          {this.renderResizeModeControl('stretch')} */}
        </View>
      </View>

      <View style={styles.trackingControls}>
        <View style={styles.progress}>
          <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
          <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
        </View>
      </View>
    </View>
  </View>
);
}
}


const styles = StyleSheet.create({
container: {
 flex: 1,
 justifyContent: 'center',
 alignItems: 'center',
 backgroundColor: 'black',
},
fullScreen: {
 position: 'absolute',
 top: 0,
 left: 0,
 bottom: 0,
 right: 0,
},
buttonText:{
 color: 'white'
},
back:{
  flexDirection: 'row',
 justifyContent : 'center'
},
button: {
    width: '75%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(3),
    backgroundColor: '#888',
    borderRadius: w(10),
    marginTop: h(3),
  },
controls: {
 backgroundColor: 'transparent',
 borderRadius: 5,
 position: 'absolute',
 bottom: 20,
 left: 20,
 right: 20,
},
progress: {
 flex: 1,
 flexDirection: 'row',
 borderRadius: 3,
 overflow: 'hidden',
},
innerProgressCompleted: {
 height: 20,
 backgroundColor: '#cccccc',
},
innerProgressRemaining: {
 height: 20,
 backgroundColor: '#2C2C2C',
},
generalControls: {
 flex: 1,
 flexDirection: 'row',
  borderRadius: 4,
 overflow: 'hidden',
 paddingBottom: 10,
},
rateControl: {
  flex: 1,
  flexDirection: 'row',
 justifyContent: 'center',
},
volumeControl: {
 flex: 1,
 flexDirection: 'row',
 justifyContent: 'center',
},
resizeModeControl: {
 flex: 1,
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent: 'center',
},
controlOption: {
 alignSelf: 'center',
 fontSize: 11,
 color: 'white',
 paddingLeft: 2,
 paddingRight: 2,
 lineHeight: 12,
},
});













// import React, { Component } from "react";
// import { AppRegistry, StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";

// import Video from "react-native-video";
// import KineticTremor from "../explanationVideos/kinetic_tremor.mp4";
// import PosturalTremor from "../explanationVideos/postural_tremor.mp4";
// import RestingTremor from "../explanationVideos/resting_tremor.mp4";

// const THRESHOLD = 100;
// export default class rnvideo extends Component {


//   render() {
//     const { width } = Dimensions.get("window");

//     return (
//       <View style={styles.container}>
//         {/* <ScrollView scrollEventThrottle={16} onScroll={this.handleScroll}> */}
//             <Text> sadasdasda</Text>
//           <Video
//             source={KineticTremor}
//             // paused={this.state.paused}
//             // onLayout={this.handleVideoLayout}
//             style={{ width, height: 300 }}
//           />
       
//         {/* </ScrollView> */}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   fakeContent: {
//     height: 850,
//     backgroundColor: "#CCC",
//     paddingTop: 250,
//     alignItems: "center",
//   },
// });