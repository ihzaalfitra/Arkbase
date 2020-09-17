import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import firebase from "../assets/Firebase/FirebaseDatabase.js";
import styles from "../assets/Stylesheet/styles.js";
import picker from "../assets/Stylesheet/picker.js";

//List of all the custom font
let customFonts = {
  'Butler-Regular-Stencil': require('../assets/Butler_Regular_Stencil.otf'),
};

class SanityCalculator extends Component {
  state = {
    fontsLoaded: false,
    errorStatement: -1,
    data: this.props.lmdData,
    stage: 0,
    ownedValue: 0,
    targetedValue: 0,
    timeAmount: 0, // Value is in minutes
    date: "",
    time: 0,
    useMonthlyPackage: false,
    useNotification: false,
  };

  //method to load the font
  _loadFontsAsync = async() => {
    await Font.loadAsync(customFonts);
    this.setState({fontsLoaded: true});
}

  // --Notification Functions--
  setNotification(value, target) {
    let msValue = value * 60000;
    console.log("Notification activated, time value set to " + msValue + "ms");

    // Notification content when timer has elapsed
    const localNotification = {
      title: "Arkbase",
      body: "Your target sanity value of " + target + " has been reached!",
    };

    // Schedules the notification - note: make sure input (time)
    // is in the correct format (ms)
    const schedulingOptions = {
      time: new Date().getTime() + Number(msValue),
    };

    // Notifications show only when app is not active.
    // (ie. another app being used or device's screen is locked)
    // Set notification (when user sets timer)
    const showToastWithGravity = () => {
      ToastAndroid.showWithGravityAndOffset(
        "Your sanity timer has been set! Expected time: " + value + " minutes",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    };
    showToastWithGravity();
    // Scheduled notification
    Notifications.scheduleLocalNotificationAsync(
      localNotification,
      schedulingOptions
    );
  }

  handleNotification() {
    // If the app needs to do something when notification is sent, put it here
    //console.warn("Notification Sent!");
  }

  async componentDidMount() {
    // Prompt notification permissions for ios
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // If we want to do something with the notification when the app
    // is active, we need to listen to notification events and
    // handle them in a callback
    Notifications.addListener(this.handleNotification);
    this._loadFontsAsync();
    
  }
  // End of notif functions
  // Note: Activate with setNotification

  calculateSanity(owned, target, useMonthlyPackage) {
    let ownedRaw = owned;
    let targetRaw = target;
    if (owned == "") {
      owned = 0;
    } else {
      owned = parseInt(owned);
    }
    target = parseInt(target);
    if (isNaN(owned)) {
      this.setState({ errorStatement: "Owned amount must be a number." });
    } else if (
      ownedRaw > Number.MAX_SAFE_INTEGER ||
      targetRaw > Number.MAX_SAFE_INTEGER
    ) {
      this.setState({ errorStatement: "Value too big" });
    } else if (owned >= target) {
      this.setState({
        errorStatement:
          "Current amount cannot be greater or equal than targeted amount.",
      });
    } else if (target <= 0 || isNaN(target)) {
      this.setState({
        errorStatement:
          "Target amount must be a number and cannot be zero or blank.",
      });
    } else {
      this.setState({ errorStatement: "" });
    }
    target = target - owned;
    let timeAmount = target * 6;
    var d = new Date(); // get current date
    d.setHours(d.getHours(), d.getMinutes() + timeAmount, d.getSeconds(), 0);
    this.setState({ date: d.toLocaleDateString() });
    this.setState({ time: d.toLocaleTimeString() });
    this.setState({ timeAmount: timeAmount });
  }

  getResult() {
    if (this.state.errorStatement == "") {
      return (
        <View style={{ width: "80%" }}>
          <Text style={styles.textRequire}>
            Estimated time to target sanity: {parseInt(this.state.timeAmount)}{" "}
            minutes
          </Text>
          <Text style={styles.textLeft}>Date: {this.state.date} </Text>
          <Text style={styles.textLeft}>Time:{this.state.time} </Text>
          <TouchableOpacity
            onPress={() => {
              this.setNotification(
                this.state.timeAmount,
                this.state.targetedValue
              );
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Set Notification</Text>
          </TouchableOpacity>
        </View>
      );
      //uninitialized errorStatement
    } else if (this.state.errorStatement == -1) {
      return null;
      //errorStatement was thrown
    } else {
      return (
        <View>
          <Text style={styles.textError}>{this.state.errorStatement}</Text>
        </View>
      );
    }
  }
  //change the style of component underline if there's an error
  styleUnderline(value, componentType, component) {
    //check whether error statement is thrown or not. if not, use normal color
    if (this.state.errorStatement == ("" || -1)) {
      return styles.input;
    } else {
      switch (component) {
        //input component error parameter, must be specifically to each of the input to make the error specific
        case "ownedValue":
          if (value == "") {
            value = 0;
          } else {
            value = parseInt(value);
          }
          if (isNaN(value)) {
            return styles.inputError;
          } else {
            return styles.input;
          }
          break;
        case "targetedValue":
          if (value <= 0 || isNaN(value)) {
            return styles.inputError;
          } else {
            return styles.input;
          }
          break;
        default:
          return styles.input;
          break;
      }
    }
  }

  render() {
    switch(this.state.fontsLoaded) {
      case false:
        return <AppLoading/>
      case true:
        return (
          <KeyboardAvoidingView
            style={{ flex: 9, backgroundColor: "#000", paddingTop: 35 }}
          >
            <ScrollView
              ref={(ref) => (this.scrollView = ref)}
              onContentSizeChange={() => {
                this.scrollView.scrollToEnd({ animated: true });
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#000",
                }}
              >
                <Text style={[styles.header, {fontFamily: 'Butler-Regular-Stencil', fontSize: 50, marginHorizontal: 20}]}>Sanity Calculator</Text>
                <View style={picker.container}>
                  <TextInput
                    style={this.styleUnderline(
                      this.state.ownedValue,
                      "textInput",
                      "ownedValue"
                    )}
                    placeholder="Current sanity"
                    value={this.input}
                    onChangeText={(input) => this.setState({ ownedValue: input })}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={this.styleUnderline(
                      parseFloat(this.state.targetedValue),
                      "textInput",
                      "targetedValue"
                    )}
                    placeholder="Target sanity"
                    value={this.input}
                    onChangeText={(input) =>
                      this.setState({ targetedValue: input })
                    }
                    keyboardType="numeric"
                  />
                  {/*
                    <View style={{width:'80%',flexDirection:'row',alignItems:'center',marginTop:25,marginBottom:-25}}>
                      <CheckBox tintColors={{ true: 'white', false: 'white' }} value={this.state.useMonthlyPackage} onValueChange={(val) => this.setState({useMonthlyPackage:val})}/>
                      <Text style={styles.textLeft}>Use monthly package</Text>
                    </View>
                  */}
                  <TouchableOpacity
                    onPress={() => {
                      this.calculateSanity(
                        this.state.ownedValue,
                        this.state.targetedValue,
                        this.state.usemuseMonthlyPackage
                      );
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Calculate</Text>
                  </TouchableOpacity>
                  {this.getResult()}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );
    }
    
  }
}

export default SanityCalculator;
