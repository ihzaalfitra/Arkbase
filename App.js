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
        expOpTargetedLevel: 0
    };

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

    }

    calculateExp(rarity, currentElite, currentLevel, targetedElite, targetedLevel, sanity, drop) {
        let startingExpReq = 0;
        let expDifference = 0;
        let levelLimit = 0
        switch(currentElite){
            case -1:
                startingExpReq = 0;
                expDifference = 0;
                break;
            case 0:
                startingExpReq = 100;
                expDifference = 17;
                break;
            case 1:
                startingExpReq = 120;
                expDifference = 52;
                break;
            case 2:
                startingExpReq = 191;
                expDifference = 112;
                break;
        };
        switch(rarity) {
            case -1:
                levelLimit = 0;
                break;
            case 1:
            case 2:
                levelLimit = 30;
                break;
            case 3:
                levelLimit = 40;
                break;
            case 4:
                levelLimit = 45;
                break;
            case 5:
            case 6:
                levelLimit = 50;
                break;
        }
        if(currentElite <= targetedElite) {
            if(!(currentElite == targetedElite && currentLevel > targetedLevel)) {
                console.log("WORKING");
            }
        }

    }

    resourceNone = () => {
        return(
            <Text style={styles.textLeft}>Please select the resource you want to farm.</Text>
        )
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
            </View>
        )
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
              <Text style={styles.textRequire}>Require:</Text>
              <Text style={styles.textLeft}>{parseInt(this.state.lmdTotalRun)} run</Text>
              <Text style={styles.textLeft}>{parseInt(this.state.lmdTotalSanity)} sanity</Text>
              <Text style={styles.textLeft}> </Text>
              <Text style={styles.textLeft}>You will get {parseInt(this.state.lmdOverflow)} extra LMD</Text>
            </View>

        )
    }

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
