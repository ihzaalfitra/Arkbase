import React, {Component} from 'react'
import {
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    Dimensions, 
    ScrollView, 
    Image,
    TouchableOpacity 
} from 'react-native'
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import default_styles from '../../assets/Stylesheet/styles.js';
import firebase from '../../assets/Firebase/FirebaseDatabase.js';



const numColumns = 4;
const WIDTH =  Dimensions.get('window').width;

class App extends Component {

  state = {
    matDatabase: [],
    matReq: [],
    isLoaded: false
  };

  loadDatabase() {
    let ref = "Material";
    let groupId = [];
    let data = [];
    let database = [];
    let matReqWithId = [];
    let matReqWithName = [];
    let matReqWithNameSub = [];
    let dropStage = {};

    return firebase.database().ref(ref).once('value', (snapshot) => {
      snapshot.forEach((snapchild) => {
        groupId.push(snapchild.key)
        data.push(snapchild.val());
      });
      data.forEach((item, index) => {
        item.forEach((subitem, subindex) => {
          database.push({
            id: groupId[index] + "/" + subindex.toString(),
            data: subitem
          });
          matReqWithId.push(subitem.matReq ? subitem.matReq : []);
        });
      });
      // console.log(matReqWithId);
      matReqWithId.forEach((item) => {
        matReqWithNameSub = [];
        item.forEach((subitem) => {
          dropStage =  database.filter(obj => {
            return obj.id === subitem.matId;
          });
          matReqWithNameSub.push({
            name: dropStage[0].data.name,
            pictId: dropStage[0].data.pictId,
            amount: subitem.amount
          });
        });
        matReqWithName.push(matReqWithNameSub);
      });
      this.setState({matReq: matReqWithName});
      this.setState({matDatabase: database});
    });
  }
  
  formatData = (dataList, numColumns) => {
    const totalRows = Math.floor(dataList.length / numColumns)
    let totalLastRows = dataList.length - (totalRows * numColumns)

    while(totalLastRows !== 0 && totalLastRows !== numColumns){
      dataList.push({key: 'Blank',empty : true})
      totalLastRows++
    }
    return dataList
  }

  _renderItem = ({item, index}) => {
    const {navigation} = this.props;
    let{itemStyle, itemText, itemInvisible} = styles
    if(item.empty){
      return <View style = {[itemStyle, itemInvisible]}/>
    }
    return (
      <TouchableOpacity 
        style = {itemStyle}
        onPress={() => navigation.push('Details', {
          data: this.state.matDatabase[index],
          matReq: this.state.matReq[index]
        })}
      >
        <Text style = {itemText}>{item.data.name}</Text>
      </TouchableOpacity>
    )
  }

  componentDidMount() {
    this.loadDatabase()
    .then(() => this.setState({isLoaded: true}));
  }

  render(){
    let {container, itemText} = styles

    return (
      <View style = {{container,backgroundColor:'#000',paddingTop: 45,flex:9}}>
		    <ScrollView>
		    	<Text style={default_styles.header}>Materials</Text>
		        <FlatList style = {{marginTop: 30}}
		    		  data = {this.state.matDatabase}
		          renderItem = {this._renderItem}
		          keyExtractor = {(item, index) => index.toString()}
		          numColumns = {numColumns}
		    	  />
		    </ScrollView>
        <ExpoStatusBar style="auto" />
      </View>
    )
  }
}

export default App;

const styles = StyleSheet.create(
  {
  container: {
    flex:1,
    paddingTop : 40,


  },
  itemStyle:{
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent : 'center',
    height : 100,
    flex:1,
    margin : 30,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 30,
    borderColor: '#fff',
    height: WIDTH/ numColumns,


  },
  itemText: {
    color:'#fff',
    fontSize:10
  },
  itemInvisible:{
    backgroundColor:'transparent'
  },
  title:{
    backgroundColor: '#000',
    marginTop: 150
  }
});
