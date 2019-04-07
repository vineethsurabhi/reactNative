// import React, { Component } from 'react';
// import { Text, View ,StyleSheet, TouchableOpacity} from 'react-native';

// export default class HelloWorldApp extends Component {
//   constructor(){
//     super()
//   }
//   render() {
//     return (
//       <View style={styles.mainContainer}>
//         <Text>Profile</Text>
//         <TouchableOpacity onPress={() =>this.props.navigation.navigate('LogIn')} activeOpacity={0.6} style={styles.button}>
//           <Text style={styles.buttonText}>LogOut</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   button: {
//     width: w(85),
//     marginTop: h(6),
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#888',
//     paddingVertical: w(1.8),
//     borderRadius: w(25),
//     borderColor: '#E0E0E0',
//     borderWidth: 1,
//   },
//   mainContainer:{
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center" ,
//     backgroundColor : 'black'
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: '600',
//     paddingVertical: h(1),
//     fontSize: totalSize(2),
//   },

// })
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { w, h, totalSize } from "../api/Dimensions";
import ParkinsonImg from '../img/parkinson.jpg'

export default class UserProfileView extends Component {

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
                <Image style={styles.avatar}
                  source={ParkinsonImg}/>

                {/* <Text style={styles.name}>John Doe </Text> */}
                <Text style={styles.userInfo}>{this.props.navigation.getParam('userName')}</Text>
                {/* <Text style={styles.userInfo}>Florida </Text> */}
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.item}>
              {/* <View style={styles.iconContent}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/home/win8/50/ffffff'}}/>
              </View> */}
              <View style={styles.infoContent}>
                <Text onPress={() =>this.props.navigation.navigate('LogIn')} style={styles.info}>Sign Out</Text>
              </View>
            </View>

            {/* <View style={styles.item}>
              <View style={styles.iconContent}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/settings/win8/50/ffffff'}}/>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.info}>Settings</Text>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.iconContent}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/news/win8/50/ffffff'}}/>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.info}>News</Text>
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.iconContent}>
                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/shopping-basket/ios11/50/ffffff'}}/>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.info}>Shop</Text>
              </View>
            </View> */}

          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#DCDCDC",
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  name:{
    fontSize:22,
    color:"#000000",
    fontWeight:'600',
  },
  userInfo:{
    fontSize:16,
    color:"#778899",
    fontWeight:'600',
  },
  body:{
    backgroundColor: "#778899",
    height:500,
    alignItems:'center',
  },
  item:{
    flexDirection : 'row',
  },
  infoContent:{
    flex:1,
    alignItems:'center',
    paddingLeft:5
  },
  iconContent:{
    flex:1,
    alignItems:'flex-end',
    paddingRight:5,
  },
  icon:{
    width:30,
    height:30,
    marginTop:20,
  },
  info:{
    fontSize:18,
    marginTop:20,
    color: "#FFFFFF",
  }
});