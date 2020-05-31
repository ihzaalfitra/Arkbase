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

class SkillModule extends Component {
    state = {
        targetedSummary: -1,
        targetedAmount: 0,
        recommendedStage: "none",
        totalRun: 0,
        totalSanity: 0,
        overflow: 0
    }

    calculateSkill(targetedSummary, targetedAmount) {
        let data = {
            1: {
                stageName: "CA-2",
                sanityUsed: 15,
                dropAmount: 5
            },
            2: {
                stageName: "CA-3",
                sanityUsed: 20,
                dropAmount: 3
            },
            3: {
                stageName: "CA-5",
                sanityUsed: 30,
                dropAmount: 2
            }
        };
        let stageName;
        let sanityUsed;
        let dropAmount;
        let runAmount;
        let overflow;

        if(targetedSummary == -1) {
            stageName = "None";
            sanityUsed = 0;
            dropAmount = 0;
            runAmount = 0;
            overflow = 0;
        }
        else {
            stageName = data[targetedSummary]["stageName"];
            sanityUsed = data[targetedSummary]["sanityUsed"];
            dropAmount = data[targetedSummary]["dropAmount"];
            runAmount = Math.ceil(targetedAmount / dropAmount);
            overflow = 0;
        }
            
        this.setState({recommendedStage: stageName});
        this.setState({totalRun: runAmount});
        this.setState({totalSanity: runAmount*sanityUsed});
        this.setState({overflow: overflow});
    }

    render() {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.targetedSummary}
                        onValueChange={(itemValue, itemIndex) => this.setState({targetedSummary: itemValue})}
                    >
                        <Picker.Item label="Select Skill Summary you want" value={-1}/>
                        <Picker.Item label="Skill Summary -1" value={1}/>
                        <Picker.Item label="Skill Summary -2" value={2}/>
                        <Picker.Item label="Skill Summary -3" value={3}/>
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Target Skill Summary Amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedAmount: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateSkill(parseInt(this.state.targetedSummary), parseInt(this.state.targetedAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <Text style={styles.textRequire}>Result:</Text>
                <Text style={styles.textLeft}>Recommended Stage: {this.state.recommendedStage}</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.totalRun)} run</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.totalSanity)} sanity</Text>
                <Text style={styles.textLeft}> </Text>
                <Text style={styles.textLeft}>You will get extra {parseInt(this.state.overflow)} extra Skull Summary</Text>
            </View>
        )
    }
}

export default SkillModule;