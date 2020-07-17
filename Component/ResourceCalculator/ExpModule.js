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

class ExpModule extends Component {
    state = {
		errorStatement:'',
        stage: 0,
        sanityUsed: 0,
        dropAmount: 0,
		opRarity: -1,
        opCurrentElite: -1,
        opCurrentLevel: 0,
        opTargetedElite: -1,
        opTargetedLevel: 0,
        opExpReqAllElite: this.props.expReq,
        opLevelLimit: this.props.levelLimit,
        stageData: this.props.stageData,
        totalExpNeeded: 0,
        totalRun: 0,
        totalSanity: 0,
        overflow: 0
    }

    changeExpCalculationParameter(stageIndex) {
        let data = this.state.stageData[parseInt(stageIndex)];
        this.setState({dropAmount: data["dropAmount"]});
        this.setState({sanityUsed: data["sanityUsed"]});
    }

    calculateExp(rarity, currentElite, currentLevel, targetedElite, targetedLevel, sanity, drop) {
        let expReqPerLevel = this.state.opExpReqAllElite;
        let levelLimit = this.state.opLevelLimit;
        let totalExp = 0;
        let runAmount = 0;
        let overflow = 0;
        while((currentElite <= targetedElite) && !(currentElite == targetedElite && currentLevel >= targetedLevel)) {
            totalExp += expReqPerLevel[currentElite][currentLevel];
            currentLevel++;
            if(currentLevel == levelLimit[rarity][currentElite]) {
                currentLevel = 1;
                currentElite++;
            }
        }
        runAmount = Math.ceil(totalExp / drop);
        overflow = (drop*runAmount) - totalExp;
        this.setState({totalExpNeeded: totalExp});
        this.setState({totalRun: runAmount});
        this.setState({totalSanity: runAmount*sanity});
        this.setState({overflow: overflow});
    }

    render() {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.stage}
                        onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeExpCalculationParameter(itemValue))}
                    >
                        <Picker.Item label="Select stage" value={0}/>
                        <Picker.Item label="LS-1" value={1}/>
                        <Picker.Item label="LS-2" value={2}/>
                        <Picker.Item label="LS-3" value={3}/>
                        <Picker.Item label="LS-4" value={4}/>
                        <Picker.Item label="LS-5" value={5}/>
                    </Picker>
                </View>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.opRarity}
                        onValueChange={(itemValue, itemIndex) => this.setState({opRarity: itemValue})}
                    >
                        <Picker.Item label="Select operator rarity" value={-1}/>
                        <Picker.Item label="1 Star" value={1}/>
                        <Picker.Item label="2 Stars" value={2}/>
                        <Picker.Item label="3 Stars" value={3}/>
                        <Picker.Item label="4 Stars" value={4}/>
                        <Picker.Item label="5 Stars" value={5}/>
                        <Picker.Item label="6 Stars" value={6}/>
                    </Picker>
                </View>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.opCurrentElite}
                        onValueChange={(itemValue, itemIndex) => this.setState({opCurrentElite: itemValue})}
                    >
                        <Picker.Item label="Select current elite" value={-1}/>
                        <Picker.Item label="E0" value={0}/>
                        <Picker.Item label="E1" value={1}/>
                        <Picker.Item label="E2" value={2}/>
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Current Level"
                    value={this.input}
                    onChangeText={(input) => this.setState({opCurrentLevel: input})}
                    keyboardType="numeric"
                />
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.opTargetedElite}
                        onValueChange={(itemValue, itemIndex) => this.setState({opTargetedElite: itemValue})}
                    >
                        <Picker.Item label="Select targeted elite" value={-1}/>
                        <Picker.Item label="E0" value={0}/>
                        <Picker.Item label="E1" value={1}/>
                        <Picker.Item label="E2" value={2}/>
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Targeted Level"
                    value={this.input}
                    onChangeText={(input) => this.setState({opTargetedLevel: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateExp(parseInt(this.state.opRarity), parseInt(this.state.opCurrentElite), parseInt(this.state.opCurrentLevel), parseInt(this.state.opTargetedElite), parseInt(this.state.opTargetedLevel), parseInt(this.state.sanityUsed), parseInt(this.state.dropAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <Text style={styles.textRequire}>Require:</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.totalExpNeeded)} exp</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.totalRun)} run</Text>
				<Text style={styles.textLeft}>{parseInt(this.state.totalSanity)} sanity</Text>
				<Text style={styles.textLeft}> </Text>
				<Text style={styles.textLeft}>You will get {parseInt(this.state.overflow)} extra EXP</Text>
            </View>
        )
    }
}

export default ExpModule;
