import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import InputField from "../../components/InputField";
import {w, h, totalSize} from '../../api/Dimensions';
import GetStarted from './GetStarted';
import Firebase from '../../api/Firebase';
import { NavigationActions } from 'react-navigation';

const companyLogo = require('../../assets/companylogo.png');
const email = require('../../assets/email.png');
const password = require('../../assets/password.png');

export default class Login extends Component {

  state = {
    isEmailCorrect: false,
    isPasswordCorrect: false,
    isLogin: false,
  };

  getStarted = () => {
    const email = this.email.getInputValue();
    const password = this.password.getInputValue();

    this.setState({
      isEmailCorrect: email === '',
      isPasswordCorrect: password === '',
    }, () => {
      if(email !== '' && password !== ''){
        this.loginToFireBase(email, password);
      } else {
        alert('Fill up all fields')
      }
    });
  };

  changeInputFocus = name => () => {
    if (name === 'Email') {
      this.setState({ isEmailCorrect: this.email.getInputValue() === '' });
      this.password.input.focus();
    } else {
      this.setState({ isPasswordCorrect: this.password.getInputValue() === '' });
    }
  };

  loginToFireBase = (email, password) => {
    this.setState({ isLogin: true });
    Firebase.userLogin(email, password)
      .then(user => {
        //if(user) this.props.success(user);
        if(user){
          this.props.navigation.navigate('DashBoard')
          const setParamsAction = NavigationActions.setParams({
          params: { userName : email },
          key: 'StartTest1'
          });
          this.props.navigation.dispatch(setParamsAction);
          //profile scrren params
          const setProfileParams = NavigationActions.setParams({
          params: { userName : email },
          key: 'Profile'
          });
          this.props.navigation.dispatch(setProfileParams)
        }else{
        this.setState({ isLogin: false });

        }
        //this.setState({ isLogin: false });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.icon} resizeMode="contain" source={companyLogo}/>
        <InputField
          placeholder="Email"
          keyboardType="email-address"
          style={styles.email}
          error={this.state.isEmailCorrect}
          focus={this.changeInputFocus}
          ref={ref => this.email = ref}
          icon={email}
        />
        <InputField
          placeholder="Password"
          returnKeyType="done"
          secureTextEntry={true}
          blurOnSubmit={true}
          error={this.state.isPasswordCorrect}
          ref={ref => this.password = ref}
          focus={this.changeInputFocus}
          icon={password}
        />
        <GetStarted
          click={this.getStarted}
          isLogin={this.state.isLogin}
        />
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')} style={styles.touchable} activeOpacity={0.6}>
            <Text style={styles.createAccount}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')} style={styles.touchable} activeOpacity={0.6}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor : 'black'
  },
  icon: {
    width: w(50),
    height: h(25),
    marginTop: h(8),
    marginBottom: h(5),
  },
  textContainer: {
    width: w(80),
    flexDirection: 'row',
    marginTop: h(5),
  },
  email: {
    marginBottom: h(4.5),
  },
  touchable: {
    flex: 1,
  },
  createAccount: {
    color:'yellow',
    textAlign: 'center',
    fontSize: totalSize(2),
    fontWeight: '600',
  },
  forgotPassword: {
    color:'yellow',
    textAlign: 'center',
    fontSize: totalSize(2),
    fontWeight: '600',
  },
});
