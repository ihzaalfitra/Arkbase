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
        data: this.props.skillData,
        targetedSummary: -1,
        targetedAmount: 0,
        recommendedStage: "none",
        totalRun: 0,
        totalSanity: 0,
        overflow: 0
    }

    calculateSkill(targetedSummary, targetedAmount) {
        let data = this.state.data[targetedSummary];

        

        let stageName = data["stageName"];
        let sanityUsed = data["sanityUsed"];
        let dropAmount = data["dropAmount"];
        let runAmount = Math.ceil(targetedAmount / dropAmount);
        let overflow = (runAmount*dropAmount) - targetedAmount;
            
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