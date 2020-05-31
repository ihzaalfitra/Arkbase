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

import ResourceCalculator from './Component/ResourceCalculator.js';
import navigation from './assets/Stylesheet/navigation.js';

const contentHeight=Math.round(Dimensions.get('window').height)-100;

class MainClass extends Component {
	state = {
		navigationContent:'',
    }
	changeContent(selectedContent){
		switch(selectedContent){
			case 'ResourceCalculator':
				return(
					<ResourceCalculator/>
				)
				break;
			case 'StageInformation':
				return(
					<View>
						<Text>Stage Information</Text>
					</View>
				)
				break;
			default:
				return(
					<ResourceCalculator/>
				)
				break;
		}
	}
	render(){
		return(
			<View style={{flex:1}}>
				{
					this.changeContent(this.state.navigationContent)
				}
				<View style={navigation.container}>
					<View style={{flexDirection:'row'}}>
						<TouchableOpacity
							style={navigation.button}
							onPress={() => this.changeContent('ResourceCalculator')}
						>
							<Text style={navigation.text}>
								Resource Calculator
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={navigation.button}
							onPress={() => this.changeContent('StageInformation')}
						>
							<Text style={navigation.text}>
								Stage Information
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={navigation.button}
							onPress={() => this.changeContent('Operator')}
						>
							<Text style={navigation.text}>
								Operator
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={navigation.button}
							onPress={() => this.changeContent('About')}
						>
							<Text style={navigation.text}>
								About
							</Text>
						</TouchableOpacity>

					</View>
				</View>
			</View>

		)
	}
}

export default MainClass;
