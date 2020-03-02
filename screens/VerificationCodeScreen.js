import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import axios from 'axios';
import Reinput from 'reinput';

const ResetCode = ({navigation}) => {
  const [code, setCode] = useState({
    init: false,
    value: ''
  })

  const [isInvalid, setIsInvalid] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
     const getEmail = await AsyncStorage.getItem('@setEmail');
     console.log(4, getEmail);
     
     setEmail(getEmail);
  }



  const ErrorFn = (val, init) => {
    if (val != '') {
      return null;
    } else {
      if (init & (val == '')) {
        return "Enter a valid reset code.";
      }
    }
  };

   const userResetFn = () => {
     console.log(email);

    if (code.value) {
      let payload = {
        Email: email,
        Code: code.value,
      };
      axios({
        method: 'post',
        url: 'http://34.66.22.221:8082/forgot/verify',
        data: payload,
      })
        .then(response => {
          console.log(response.data);
          if (response.data.message == 'failed') {
            setIsInvalid(true);
          } else {
            AsyncStorage.setItem(
              '@setEmail',
              email,
              () => {
                navigation.navigate('ResetPassword');
              },
            );
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log('Error');
      setEmail({
        ...email,
        init: true,
      });
      // setPwd({
      //   ...pwd,
      //   init: true,
      // });
    }
  };

  const {container, signInText, btnContainer, btn, card} = style;
  return (
    <>
      <ScrollView style={container} keyboardShouldPersistTaps={'handled'}>
        <View style={{flex: 1, marginTop: 40, marginBottom: 10}}>
          <Text style={signInText}>Verify Code</Text>
        </View>

        <View style={{flex: 1, marginTop: 40, marginBottom: 10}}>
          <Text style={{textAlign: 'center', fontSize: 16}}>Enter your code given{"\n"}in the e-mail we just sent you so that{"\n"}we can verify you account.</Text>
        </View>

        <View style={card}>
          {isInvalid && (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 18,
                  color: 'red',
                }}>
                Invalid reset code.
              </Text>
            </View>
          )}

          <View>
            <Text
              style={{
                fontFamily: 'OpenSans-ExtraBold',
                fontSize: 18,
                marginTop: 40,
              }}>
              RESET CODE
            </Text>
            <Reinput
              placeholderVisibility={false}
              placeholder="Code"
              fontSize={16}
              fontFamily={'openSans-bold'}
              padding={10}
              error={ErrorFn(code.value, code.init)}
              activeColor="#8775fc"
              underlineHeight={2}
              underlineColor="#8775fc"
              placeholderColor="#c7cbd2"
              value={code.value}
              onChangeText={val => [
                setCode({init: true,value: val,}),
                setIsInvalid(false),
              ]}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontFamily: 'OpenSans-SemiBold',
              color: '#7f7f7f',
              fontSize: 18,
            }}>
            Submit
          </Text>
          <View style={btnContainer}>
            <TouchableOpacity onPress={() => userResetFn()}>
              <View style={btn}>
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../Img/arrow.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const style = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    // shadowRadius: 1,
    // shadowOffset: {
    //   height: 1,
    //   width: 0.3
    // },
    shadowColor: '#ececee',
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
    marginLeft: 2,
    marginRight: 2,
    padding: 20,
    // flex: 2,
    height: 200,
    // alignItems:"center",
    // justifyContent:"center"
  },

  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#f6f6f8',
  },
  signInText: {
    fontSize: 50,
    flex: 1,
    // fontWeight: "bold",
    paddingBottom: 20,
    fontFamily: 'OpenSans-ExtraBold',
  },
  containerStyle: {
    flex: 2,
    height: Dimensions.get('window').height - 300,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ececee',
    borderRadius: 5,
    padding: 20,
    shadowColor: '#ececee',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
    marginLeft: 2,
    marginRight: 2,
  },
  btn: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    overflow: 'hidden',
    padding: 12,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  btnContainer: {
    paddingTop: 10,
  },
});

export default ResetCode;
