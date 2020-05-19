import React, {Component} from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity,
    Picker,
    TextInput
} from 'react-native';


class ResourceCalculator extends Component {
    state = {
        resource: "none",
        stage: -1,
        targetedValue: 0,
        sanityUsed: 0,
        droppedAmount: 0,
        result: 0
    };

    changeCalculationParameter(stageIndex) {
        switch(stageIndex){
            case "-1":
                this.setState({sanityUsed: 0}, this.setState({droppedAmount: 0}));
                break;
            case "5":
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
            <Text>WORK UNDER PROGRESS</Text>
        )
    }

    resourceLmd = () => {
        
        return(
            <View>
                <Text>Select stage</Text>
                <Picker
                    selectedValue={this.state.stage}
                    onValueChange={(itemValue, itemIndex) => this.setState({stage: itemValue}, this.changeCalculationParameter(itemValue))}
                >
                    <Picker.Item label="-none" value={-1}/>
                    <Picker.Item label="CE-5" value={5}/>
                </Picker>
                <Text>Targeted LMD Amount</Text>
                <TextInput
                    value={this.state.targetedValue.toString()}
                    onChangeText={(input) => this.setState({targetedValue: input})}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress= {() => this.calculateLMD(parseFloat(this.state.targetedValue), parseFloat(this.state.sanityUsed), parseFloat(this.state.droppedAmount))}
                >
                    <Text>Calulate</Text>
                </TouchableOpacity>
                <Text>You need {parseInt(this.state.result)}x run</Text>
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
            <View>
                <Picker
                    selectedValue={this.state.resource}
                    onValueChange={(itemValue, itemIndex) => this.setState({resource: itemValue})}
                >
                    <Picker.Item label="-none-" value="none"/>
                    <Picker.Item label="EXP" value="exp"/>
                    <Picker.Item label="LMD" value="lmd"/>
                </Picker>
                {this.checkSelectedResource(this.state.resource)}
            </View>
        )
    }
}

export default ResourceCalculator;