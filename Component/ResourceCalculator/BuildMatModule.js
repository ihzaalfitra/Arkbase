import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Picker,
    TextInput
} from 'react-native';

import styles from '../../assets/Stylesheet/styles.js';
import picker from '../../assets/Stylesheet/picker.js';

class BuildMatModule extends Component {
    state = {
		errorStatement:'',
        building: "none",
        currentPhase: 0,
        targetedPhase: 0,
        buildingData: this.props.buildingData,
        buildMatData: this.props.buildMatData,
        matUsed: [],
        matAmount: []
    }

    calculateBuildMat(selectedBuilding, currentPhase, targetedPhase) {
        let building = this.state.buildingData[selectedBuilding];
        let matUsed = [];
        let matAmount = [];
        let matIndex = 0;
		if (
			selectedBuilding == 'none' ||
			(currentPhase==0 && targetedPhase==0) ||
			isNaN(currentPhase) ||
			isNaN(targetedPhase) ||
			currentPhase >= targetedPhase
		){
			this.setState({errorStatement: "Input is incorrect"});
        }else if(currentPhase == 0 && selectedBuilding == "controlCenter" ){
			this.setState({errorStatement: "Control Center current phase cannot be zero"});
		}else if(targetedPhase > building["maxPhase"]){
			this.setState({errorStatement: "The max phase of " + building["name"] + " is " + building["maxPhase"]});
		}else if(currentPhase < targetedPhase && targetedPhase <= building["maxPhase"]){
            while(currentPhase < targetedPhase) {
                currentPhase += 1;
                building["phase"][currentPhase]["matName"].forEach(function(item, index) {
                    matIndex = matUsed.indexOf(item);
                    if(matIndex == -1) {
                        matUsed.push(item);
                        matAmount.push(building["phase"][currentPhase]["matQuantity"][index]);
                    }
                    else {
                        matAmount[matIndex] += building["phase"][currentPhase]["matQuantity"][index];
                    }
                });
            }
			this.setState({errorStatement: ""});
		}
		this.setState({matUsed: matUsed});
        this.setState({matAmount: matAmount});
    }

    getResult() {
		if(this.state.errorStatement!=''){
			return(
				<View style={picker.container}>
					<Text style={styles.textError}>{this.state.errorStatement}</Text>
				</View>
			)
		}else{
	        let matUsed = this.state.matUsed;
	        let matAmount = this.state.matAmount;
	        let buildMatData = this.state.buildMatData;
	        let buildMatName = "";
	        let buildMatAmount = "";
	        let reqMat = "";
	        let reqMatName = "";
	        let reqMatAmount = "";
	        let stage = "";
	        let sanityUsed = 0;
	        let dropAmount = 0;
	        let totalRun = 0;
	        let totalSanity = 0;
	        let overflow = 0;
	        if(matUsed.length == 0) {
	            return;
	        }
	        else {
	            let outputText = matUsed.map(function(item, index) {
	                if(item != "none") {
	                    if(item != "keel") {
	                        buildMatName = buildMatData["BuildingMaterial"][item]["name"];
	                        buildMatAmount = matAmount[index];
	                        reqMat = buildMatData["BuildingMaterial"][item]["reqMat"];
	                        reqMatName = buildMatData["Carbon"][reqMat]["name"];
	                        stage = buildMatData["Carbon"][reqMat]["bestStage"];
	                        reqMatAmount = buildMatData["BuildingMaterial"][item]["reqAmount"] * buildMatAmount;
	                        sanityUsed = buildMatData["Carbon"][reqMat]["sanityUsed"];
	                        dropAmount = buildMatData["Carbon"][reqMat]["dropAmount"];
	                        totalRun = Math.ceil(reqMatAmount/dropAmount);
	                        totalSanity = totalRun * sanityUsed;
	                        overflow = (totalRun * dropAmount) - reqMatAmount;
	                        return(
	                            <View style={{width:'80%'}}>
	                                <Text style={styles.textLeft}>You need {buildMatAmount} {buildMatName} ({reqMatAmount} {reqMatName} from {stage})</Text>
	                                <Text style={styles.textLeft}>You need minimal: </Text>
	                                <Text style={styles.textLeft}>{totalRun} run</Text>
	                                <Text style={styles.textLeft}>{totalSanity} sanity</Text>
	                                <Text style={styles.textLeft}>You will get {overflow} extra {reqMatName}</Text>
	                                <Text style={styles.textLeft}> </Text>
	                            </View>

	                        )
	                    }
	                    else {
	                        return(
	                            <Text style={styles.textLeft}>You need {matAmount[index]} Keel from Main Story</Text>
	                        )
	                    }
	                }
	            });
	            return outputText;
	        }
		}
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
                        <Picker.Item label="Select the building you want to build" value="none"/>
                        <Picker.Item label="Control Center" value="controlCenter"/>
                        <Picker.Item label="Dormitory" value="dormitory"/>
                        <Picker.Item label="Power Plant" value="powerPlant"/>
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
					keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Targeted Phase"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedPhase: input})}
					keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateBuildMat(this.state.building, parseInt(this.state.currentPhase), parseInt(this.state.targetedPhase))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
				
					{this.getResult()}
            </View>
        )
    }
}

export default BuildMatModule;
