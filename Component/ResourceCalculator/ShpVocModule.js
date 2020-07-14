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
		errorStatement:-1,
        data: this.props.shpVocData,
        stage: 0,
        sanityUsed: 0,
        dropAmount: 0,
        targetedValue: 0,
        totalRun: 0,
        totalSanity: 0,
        overflow: 0
    }

    changeShpVocCalculationParameter(stageIndex) {
        let data = this.state.data[parseInt(stageIndex)];
        this.setState({dropAmount: data["dropAmount"]});
        this.setState({sanityUsed: data["sanityUsed"]});
    }

    calculateShpVoc(target, sanity, drop) {
		if(
			this.state.stage == 0 ||
			isNaN(target) ||
			isNaN(sanity) ||
			isNaN(drop) ||
			target == 0
		){
			this.setState({errorStatement:'Input is incorrect.'});
		}else{
			this.setState({errorStatement:''});
	        let runAmount = Math.ceil(target / drop);
	        let overflow = (drop*runAmount) - target;
	        this.setState({totalRun: runAmount});
	        this.setState({totalSanity: runAmount*sanity});
	        this.setState({overflow: overflow});
		}
    }
	getResult(){
		//no errorStatement
		if(this.state.errorStatement==''){
			return(
				<View>
					<Text style={styles.textRequire}>Require minimal:</Text>
					<Text style={styles.textLeft}>{parseInt(this.state.totalRun)} run</Text>
					<Text style={styles.textLeft}>{parseInt(this.state.totalSanity)} sanity</Text>
					<Text style={styles.textLeft}> </Text>
					<Text style={styles.textLeft}>You will get {parseInt(this.state.overflow)} extra shop voucher</Text>
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
    render() {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.stage}
                        onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeShpVocCalculationParameter(itemValue))}
                    >
                        <Picker.Item label="Selec stage" value={0}/>
                        <Picker.Item label="AP-1" value={1}/>
                        <Picker.Item label="AP-2" value={2}/>
                        <Picker.Item label="AP-3" value={3}/>
                        <Picker.Item label="AP-4" value={4}/>
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
				{this.getResult()}
            </View>
        )
    }
}

export default ShpVocModule;
