import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button } from "react-native";
import * as Sensors from "react-native-sensors";
import TimerMixin from 'react-timer-mixin';


const Value = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
);

export default function(sensorName, values) {
  const sensor$ = Sensors[sensorName];

  return class SensorView extends Component {
    constructor(props) {
      super(props);

      const initialValue = values.reduce(
        (carry, val) => ({ ...carry, [val]: 0 }),
        {}
      );
      this.state = {
          initialValue : initialValue,
           value : 0,
           text : ''
      };
      this.submitAndClear =this.submitAndClear.bind(this)
      this.writeText = this.writeText.bind(this)
    }
    submitAndClear = () => {
        this.props.writeText(this.state.text)
      
        this.setState({
          text: ''
        })
      }
    writeText = text => {
        this.setState({
          text: text
        })
    }  

    startTest = ()=>{
        const subscription = sensor$.subscribe(values => {
            this.setState({ ...values });
          });
        this.setState({ subscription });
  
        TimerMixin.setTimeout(() =>{
        this.state.subscription.unsubscribe();
        //this.setState({ subscription: null });   
        },6000)


    }

    // componentWillMount() {
    //   const subscription = sensor$.subscribe(values => {
    //     this.setState({ ...values });
    //   });
    //   this.setState({ subscription });
    // }

    // componentWillUnmount() {
    //   this.state.subscription.unsubscribe();
    //   this.setState({ subscription: null });
    // }

    render() {
      return (
            <View style={styles.container}>
            <Text style={styles.headline}>{sensorName} values</Text>
            {values.map(valueName => (
                <Value
                key={sensorName + valueName}
                name={valueName}
                value={this.state[valueName]}
                />
            ))}
            <View>
            <View>
            <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            clearButtonMode='always'
            />
            <Button
            onPress={this.submitAndClear}
            title='Submit'
            color='#841584'
            accessibilityLabel='Learn more about this purple button'      
            placeholder='Enter Time '
            />
        </View>
        <TouchableOpacity onPress = {this.startTest}>
                <Text>Start Test</Text>
        </TouchableOpacity>
        </View>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    marginTop: 50
  },
  headline: {
    fontSize: 30,
    textAlign: "left",
    margin: 10
  },
  valueContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  valueValue: {
    width: 200,
    fontSize: 20
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: "bold"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});