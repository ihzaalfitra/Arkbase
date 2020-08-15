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

class App extends Component {
constructor() {
	super();

	/**
	* Returns true if the screen is in portrait mode
	*/
	const isPortrait = () => {
	  const dim = Dimensions.get('screen');
	  return dim.height > dim.width;
	};
	this.state = {
	    matDatabase: [],
	    matReq: [],
	    isLoaded: false,
	  	numColumns: isPortrait() ? 4 : 8,
	  	width:Dimensions.get('window').width
    };
	// Event Listener for orientation changes
	Dimensions.addEventListener('change', () => {
		this.setState({
			numColumns: isPortrait() ? 4 : 8,
			width:Dimensions.get('window').width
		});
	});

}


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
            picId: dropStage[0].data.picId,
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
        style = {{
			backgroundColor: '#000',
		    alignItems: 'center',
		    justifyContent : 'center',
		    flex:1,
		    borderWidth: 2,
		    marginHorizontal: 5,
		    marginVertical: 5,
		    borderColor: '#292929',
		    height:this.state.width/this.state.numColumns+20
		}}
        onPress={() => navigation.push('Details', {
          data: this.state.matDatabase[index],
          matReq: this.state.matReq[index]
        })}
      >
        <Image
          //blurRadius={1}
          fadeDuration={1000}
          style={styles.icon}
          source={{
            uri:"https://cdn.ihzaa.com/arkbase/"+item.data.picId,
            width: 70,
            height: 70
          }}
          resizeMode="contain"
        />
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
      <View style = {{container,backgroundColor:'#000',paddingTop: 30,flex:9}}>
		    <ScrollView>
		    	<Text style={default_styles.header}>Materials</Text>
		        <FlatList style = {{marginTop: 30}}
		    		  data = {this.state.matDatabase}
		          renderItem = {this._renderItem}
		          keyExtractor = {(item, index) => index.toString()}
		          numColumns = {this.state.numColumns}
				  key= {this.state.numColumns}
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
  itemText: {
    color:'#fff',
    fontSize:10,
    textAlign: "center"
  },
  itemInvisible:{
    backgroundColor:'transparent'
  },
  title:{
    backgroundColor: '#000',
    marginTop: 150
  }
});
