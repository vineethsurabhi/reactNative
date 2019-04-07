// import React, { Component } from 'react';
// import { Text, View } from 'react-native';

// export default class HelloWorldApp extends Component {
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Test</Text>
//       </View>
//     );
//   }
// }


import React, { Component } from "react";
import { ScrollView } from "react-native";
import SensorView from "./SensorView";

const axis = ["x", "y", "z"];

const availableSensors = {
  accelerometer: axis,
  gyroscope: axis,
  // magnetometer: axis,
  // barometer: ["pressure"]
};
const viewComponents = Object.entries(availableSensors).map(([name, values]) =>
  SensorView(name, values)
);

export default class App extends Component {
  render() {
    return (
      <ScrollView>
        {viewComponents.map((Comp, index) => <Comp key={index} />)}
      </ScrollView>
    );
  }
}