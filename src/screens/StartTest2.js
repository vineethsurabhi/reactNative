import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import InputField from "../components/InputField";
import {w,h} from '../api/Dimensions'
//external
import { accelerometer, SensorTypes, setUpdateIntervalForType, gyroscope, } from 'react-native-sensors';
import TimerMixin from 'react-timer-mixin'
//uploading file
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from 'react-native-firebase'
import { NavigationActions } from 'react-navigation';

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

//audio files
const Sound = require('react-native-sound')
let  finishSound,startSound;

export default class AccelerometerSensor extends React.Component {
  state = {
    accelerometerData: {},
    gyroscopeData :{},
    userName : '',
    pathToWrite : '',
    accelValues : [[0,0,0]],
    gyroValues : [[0,0,0,0]],
    values : [[1,2,3,4,5,6,7]],
    fileName : '',
    time : '',
    readStoragePermission : false,
    writeStoragePermission : false
  };

  componentDidMount() {
    setUpdateIntervalForType(SensorTypes.accelerometer, 400);
    setUpdateIntervalForType(SensorTypes.gyroscope, 400);
    finishSound = new Sound('exercisefinished.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
      console.log('failed to load the sound', error);
      return;
     }
    })
    startSound = new Sound('starttest.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
      console.log('failed to load the sound', error);
      return;
     }
    })
    //  this.readStorage()
    // this.writeStorage()
  }

  componentWillUnmount() {
  }
  readStorage = async function requestReadStoragePermission() {
    //alert('entered')
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'App Storage Permission',
          message:
            ' App needs access to your storage ' +
            'so you can store and upload results',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({readStoragePermission : true})
      }else{
        alert('need storage permission to continue')
      }
    } catch (err) {
      console.warn(err);
    }
  }
  writeStorage = async function requestWriteStoragePermission() {
    //alert('entered')
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App Storage Permission',
          message:
            ' App needs access to write files in your storage ' +
            'so you can store and upload results',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({writeStoragePermission : true})
      }else{
        alert('need storage permission to continue')
      }
    } catch (err) {
      console.warn(err);
    }
  }
  _start = () =>{
    //set user details and 
    const userEmail = this.props.navigation.getParam('userName')
    this.setState({userName : userEmail.split('@')[0]})
    //get time value
    let time
    const timeInput =  parseInt(this.state.time)
    if( timeInput >0 && timeInput <= 60){
        time = timeInput * 1000
    }else{
      time = 20000
    }
    //subscribe to sensors
    startSound.play()
    //subscribe to sensors
    TimerMixin.setTimeout(() =>{
      //alert('starting subscription')
      this._subscribe()
      TimerMixin.setTimeout(() => {
        this._unsubscribe()
        this._combineArray()
        finishSound.play()
      }, time);
    },3500)
    //set timeInterval
   
  }

  _combineArray = () => {
    //get array values
    accelArray = this.state.accelValues
    gyroArray = this.state.gyroValues
    const valueArray = []
    for( i=0; i<accelArray.length; i++){
      valueArray[i] = accelArray[i].concat(gyroArray[i])
    }
    //setting sensor values
   this.setState({values : valueArray})
   this._write()
  }

  _reset = () =>{
    this._unsubscribe()
    this.setState({accelValues:[],gyroValues:[],values:[]})
  }

  _subscribe = () => {
    // activating sensors
    this._accelerometerSubscription = accelerometer._subscribe(
      ({ ax, ay, az, timestamp })=> {
        const accelValues = [...this.state.accelValues,[ax, ay, az]]
        this.setState( {accelerometerData  :{  ax, ay, az ,timestamp },accelValues});
      }
    );
    this._gyroscopeSubscription = gyroscope._subscribe(
      ({ gx, gy, gz, timestamp })=> {
        const gyroValues = [...this.state.gyroValues,[gx, gy, gz, timestamp]]
        this.setState({gyroscopeData  :{  gx, gy, gz ,timestamp },gyroValues});
      }
    );
  };

  _unsubscribe = () => {
    //deactivating sensors
    this._accelerometerSubscription.unsubscribe()
    this._gyroscopeSubscription.unsubscribe()
    this.setState({time : ''})
  };

  _write = () => {
  //setting csv file data
  const headerString = 'ax,ay,az,gx,gy,gz,timestamp\n';
  const values = this.state.values
  const rowString = values.map(d => `${d[0]},${d[1]},${d[2]},${d[3]},${d[4]},${d[5]},${d[6]}\n`).join('');
  const csvString = `${headerString}${rowString}`;
  const systemPath = `${RNFetchBlob.fs.dirs.DownloadDir}/`;
  const dateArray = new Date().toString().split(' ')
  const timeString = dateArray[4].split(':').join('@')
  const date = dateArray[0]+dateArray[2]+dateArray[1]+timeString
  const userName = this.state.userName
  //setting filename in state
  this.setState ({pathToWrite :systemPath+date+userName+'.csv',fileName : date+userName+'.csv' })
  const pathToWrite = this.state.pathToWrite
  //writing file to local storage
  RNFetchBlob.fs
  .writeFile(pathToWrite, csvString, 'utf8')
  .then(() => {
    //setting sound 
      this._upload()
    })
    .catch(error => console.error(error));
  }

  _upload = () => {

    let pathToWrite = this.state.pathToWrite
    let userName = this.state.userName
    let fileName = this.state.fileName
    //uploading file to firebase storage
    firebase.storage()
    .ref().child(`${userName}/test2/${fileName}`)
    .putFile(pathToWrite)
    .then(uploadedFile => {
        //success
        alert('success')
    })
    .catch(err => {
        //Error
        alert(err)
    });

  }  

  render() {
    let {
      ax,
      ay,
      az,
    } = this.state.accelerometerData; 
     let {
      gx,
      gy,
      gz,
    } = this.state.gyroscopeData; 

    return (
      <View style={styles.container}>
      <Text style = {styles.mainHeader}>Testing Postural Tremor </Text>
      <Text style ={styles.sensorText}>Accelerometer :</Text>
      <Text style = {styles.sensorData}>
          x: {round(ax)} y: {round(ay)} z: {round(az)}
      </Text>
      <Text style = {styles.sensorText}>Gyroscope :</Text>
      <Text style ={styles.sensorData}>
          x: {round(gx)} y: {round(gy)} z: {round(gz)}
      </Text>
      <View style = {styles.textInputContainer}>
         <TextInput
          keyboardType = 'numeric'
          underlineColorAndroid='transparent'
          placeholderTextColor="black"
          placeholder="Enter Time"
          onChangeText = {(time) => this.setState({time})}
          style={styles.textInput}
          value = {this.state.time}
          ref={ref => this.time = ref}
        />
      </View>
      <View style = {styles.howTo}>
        <TouchableOpacity onPress={() =>this.props.navigation.navigate('ExplainTest', {userName :this.props.navigation.getParam('userName'),value : 2 })} style={styles.howToButton}>
            <Text style ={styles.buttonText}>How to perform test?</Text>
          </TouchableOpacity>
        </View>
      <View style={styles.buttonMainContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() =>this.props.navigation.navigate('StartTest1' ,{userName : this.props.navigation.getParam('userName')})} style={styles.button}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
        <View style = {styles.buttonContainer}>
          <TouchableOpacity onPress={this._start} style={styles.button}>
            <Text>Start</Text>
          </TouchableOpacity>
        </View>
        <View style = {styles.buttonContainer} >
          <TouchableOpacity onPress={() =>this.props.navigation.navigate('StartTest3',{userName : this.props.navigation.getParam('userName')})} style={styles.button}>
            <Text>Next Test</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : '#2c3e50'
    // backgroundColor : '#FF4500'
  },
  displayText:{
   color : 'white'
  },
  sensorText : {
   textAlign : 'center',
   color : 'white',
   paddingBottom : h(3),
   fontSize : h(3)
  },
  sensorData : {
    textAlign : 'center',
    justifyContent : 'center',
    alignItems : 'center',
    color : 'white',
    fontSize : h(3),
    paddingBottom : h(3)
  },
  howTo:{
    flexDirection: 'row',
    justifyContent : 'center'
  },
  mainHeader : {
   color : 'white',
   fontSize : h(3),
   textAlign : 'center',
   paddingTop: h(3),
   paddingBottom : h(3)
  },
  textInputContainer:{
    alignItems : 'center',
    paddingBottom : h(3),
    paddingTop : h(3)
  },
  textInput : {
    width : w(30),
    backgroundColor: 'lightblue',
    borderRadius : 15,
    textAlign : 'center',
  },
  buttonMainContainer :{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex : 1
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   justifyContent : 'center'
  // },
  button: {
    width: '75%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(3),
    backgroundColor: '#888',
    borderRadius: w(10),
    marginTop: h(2),
  },
  howToButton:{
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(3),
    backgroundColor: '#888',
    borderRadius: w(10),
    marginTop: h(2),
  },
  buttonText:{
    color: 'white'
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});