import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import GridView from './GridView.js';
import Details from './Details.js';

const Stack = createStackNavigator();

class Material extends Component{
    render() {
        return(
            <Stack.Navigator initialRouteName="GridView">
                <Stack.Screen 
                    name="GridView" 
                    component={GridView}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen 
                    name="Details" 
                    component={Details}
                />
            </Stack.Navigator>
        )
    }
}

export default Material;