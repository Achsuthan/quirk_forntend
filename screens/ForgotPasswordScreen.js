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

const Forgot = ({navigation}) => {
  const [email, setEmail] = useState({
    init: false,
    value: '',
  });

  const [isInvalid, setIsInvalid] = useState(false);

  const ErrorFn = (val, init) => {
    if (val != '') {
      return null;
    } else {
      if (init & (val == '')) {
        return "Enter a valid user id.";
      }
    }
  };

  const userForgotFn = () => {
    if (email.value) {
      let payload = {
        Email: email.value.toLocaleLowerCase(),
      };
      console.log(1, email.value);
      
      axios({
        method: 'post',
        url: 'https://quiz.quirk.money:8082/forgot',
        data: payload,
      })
        .then(response => {
          console.log(response.data);
          if (response.data.message == 'success') {
            console.log(2, email.value.toLocaleLowerCase());
            
            AsyncStorage.setItem(
              '@setEmail',
              email.value.toLocaleLowerCase(),
              () => {
                console.log(3);
                
                navigation.navigate('VerificartionCode');
              },
            );
          } else {
            setIsInvalid(true);
          }
        })
        .catch(error => {
          console.log("forgot error : "+error);
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
          <Text style={signInText}>Forgot password?</Text>
        </View>

        <View style={{flex: 1, marginTop: 20, marginBottom: 10}}>
          <Text style={{textAlign: 'center', fontSize: 16}}>Enter your email address below{"\n"}and we'll send you an email right now to{"\n"}help you reset.</Text>
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
                Enter a valid email.
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
              USERNAME
            </Text>
            <Reinput
              placeholderVisibility={false}
              placeholder="User ID"
              fontSize={16}
              fontFamily={'openSans-bold'}
              padding={10}
              error={ErrorFn(email.value, email.init)}
              activeColor="#8775fc"
              underlineHeight={2}
              underlineColor="#8775fc"
              placeholderColor="#c7cbd2"
              value={email.value}
              onChangeText={val => [
                setEmail({
                  init: true,
                  value: val,
                }),
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
            Verify
          </Text>
          <View style={btnContainer}>
            <TouchableOpacity onPress={() => userForgotFn()}>
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

export default Forgot;
