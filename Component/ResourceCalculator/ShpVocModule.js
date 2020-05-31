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

class ShpVocModule extends Component {
    state = {
        stage: -1,
        sanityUsed: 0,
        dropAmount: 0,
        targetedValue: 0,
        totalRun: 0,
        totalSanity: 0,
        overflow: 0
    }

    changeShpVocCalculationParameter(stageIndex) {
        let stageInt = parseInt(stageIndex);
        switch(stageInt) {
            case -1:
                this.setState({sanityUsed: 0}, this.setState({dropAmount: 0}));
                break;
            case 5:
                this.setState({sanityUsed: 30}, this.setState({dropAmount: 20}));
                break;
        }
    }

    calculateShpVoc(target, sanity, drop) {
        let runAmount = target / drop;
        let overflow = 0;
        if(runAmount - Math.floor(runAmount) != 0) {
            runAmount = Math.floor(runAmount) + 1;
        }
        overflow = (drop*runAmount) - target;
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
                        onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeShpVocCalculationParameter(itemValue))}
                    >
                        <Picker.Item label="Selec stage" value={-1}/>
                        <Picker.Item label="AP-5" value={5}/>
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Target Shop Voucher amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedValue: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateShpVoc(parseFloat(this.state.targetedValue), parseFloat(this.state.sanityUsed), parseFloat(this.state.dropAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <Text style={styles.textRequire}>Require minimal:</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.totalRun)} run</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.totalSanity)} sanity</Text>
                <Text style={styles.textLeft}> </Text>
                <Text style={styles.textLeft}>You will get {parseInt(this.state.overflow)} extra shop voucher</Text>
            </View>
        )
    }
}

export default ShpVocModule;