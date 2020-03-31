import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

const Welcome = ({navigation}) => {
  const [userDetails, setUserDetails] = useState('');

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const value = await AsyncStorage.getItem('@userDetails');
    if (value != null) {
      setUserDetails(JSON.parse(value));
      navigation.navigate('Dashboard');
      console.log(value);
    }
  }
  const {container, welcomeText, btn, btnContainer} = styles;
  return (
    <>
      <View style={container}>
        <Text style={welcomeText}>Welcome to Quirk!</Text>
        <View style={btnContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('BankAccount')}>
            <Text style={btn}>Get Started!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  btn: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 30,
    color: 'white',
    fontSize: 24,
    // fontWeight: "900",
    overflow: 'hidden',
    padding: 15,
    marginTop: 30,
    paddingHorizontal: 40,
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
  },
  btnContainer: {
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 30,
    // fontWeight: "bold"
    fontFamily: 'OpenSans-Bold',
  },
});

export default Welcome;
