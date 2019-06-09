import React from 'react';
import {Text, Button} from 'react-native';
import { Card, Icon } from 'react-native-elements';
navigationOptions = ({navigation}) => {
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
}

const SpesifikasiScreen = (props) => (
  <Card
  title='HELLO WORLD'
  image={require('./images/avatar.png')}>
  <Text style={{marginBottom: 10}}>
    The idea with React Native Elements is more about component structure than actual design.
  </Text>
  <Button
    icon={<Icon name='code' color='#ffffff' />}
    backgroundColor='#03A9F4'
    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
    title='VIEW NOW' />
</Card>
)
export default SpesifikasiScreen;