import React, {Component} from 'react'
import {StyleSheet, Text, View, FlatList, Dimensions, ScrollView } from 'react-native'

import default_styles from '../assets/Stylesheet/styles.js';

const dataList = [{key: '1'}, {key: '2'}, {key: '3'}, {key: '4'}, {key: '5'},{key: '6'}, {key: '7'}, {key: '8'}, {key: '9'}, {key: '10'},{key: '11'}, {key: '12'}, {key: '13'}, {key: '14'}, {key: '15'}
,{key: '16'}, {key: '17'}, {key: '18'}, {key: '19'}, {key: '20'},{key: '21'}, {key: '22'}, {key: '23'}, {key: '24'}, {key: '25'},{key: '26'}, {key: '27'}, {key: '28'}, {key: '29'}, {key: '30'}]



const numColumns = 4
const WIDTH =  Dimensions.get('window').width

export default class App extends Component {


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
      let{itemStyle, itemText, itemInvisible} = styles
      if(item.empty){
        return <View style = {[itemStyle, itemInvisible]}/>
      }
      return (

        <View style = {itemStyle}>
          <Text style = {itemText}>{item.key}</Text>
        </View>
      )
    }

    render(){
      let {container, itemText} = styles

      return (
        <View style = {{container,backgroundColor:'#000',paddingTop: 25,flex:9}}>
			<ScrollView>
				<Text style={default_styles.header}>Materials
				</Text>
		        <FlatList
					data = {this.formatData(dataList, numColumns)}
		          	renderItem = {this._renderItem}
		          	keyExtractor = {(item, index) => index.toString()}
		          	numColumns = {numColumns}
				/>
		  </ScrollView>

        </View>
      )
    }

}


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
    margin : 20,
    borderWidth: 2,
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 20,
    borderColor: '#fff',
    height: WIDTH/ numColumns,


  },
  itemText: {
    color:'#fff',
    fontSize:30
  },
  itemInvisible:{
    backgroundColor:'transparent'
  },
  title:{
    backgroundColor: '#000',
    marginTop: 150
  }
});
