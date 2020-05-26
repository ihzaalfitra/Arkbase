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
    height:40,
    alignItems:'center'
  },
  underline:{
    width:'80%',
    height:91,
    marginBottom:-15,
    borderColor:'#aaa',
    borderBottomWidth: 1
  },
  itemStyle:{
    backgroundColor:'#151515',
    color:'#eee'
  }
});

export default picker;