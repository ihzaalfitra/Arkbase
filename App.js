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

import ResourceCalculator from './resourceCalculator.js';

const contentHeight=Math.round(Dimensions.get('window').height)-100;

class MainClass extends Component {
	render(){
		return(
			<ResourceCalculator>
			</ResourceCalculator>
		)
	}
}

export default MainClass;
