import React, {Component} from 'react';
import {
    Text,
    View,
    Picker,
    ScrollView,
	Dimensions
} from 'react-native';
import firebase from '../assets/Firebase/FirebaseDatabase.js';
import styles from '../assets/Stylesheet/styles.js';
import picker from '../assets/Stylesheet/picker.js';
import LmdModule from './ResourceCalculator/LmdModule.js';
import ExpModule from './ResourceCalculator/ExpModule.js';
import SkillModule from './ResourceCalculator/SkillModule.js';
import FurnPartModule from './ResourceCalculator/FurnPartModule.js';
import BuildMatModule from './ResourceCalculator/BuildMatModule.js';
import ShpVocModule from './ResourceCalculator/ShpVocModule.js';

const contentHeight=Math.round(Dimensions.get('window').height)-100;

class ResourceCalculator extends Component {
    state = {
		screenHeight:contentHeight,
        resource: "none",
        errorStatement:'',
    };

//-----------------------------------------------
//----------------------GENERAL------------------
//-----------------------------------------------

	checkSelectedResource(selectedResource) {
		switch(selectedResource) {
			case "none":
				return this.resourceNone();
				break;
			case "exp":
                return(
                    <ExpModule expReq={this.state.expOpExpReqAllElite} levelLimit={this.state.expOpLevelLimit}/>
                );
				break;
			case "lmd":
                return(
                    <LmdModule/>
                );
                break;
            case "skill":
                return(
                    <SkillModule/>
                );
                break;
            case "furnPart":
                return(
                    <FurnPartModule/>
                );
                break;
            case "buildMat":
                return(
                    <BuildMatModule/>
                );
                break;
            case "voucher":
                return(
                    <ShpVocModule/>
                );
                break;
		}
	}
	changeScreenHeight(itemValue){
		switch(itemValue){
			case 'exp':
				this.setState({screenHeight:850})
				break;
			case 'lmd':
				this.setState({screenHeight:contentHeight})
				break;
			default:
				this.setState({screenHeight:contentHeight})
				break;
		}
	}

    resourceNone = () => {

    }

    loadDatabase() {
        let refDir = "CalculationData/Operator/Leveling/";
        let refDirExpReq = refDir + "ExpReq";
        let refDirLevelLimit = refDir + "LevelLimit";

        let elite0 = [];
        let elite1 = [];
        let elite2 = [];
        let allElite = [];
        let levelLimit = [];
        let tempLimit = [];

        firebase.database().ref(refDirExpReq).once('value', (snapshot) => {
            elite0 = snapshot.child("E0").val();
            elite1 = snapshot.child("E1").val();
            elite2 = snapshot.child("E2").val();

            allElite.push(elite0);
            allElite.push(elite1);
            allElite.push(elite2);

            this.setState({expOpExpReqAllElite: allElite});
        });

        firebase.database().ref(refDirLevelLimit).once('value', (snapshot) => {
            levelLimit.push(tempLimit);
            snapshot.forEach((snapchild) => {
                tempLimit = snapchild.val();
                levelLimit.push(tempLimit);
            });
            this.setState({expOpLevelLimit: levelLimit});
        });

    }

    componentDidMount() {
        this.loadDatabase();
    }

    render() {

        let lmdSanityUsed = 0;
        let lmdDropAmount = 0;

        return(
			<View style={{flex:9,backgroundColor:'#000',paddingTop:25}}>
			<Text style={styles.header}>Resource Calculator</Text>
			<ScrollView>
				<View style={{
					alignItems:'center',
				    backgroundColor:'#000',
				    flex:1,
				    height:this.state.screenHeight
				}}>
                    <View style={picker.container}>
                      <View style={picker.underline}>
                        <Picker
                          style={picker.style}
                          itemStyle={picker.itemStyle}
                          selectedValue={this.state.resource}
                          onValueChange={(itemValue, itemIndex) => this.setState({resource: itemValue}, this.changeScreenHeight(itemValue))}
                        >
                          <Picker.Item label="Select resource" value={null}/>
                          <Picker.Item label="BATTLE RECORD (EXP)" value="exp"/>
                          <Picker.Item label="LMD" value="lmd"/>
                          <Picker.Item label="SKILL SUMMARY" value={"skill"}/>
                          <Picker.Item label="FURNITURE PART" value={"furnPart"}/>
                          <Picker.Item label="BUILDING MATERIAL" value={"buildMat"}/>
                          <Picker.Item label="SHOP VOUCHER" value={"voucher"}/>
                          </Picker>
                      </View>
                      {this.checkSelectedResource(this.state.resource)}
                    </View>
                    </View>
                </ScrollView>
			</View>
        )
    }
}

export default ResourceCalculator;