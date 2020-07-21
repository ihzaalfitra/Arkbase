import React, {Component} from 'react';
import {
    Text,
    View,
    Picker,
    ScrollView,
	Dimensions
} from 'react-native';
import styles from '..//assets/Stylesheet/styles.js';
import picker from '../assets/Stylesheet/picker.js';

class ResourceCalculator extends Component {
	isPortrait(){
		const dim = Dimensions.get('screen');
		return dim.height>=dim.width;
	}
    state = {
		orientation:this.isPortrait()?'portraite':'landscape'
    };

	render() {

        return(
			<View style={{flex:9,backgroundColor:'#000',paddingTop:25}}>
				<Text style={styles.textLeft}>orientation is :{this.state.orientation}</Text>
			</View>
        )
    }
}

export default ResourceCalculator;
