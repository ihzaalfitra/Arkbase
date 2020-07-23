import React, {Component} from 'react'
import {StyleSheet, Text, View, FlatList, Dimensions, ScrollView, Image, SafeAreaView } from 'react-native'

import default_styles from '../../assets/Stylesheet/styles.js';


const dataList = [{key:''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''}
,{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''}
,{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''},{key: ''}, {key: ''}, {key: ''}, {key: ''}, {key: ''}]

export default class App extends Component {
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
        <View style = {{
			backgroundColor: '#000',
		    alignItems: 'center',
		    justifyContent : 'center',
		    flex:1,
		    margin : 30,
		    borderWidth: 2,
		    borderRadius: 10,
		    marginHorizontal: 10,
		    marginVertical: 30,
		    borderColor: '#fff',
		    height:this.state.width/this.state.numColumns-10
		}}>
          <Text style = {itemText}>{item.key}</Text>
        </View>
      )
    }

    render(){
      let {container, itemText} = styles

      return (
        <View style = {{container,backgroundColor:'#000',paddingTop: 45,flex:9}}>
			<ScrollView>
				<Text style={default_styles.header}>Materials
				</Text>
		        <FlatList style = {{marginTop: 30}}
					data = {this.formatData(dataList, this.state.numColumns)}
		          	renderItem = {this._renderItem}
		          	keyExtractor = {(item, index) => index.toString()}
		          	numColumns = {this.state.numColumns}
					key = {this.state.numColumns}
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
