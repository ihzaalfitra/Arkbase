import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Picker,
    TextInput,
    ScrollView,
    Modal,
    SafeAreaView,
	Dimensions
} from 'react-native';
import firebase from './Component/FirebaseDatabase.js';
import styles from './assets/stylesheet/styles.js';
import picker from './assets/stylesheet/picker.js';



const contentHeight=Math.round(Dimensions.get('window').height)-100;



class ResourceCalculator extends Component {
    state = {
		screenHeight:contentHeight,
        resource: "none",
        errorStatement:'',
        
        lmdStage: -1,
        lmdSanityUsed: 0,
        lmdDropAmount: 0,
        lmdTargetedValue: 0,
        lmdTotalSanity: 0,
        lmdTotalRun: 0,
        lmdOverflow: 0,

        expStage: -1,
        expSanityUsed: 0,
        expDropAmount: 0,
        expOpRarity: -1,
        expOpCurrentElite: -1,
        expOpCurrentLevel: 0,
        expOpTargetedElite: -1,
        expOpTargetedLevel: 0,
        expOpExpReqAllElite: [],
        expOpLevelLimit: [],
        expTotalExpNeeded: 0,
        expTotalRun: 0,
        expTotalSanity: 0,
        expOverflow: 0,

        furnPartStage: -1,
        furnPartSanityUsed: 0,
        furnPartDropAmount: 0,
        furnPartTargetedValue: 0,
        furnPartTotalSanity: 0,
        furnPartTotalRun: 0,
        furnPartOverflow: 0,

        shpVocStage: -1,
        shpVocSanityUsed: 0,
        shpVocMinDropAmount: 0,
        shpVocTargetedValue: 0,
        shpVocTotalRun: 0,
        shpVocTotalSanity: 0,
        shpVocOverflow: 0,

        buildMatBuilding: "none",
        buildMatCurrentPhase: 0,
        buildMatTargetedPhase: 0,

        skillTargetedSummary: -1,
        skillTargetedAmount: 0,
        skillRecommendedStage: "none",
        skillTotalRun: 0,
        skillTotalSanity: 0,
        skillOverflow: 0
    };

//-----------------------------------------------
//----------------------GENERAL------------------
//-----------------------------------------------

	checkSelectedResource(selectedResource) {
		switch(selectedResource) {
			case "none":
				return this.resourceNone();
				break;
			case "exp":
				return this.resourceExp();
				break;
			case "lmd":
                return this.resourceLmd();
                break;
            case "skill":
                return this.resourceSkill();
                break;
            case "furnPart":
                return this.resourceFurnPart();
                break;
            case "buildMat":
                return this.resourceBuildMat();
                break;
            case "voucher":
                return this.resourceVoucher();
                break;
		}
	}
	changeScreenHeight(itemValue){
		switch(itemValue){
			case 'exp':
				this.setState({screenHeight:850})
				break;
			case 'lmd':
				this.setState({screenHeight:contentHeight})
				break;
			default:
				this.setState({screenHeight:contentHeight})
				break;
		}
	}

    resourceNone = () => {

    }

//-----------------------------------------------
//--------------------DATABASE-------------------
//-----------------------------------------------

loadDatabase() {
    let refDir = "CalculationData/Operator/Leveling/";
    let refDirExpReq = refDir + "ExpReq";
    let refDirLevelLimit = refDir + "LevelLimit";

    let elite0 = [];
    let elite1 = [];
    let elite2 = [];
    let allElite = [];
    let levelLimit = [];
    let tempLimit = [];

    firebase.database().ref(refDirExpReq).once('value', (snapshot) => {
        elite0 = snapshot.child("E0").val();
        elite1 = snapshot.child("E1").val();
        elite2 = snapshot.child("E2").val();

        allElite.push(elite0);
        allElite.push(elite1);
        allElite.push(elite2);

        this.setState({expOpExpReqAllElite: allElite});
    });

    firebase.database().ref(refDirLevelLimit).once('value', (snapshot) => {
        levelLimit.push(tempLimit);
        snapshot.forEach((snapchild) => {
            tempLimit = snapchild.val();
            levelLimit.push(tempLimit);
        });
        this.setState({expOpLevelLimit: levelLimit});
    });

}

//-----------------------------------------------
//----------------------EXP----------------------
//-----------------------------------------------

