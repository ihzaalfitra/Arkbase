import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {NavigationContainer,DefaultTheme} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    View
} from 'react-native';
import * as Analytics from 'expo-firebase-analytics';

import Material from './Component/Material/Material.js';
import ResourceCalculator from './Component/ResourceCalculator/ResourceCalculator.js';
import SanityCalculator from './Component/SanityCalculator.js';

import {
  AdMobBanner,
  setTestDeviceIDAsync
} from 'expo-ads-admob';

/*This line is to disable the ads for development
PLEASE COMMENT THIS LINE WHEN AT DEVELOPMENT, AND UNCOMMENT IT BEFORE BUILDING*/
setTestDeviceIDAsync('EMULATOR');

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

    //Function to get the screen name from the tab navigation
    getActiveRouteName(navigationState) {
        if (!navigationState) return null;
        const route = navigationState.routes[navigationState.index];
        // Parse the nested navigators
        if (route.routes) return this.getActiveRouteName(route);
        return route.name;
    }

    componentDidMount() {
        //Enabling debugger for Analitics
        Analytics.setDebugModeEnabled(true);

        Analytics.setCurrentScreen('ResourceCalculator');
    }

	render(){
		return(
            <NavigationContainer
                theme={MyTheme}
                onStateChange={(currentState, prevState) => {
                    const currentScreen = this.getActiveRouteName(currentState);
                    const prevScreen = this.getActiveRouteName(prevState);
                    if (prevScreen !== currentScreen) {
                        Analytics.setCurrentScreen(currentScreen);
                    }
                }}
            >
                <Tab.Navigator tabBarPosition="bottom">
                    <Tab.Screen name="ResourceCalculator" component={ResourceCalculator} options={{title: 'Resource Calculator'}}/>
                    <Tab.Screen name="Material" component={Material} options={{title: 'Material'}}/>
					<Tab.Screen name="SanityCalculator" component={SanityCalculator} options={{title: 'Sanity Calculator'}}/>
                </Tab.Navigator>
				{/*under-nav admob*/}
				<AdMobBanner
				style={{width:"100%",marginLeft:0,marginRight:0}}
				bannerSize="smartBannerLandscape"
				adUnitID="ca-app-pub-3996172719278664/4877597674"
				servePersonalizedAds={true}
				onDidFailToReceiveAdWithError={this.bannerError} />
            </NavigationContainer>

		)
	}
}

export default MainClass;
