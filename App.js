import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {NavigationContainer,DefaultTheme} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    View
} from 'react-native';

import Material from './Component/Material/Material.js';
import ResourceCalculator from './Component/ResourceCalculator/ResourceCalculator.js';

import {
  AdMobBanner
} from 'expo-ads-admob';

const Tab = createMaterialTopTabNavigator();

const MyTheme = {
    dark: true,
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
			<View style={{flex:1,backgroundColor:'#000'}}>
				<NavigationContainer theme={MyTheme}>
	                <Tab.Navigator tabBarPosition="bottom">
	                    <Tab.Screen name="ResourceCalculator" component={ResourceCalculator} options={{title: 'Resource Calculator'}}/>
	                    <Tab.Screen name="Material" component={Material} options={{title: 'Material'}}/>
	                </Tab.Navigator>
					{/*under-nav admob*/}
					<AdMobBanner
					style={{width:"100%",marginLeft:0,marginRight:0}}
					bannerSize="smartBannerLandscape"
					adUnitID="ca-app-pub-3996172719278664/4877597674"
					servePersonalizedAds="false"
					onDidFailToReceiveAdWithError={this.bannerError} />
	            </NavigationContainer>
			</View>
		)
	}
}

export default MainClass;
