import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Picker,
    TextInput
} from 'react-native';

import styles from '../../assets/Stylesheet/styles.js';
import picker from '../../assets/Stylesheet/picker.js';

class BuildMatModule extends Component {
    state = {
        building: "none",
        currentPhase: 0,
        targetedPhase: 0
    }

    calculateBuildMat(building, currentPhase, targetedPhase) {
        // let buildingData = {
        //     controlCenter: {
        //         maxPhase: 5,
        //     },
        //     dormitory: {
        //         maxPhase: 5,
        //         1: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         },
        //         2: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         },
        //         3: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         },
        //         4: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         },
        //         5: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         }
        //     },
        //     powerPlant: {
        //         maxPhase: 3
        //     },
        //     factory: {
        //         maxPhase: 3
        //     },
        //     tradingPost: {
        //         maxPhase: 3
        //     },
        //     receptionRoom: {
        //         maxPhase: 3
        //     },
        //     workshop: {
        //         maxPhase: 3
        //     },
        //     office: {
        //         maxPhase: 3
        //     },
        //     trainingRoom: {
        //         maxPhase: 3
        //     }
        // };
    }

    render() {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.building}
                        onValueChange={(itemValue, itemIndex) => this.setState({building: itemValue})}
                    >
                        <Picker.Item label="Select the building you want tp build" value="none"/>
                        <Picker.Item label="Control Center" value="controlCenter"/>
                        <Picker.Item label="Dormitory" value="dormitory"/>
                        <Picker.Item label="Power Plant" value="powerPlat"/>
                        <Picker.Item label="Factory" value="factory"/>
                        <Picker.Item label="Trading Post" value="tradingPost"/>
                        <Picker.Item label="Reception Room" value="receptionRoom"/>
                        <Picker.Item label="Workshop" value="workshop"/>
                        <Picker.Item label="Office" value="office"/>
                        <Picker.Item label="Training Room" value="trainingRoom"/>
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Current Phase"
                    value={this.input}
                    onChangeText={(input) => this.setState({currentPhase: input})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Targeted Phase"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedPhase: input})}
                />
                <TouchableOpacity
                    onPress={() => this.calculateBuildMat(this.state.building, parseInt(this.state.currentPhase), parseInt(this.state.targetedPhase))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
            </View>
        ) 
    }
}

export default BuildMatModule;