	changeExpCalculationParameter(stageIndex) {
		let stageInt = parseInt(stageIndex);
		switch(stageInt){
			case -1:
				this.setState({expSanityUsed: 0}, this.setState({expDropAmount: 0}));
				break;
			case 5:
				this.setState({expSanityUsed: 30}, this.setState({expDropAmount: 7400}));
				break;
		}
    }

    calculateExp(rarity, currentElite, currentLevel, targetedElite, targetedLevel, sanity, drop) {
        let expReqPerLevel = this.state.expOpExpReqAllElite;
        let levelLimit = this.state.expOpLevelLimit;
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
        runAmount = totalExp / drop;
        if(runAmount - Math.floor(runAmount) != 0) {
            runAmount = Math.floor(runAmount) + 1;
        }
        overflow = (drop*runAmount) - totalExp;
        this.setState({expTotalExpNeeded: totalExp});
        this.setState({expTotalRun: runAmount});
        this.setState({expTotalSanity: runAmount*sanity});
        this.setState({expOverflow: overflow});
    }

    resourceExp = () => {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.expStage}
                        onValueChange={(itemValue, itemIndex) => this.setState({expStage: itemValue}, this.changeExpCalculationParameter(itemValue))}
                    >
                        <Picker.Item label="Select stage" value={-1}/>
                        <Picker.Item label="LS-5" value={5}/>
                    </Picker>
                </View>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.expOpRarity}
                        onValueChange={(itemValue, itemIndex) => this.setState({expOpRarity: itemValue})}
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
                        selectedValue={this.state.expOpCurrentElite}
                        onValueChange={(itemValue, itemIndex) => this.setState({expOpCurrentElite: itemValue})}
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
                    onChangeText={(input) => this.setState({expOpCurrentLevel: input})}
                    keyboardType="numeric"
                />
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.expOpTargetedElite}
                        onValueChange={(itemValue, itemIndex) => this.setState({expOpTargetedElite: itemValue})}
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
                    onChangeText={(input) => this.setState({expOpTargetedLevel: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateExp(parseInt(this.state.expOpRarity), parseInt(this.state.expOpCurrentElite), parseInt(this.state.expOpCurrentLevel), parseInt(this.state.expOpTargetedElite), parseInt(this.state.expOpTargetedLevel), parseInt(this.state.expSanityUsed), parseInt(this.state.expDropAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <Text style={styles.textRequire}>Require:</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.expTotalExpNeeded)} exp</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.expTotalRun)} run</Text>
				<Text style={styles.textLeft}>{parseInt(this.state.expTotalSanity)} sanity</Text>
				<Text style={styles.textLeft}> </Text>
				<Text style={styles.textLeft}>You will get {parseInt(this.state.expOverflow)} extra EXP</Text>
            </View>
        )
    }

