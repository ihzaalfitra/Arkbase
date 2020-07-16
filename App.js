import 'react-native-gesture-handler';
import React, {Component} from 'react';
import ResourceCalculator from './Component/ResourceCalculator.js';
import {NavigationContainer,DefaultTheme} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Material from './Component/Material.js';

const Tab = createMaterialTopTabNavigator();

const MyTheme = {
    dark: false,
        colors: {
            primary: 'rgb(230,230,230)',
            background: 'rgb(255, 255, 255)',
            card: 'rgb(41, 41, 41)',
            text: 'rgb(255, 255, 255)',
            border: 'rgb(230,230,230)',
  },
};

class MainClass extends Component {
	render(){
		return(
			<NavigationContainer theme={MyTheme}>
                <Tab.Navigator tabBarPosition="bottom">
                    <Tab.Screen name="ResourceCalculator" component={ResourceCalculator} options={{title: 'Resource Calculator'}}/>
                    <Tab.Screen name="Material" component={Material} options={{title: 'Material'}}/>
                </Tab.Navigator>
            </NavigationContainer>

		)
	}
}

export default MainClass;
