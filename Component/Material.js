  
import React, {Component} from 'react'
import {StyleSheet, Text, View, FlatList, Dimensions, ScrollView, Image } from 'react-native'

import default_styles from '../assets/Stylesheet/styles.js';


const dataList = [{key:''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''}
,{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''}
,{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''}]



const numColumns = 4
const WIDTH =  Dimensions.get('window').width


export default class App extends Component {
  formatData = (dataList, numColumns) => {
    const totalRows = Math.floor(dataList.length / numColumns);
    let totalLastRows = dataList.length - totalRows * numColumns;

    while (totalLastRows !== 0 && totalLastRows !== numColumns) {
      dataList.push({ key: "Blank", empty: true });
      totalLastRows++;
    }
    return dataList;
  };

  _renderItem = ({ item, index }) => {
    let { itemStyle, itemText, itemInvisible } = styles;
    if (item.empty) {
      return <View style={[itemStyle, itemInvisible]} />;
    }
  }


    render(){
      let {container, itemText} = styles

      return (
        <View style = {{container,backgroundColor:'#000',paddingTop: 45,flex:9}}>
			<ScrollView>
				<Text style={default_styles.header}>Materials
				</Text>
		        <FlatList style = {{marginTop: 30}}
					data = {this.formatData(dataList, numColumns)}
		          	renderItem = {this._renderItem}
		          	keyExtractor = {(item, index) => index.toString()}
		          	numColumns = {numColumns}
				/>
		  </ScrollView>

        </View>
      )
    }



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
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
    color: "#fff",
    fontSize: 30,
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  title: {
    backgroundColor: "#000",
    marginTop: 150,
  },
});
