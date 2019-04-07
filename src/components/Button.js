import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Image,StyleSheet } from 'react-native';
import pressImg from '../img/press.png'
import {w,h} from '../api/Dimensions'
const IMAGE_SIZE = 67;

export default class Button extends Component {
  constructor(props){
        super()

  }
  render() {
    return (
      <View style ={[styles.imageSize,this.props.posistion]} >
        <TouchableWithoutFeedback onPress = {this.props.onClick()} >
            <View>
                <Image style ={styles.imageSize}source ={pressImg} />
            </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    imageSize :{
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
      }
})