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

class LmdModule extends Component {
    state = {
        errorStatement:'',

        stage: -1,
        sanityUsed: 0,
        dropAmount: 0,
        targetedValue: 0,
        totalSanity: 0,
        totalRun: 0,
        overflow: 0
    }

    changeLmdCalculationParameter(stageIndex) {
		let stageInt = parseInt(stageIndex);
		switch(stageInt) {
			case -1:
				this.setState({sanityUsed: 0}, this.setState({dropAmount: 0}));
				break;
			case 1:
				this.setState({sanityUsed: 10}, this.setState({dropAmount: 1700}));
				break;
			case 2:
				this.setState({sanityUsed: 15}, this.setState({dropAmount: 2800}));
				break;
			case 3:
				this.setState({sanityUsed: 20}, this.setState({dropAmount: 4100}));
				break;
			case 4:
				this.setState({sanityUsed: 25}, this.setState({dropAmount: 5700}));
				break;
			case 5:
				this.setState({sanityUsed: 30}, this.setState({dropAmount: 7500}));
				break;
		}
    }

    calculateLMD(target, sanity, drop) {
        let runAmount = Math.ceil(target / drop);
        let overflow = (drop*runAmount) - target;
        this.setState({totalRun: runAmount});
        this.setState({totalSanity: runAmount*sanity});
        this.setState({overflow: overflow});
		if (sanity == 0 && drop == 0) {
			this.setState({errorStatement: 'Please select stage.'})
		}else if(target == 0 || isNaN(target)){
			this.setState({errorStatement: 'Target amount cannot be zero or blank.'})
		}else{
			this.setState({errorStatement: 'no_error'})
		}
    }

	outputLmd = () => {

		if(this.state.errorStatement == 'no_error'){
			return(
				<View style={{width:'80%'}}>
					<Text style={styles.textRequire}>Require:</Text>
					<Text style={styles.textLeft}>{parseInt(this.state.totalRun)} run</Text>
					<Text style={styles.textLeft}>{parseInt(this.state.totalSanity)} sanity</Text>
					<Text style={styles.textLeft}> </Text>
					<Text style={styles.textLeft}>You will get {parseInt(this.state.overflow)} extra LMD</Text>
				</View>
			)
		}else{
			return(
				null
			)
		}
	}

    render() {
        return(
            <View style={picker.container}>
              <View style={picker.underline}>
                <Picker
                    style={picker.style}
                    selectedValue={this.state.stage}
                    onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeLmdCalculationParameter(itemValue))}
                >
					<Picker.Item label="Select stage" value={-1}/>
                    <Picker.Item label="CE-1" value={1}/>
                    <Picker.Item label="CE-2" value={2}/>
                    <Picker.Item label="CE-3" value={3}/>
                    <Picker.Item label="CE-4" value={4}/>
                    <Picker.Item label="CE-5" value={5}/>
                </Picker>
              </View>
              <TextInput
                    style={styles.input}
                    placeholder="Target LMD amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedValue: input})}
                    keyboardType="numeric"
              />
              <TouchableOpacity
                    onPress= {() => this.calculateLMD(parseFloat(this.state.targetedValue), parseFloat(this.state.sanityUsed), parseFloat(this.state.dropAmount))}
                    style={styles.button}
              >
                  <Text style={styles.buttonText}>Calculate</Text>
              </TouchableOpacity>
			  {this.state.errorStatement != 'no_error' && this.state.errorStatement != '' ? <Text style={styles.textError}>{this.state.errorStatement}</Text>: this.outputLmd()}
            </View>
        )
    }
}

export default LmdModule;