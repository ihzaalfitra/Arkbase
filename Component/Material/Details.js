/* TODO: set fonts and polish styling */
import { StatusBar as ExpoStatusBar } from "expo-status-bar"; //Notch Settings for Android
import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

//Test data
const stageDict = {
  "5-3": 150,
  "5-2": 125,
  "5-1": 100,
  "4-3": 90,
  "4-2": 80,
  "4-1": 75,
  "3-3": 70,
  "3-2": 60,
  "3-1": 50,
  "2-3": 45,
  "2-2": 30,
  "2-1": 25,
  "1-1": 10,
};

export default class App extends Component {

  state = {
    data: [],
    isLoaded: false
  }

  showSelected = () => {
    //fetch item here
    let item = "Onirock";
    return (
      <View style={styles.borderedIcon}>
        <Image
          //blurRadius={1}
          fadeDuration={1000}
          style={styles.icon}
          source={{
            width: 70,
            height: 70,
            uri: "https://picsum.photos/200",
          }}
        />
        <Text style={styles.text}>{item}</Text>
      </View>
    );
  };

  showSectionItem = (stage, percentage) => {
    //Formats section's item
    return (
      <View style={styles.sectionItem}>
        <Text style={styles.itemText}>{stage}</Text>
        <Text style={styles.descriptorText}>{percentage}</Text>
      </View>
    );
  };

  showSections = () => {
    //Retrieves all stage data and formats section and title
    //assuming data is key pair values - {stage:percentage}
    //let content = []; //Compiled content
    let sectionG = []; //Guaranteed section
    let sectionC = []; //Common section
    let sectionUC = []; //Uncommon section
    let sectionR = []; //Rare section
    let sectionVR = []; //Very rare section
    for (var key in stageDict) {
      if (stageDict[key] > 99) {
        sectionG.push(this.showSectionItem(key, stageDict[key]));
      } else if (stageDict[key] > 74) {
        sectionC.push(this.showSectionItem(key, stageDict[key]));
      } else if (stageDict[key] > 49) {
        sectionUC.push(this.showSectionItem(key, stageDict[key]));
      } else if (stageDict[key] > 24) {
        sectionR.push(this.showSectionItem(key, stageDict[key]));
      } else {
        sectionVR.push(this.showSectionItem(key, stageDict[key]));
      }
    }
    return (
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
      >
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>Guaranteed drop stages</Text>
          </View>
          {sectionG}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>Common drop stages</Text>
          </View>
          {sectionC}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>Uncommon drop stages</Text>
          </View>
          {sectionUC}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>Rare drop stages</Text>
          </View>
          {sectionR}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text style={styles.title}>Very rare drop stages</Text>
          </View>
          {sectionVR}
        </View>
      </ScrollView>
    );
  };

  componentDidMount() {
    this.setState({data: this.props.route.params.data});
    this.setState({isLoaded: true});
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{this.state.isLoaded ? this.state.data.data.name : ""}</Text>
          {/* --replace search icon here--
          <TouchableWithoutFeedback
            onPress={() => console.log("search pressed")}
          >
            <Image
              style={{
                margin: 5,
                position: "absolute",
                right: 20,
              }}
              source={require("./assets/search.png")}
            ></Image>
          </TouchableWithoutFeedback>
          */}
        </View>

        <View style={styles.iconArea}>{this.showSelected()}</View>

        {this.showSections}
        <ExpoStatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282828",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flex: 0.1,
    width: "100%",
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
  },
  iconArea: {
    flex: 0.2,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 0.7,
    width: "100%",
    backgroundColor: "#282828",
  },
  bodyContent: {
    alignItems: "center",
  },
  section: {
    width: "90%",
    marginBottom: 10,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    width: "100%",
    borderBottomColor: "#fff",
    borderBottomWidth: 2,
  },
  sectionBody: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  sectionItem: {
    flexDirection: "row",
    margin: 15,
    width: "35%",
  },
  icon: {
    margin: 2,
  },
  borderedIcon: {
    width: 100,
    height: 100,
    margin: 25,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "flex-start",
    paddingLeft: 20,
    paddingBottom: 5,
    //position: "absolute",
    //left: 15,
  },
  itemText: {
    height: 30,
    width: 60,
    fontSize: 20,
    color: "#fff",
    backgroundColor: "#000",
    textAlign: "center",
  },
  descriptorText: {
    height: 30,
    width: 60,
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  text: {
    color: "#fff",
  },
});