//-----------------------------------------------
//----------------------LMD----------------------
//-----------------------------------------------

	changeLmdCalculationParameter(stageIndex) {
		let stageInt = parseInt(stageIndex);
		switch(stageInt) {
			case -1:
				this.setState({lmdSanityUsed: 0}, this.setState({lmdDropAmount: 0}));
				break;
			case 1:
				this.setState({lmdSanityUsed: 10}, this.setState({lmdDropAmount: 1700}));
				break;
			case 2:
				this.setState({lmdSanityUsed: 15}, this.setState({lmdDropAmount: 2800}));
				break;
			case 3:
				this.setState({lmdSanityUsed: 20}, this.setState({lmdDropAmount: 4100}));
				break;
			case 4:
				this.setState({lmdSanityUsed: 25}, this.setState({lmdDropAmount: 5700}));
				break;
			case 5:
				this.setState({lmdSanityUsed: 30}, this.setState({lmdDropAmount: 7500}));
				break;
		}
    }
    
    calculateLMD(target, sanity, drop) {
        let runAmount = target / drop;
        let overflow = 0;
        if(runAmount - Math.floor(runAmount) != 0) {
            runAmount = Math.floor(runAmount) + 1;
        }
        overflow = (drop*runAmount) - target;
        this.setState({lmdTotalRun: runAmount});
        this.setState({lmdTotalSanity: runAmount*sanity});
        this.setState({lmdOverflow: overflow});
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
					<Text style={styles.textLeft}>{parseInt(this.state.lmdTotalRun)} run</Text>
					<Text style={styles.textLeft}>{parseInt(this.state.lmdTotalSanity)} sanity</Text>
					<Text style={styles.textLeft}> </Text>
					<Text style={styles.textLeft}>You will get {parseInt(this.state.lmdOverflow)} extra LMD</Text>
				</View>
			)
		}else{
			return(
				null
			)
		}
	}

    resourceLmd = () => {
        return(
          <View style={picker.container}>
              <View style={picker.underline}>
                <Picker
                    style={picker.style}
                    selectedValue={this.state.lmdStage}
                    onValueChange={(itemValue, itemIndex) => this.setState({lmdStage: itemValue}, this.changeLmdCalculationParameter(itemValue))}
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
                    onChangeText={(input) => this.setState({lmdTargetedValue: input})}
                    keyboardType="numeric"
              />
              <TouchableOpacity
                    onPress= {() => this.calculateLMD(parseFloat(this.state.lmdTargetedValue), parseFloat(this.state.lmdSanityUsed), parseFloat(this.state.lmdDropAmount))}
                    style={styles.button}
              >
                  <Text style={styles.buttonText}>Calculate</Text>
              </TouchableOpacity>
			  {this.state.errorStatement != 'no_error' && this.state.errorStatement != '' ? <Text style={styles.textError}>{this.state.errorStatement}</Text>: this.outputLmd()}
            </View>

        )
    }

//-----------------------------------------------
//---------------------SKILL---------------------
//-----------------------------------------------

    calculateSkill(targetedSummary, targetedAmount) {
        let data = {
            1: {
                stageName: "CA-2",
                sanityUsed: 15,
                dropAmount: 5
            },
            2: {
                stageName: "CA-3",
                sanityUsed: 20,
                dropAmount: 3
            },
            3: {
                stageName: "CA-5",
                sanityUsed: 30,
                dropAmount: 2
            }
        };
        let stageName;
        let sanityUsed;
        let dropAmount;
        let runAmount;
        let overflow;

        if(targetedSummary == -1) {
            stageName = "None";
            sanityUsed = 0;
            dropAmount = 0;
            runAmount = 0;
            overflow = 0;
        }
        else {
            stageName = data[targetedSummary]["stageName"];
            sanityUsed = data[targetedSummary]["sanityUsed"];
            dropAmount = data[targetedSummary]["dropAmount"];
            runAmount = Math.ceil(targetedAmount / dropAmount);
            overflow = 0;
        }
            
        this.setState({skillRecommendedStage: stageName});
        this.setState({skillTotalRun: runAmount});
        this.setState({skillTotalSanity: runAmount*sanityUsed});
        this.setState({skillOverflow: overflow});
    }

    resourceSkill = () => {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.skillTargetedSummary}
                        onValueChange={(itemValue, itemIndex) => this.setState({skillTargetedSummary: itemValue})}
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
                    onChangeText={(input) => this.setState({skillTargetedAmount: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateSkill(parseInt(this.state.skillTargetedSummary), parseInt(this.state.skillTargetedAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <Text style={styles.textRequire}>Result:</Text>
                <Text style={styles.textLeft}>Recommended Stage: {this.state.skillRecommendedStage}</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.skillTotalRun)} run</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.skillTotalSanity)} sanity</Text>
                <Text style={styles.textLeft}> </Text>
                <Text style={styles.textLeft}>You will get extra {parseInt(this.state.skillOverflow)} extra Skull Summary</Text>
            </View>
        )
    } 

