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
		errorStatement:-1,
        data: this.props.skillData,
        targetedSummary: -1,
        targetedAmount: 0,
        recommendedStage: "none",
        totalRun: 0,
        totalSanity: 0,
        overflow: 0
    }

    calculateSkill(targetedSummary, targetedAmount) {
		if(targetedSummary == 0){
			this.setState({errorStatement:'Please select skill summary.'});
		}else if(
			targetedAmount <= 0 ||
			isNaN(targetedAmount)
		){
			this.setState({errorStatement: 'Target amount must be a number and cannot be zero or blank.'})
		}
		else if(parseInt(targetedSummary) > Number.MAX_SAFE_INTEGER || parseInt(targetedAmount) > Number.MAX_SAFE_INTEGER) {
			this.setState({errorStatement: 'Value too big'});
		}
		else{
			targetedSummary = parseFloat(targetedSummary);
			targetedAmount = parseFloat(targetedAmount);
			this.setState({errorStatement:''});
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
    }
	getResult(){
		//no errorStatement
		if(this.state.errorStatement==''){
			return(
				<View>
					<Text style={styles.textRequire}>Result:</Text>
					<Text style={styles.textLeft}>Recommended Stage: {this.state.recommendedStage}</Text>
					<Text style={styles.textLeft}>{parseInt(this.state.totalRun)} run</Text>
					<Text style={styles.textLeft}>{parseInt(this.state.totalSanity)} sanity</Text>
					<Text style={styles.textLeft}> </Text>
					<Text style={styles.textLeft}>You will get extra {parseInt(this.state.overflow)} extra Skill Summary</Text>
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
				case 'targetedSummary':
					//error parameter
					if(
						this.state.targetedSummary == 0
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
				case 'targetedAmount':
					if(value <= 0 || isNaN(value)){
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

    render() {
        return(
            <View style={picker.container}>
                <View style={this.styleUnderline(this.state.targetedSummary,'picker', 'targetedSummary')}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.targetedSummary}
                        onValueChange={(itemValue, itemIndex) => this.setState({targetedSummary: itemValue})}
                    >
                        <Picker.Item label="Select Skill Summary you want" value={0}/>
                        <Picker.Item label="Skill Summary -1" value={1}/>
                        <Picker.Item label="Skill Summary -2" value={2}/>
                        <Picker.Item label="Skill Summary -3" value={3}/>
                    </Picker>
                </View>
                <TextInput
                    style={this.styleUnderline(this.state.targetedAmount, 'textInput', 'targetedAmount')}
                    placeholder="Target Skill Summary Amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedAmount: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateSkill(this.state.targetedSummary, this.state.targetedAmount)}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                {this.getResult()}
            </View>
        )
    }
}

export default SkillModule;
