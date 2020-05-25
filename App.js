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
        expTotalExpNeeded: 0,
        expTotalRun: 0,
        expTotalSanity: 0,
        expOverflow: 0,
		errorStatement:'',
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
				return this.resourceLmd()
		}
	}
	changeScreenHeight(itemValue){
		switch(itemValue){
			case 'exp':
				this.setState({screenHeight:700})
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
//----------------------EXP----------------------
//-----------------------------------------------

    getExpReqAndDiffrence(currentElite, exp) {
        switch(currentElite){
            case -1:
                exp.req= 0;
                exp.difference = 0;
                break;
            case 0:
                exp.req = 100;
                exp.difference = 17;
                break;
            case 1:
                exp.req = 120;
                exp.difference = 52;
                break;
            case 2:
                exp.req = 191;
                exp.difference = 112;
                break;
        };
    }

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
        let exp = {
            'req' : 0,
            'difference' : 0,
            'total' : 0
        };
        let rarityLevelLimit;
        let currentLevelLimit;
        this.getExpReqAndDiffrence(currentElite, exp);
        let runAmount;
        let overflow = 0;
        switch(rarity) {
            case -1:
                rarityLevelLimit = {
                    'e0' : 0,
                    'e1' : 0,
                    'e2' : 0
                };
                break;
            case 1:
            case 2:
                rarityLevelLimit = {
                    'e0' : 30,
                    'e1' : 0,
                    'e2' : 0
                };
                break;
            case 3:
                rarityLevelLimit = {
                    'e0' : 40,
                    'e1' : 55,
                    'e2' : 0
                };
                break;
            case 4:
                rarityLevelLimit = {
                    'e0' : 45,
                    'e1' : 60,
                    'e2' : 70
                };
                break;
            case 5:
                rarityLevelLimit = {
                    'e0' : 50,
                    'e1' : 70,
                    'e2' : 80
                };
                break;
            case 6:
                rarityLevelLimit = {
                    'e0' : 50,
                    'e1' : 80,
                    'e2' : 90
                };
                break;
        }
        switch(currentElite) {
            case 0:
                currentLevelLimit = rarityLevelLimit.e0;
                break;
            case 1:
                currentLevelLimit = rarityLevelLimit.e1;
                break;
            case 2:
                currentLevelLimit = rarityLevelLimit.e2;
                break;
        }
        if(currentElite <= targetedElite) {
            if(!(currentElite == targetedElite && currentLevel > targetedLevel) && !(targetedElite - currentElite == 1 && currentLevel == currentLevelLimit && targetedLevel == 1)) {
                for(let level = 2; level <= currentLevel; level++) {
                    exp.req += exp.difference;
                }
                while(!(currentElite == targetedElite && currentLevel == targetedLevel)) {
                    if(currentElite < targetedElite && currentLevel == currentLevelLimit) {
                        currentLevel = 1;
                        currentElite++;
                        switch(currentElite) {
                            case 1:
                                currentLevelLimit = rarityLevelLimit.e1;
                                break;
                            case 2:
                                currentLevelLimit = rarityLevelLimit.e2;
                                break;
                        }
                    }
                    exp.total += exp.req;
                    exp.req += exp.difference;
                    currentLevel++;
                }
            }
        }
        runAmount = exp.total / drop;
        if(runAmount - Math.floor(runAmount) != 0) {
            runAmount = Math.floor(runAmount) + 1;
        }
        overflow = (drop*runAmount) - exp.total;
        this.setState({expTotalExpNeeded: exp.total});
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
//----------------------MAIN---------------------
//-----------------------------------------------

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
                          <Picker.Item label="EXP" value="exp"/>
                          <Picker.Item label="LMD" value="lmd"/>
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

//-----------------------------------------------
//----------------------STYLE--------------------
//-----------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    paddingTop: 60,
    backgroundColor:'#000',
    flex:1,
    height:'auto'
  },
  flexStart:{
    flex:1,
    justifyContent:'flex-start'
  },
  flexEnd:{
    flex:1,
    justifyContent:'flex-end'
  },
  header:{
    color:'#eee',
    textAlign:'center',
    fontFamily:'monospace',
    fontSize:40
  },
  text: {
    textAlign: 'center',
    color: '#eee',
    fontSize:16,
    marginTop:40
  },
  textLeft: {
    textAlign: 'left',
    color: '#eee',
    width:'80%',
    fontSize:16,
  },
  textError: {
    textAlign: 'left',
    color: '#f22',
    width:'80%',
    fontSize:16,
  },
  textRequire: {
    textAlign: 'left',
    color: '#eee',
    width:'80%',
    marginTop:40,
    fontSize:16,
  },
  buttonText: {
    textAlign: 'center',
    color: '#eee',
    fontSize:20,
    width:'100%'
  },
  button: {
    textAlign: 'center',
    marginTop:40,
    borderColor:'#aaa',
    borderWidth:1,
    paddingHorizontal:12,
    paddingVertical:12,
    color: '#fff',
    backgroundColor:'#151515',
    width:'80%'
  },
  input:{
    backgroundColor:'#151515',
    marginTop:40,
    color:'#eee',
    paddingHorizontal:12,
    paddingVertical:6,
    width:'80%',
    fontSize:16,
    borderColor:'#aaa',
    borderBottomWidth: 1
  }
});

const picker = StyleSheet.create({
  style:{
    marginTop:40,
    color:'#eee',
    backgroundColor: '#151515',
    width:'100%',
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  container:{
    flex:1,
    width:'100%',
    height:40,
    alignItems:'center'
  },
  underline:{
    width:'80%',
    height:91,
    marginBottom:-15,
    borderColor:'#aaa',
    borderBottomWidth: 1
  },
  itemStyle:{
    backgroundColor:'#151515',
    color:'#eee'
  }
});
