/* TODO: set fonts and polish styling */
import { StatusBar as ExpoStatusBar } from "expo-status-bar"; //Notch Settings for Android
import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  StatusBar,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  //TouchableWithoutFeedback,
} from "react-native";

// Test data
// const stageDict = {
//   "5-3": 150,
//   "5-2": 125,
//   "5-1": 100,
//   "4-3": 90,
//   "4-2": 80,
//   "4-1": 75,
//   "3-3": 70,
//   "3-2": 60,
//   "3-1": 50,
//   "2-3": 45,
//   "2-2": 30,
//   "2-1": 25,
//   "1-1": 10,
// };

// const craftDict = {
//   "item 1": 2,
//   "item 2": 2,
//   "item 3": 3,
// };

// let picPath = '';

export default class App extends Component {
  state = {
    data: [],
    matReq: [],
    isLoaded: false,
    picPath: ''
  };

  constructor() {
    super();
    /**
     * Returns true if the screen is in portrait mode
     */
    const isPortrait = () => {
      const dim = Dimensions.get("screen");
      return dim.height > dim.width;
    };

    this.state = {
      orientation: isPortrait() ? "portrait" : "landscape",
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener("change", () => {
      this.setState({
        orientation: isPortrait() ? "portrait" : "landscape",
      });
    });
  }

  showSelected = (picPath) => {
    //fetch item here
    let item = "Orirock";
    return (
      <View style={styles.borderedIcon}>
        <Image
          //blurRadius={1}
          fadeDuration={1000}
          style={styles.icon}
          source={picPath}
          resizeMode="stretch"
        />
        <Text style={styles.text}>{item}</Text>
      </View>
    );
  };

  showStageEntry = (stage, percentage) => {
    //Formats section's item
    return (
      <View style={styles.sectionItem}>
        <Text style={styles.itemText}>{stage}</Text>
        <Text style={styles.descriptorText}>{percentage}%</Text>
      </View>
    );
  };

  showCraftEntry = (item, number) => {
    return (
      <TouchableOpacity>
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
          <Text style={styles.text}>
            {item} (x{number})
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  showSections = () => {
    //Retrieves all stage data and formats section and title
    //assuming data is key pair values - {stage:percentage}
    let stageContent = [];
    let craftContent = [];
    let stageDict = this.state.isLoaded && this.state.data.data.drop ? this.state.data.data.drop : [];
    let craftDict = this.state.isLoaded && this.state.matReq ? this.state.matReq : [];
    // for (let key in stageDict) {
    //   stageContent.push(this.showStageEntry(key, stageDict[key]));
    // }

    stageDict.forEach((item) => {
      stageContent.push(this.showStageEntry(item.stageName, item.dropRate));
    });

    // for (let key in craftDict) {
    //   craftContent.push(this.showCraftEntry(key, craftDict[key]));
    // }

    craftDict.forEach((item) => {
      craftContent.push(this.showCraftEntry(item.name, item.amount));
    })

    return (
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.title}>Stage Drops</Text>
        </View>
        <View style={styles.sectionBody}>{stageContent}</View>

        <View style={styles.sectionTitle}>
          <Text style={styles.title}>Crafting Materials</Text>
        </View>
        <View style={styles.sectionBody}>{craftContent}</View>
      </View>
    );
  };

  componentDidMount() {
    let picPath = '../../assets/Graphic/Material/' + this.props.route.params.data.data.picId;
    // console.log(picPath);
    this.setState({ data: this.props.route.params.data });
    this.setState({picPath: picPath})
    this.setState({matReq: this.props.route.params.matReq})
    this.setState({ isLoaded: true });
    console.log(this.state.isLoaded ? this.state.picPath : "LOL");
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {this.state.isLoaded ? this.state.data.data.name : ""}
          </Text>
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

        <View
          style={{
            flex: this.state.orientation === "portrait" ? 1 : 0.9,
            flexDirection:
              this.state.orientation === "portrait" ? "column" : "row",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.iconArea}>{this.showSelected(this.state.picPath)}</View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
          >
            {this.showSections()}
          </ScrollView>
        </View>

        <ExpoStatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282828",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flex: 0.1,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
  },
  subcontainer: {
    flex: 0.9,
  },
  iconArea: {
    flex: 0.3,
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
    marginBottom: 30,
    justifyContent: "flex-start",
  },
  sectionItem: {
    flexDirection: "row",
    margin: 15,
    width: "35%",
  },
  icon: {
    margin: 2,
    width: 70,
    height: 70,
  },
  borderedIcon: {
    width: 100,
    height: 100,
    margin: 15,
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
