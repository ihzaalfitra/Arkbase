import { StyleSheet } from 'react-native';

const picker = StyleSheet.create({
  style:{
    marginTop:40,
    color:'#eee',
    backgroundColor: '#151515',
    width:'100%',
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  container:{
    flex:1,
    width:'100%',
    alignItems:'center'
  },
  containerScrollView: {
    width:'100%',
    flex:1
  },
  scrollViewAlignItems:{
	  alignItems:'center',
  },
  underline:{
    width:'80%',
    borderColor:'#aaa',
    borderBottomWidth: 1
  },
  underlineError:{
    width:'80%',
    borderColor:'#f22',
    borderBottomWidth: 1
  },
  underline_100:{
	width:'100%',
    borderColor:'#aaa',
    borderBottomWidth: 1,
	textAlign:'center'
  },
  underlineError_100:{
    width:'100%',
    borderColor:'#f22',
    borderBottomWidth: 1
  },
  itemStyle:{
    backgroundColor:'#151515',
    color:'#eee'
  }
});

export default picker;
