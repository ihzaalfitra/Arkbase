import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
	KeyboardAvoidingView,
    TouchableOpacity,
	Vibration,
	Platform,
    TextInput
} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
// import Constants from 'expo-constants';
// import * as Permissions from 'expo-permissions';
import {
  AdMobBanner
} from 'expo-ads-admob';

//Note from IA :
//legacy notification api, because expo-notifications is relatively new, there's an error that i can't found the solution
//https://docs.expo.io/versions/latest/sdk/legacy-notifications/
//import { Notifications } from 'expo';

import firebase from '../assets/Firebase/FirebaseDatabase.js';
import styles from '../assets/Stylesheet/styles.js';
import picker from '../assets/Stylesheet/picker.js';

class SanityCalculator extends Component {

	state = {
        errorStatement:-1,
        data: this.props.lmdData,
        stage: 0,
		ownedValue:0,
        targetedValue: 0,
        timeAmount: 0,
		date:'',
		time:0,
		useMonthlyPackage:false
    }
    calculateSanity(owned, target, useMonthlyPackage) {
		let ownedRaw = owned;
		let targetRaw = target;
		if(owned == ''){
			owned = 0;
		}else{
			owned = parseInt(owned);
		}
		target = parseInt(target);
		if(isNaN(owned)){
			this.setState({errorStatement: 'Owned amount must be a number.'})
		}else if(ownedRaw > Number.MAX_SAFE_INTEGER || targetRaw > Number.MAX_SAFE_INTEGER ) {
			this.setState({errorStatement: "Value too big"});
		}else if(owned >= target){
			this.setState({errorStatement: 'Owned amount cannot be greater or equal than targeted amount.'})
		}else if(target <= 0 || isNaN(target)){
			this.setState({errorStatement: 'Target amount must be a number and cannot be zero or blank.'})
		}else{
			this.setState({errorStatement: ''})
		}
		target = target-owned;
		let timeAmount = target * 6;
		var d = new Date(); // get current date
		d.setHours(d.getHours(),d.getMinutes()+timeAmount,d.getSeconds(),0);
		this.setState({date:d.toLocaleDateString()});
		this.setState({time:d.toLocaleTimeString()});
		this.setState({timeAmount: timeAmount});
    }

	getResult(){
		if(this.state.errorStatement == ''){
			return(
				<View style={{width:'80%'}}>
				<Text style={styles.textRequire}>Require:</Text>
				<Text style={styles.textLeft}>{this.state.date} Date</Text>
				<Text style={styles.textLeft}>{this.state.time} Time</Text>
				<Text style={styles.textLeft}>{parseInt(this.state.timeAmount)} minutes</Text>
				</View>
			)
			//uninitialized errorStatement
		}else if (this.state.errorStatement==-1) {
			return(
				null
			)
		//errorStatement was thrown
		}else{
			return(
				<View>
					<Text style={styles.textError}>{this.state.errorStatement}</Text>
				</View>
			)
		}
	}
	//change the style of component underline if there's an error
	styleUnderline(value,componentType,component){
		//check whether error statement is thrown or not. if not, use normal color
		if(this.state.errorStatement==('' || -1) ){
				return(
					styles.input
				)
		}else{
			switch(component){
				//input component error parameter, must be specifically to each of the input to make the error specific
				case 'ownedValue':
					if(value==''){
						value=0;
					}else{
						value=parseInt(value);
					}
					if(isNaN(value)){
						return(
							styles.inputError
						)
					}else{
						return(
							styles.input
						)
					}
					break;
				case 'targetedValue':
					if(value <= 0 || isNaN(value)){
						return(
							styles.inputError
						)
					}else{
						return(
							styles.input
						)
					}
					break;
				default:
					return(
						styles.input
					)
					break;
			}
		}
	}

    render() {
        return(
			<KeyboardAvoidingView style={{flex:9,backgroundColor:'#000',paddingTop:25}}>
				<ScrollView ref={ ( ref ) => this.scrollView = ref } onContentSizeChange={ () => { this.scrollView.scrollToEnd( { animated: true } )} } >
					<View style={{
						alignItems:'center',
					    backgroundColor:'#000',
					}}>
	                    <Text style={styles.header}>Sanity Calculator</Text>
						{/*under-title admob*/}
						<AdMobBanner
						style={{width:"100%",marginLeft:0,marginRight:0}}
						bannerSize="smartBannerLandscape"
						adUnitID="ca-app-pub-3996172719278664/7085878486"
						servePersonalizedAds={true}
						onDidFailToReceiveAdWithError={this.bannerError} />
						<View style={picker.container}>
			                <TextInput
			                    style={this.styleUnderline(this.state.ownedValue, 'textInput', 'ownedValue')}
			                    placeholder="Current sanity"
			                    value={this.input}
			                    onChangeText={(input) => this.setState({ownedValue: input})}
			                    keyboardType="numeric"
			                />
							<TextInput
			                    style={this.styleUnderline(parseFloat(this.state.targetedValue), 'textInput', 'targetedValue')}
			                    placeholder="Target sanity"
			                    value={this.input}
			                    onChangeText={(input) => this.setState({targetedValue: input})}
			                    keyboardType="numeric"
			                />
							{/*
								<View style={{width:'80%',flexDirection:'row',alignItems:'center',marginTop:25,marginBottom:-25}}>
									<CheckBox tintColors={{ true: 'white', false: 'white' }} value={this.state.useMonthlyPackage} onValueChange={(val) => this.setState({useMonthlyPackage:val})}/>
									<Text style={styles.textLeft}>Use monthly package</Text>
								</View>
							*/}
			                <TouchableOpacity
			                    onPress= {()=>{this.calculateSanity(this.state.ownedValue,this.state.targetedValue,this.state.usemuseMonthlyPackage)}}
			                    style={styles.button}
			                >
			                    <Text style={styles.buttonText}>Calculate</Text>
			                </TouchableOpacity>
						    {this.getResult()}
			            </View>
                    </View>
                </ScrollView>
			</KeyboardAvoidingView>
        )
    }
}

export default SanityCalculator;
