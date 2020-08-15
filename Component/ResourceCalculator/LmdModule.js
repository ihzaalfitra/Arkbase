import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Picker,
    TextInput
} from 'react-native';
import * as Analytics from 'expo-firebase-analytics';

import styles from '../../assets/Stylesheet/styles.js';
import picker from '../../assets/Stylesheet/picker.js';

class LmdModule extends Component {
    state = {
        errorStatement:-1,
        data: this.props.lmdData,
        stage: 0,
        sanityUsed: 0,
        dropAmount: 0,
		ownedValue:0,
        targetedValue: 0,
        totalSanity: 0,
        totalRun: 0,
        overflow: 0
    }

    changeLmdCalculationParameter(stageIndex) {
        let data = this.state.data[parseInt(stageIndex)];
        this.setState({dropAmount: data["dropAmount"]});
        this.setState({sanityUsed: data["sanityUsed"]});
    }

    calculateLMD(owned, target, sanity, drop) {
		let ownedRaw = owned;
		let targetRaw = target;
		if(owned==''){
			owned=0;
		}else{
			owned = parseFloat(owned);
		}
		target = parseFloat(target);
		target=target-owned;
		if (sanity == 0 && drop == 0) {
			this.setState({errorStatement: 'Please select stage.'})
		}else if(isNaN(owned)){
			this.setState({errorStatement: 'Owned amount must be a number.'})
		}else if(isNaN(target)){
			this.setState({errorStatement: 'Target amount must be a number.'})
		}else if(owned >= target){
			this.setState({errorStatement: 'Owned amount cannot be greater or equal than targeted amount.'})
		}else if(target <= 0 || isNaN(target)){
			this.setState({errorStatement: 'Target amount must be a number and cannot be zero or blank.'})
		}else if(ownedRaw > Number.MAX_SAFE_INTEGER || targetRaw > Number.MAX_SAFE_INTEGER ) {
			this.setState({errorStatement: "Value too big"});
		}else{
			this.setState({errorStatement: ''})
			Analytics.logEvent('CalculateLmd', {
				stageIndex: this.state.stage,
				own: owned,
				target: target
			});
		}
        let runAmount = Math.ceil(target / drop);
        let overflow = (drop*runAmount) - target;
        this.setState({totalRun: runAmount});
        this.setState({totalSanity: runAmount*sanity});
        this.setState({overflow: overflow});
    }

	getResult(){
		if(this.state.errorStatement == ''){
			return(
				<View style={{width:'80%'}}>
				<Text style={styles.textRequire}>Require:</Text>
				<Text style={styles.textLeft}>{parseInt(this.state.totalRun)} run</Text>
				<Text style={styles.textLeft}>{parseInt(this.state.totalSanity)} sanity</Text>
				<Text style={styles.textLeft}> </Text>
				<Text style={styles.textLeft}>You will get {parseInt(this.state.overflow)} extra LMD</Text>
				</View>
			)
			//uninitialized errorStatement
		}else if (this.state.errorStatement==-1) {
			return(
				null
			)
		//errorStatement was thrown
		}else{
			return(
				<View>
					<Text style={styles.textError}>{this.state.errorStatement}</Text>
				</View>
			)
		}
	}
	//change the style of component underline if there's an error
	styleUnderline(value,componentType,component){
		//check whether error statement is thrown or not. if not, use normal color
		if(this.state.errorStatement==('' || -1) ){
			if(componentType=='picker'){
				return(
					picker.underline
				)
			}else{
				return(
					styles.input
				)
			}
		}else{
			switch(component){
				//input component error parameter, must be specifically to each of the input to make the error specific
				case 'stage':
					//error parameter
					if(
						this.state.stage == 0
					){
						//if error, change underline to error style
						return(
							picker.underlineError
						)
					}else{
						//if not error, use normal underline
						return(
							picker.underline
						)
					}
					break;
				case 'ownedValue':
					if(value==''){
						value=0;
					}else{
						value=parseFloat(value);
					}
					if(isNaN(value) || value > Number.MAX_SAFE_INTEGER){
						return(
							styles.inputError
						)
					}else{
						return(
							styles.input
						)
					}
					break;
				case 'targetedValue':
					if(value <= 0 || isNaN(value) || value > Number.MAX_SAFE_INTEGER){
						return(
							styles.inputError
						)
					}else{
						return(
							styles.input
						)
					}
					break;
				default:
					if(componentType=='picker'){
						return(
							picker.underline
						)
					}else{
						return(
							styles.input
						)
					}
					break;
			}
		}
	}

	componentDidMount() {
		Analytics.setCurrentScreen('LmdModule');
	}

    render() {
        return(
            <View style={picker.container}>
                <View style={this.styleUnderline(this.state.stage,'picker', 'stage')}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.stage}
                        onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeLmdCalculationParameter(itemValue))}
                    >
					    <Picker.Item label="Select stage" value={0}/>
                        <Picker.Item label="CE-1" value={1}/>
                        <Picker.Item label="CE-2" value={2}/>
                        <Picker.Item label="CE-3" value={3}/>
                        <Picker.Item label="CE-4" value={4}/>
                        <Picker.Item label="CE-5" value={5}/>
                    </Picker>
                </View>
                <TextInput
                    style={this.styleUnderline(this.state.ownedValue, 'textInput', 'ownedValue')}
                    placeholder="Owned LMD amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({ownedValue: input})}
                    keyboardType="numeric"
                />
				<TextInput
                    style={this.styleUnderline(parseFloat(this.state.targetedValue), 'textInput', 'targetedValue')}
                    placeholder="Target LMD amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedValue: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress= {() => this.calculateLMD(this.state.ownedValue, this.state.targetedValue, parseFloat(this.state.sanityUsed), parseFloat(this.state.dropAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
			    {this.getResult()}
            </View>
        )
    }
}

export default LmdModule;