//-----------------------------------------------
//-------------------FURNITURE-------------------
//-----------------------------------------------

    changeFurnPartCalculationParameter(stageIndex) {
        let stageInt = parseInt(stageIndex);
        switch(stageInt) {
            case -1:
                this.setState({furnPartSanityUsed: 0}, this.setState({furnPartDropAmount: 0}));
                break;
            case 5:
                this.setState({furnPartSanityUsed: 30}, this.setState({furnPartDropAmount: 10}));
                break;
        }
    }

    calculateFurnPart(target, sanity, drop) {
        let runAmount = target / drop;
        let overflow = 0;
        if(runAmount - Math.floor(runAmount) != 0) {
            runAmount = Math.floor(runAmount) + 1;
        }
        overflow = (drop*runAmount) - target;
        this.setState({furnPartTotalRun: runAmount});
        this.setState({furnPartTotalSanity: runAmount*sanity});
        this.setState({furnPartOverflow: overflow});
    }

    resourceFurnPart = () => {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.furnPartStage}
                        onValueChange={(itemValue, itemIndex) => this.setState({furnPartStage: itemValue}, this.changeFurnPartCalculationParameter(itemValue))}
                    >
                        <Picker.Item label="Select stage" value={-1}/>
                        <Picker.Item label="SK-5" value={5}/>
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Target Furniture Part amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({furnPartTargetedValue: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateFurnPart(parseFloat(this.state.furnPartTargetedValue), parseFloat(this.state.furnPartSanityUsed), parseFloat(this.state.furnPartDropAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <Text style={styles.textRequire}>Require:</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.furnPartTotalRun)} run</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.furnPartTotalSanity)} sanity</Text>
                <Text style={styles.textLeft}> </Text>
                <Text style={styles.textLeft}>You will get {parseInt(this.state.furnPartOverflow)} extra furniture part</Text>
            </View>
        )
    }

//-----------------------------------------------
//-------------------BUILDING--------------------
//-----------------------------------------------

    calculateBuildMat(building, currentPhase, targetedPhase) {
        // let buildingData = {
        //     controlCenter: {
        //         maxPhase: 5,
        //     },
        //     dormitory: {
        //         maxPhase: 5,
        //         1: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         },
        //         2: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         },
        //         3: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         },
        //         4: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         },
        //         5: {
        //             droneUsed: 100,
        //             materialType: [
        //                 "light"  
        //             ],
        //             materialQuantity: [
        //                 1
        //             ]
        //         }
        //     },
        //     powerPlant: {
        //         maxPhase: 3
        //     },
        //     factory: {
        //         maxPhase: 3
        //     },
        //     tradingPost: {
        //         maxPhase: 3
        //     },
        //     receptionRoom: {
        //         maxPhase: 3
        //     },
        //     workshop: {
        //         maxPhase: 3
        //     },
        //     office: {
        //         maxPhase: 3
        //     },
        //     trainingRoom: {
        //         maxPhase: 3
        //     }
        // };
    }

    resourceBuildMat = () => {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.buildMatBuilding}
                        onValueChange={(itemValue, itemIndex) => this.setState({buildMatBuilding: itemValue})}
                    >
                        <Picker.Item label="Select the building you want tp build" value="none"/>
                        <Picker.Item label="Control Center" value="controlCenter"/>
                        <Picker.Item label="Dormitory" value="dormitory"/>
                        <Picker.Item label="Power Plant" value="powerPlat"/>
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
                    onChangeText={(input) => this.setState({buildMatCurrentPhase: input})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Targeted Phase"
                    value={this.input}
                    onChangeText={(input) => this.setState({buildMatTargetedPhase: input})}
                />
                <TouchableOpacity
                    onPress={() => this.calculateBuildMat(this.state.buildMatBuilding, parseInt(this.state.buildMatCurrentPhase), parseInt(this.state.buildMatTargetedPhase))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
            </View>
        )
    }

