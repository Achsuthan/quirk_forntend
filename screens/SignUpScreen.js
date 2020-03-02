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
import Reinput from 'reinput';
import axios from 'axios';
import CheckEmail from '../Util/CheckEmail';

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isEmailInit, setIsEmailInit] = useState(false);
  const [password, setPassword] = useState('');
  const [isPwdInit, setIsPwdInit] = useState(false);

  const userRegFn = async () => {
    console.log('Not Cool');

    if (email && CheckEmail(email) && password.length >= 6) {
      console.log('Cool');
      let payload = {
        Email: email.toLocaleLowerCase(),
        Password: password,
      };
      const response = await axios({
        method: 'post',
        url: 'http://34.66.22.221:8082/user',
        data: payload,
      })
        .then(response => {
          console.log(response.data);
          if (response.data.message == 'failed') {
            setIsDuplicate(true);
            // emailError();
          } else {
            AsyncStorage.setItem(
              '@userDetails',
              JSON.stringify(response.data.content),
              () => {
                navigation.navigate('AboutYou');
              },
            );
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log('Error');
      setIsEmailInit(true);
      setIsPwdInit(true);
    }
  };

  const emailError = () => {
    if (email != '' && CheckEmail(email)) {
      return null;
    } else {
      if (email != '') {
        return 'Invalid Email Address';
      } else if (isEmailInit && email == '') {
        return 'Blank Email Address';
      } else if (isEmailInit && isDuplicate) {
        return 'Email already exists';
      }
    }
  };

  const pwdError = () => {
    if (isPwdInit && password == '') {
      return 'Blank Password';
    } else if (isPwdInit && password.length < 6) {
      return 'Password should contain at least 6 characters.';
    } else {
      return null;
    }
  };

  const {container, signInText, btnContainer, btn, card} = style;
  return (
    <>
      <ScrollView style={container} keyboardShouldPersistTaps={'handled'}>
        <View style={{flex: 1, marginTop: 30, marginBottom: 10}}>
          <Text style={signInText}>Sign up</Text>
        </View>
        <View style={card}>
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
              // label=""
              placeholder="User ID"
              // height={100}
              fontSize={16}
              // fontWeight={"bold"}
              fontFamily={'OpenSans-Bold'}
              padding={10}
              error={isDuplicate ? 'Email already exists' : emailError()}
              activeColor="#8775fc"
              underlineHeight={2}
              underlineColor="#8775fc"
              placeholderColor="#c7cbd2"
              value={email}
              onChangeText={email => [
                !isEmailInit ? setIsEmailInit(true) : null,
                setEmail(email),
                setIsDuplicate(false),
              ]}
            />
            <Text style={{fontFamily: 'OpenSans-ExtraBold', fontSize: 18}}>
              PASSWORD
            </Text>
            <Reinput
              placeholderVisibility={false}
              secureTextEntry={true}
              // label=""
              placeholder="Password"
              // height={100}
              fontSize={16}
              // fontWeight={"bold"}
              fontFamily={'OpenSans-Bold'}
              padding={10}
              error={pwdError()}
              activeColor="#8775fc"
              underlineHeight={2}
              underlineColor="#8775fc"
              placeholderColor="#c7cbd2"
              value={password}
              onChangeText={password => [
                !isPwdInit ? setIsPwdInit(true) : null,
                ,
                setPassword(password),
              ]}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontFamily: 'OpenSans-SemiBold',
              color: '#7f7f7f',
              fontSize: 18,
            }}>
            Join
          </Text>
          <View style={btnContainer}>
            <TouchableOpacity onPress={() => userRegFn()}>
              <View style={btn}>
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../Img/arrow.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontFamily: 'OpenSans-SemiBold',
                color: '#7f7f7f',
                fontSize: 18,
                paddingTop: 10,
                paddingEnd: 10,
              }}>
              Already have an account ?
            </Text>
            <TouchableOpacity
              onPress={() => [
                navigation.navigate('SignIn'),
                setIsEmailInit(false),
                setIsPwdInit(false),
              ]}>
              <Text
                style={{
                  fontFamily: 'OpenSans-SemiBold',
                  color: '#7f7f7f',
                  fontSize: 18,
                  paddingTop: 10,
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                }}>
                Sign in
              </Text>
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
    height: 300,
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

export default SignUp;
