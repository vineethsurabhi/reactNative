import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View , Dimensions} from 'react-native';
import { createSwitchNavigator, createAppContainer, createBottomTabNavigator, createStackNavigator,withNavigation } from 'react-navigation'
// import LoggedOut from './src/screens/LoggedOut'
// import LogIn from './src/screens/LogIn'
// import ForgotPassword from './src/screens/ForgotPassword'
//import Home from './src/screens/Home'
import LogIn from './src/screens/Login/index'
import Register from './src/screens/Register/index'
import ForgotPassword from './src/screens/ForgotPassword/index'

import Profile from './src/screens/Profile'
//import Test from './src/screens/Test'
import Response from './src/screens/Response'
import Videos from './src/screens/Videos'

import StartTest1 from './src/screens/StartTest1'
import StartTest2 from './src/screens/StartTest2'
import StartTest3 from './src/screens/StartTest3'
import ExplainTest from './src/screens/ExplainTest'


import firebase from "firebase"; 
// import Firebase from './src/api/Firebase';


import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const config = {  
  apiKey: "AIzaSyB2yuFlsVaP_4lAZSys7LMlmcFunVcdbEo",  
  authDomain: "database-63fe1.firebaseapp.com",  
  databaseURL: "https://database-63fe1.firebaseio.com/",  
  projectId: "database-63fe1",  
  storageBucket: "database-63fe1.appspot.com",  
  //messagingSenderId: "xyz"  
};  
firebase.initializeApp(config);
//import config from './src/common/constants.js';
//const user = Firebase.userId()
//alert('user' ,user)

const { width, height } = Dimensions.get("window");
const Test = createSwitchNavigator({
  StartTest1 : {screen : StartTest1},
  StartTest2 : {screen : StartTest2},
  StartTest3 : {screen : StartTest3},
  ExplainTest : {screen : ExplainTest},
})

const DashboardTabNavigator = createBottomTabNavigator({
  Profile,
  Test,
  Response,
  Videos,
},{
  navigationOptions : ({navigation}) =>{
    const {routeName} = navigation.state.routes[navigation.state.index]
    return{
      headerTitle : routeName,
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  },
  tabBarOptions: {
    pressColor: "blue",
    indicatorStyle: {
      opacity: 0
    },
    allowFontScaling: true,
  
    upperCaseLabel: false,
    showLabel: true,
    activeTintColor: "red",
    labelStyle: {
      fontSize: 20,
      textAlign: "center",
      marginBottom : 5
    },
    showIcon: true,
    style: {
      // borderTopWidth: 0,
      backgroundColor: "#221f1f",
      //tabBarButtonColor: "#000",
      //navBarTextFontSize: 34,
      // forceTitlesDisplay: true,
      // tabFontFamily: "Avenir-Medium"
    }
  }
},
 
)
const DashboardStackNavigator = createStackNavigator({
  DashboardTabNavigator : DashboardTabNavigator
})

const AppSwitchNavigator = createSwitchNavigator({
  LogIn : {screen : LogIn},
  Register : {screen : Register},
  ForgotPassword : {screen : ForgotPassword},
  DashBoard : {screen : DashboardStackNavigator}
})
const AppContainer = createAppContainer(AppSwitchNavigator)

class App extends Component {

  render(){
    return(
      <AppContainer />
    )
  }
}

export  default App
// import React, {Component} from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import RNFetchBlob from 'react-native-fetch-blob';
// import firebase from 'react-native-firebase'

// const values = [
//   ['build', '2017-11-05T05:40:35.515Z'],
//   ['deploy', '2017-11-05T05:42:04.810Z']
// ];

// const headerString = 'event,timestamp\n';
// const rowString = values.map(d => `${d[0]},${d[1]}\n`).join('');
// const csvString = `${headerString}${rowString}`;
// const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/data.csv`;

// // Prepare Blob support
// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
// window.Blob = Blob


// export default class App extends Component{
//   constructor(){
//     super()
//     this.state = {
//       accelerometer : {}
//       }
//     }

  
//   _write = () => {

//     RNFetchBlob.fs
//     .writeFile(pathToWrite, csvString, 'utf8')
//     .then(() => {
//       console.log(`wrote file ${pathToWrite}`);
//       // wrote file /storage/emulated/0/Download/data.csv
//     })
//     .catch(error => console.error(error));

//   }  

//   _upload = () => {

//     firebase.storage()
//     .ref('/files')
//     .putFile(pathToWrite)
//     .then(uploadedFile => {
//         //success
//     })
//     .catch(err => {
//         //Error
//     });

//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <View >
//           <TouchableOpacity onPress={this._write.bind(this)} >
//             <Text>write</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={this._upload.bind(this)} >
//             <Text>upload</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
