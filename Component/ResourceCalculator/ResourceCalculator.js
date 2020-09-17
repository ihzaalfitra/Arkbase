import React, {Component} from 'react';
import {
    Text,
    View,
    Picker,
    ScrollView,
	Dimensions,
	KeyboardAvoidingView
} from 'react-native';
import {
  AdMobBanner
} from 'expo-ads-admob';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

import firebase from '../../assets/Firebase/FirebaseDatabase.js';
import styles from '../../assets/Stylesheet/styles.js';
import picker from '../../assets/Stylesheet/picker.js';
import LmdModule from './LmdModule.js';
import ExpModule from './ExpModule.js';
import SkillModule from './SkillModule.js';
import FurnPartModule from './FurnPartModule.js';
import BuildMatModule from './BuildMatModule.js';
import ShpVocModule from './ShpVocModule.js';

//List of all the custom font
let customFonts = {
    'Butler-Regular-Stencil': require('../../assets/Butler_Regular_Stencil.otf'),
};


class ResourceCalculator extends Component {
    state = {
        resource: "none",
        errorStatement:'',
        fontsLoaded: false,
        

        isLoaded: false,

        expOpExpReqAllElite: [],
        expOpLmdReq: {},
        expOpLevelLimit: [],
        expData: [],

        lmdData: [],

        skillData: [],

        furnPartData: [],

        buildMatBuildingData: {},
        buildMatBuildMatData: {},

        shpVocData: []
    };

    //method to load the font
    _loadFontsAsync = async() => {
        await Font.loadAsync(customFonts);
        this.setState({fontsLoaded: true});
    }

	checkSelectedResource(selectedResource) {
        if(this.state.isLoaded) {
            switch(selectedResource) {
                case "none":
                    return;
                    break;
                case "exp":
                    return(
                        <ExpModule expReq={this.state.expOpExpReqAllElite} lmdReq={this.state.expOpLmdReq} levelLimit={this.state.expOpLevelLimit} stageData={this.state.expData} lmdData={this.state.lmdData}/>
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
        else{
            return
        }
	}

    loadOpDatabase() {
        let refDir = "CalculationData/Operator/Leveling/";
        let refDirExpReq = refDir + "ExpReq";
        let refDirLmdReq = refDir + "LmdReq";
        let refDirLevelLimit = refDir + "LevelLimit";
        let refDirStageData = "CalculationData/Farming/Exp"

        let elite0 = [];
        let elite1 = [];
        let elite2 = [];
        let allElite = [];
        let lmdReq = {};
        let levelLimit = [];
        let tempLimit = [];
        let stageData = [];

        return firebase.database().ref(refDirExpReq).once('value', (snapshot) => {
            elite0 = snapshot.child("E0").val();
            elite1 = snapshot.child("E1").val();
            elite2 = snapshot.child("E2").val();

            allElite.push(elite0);
            allElite.push(elite1);
            allElite.push(elite2);

            this.setState({expOpExpReqAllElite: allElite});
        })
        .then(() => {
            firebase.database().ref(refDirLmdReq).once('value', (snapshot) => {
                lmdReq = {
                    "PromoteCost": snapshot.child("PromoteCost").val(),
                    "UpgradeCost": snapshot.child("UpgradeCost").val()
                };
                this.setState({expOpLmdReq: lmdReq});
            });
        })
        .then(() =>
            firebase.database().ref(refDirLevelLimit).once('value', (snapshot) => {
                levelLimit.push(tempLimit);
                snapshot.forEach((snapchild) => {
                    tempLimit = snapchild.val();
                    levelLimit.push(tempLimit);
                });
                this.setState({expOpLevelLimit: levelLimit});
            })
        )
        .then(() =>
            firebase.database().ref(refDirLevelLimit).once('value', (snapshot) => {
                levelLimit.push(tempLimit);
                snapshot.forEach((snapchild) => {
                    tempLimit = snapchild.val();
                    levelLimit.push(tempLimit);
                });
                this.setState({expOpLevelLimit: levelLimit});
            })
        )
        .then(() =>
            firebase.database().ref(refDirStageData).once('value', (snapshot) => {
                snapshot.forEach((snapchild) => {
                    stageData.push(snapchild.val());
                });
                this.setState({expData: stageData});
            })
        )
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

        return firebase.database().ref(refDir).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                data.push(snapchild.val());
            });
            this.setState({skillData: data});
        });
    }
    loadFurnPartDatabase() {
        let refDir = "CalculationData/Farming/FurniturePart"
        let data = [];

        return firebase.database().ref(refDir).once('value', (snapshot) => {
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

        return firebase.database().ref(refDirBuilding).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                buildingData[snapchild.key] = snapchild.val();
            });
            this.setState({buildMatBuildingData: buildingData});
        })
        .then(() =>
            firebase.database().ref(refDirBuildMat).once('value', (snapshot) => {
                snapshot.forEach((snapchild) => {
                    buildMatData[snapchild.key] = snapchild.val();
                });
                this.setState({buildMatBuildMatData: buildMatData});
            })
        );
    }

    loadShpVocDatabase() {
        let refDir = "CalculationData/Farming/ShopVoucher"
        let data = [];

        return firebase.database().ref(refDir).once('value', (snapshot) => {
            snapshot.forEach((snapchild) => {
                data.push(snapchild.val());
            });
            this.setState({shpVocData: data});
        });
    }

    componentDidMount() {
        // console.log(this.loadLmdDatabase());
        this.loadLmdDatabase()
        .then(this.loadSkillDatabase())
        .then(this.loadFurnPartDatabase())
        .then(this.loadShpVocDatabase())
        .then(this.loadOpDatabase())
        .then(this.loadBuildMatDatabase())
        .then(this.setState({isLoaded: true}));
        this._loadFontsAsync();
    }

    render() {
        switch(this.state.fontsLoaded) {
            case false:
                return <AppLoading/>
            case true:
                return(
                    <KeyboardAvoidingView style={{flex:9,backgroundColor:'#000',paddingTop:25}}>
                    <ScrollView ref={ ( ref ) => this.scrollView = ref } onContentSizeChange={ () => { this.scrollView.scrollToEnd( { animated: true } )} } >
                        <View style={{
                            alignItems:'center',
                            backgroundColor:'#000',
                        }}>
                            <Text style={[styles.header, {fontFamily: 'Butler-Regular-Stencil', fontSize: 50}]}>Resource Calculator</Text>
                            {/*under-title admob*/}
                            {/* <AdMobBanner
                            style={{width:"100%",marginLeft:0,marginRight:0}}
                            bannerSize="smartBannerLandscape"
                            adUnitID="ca-app-pub-3996172719278664/3274524358"
                            servePersonalizedAds={true}
                            onDidFailToReceiveAdWithError={this.bannerError} /> */}
        
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
                                  <Picker.Item label="BUILDING MATERIAL" value={"buildMat"}/>
                                  <Picker.Item label="FURNITURE PART" value={"furnPart"}/>
                                  <Picker.Item label="LMD" value={"lmd"}/>
                                  <Picker.Item label="SHOP VOUCHER" value={"voucher"}/>
                                  <Picker.Item label="SKILL SUMMARY" value={"skill"}/>
                                  </Picker>
                              </View>
                              {this.checkSelectedResource(this.state.resource)}
                            </View>
                            </View>
                        </ScrollView>
                        <ExpoStatusBar style="auto" />
                    </KeyboardAvoidingView>
                );
        }
    
    }
}

export default ResourceCalculator;
