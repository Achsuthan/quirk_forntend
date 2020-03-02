import React, {useState, useEffect} from 'react';
import AndroidBackBtnHandler from '../Hoc/AndroidBackBtnHandler';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

const Dashboard = ({navigation, onBackPress}) => {
  const [userDetails, setUserDetails] = useState('');

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const value = await AsyncStorage.getItem('@userDetails');
    setUserDetails(JSON.parse(value));
  }

  const {headingSty, logoutSty, currencySty, container} = styles;
  return (
    <AndroidBackBtnHandler>
      <View style={container}>
        <View
          style={{
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 40,
            flex: 1,
          }}>
          <Text style={headingSty}>Hello {userDetails.firstName}!</Text>
        </View>
        <View style={{alignItems: 'center', marginTop: 50, flex: 1}}>
          <Text style={logoutSty}>TOTAL BALANCE</Text>
          <Text style={currencySty}>£2,120</Text>
        </View>
        <View
          style={{
            flex: 4,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <TouchableOpacity
            onPress={() => [
              AsyncStorage.clear(),
              navigation.navigate('Welcome'),
            ]}>
            <Text style={logoutSty}>Log out</Text>
          </TouchableOpacity>
        </View>
        {/* <View>
          <TouchableOpacity onPress={() => navigation.navigate('PlaidAuthenticator')}>
            <Text>Link your bank account</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </AndroidBackBtnHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 6,
    // backgroundColor: '#000',
    // height: Dimensions.get('window').height,
  },
  headingSty: {
    fontSize: 40,
    color: '#000000',
    fontFamily: 'OpenSans-SemiBold',
    // marginTop:20
    // fontWeight: "bold"
  },
  currencySty: {
    color: '#000000',
    fontSize: 50,
    fontFamily: 'OpenSans-Bold',
    // fontWeight: "bold"
  },
  logoutSty: {
    color: '#7f7f7f',
    fontSize: 16,
    // fontWeight: "bold",
    marginBottom: 10,
    fontFamily: 'OpenSans-Bold',
  },
});

export default Dashboard;
