import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import ResourceCalculator from './Component/ResourceCalculator.js';
import Material from './Component/Material.js';
import navigation from './assets/Stylesheet/navigation.js';

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
			case 'Material':
				return(
					<Material/>
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
							onPress={() => this.setState({navigationContent:'ResourceCalculator'})}
						>
							<Text style={navigation.text}>
								Resource Calculator
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={navigation.button}
							onPress={() => this.setState({navigationContent:'Material'})}
						>
							<Text style={navigation.text}>
								Material
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
