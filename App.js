// import SpesifikasiScreen from './spesifikasi';
// ---------------------------------- FOR PAGING ------------------------------------
import React from 'react';
import {ScrollView, TouchableOpacity, ActivityIndicator, FlatList, Text, StyleSheet, View,  ListView } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { SearchBar, ListItem, Card, Image  } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import phone from './assets/phone.json';


class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {search: false}
    this.state = {isLoading: true,text: ''}
    this.phones = [];
  }
  static navigationOptions = ({navigation}) => {
    if(navigation.getParam('search') != true) {
      return {
        headerTitle: ('Home'),
        headerRight: (
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.setParams({search: true})}>
            <Icon name="md-search" size={28} color="#FFF"/>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    } else {
      return {
        headerTitle: (
          <SearchBar
            placeholder="Type Here..."
            onBlur={() => navigation.setParams({search: false})}
            onChangeText={(item) => {navigation.setParams({value: item})}}
            value={navigation.getParam('value')}
            round="true"
            containerStyle={{
              flex: 1,
              backgroundColor: 'transparent',
            }}
            inputContainerStyle={{backgroundColor: "#FFF"}}
          />
        ),
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    }
      
  }

  componentDidMount() {
    this.setState({isLoading: false, dataSource: phone.data});    
    this.props.navigation.setParams({search: false, value: '' });
  }

  initializeItems() {
		this.phones = phone.data
  }
  
  SearchFilterFunction = (text = '') => {
    this.initializeItems();
    const newData = this.phones.filter(function(item){
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1
    })
    this.phones = newData;
  }

  render() {
    const textData = this.props.navigation.getParam('value');
    this.SearchFilterFunction(textData);
    const {navigate} = this.props.navigation;

    if(this.state.isLoading) {      
      return (<View style={styles.container}>
        <ActivityIndicator
        size="large" animating
        />
      </View>);
    } else {      
      return (
        <ScrollView>
          <FlatList
          data = {this.phones}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => navigate('Device', {slug: item.slug, name: item.name})}>
            <View
            style={styles.item}
            >
              <Text>{item.name}</Text>
            </View>
            </TouchableOpacity>
          )}
          />
        </ScrollView>
      );
    }
  }
}


class DeviceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {search: false}
    this.state = {isLoading: true,text: '',isLoadingMore: false,}
    this.devices = [];
  }
  static navigationOptions = ({navigation}) => {
    if(navigation.getParam('search') != true) {
      return {
        headerTitle: (navigation.getParam('name', 'Device')),
        headerRight: (
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.setParams({search: true})}>
            <Icon name="md-search" size={28} color="#FFF"/>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    } else {
      return {
        headerTitle: (
          <SearchBar
            placeholder="Type Here..."
            onBlur={() => navigation.setParams({search: false})}
            onChangeText={(item) => {navigation.setParams({value: item})}}
            value={navigation.getParam('value')}
            round="true"
            containerStyle={{
              flex: 1,
              backgroundColor: 'transparent',
              borderBottomColor: 'transparent'
            }}
            inputContainerStyle={{backgroundColor: "#FFF"}}
          />
        ),
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    }
      
  }

  componentDidMount(){
    return fetch('http://rumusexcel.net/device.php?dev=' + this.props.navigation.getParam('slug', 'Device').replace(/&|'/g,''))
      .then((response) => response.json())
      .then((responseJson) => {
        // HASIL DATA YANG DIDAPATKAN
        const data = responseJson.data.items;
        this.devices = data;
        this.setState({
          dataSource: data,
          isLoading: false
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  initializeItems() {
    this.devices = this.state.dataSource;
  }
  
  SearchFilterFunction = (text = '') => {
    this.initializeItems();
    const newData = this.devices.filter(function(item){
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1
    })
    this.devices = newData;
  }

  render() {
    const {navigate} = this.props.navigation;
    if(this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" animating/>
        </View>
      )
    } else {
      const textData = this.props.navigation.getParam('value');
      this.SearchFilterFunction(textData);
      // console.log(this.state.dataSource);
      return(
        <View>
          <FlatList
            data={this.devices}
            renderItem={({item}) => <ListItem
            title={item.name}
            subtitle={item.description.substring(0, 50) + '...'}
            leftAvatar={{ source: { uri: item.image } }}
            onPress={() => navigate('Spesifikasi', {slug: item.slug, name: item.name})}
          />}
          
          />
        </View>
      );
    }

  }
}


class SpesifikasiScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: true}
    this.spesifikasi = []
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (navigation.getParam('name', 'NAME DEVICE')),
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    } 
  }

  componentDidMount(){
    return fetch('http://rumusexcel.net/spesification.php?dev=' + this.props.navigation.getParam('slug', 'Device').replace(/&|'/g,''))
      .then((response) => response.json())
      .then((responseJson) => {
        // HASIL DATA YANG DIDAPATKAN
        console.log(responseJson.data);
        const data = responseJson.data;
        this.spesifikasi = data;
        this.setState({
          dataSource: data,
          isLoading: false
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {

    
    if(this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator size="large" animating/>
        </View>
      )
    } else {
      console.log(this.spesifikasi["image_url"]);
      return(
        <View style={styles.container}>
          <View style={{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: 300
  }}>
            <View style={[styles.box, styles.center]}><Image source={{ uri: this.spesifikasi["image_url"]}} style={{ width: 200, height: 200 }} /></View>
            <View><Text>{this.spesifikasi.overview.general_info.launched}</Text></View>
          </View>
      </View>
      );
    }

  }
}




const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Device: {
    screen: DeviceScreen
  },
  Spesifikasi: {
    screen: SpesifikasiScreen
  }
});

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  paddding: {
    fontSize: 20,
    textAlign: 'center',
    margin: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  search: {
    marginLeft: 10,
    fontSize: 15,
    color: '#999',
    backgroundColor: '#FEFEFE',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  box: {
    flex: 1,
  },
  two: {
    flex: 2
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})
