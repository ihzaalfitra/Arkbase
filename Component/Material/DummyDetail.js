import { StatusBar as ExpoStatusBar } from "expo-status-bar"; //Notch Settings for Android
import React, { Component } from "react";
import {
    StyleSheet,
    StatusBar,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    Image
} from "react-native";

export default class Dummy extends Component {
    state = {
        database: [],
        isLoaded: false
    }

    showDropStage() {
        if(!this.state.database.data.drop) {
            return(
                <Text> - </Text>
            )
        }
        else {
            let output = this.state.database.data.drop.map((item, index) => {
                return <Text>{item.stageName}: {item.dropRate}%</Text>
            })
            return output;
        }
    }
    
    componentDidMount() {
        this.setState({database: this.props.route.params.data});
        this.setState({isLoaded: true})
    }

    render() {
        if(this.state.isLoaded) {
            return(
                <View>
                    <Text>{this.state.database.data.name}</Text>
                    {this.showDropStage()}
                </View>
            );
        }
        else {
            return(
                <View>

                </View>
            )
        }
    }
}