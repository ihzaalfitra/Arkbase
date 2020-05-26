import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    paddingTop: 60,
    backgroundColor:'#000',
    flex:1,
    height:'auto'
  },
  flexStart:{
    flex:1,
    justifyContent:'flex-start'
  },
  flexEnd:{
    flex:1,
    justifyContent:'flex-end'
  },
  header:{
    color:'#eee',
    textAlign:'center',
    fontFamily:'monospace',
    fontSize:40
  },
  text: {
    textAlign: 'center',
    color: '#eee',
    fontSize:16,
    marginTop:40
  },
  textLeft: {
    textAlign: 'left',
    color: '#eee',
    width:'80%',
    fontSize:16,
  },
  textError: {
    textAlign: 'left',
    color: '#f22',
    width:'80%',
    fontSize:16,
  },
  textRequire: {
    textAlign: 'left',
    color: '#eee',
    width:'80%',
    marginTop:40,
    fontSize:16,
  },
  buttonText: {
    textAlign: 'center',
    color: '#eee',
    fontSize:20,
    width:'100%'
  },
  button: {
    textAlign: 'center',
    marginTop:40,
    borderColor:'#aaa',
    borderWidth:1,
    paddingHorizontal:12,
    paddingVertical:12,
    color: '#fff',
    backgroundColor:'#151515',
    width:'80%'
  },
  input:{
    backgroundColor:'#151515',
    marginTop:40,
    color:'#eee',
    paddingHorizontal:12,
    paddingVertical:6,
    width:'80%',
    fontSize:16,
    borderColor:'#aaa',
    borderBottomWidth: 1
  }
});

export default styles;