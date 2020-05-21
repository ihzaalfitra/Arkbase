import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Picker,
    TextInput,
    ScrollView,
    Modal
} from 'react-native';


class ResourceCalculator extends Component {
    state = {
        resource: "none",
        stage: -1,
        targetedValue: 0,
        sanityUsed: 0,
        droppedAmount: 0,
        result: 0,
        operatorRarity:-1
    };

    changeCalculationParameter(stageIndex) {
        switch(stageIndex){
            case -1:
                this.setState({sanityUsed: 0}, this.setState({droppedAmount: 0}));
                break;
            case 5:
                this.setState({sanityUsed: 30}, this.setState({droppedAmount: 7500}));
                break;
        }
    }

    calculateLMD(target, sanity, drop) {
        let runAmount = target / drop;
        if(runAmount - Math.floor(runAmount) != 0) {
            runAmount = Math.floor(runAmount) + 1;
        }
        this.setState({result: runAmount});

    }

    resourceNone = () => {
        return(
            <Text>Please select the resource you want to farm.</Text>
        )
    }

    resourceExp = () => {
        return(
          <View style={picker.container}>
              <View style={picker.underline}>
                <Picker
                    style={picker.style}
                    selectedValue={this.state.stage}
                    onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeCalculationParameter(itemValue))}
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
                    selectedValue={this.state.stage}
                    onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeCalculationParameter(itemValue))}
                >
                    <Picker.Item label="Select current elite" value={-1}/>
                    <Picker.Item label="Elite 0" value={0}/>
                    <Picker.Item label="Elite 1" value={1}/>
                    <Picker.Item label="Elite 2" value={2}/>
                </Picker>
              </View>
              <TextInput
                    style={styles.input}
                    placeholder="Current level"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedValue: input})}
                    keyboardType="numeric"
              />
              <View style={picker.underline}>
                <Picker
                    style={picker.style}
                    selectedValue={this.state.stage}
                    onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeCalculationParameter(itemValue))}
                >
                    <Picker.Item label="Select target elite" value={-1}/>
                    <Picker.Item label="Elite 0" value={0}/>
                    <Picker.Item label="Elite 1" value={1}/>
                    <Picker.Item label="Elite 2" value={2}/>
                </Picker>
              </View>
              <TextInput
                    style={styles.input}
                    placeholder="Target level"
                    value={this.input}
                    onChangeText={(input) => this.setState({targetedValue: input})}
                    keyboardType="numeric"
              />
              <View style={picker.underline}>
                <Picker
                    style={picker.style}
                    selectedValue={this.state.stage}
                    onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeCalculationParameter(itemValue))}
                >
                    <Picker.Item label="Select stage" value={-1}/>
                    <Picker.Item label="LS-5" value={5}/>
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
                    onPress= {() => this.calculateLMD(parseFloat(this.state.targetedValue), parseFloat(this.state.sanityUsed), parseFloat(this.state.droppedAmount))}
                    style={styles.button}
              >
                  <Text style={styles.buttonText}>Calculate</Text>
              </TouchableOpacity>
              <Text style={styles.textRequire}>Require:</Text>
              <Text style={styles.textLeft}>{parseInt(this.state.result)} run</Text>
              <Text style={styles.textLeft}>{parseInt(this.state.result)*30} sanity</Text>
            </View>
        )
    }

    resourceLmd = () => {

        return(
          <View style={picker.container}>
              <View style={picker.underline}>
                <Picker
                    style={picker.style}
                    selectedValue={this.state.stage}
                    onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeCalculationParameter(itemValue))}
                >
                    <Picker.Item label="Select stage" value={-1}/>
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
                    onPress= {() => this.calculateLMD(parseFloat(this.state.targetedValue), parseFloat(this.state.sanityUsed), parseFloat(this.state.droppedAmount))}
                    style={styles.button}
              >
                  <Text style={styles.buttonText}>Calculate</Text>
              </TouchableOpacity>
              <Text style={styles.textRequire}>Require:</Text>
              <Text style={styles.textLeft}>{parseInt(this.state.result)} run</Text>
              <Text style={styles.textLeft}>{parseInt(this.state.result)*30} sanity</Text>
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

    render() {

        let sanityUsed = 0;
        let droppedAmount = 0;

        return(
          // <ScrollView style={{backgroundColor:'#123456',height:'auto'}}>
            <View style={styles.container}>
                <Text style={styles.header}>Resource Calculator</Text>
                <View style={picker.container}>
                  <View style={picker.underline}>
                    <Picker
                      style={picker.style}
                      itemStyle={picker.itemStyle}
                      selectedValue={this.state.resource}
                      onValueChange={(itemValue, itemIndex) => this.setState({resource: itemValue})}
                    >
                      <Picker.Item label="Select resource" value={null}/>
                      <Picker.Item label="EXP" value="exp"/>
                      <Picker.Item label="LMD" value="lmd"/>
                      </Picker>
                  </View>
                  {this.checkSelectedResource(this.state.resource)}
                </View>
            </View>
          // </ScrollView>
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