//-----------------------------------------------
//--------------------VOUCHER--------------------
//-----------------------------------------------

    changeShpVocCalculationParameter(stageIndex) {
        let stageInt = parseInt(stageIndex);
        switch(stageInt) {
            case -1:
                this.setState({shpVocSanityUsed: 0}, this.setState({shpVocMinDropAmount: 0}));
                break;
            case 5:
                this.setState({shpVocSanityUsed: 30}, this.setState({shpVocMinDropAmount: 20}));
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
        this.setState({shpVocTotalRun: runAmount});
        this.setState({shpVocTotalSanity: runAmount*sanity});
        this.setState({shpVocOverflow: overflow});
    }

    resourceVoucher = () => {
        return(
            <View style={picker.container}>
                <View style={picker.underline}>
                    <Picker
                        style={picker.style}
                        selectedValue={this.state.shpVocStage}
                        onValueChange={(itemValue, itemIndex) => this.setState({shpVocStage: itemValue}, this.changeShpVocCalculationParameter(itemValue))}
                    >
                        <Picker.Item label="Selec stage" value={-1}/>
                        <Picker.Item label="AP-5" value={5}/>
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Target Shop Voucher amount"
                    value={this.input}
                    onChangeText={(input) => this.setState({shpVocTargetedValue: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={() => this.calculateShpVoc(parseFloat(this.state.shpVocTargetedValue), parseFloat(this.state.shpVocSanityUsed), parseFloat(this.state.shpVocMinDropAmount))}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <Text style={styles.textRequire}>Require minimal:</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.shpVocTotalRun)} run</Text>
                <Text style={styles.textLeft}>{parseInt(this.state.shpVocTotalSanity)} sanity</Text>
                <Text style={styles.textLeft}> </Text>
                <Text style={styles.textLeft}>You will get {parseInt(this.state.shpVocOverflow)} extra shop voucher</Text>
            </View>
        )
    }

//-----------------------------------------------
//----------------------MAIN---------------------
//-----------------------------------------------

    componentDidMount() {
        this.loadDatabase();
    }

    render() {

        let lmdSanityUsed = 0;
        let lmdDropAmount = 0;

        return(
			<View style={{flex:1,backgroundColor:'#000',paddingTop:25}}>
			<Text style={styles.header}>Resource Calculator</Text>
			<ScrollView>
				<View style={{
					alignItems:'center',
				    backgroundColor:'#000',
				    flex:1,
				    height:this.state.screenHeight
				}}>
                    <View style={picker.container}>
                      <View style={picker.underline}>
                        <Picker
                          style={picker.style}
                          itemStyle={picker.itemStyle}
                          selectedValue={this.state.resource}
                          onValueChange={(itemValue, itemIndex) => this.setState({resource: itemValue}, this.changeScreenHeight(itemValue))}
                        >
                          <Picker.Item label="Select resource" value={null}/>
                          <Picker.Item label="BATTLE RECORD (EXP)" value="exp"/>
                          <Picker.Item label="LMD" value="lmd"/>
                          <Picker.Item label="SKILL SUMMARY" value={"skill"}/>
                          <Picker.Item label="FURNITURE PART" value={"furnPart"}/>
                          <Picker.Item label="BUILDING MATERIAL" value={"buildMat"}/>
                          <Picker.Item label="SHOP VOUCHER" value={"voucher"}/>
                          </Picker>
                      </View>
                      {this.checkSelectedResource(this.state.resource)}
                    </View>
                    </View>
                </ScrollView>
			</View>
        )
    }
}

export default ResourceCalculator;
