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
		errorStatement:''
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
            case "furniture":
                return this.resourceFurniture();
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
		switch(stageInt){
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

    resourceSkill = () => {
        return(
            <View style={picker.container}>
                <Text style={styles.textLeft}>SKILL SUMARRY ON PROGRESS</Text>
            </View>
        )
    }

//-----------------------------------------------
//-------------------FURNITURE-------------------
//-----------------------------------------------

    resourceFurniture = () => {
        return(
            <View style={picker.container}>
                <Text style={styles.textLeft}>FURNITURE PART AND CARBON ON PROGRESS</Text>
            </View>
        )
    }

//-----------------------------------------------
//--------------------VOUCHER--------------------
//-----------------------------------------------

    resourceVoucher = () => {
        return(
            <View style={picker.container}>
                <Text style={styles.textLeft}>SHOP VOUCHER ON PROGRESS</Text>
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
                          <Picker.Item label="FURNITURE PART AND CORBON" value={"furniture"}/>
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
