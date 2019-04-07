import React, { Component } from 'react'
// import (Header) from 'react-navigation';
import { Text, View,TouchableWithoutFeedback,Dimensions, Platform, Image, StyleSheet, TouchableOpacity, TouchableHighlight,Modal, CameraRoll  } from 'react-native';
import {w,h} from '../api/Dimensions'
import Button from '../components/Button'
import TimerMixin from 'react-timer-mixin'
import { captureScreen } from "react-native-view-shot"
import {PermissionsAndroid} from 'react-native';

//import CameraRollExtended from 'react-native-store-photos-album'
let posistion,time = 60;
const IMAGE_SIZE = 90;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOP_AREA_HEIGHT = SCREEN_HEIGHT/3;
const GRID_AREA_WIDTH = SCREEN_WIDTH;
const GRID_AREA_HEIGHT = SCREEN_HEIGHT -TOP_AREA_HEIGHT ;

export default class HelloWorldApp extends Component {
  constructor(props){
    super()
    this.state ={
        posistion : '',
        timeRemaining : 10,
        hits : 0,
        missed : 0,
        left : 0,
        timeInSeconds : 0,
        seconds : 0,
        responseTime : 0 ,
        values : [],
        test : false,
        accessGallery : false
    }
    this.generateRandomPosition =this.generateRandomPosition.bind(this)
    this.start = this.start.bind(this)
  }
  componentDidMount(){
    this.writeStorage()
  }
  writeStorage = async function requestWriteStoragePermission() {
    //alert('entered')
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App Gallery Permission',
          message:
            ' App needs access to store files in your gallery ' +
            'so you can view results',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({accessGallery: true})
      }else{
        alert('need storage permission to continue')
      }
    } catch (err) {
      console.warn(err);
    }
  }
  generateRandomPosition = () => {
    return {
        left: Math.random()*(GRID_AREA_WIDTH - IMAGE_SIZE), 
        top: Math.random()*(GRID_AREA_HEIGHT - IMAGE_SIZE - h(10))
    }
  }
  start = ()=>{
    // alert(SCREEN_HEIGHT/3)
    let timer = TimerMixin.setInterval(()=>{
      //alert('enterd the dragon')
      posistion = this.generateRandomPosition()
      this.setState({posistion,timeRemaining: this.state.timeRemaining-1,test: true})
      // alert(posistion)
    },1000)
    TimerMixin.setTimeout( ()=>{
      TimerMixin.clearInterval(timer)
      this.setState({timeRemaining :10, test : false})
      this.averageResponseTime()
    },10000)
  }
  averageResponseTime = ()=>{
    let total = 0;
    let valueArray = this.state.values
    for(let i = 1; i < valueArray.length; i++) {
    total += valueArray[i];
    }
    let responseTime = total / valueArray.length;
    this.setState({responseTime,values : []})
  }

  miss = ()=>{
    if(this.state.test === true){
      this.setState({missed : this.state.missed + 1 })
    }
  }

  hit = ()=>{
    if(this.state.test === true){
      let one = this.state.timeInSeconds
      let two = new Date().getTime() / 1000
      let seconds = two - one
      let values = this.state.values
      values.push(seconds)
      this.setState({hits : this.state.hits + 1 , values, seconds, timeInSeconds : two })
    }
  }

  capture = ()=>{
    if(this.state.accessGallery === true){
      captureScreen({
        format: "jpg",
        quality: 0.8
      })
      .then(
        uri => {
          CameraRoll.saveToCameraRoll(uri, 'photo')
        },
        error => console.error("Oops, snapshot failed", error)
      );
    }else{
      alert('please allow gallery permission to continue in app settings')
    }
  }

  render() {
    return (
      <View style= {styles.mainContainer}>
        <View style={styles.startTestContainer} >
          <View style = {styles.startTestButtonContainer}>
            {/* <View style = {styles.buttonContainer}> */}
              <TouchableOpacity onPress={this.start} style={styles.button}>
                <Text style ={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            {/* </View> */}
            {/* <View style = {styles.buttonContainer}> */}
              <TouchableOpacity onPress={this.capture} style={styles.button}>
                <Text style ={styles.buttonText}>Screenshot</Text>
              </TouchableOpacity>
            {/* </View> */}
          </View>
          <View style ={styles.startTestTextContainer}>
              <Text style = {styles.startTestText}>Time Remaining :{ this.state.timeRemaining} </Text>
              <Text style = {styles.startTestText}> Hits : {this.state.hits}</Text>
          </View>
          <View style = {styles.startTestTextContainer}>
              <Text style = {styles.startTestText}> Missed : {this.state.missed}</Text>
              { this.state.responseTime != 0? (
                <Text style = {styles.startTestText} > ResponseTime : {this.state.responseTime.toFixed(2)}</Text>
              ): false
              }
          </View>
        </View>
        {/* <View style = {styles.testContainer }> */}
          <TouchableWithoutFeedback onPress = {this.miss}>
            <View style={styles.testContainer} >
              <Button onClick = {()=>this.hit.bind(this)} posistion = {this.state.posistion}/>
            </View>
          </TouchableWithoutFeedback>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  mainContainer : {
    display : 'flex',
    flex: 1
  },
  startTestContainer : {
    display: 'flex',
    flex: 1.5,
    backgroundColor: 'black',
    height : TOP_AREA_HEIGHT
  },
  startTestTextContainer:{
    flexDirection : 'row'
  },
  startTestButtonContainer:{
    flexDirection : 'row',
  },
  buttonContainer:{
    // paddingLeft: w(1),
    // paddingRight:w(1)
  },
  buttonText:{
    color: 'white',
    paddingLeft : w(5),
    paddingRight : w(5)
  },
  startTestText:{
    color : 'white',
    textAlign : 'center',
    paddingRight : w(10),
    paddingLeft : w(10),
    paddingTop : TOP_AREA_HEIGHT/10,
    paddingTop : TOP_AREA_HEIGHT/10
  },
  testContainer :{
    display: 'flex',
    flex: 3,
    backgroundColor: '#2c3e50',
    borderWidth: w(1),
    borderColor : 'rgba(225,225,225,0.2)',
    borderRadius: w(5),
    // top: TOP_AREA_HEIGHT
    height : GRID_AREA_HEIGHT
    // marginTop : SCREEN_HEIGHT/3,
    // marginBottom : 0
  },
  button: {
    width: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(3),
    backgroundColor: '#888',
    borderRadius: w(10),
    marginTop: h(5),
    marginRight : w(5),
    marginLeft : w(5)
    // paddingLeft : w(10),
    // paddingRight : w(20)
  },
  imageSize :{
    width: IMAGE_SIZE,
    height: IMAGE_SIZE
  }
  // buttonMainContainer :{
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor : 'lightblue',
  //   paddingTop : h(5)
  // },
  // buttonContainer: {
  //   flex : 1,
  //   backgroundColor: 'red'
  // },
  // howTo:{
  //   flexDirection: 'row',
  //   justifyContent : 'center'
  // },
 
  // buttonText:{
  //   color: 'white'
  // },
  // gameContainer:{
  //   flex : 7,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor : 'red',
  // }
})