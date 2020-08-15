import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Picker,
    TextInput
} from 'react-native';
import * as Analytics from 'expo-firebase-analytics';

import styles from '../../assets/Stylesheet/styles.js';
import picker from '../../assets/Stylesheet/picker.js';

class BuildMatModule extends Component {
    state = {
		errorStatement:-1,
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
		if(selectedBuilding == 'none'){
			this.setState({errorStatement: "Please select a building"});

        }else if(currentPhase==-1 && targetedPhase==-1){
			this.setState({errorStatement: "Please select building phases"});
        }else if(currentPhase >= targetedPhase){
			this.setState({errorStatement: "Current phase cannot be greater or equal to targeted phase"});
        }else if(targetedPhase == 0){
			this.setState({errorStatement: "Targeted phase cannot be zero"});
        }else if(currentPhase == 0 && selectedBuilding == "controlCenter" ){
			this.setState({errorStatement: "Control Center current phase cannot be zero"});
		}else if(targetedPhase > building["maxPhase"]){
			this.setState({errorStatement: "The max phase of " + building["name"] + " is " + building["maxPhase"]});
		}else if(currentPhase < targetedPhase && targetedPhase <= building["maxPhase"]){
			this.setState({errorStatement: ""});
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
			Analytics.logEvent('CalculateBuildMatModule', {
				building: building.name,
				currentPhase: currentPhase,
				targetedPhase: targetedPhase
			});
		}
		this.setState({matUsed: matUsed});
        this.setState({matAmount: matAmount});
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
				case 'building':
					//error parameter
					if(
						value == 'none'
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
				case 'currentPhase':
					if(
						(this.state.currentPhase==0 && this.state.targetedPhase==0) ||
						isNaN(this.state.currentPhase) ||
						this.state.currentPhase >= this.state.targetedPhase ||
						this.state.currentPhase < 0 ||
						this.state.currentPhase == 0 && this.state.building == "controlCenter"
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
				case 'targetedPhase':
					if(
						(this.state.currentPhase==0 && this.state.targetedPhase==0) ||
						isNaN(this.state.targetedPhase) ||
						this.state.currentPhase >= this.state.targetedPhase ||
						this.state.targetedPhase <= 0 ||
						this.state.targetedPhase > this.state.buildingData[this.state.building]["maxPhase"]
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

    getResult() {
		if(this.state.errorStatement==''){
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
		//uninitialized errorStatement
		}else if (this.state.errorStatement==-1) {
			return(
				null
			)
		//errorStatement was thrown
		}else{
			return(
				<View style={picker.container}>
				<Text style={styles.textError}>{this.state.errorStatement}</Text>
				</View>
			)
		}
	}
	
	componentDidMount() {
		Analytics.setCurrentScreen('BuildMatModule');
	}

    render() {
        return(
            <View style={picker.container}>
                <View style={this.styleUnderline(this.state.building,'picker', 'building')}>
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
				<View style={this.styleUnderline(this.state.currentPhase,'picker', 'currentPhase')}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.currentPhase}
                        onValueChange={(itemValue, itemIndex) => this.setState({currentPhase: itemValue})}
                    >
                        <Picker.Item label="Current phase" value="-1"/>
                        <Picker.Item label="0" value="0"/>
						<Picker.Item label="1" value="1"/>
						<Picker.Item label="2" value="2"/>
						<Picker.Item label="3" value="3"/>
						<Picker.Item label="4" value="4"/>
						<Picker.Item label="5" value="5"/>
                    </Picker>
                </View>

				<View style={this.styleUnderline(this.state.targetedPhase,'picker', 'targetedPhase')}>
					<Picker
						style={picker.style}
						selectedValue={this.state.targetedPhase}
						onValueChange={(itemValue, itemIndex) => this.setState({targetedPhase: itemValue})}
					>
						<Picker.Item label="Targeted phase" value="-1"/>
						<Picker.Item label="0" value="0"/>
						<Picker.Item label="1" value="1"/>
						<Picker.Item label="2" value="2"/>
						<Picker.Item label="3" value="3"/>
						<Picker.Item label="4" value="4"/>
						<Picker.Item label="5" value="5"/>
					</Picker>
				</View>

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
