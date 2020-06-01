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

class FurnPartModule extends Component {
    state = {
        data: this.props.furnPartData,
        stage: 0,
        sanityUsed: 0,
        dropAmount: 0,
        targetedValue: 0,
        totalSanity: 0,
        totalRun: 0,
        overflow: 0
    }
    
    changeFurnPartCalculationParameter(stageIndex) {
        let data = this.state.data[parseInt(stageIndex)];
        this.setState({dropAmount: data["dropAmount"]});
        this.setState({sanityUsed: data["sanityUsed"]});
    }

    calculateFurnPart(target, sanity, drop) {
        let runAmount = Math.ceil(target / drop);
        let overflow = (drop*runAmount) - target;
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
                        onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeFurnPartCalculationParameter(itemValue))}
                    >
                        <Picker.Item label="Select stage" value={0}/>
                        <Picker.Item label="SK-1" value={1}/>
                        <Picker.Item label="SK-2" value={2}/>
                        <Picker.Item label="SK-3" value={3}/>
                        <Picker.Item label="SK-4" value={4}/>
                        <Picker.Item label="SK-5" value={5}/>
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Target Furniture Part amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedValue: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateFurnPart(parseFloat(this.state.targetedValue), parseFloat(this.state.sanityUsed), parseFloat(this.state.dropAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <Text style={styles.textRequire}>Require:</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.totalRun)} run</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.totalSanity)} sanity</Text>
                <Text style={styles.textLeft}> </Text>
                <Text style={styles.textLeft}>You will get {parseInt(this.state.overflow)} extra furniture part</Text>
            </View> 
        )
    }
}

export default FurnPartModule;