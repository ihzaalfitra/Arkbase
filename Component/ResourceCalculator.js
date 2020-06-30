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

class ResourceCalculator extends Component {
    state = {
        resource: "none",
        errorStatement:'',

        expOpExpReqAllElite: [],
        expOpLevelLimit: [],
        expData: [],

        lmdData: [],

        skillData: [],

        furnPartData: [],

        buildMatBuildingData: {},
        buildMatBuildMatData: {},

        shpVocData: [],

        isDataLoaded: false
    };

	checkSelectedResource(selectedResource) {
		switch(selectedResource) {
			case "none":
				return;
				break;
			case "exp":
                return(
                    <ExpModule expReq={this.state.expOpExpReqAllElite} levelLimit={this.state.expOpLevelLimit} stageData={this.state.expData}/>
                );
				break;
			case "lmd":
                return(
                    <LmdModule lmdData={this.state.lmdData}/>
                );
                break;
            case "skill":
                return(
                    <SkillModule skillData={this.state.skillData}/>
                );
                break;
            case "furnPart":
                return(
                    <FurnPartModule furnPartData={this.state.furnPartData}/>
                );
                break;
            case "buildMat":
                return(
                    <BuildMatModule buildingData={this.state.buildMatBuildingData} buildMatData={this.state.buildMatBuildMatData}/>
                );
                break;
            case "voucher":
                return(
                    <ShpVocModule shpVocData={this.state.shpVocData}/>
                );
                break;
		}
	}

    loadOpDatabase() {
        let refDir = "CalculationData/Operator/Leveling/";
        let refDirExpReq = refDir + "ExpReq";
        let refDirLevelLimit = refDir + "LevelLimit";
        let refDirStageData = "CalculationData/Farming/Exp"

        let elite0 = [];
        let elite1 = [];
        let elite2 = [];
        let allElite = [];
        let levelLimit = [];
        let tempLimit = [];
        let stageData = [];

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

        firebase.database().ref(refDirStageData).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                stageData.push(snapchild.val());
            });
            this.setState({expData: stageData});
        });
    }

    loadLmdDatabase() {
        let refDir = "CalculationData/Farming/Lmd";
        let data = [];

        return firebase.database().ref(refDir).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                data.push(snapchild.val());
            });
            this.setState({lmdData: data});
        });
    }

    loadSkillDatabase() {
        let refDir = "CalculationData/Farming/Skill";
        let data = [];

        firebase.database().ref(refDir).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                data.push(snapchild.val());
            });
            this.setState({skillData: data});
        });
    }
    loadFurnPartDatabase() {
        let refDir = "CalculationData/Farming/FurniturePart"
        let data = [];

        firebase.database().ref(refDir).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                data.push(snapchild.val());
            });
            this.setState({furnPartData: data});
        });
    }

    loadBuildMatDatabase() {
        let refDirBuilding = "CalculationData/Building";
        let refDirBuildMat = "CalculationData/BuildMat";
        let buildingData = {};
        let buildMatData = {};

        firebase.database().ref(refDirBuilding).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                buildingData[snapchild.key] = snapchild.val();
            });
            this.setState({buildMatBuildingData: buildingData});
        });

        firebase.database().ref(refDirBuildMat).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                buildMatData[snapchild.key] = snapchild.val();
            });
            this.setState({buildMatBuildMatData: buildMatData});
        });
    }

    loadShpVocDatabase() {
        let refDir = "CalculationData/Farming/ShopVoucher"
        let data = [];

        firebase.database().ref(refDir).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                data.push(snapchild.val());
            });
            this.setState({shpVocData: data});
        });
    }

    componentDidMount() {
        this.loadOpDatabase();
        this.loadLmdDatabase().then(() => this.setState({isDataLoaded: true}));
        this.loadSkillDatabase();
        this.loadFurnPartDatabase();
        this.loadBuildMatDatabase();
        this.loadShpVocDatabase();
    }

    render() {

        const blank = <View></View>;

        return(
			<View style={{flex:9,backgroundColor:'#000',paddingTop:25}}>
			    
			
			<ScrollView>
				<View style={{
					alignItems:'center',
				    backgroundColor:'#000',
				}}>
                    <Text style={styles.header}>Resource Calculator</Text>
                    <View style={picker.container}>
                      <View style={picker.underline}>
                        <Picker
                          style={picker.style}
                          itemStyle={picker.itemStyle}
                          selectedValue={this.state.resource}
                          onValueChange={(itemValue, itemIndex) => this.setState({resource: itemValue})}
                        >
                          <Picker.Item label="Select resource" value={null}/>
                          <Picker.Item label="BATTLE RECORD (EXP)" value={"exp"}/>
                          <Picker.Item label="LMD" value={"lmd"}/>
                          <Picker.Item label="SKILL SUMMARY" value={"skill"}/>
                          <Picker.Item label="FURNITURE PART" value={"furnPart"}/>
                          <Picker.Item label="BUILDING MATERIAL" value={"buildMat"}/>
                          <Picker.Item label="SHOP VOUCHER" value={"voucher"}/>
                          </Picker>
                      </View>
                      {this.state.isDataLoaded ? this.checkSelectedResource(this.state.resource) : blank}
                    </View>
                    </View>
                </ScrollView>
				
			</View>
        )
    }
}

export default ResourceCalculator;
