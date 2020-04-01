import React, {useState, useEffect} from 'react';
import {
  AsyncStorage,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import axios from 'axios';
import moment from 'moment';
import Reinput, {ReinputButton} from 'reinput';

const AboutYou = ({navigation}) => {
  const {btnContainer, btn, titleText} = styles;

  const [date, setDate] = useState('');
  const [show, setShow] = useState(false);
  const [UserDetails, setUserDetails] = useState('');
  const [firstName, setFirstName] = useState({
    init: false,
    value: '',
  });
  const [lastName, setLastName] = useState({
    init: false,
    value: '',
  });

  const [postalCode, setPostalCode] = useState({
    init: false,
    value: '',
  });
  const [streetName, setStreetName] = useState({
    init: false,
    value: '',
  });

  const ErrorFn = (val, init) => {
    if (val != '') {
      return null;
    } else {
      if (init & (val == '')) {
        return "This can't be empty";
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const value = await AsyncStorage.getItem('@userDetails');
    setUserDetails(JSON.parse(value));
  }

  const userDetailsSaveFn = () => {
    if (
      firstName.value &&
      lastName.value &&
      postalCode.value &&
      streetName.value &&
      date
    ) {
      let payload = {
        UserId: UserDetails.userId,
        FirstName: firstName.value,
        LastName: lastName.value,
        Birthday: date,
        StreetName: postalCode.value,
        PostalCode: streetName.value,
      };

      console.log(payload);
      axios({
        method: 'post',
        url: 'https://quiz.quirk.money:8082/userDetails',
        data: payload,
      })
        .then(response => {
          console.log(response.data);

          AsyncStorage.setItem(
            '@userDetails',
            JSON.stringify(response.data.content),
            () => {
              navigation.navigate('BankAccount');
            },
          );
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log('Error');
      setFirstName({
        ...firstName,
        init: true,
      });
      setLastName({
        ...lastName,
        init: true,
      });
      setPostalCode({
        ...postalCode,
        init: true,
      });
      setStreetName({
        ...streetName,
        init: true,
      });
    }
  };

  const handleDatePicked = date => {
    setDate(date);
    setShow(false);
  };

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
      <KeyboardAvoidingView
        style={{flex: 1, padding: 30}}
        behavior="padding"
        enabled>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'baseline',
          }}>
          <Text style={titleText}>About you</Text>
        </View>
        <View style={{marginTop: 0}}>
          <Text
            style={{
              // fontWeight: "bold",
              fontFamily: 'OpenSans-Bold',
              fontSize: 20,
              paddingTop: 0,
              paddingBottom: 0,
            }}>
            Let’s get to know you a bit better!
          </Text>

          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: 20,
              marginTop: 30,
            }}>
            First name
          </Text>
          <Reinput
            // label=""
            // height={50}
            marginTop={20}
            fontSize={16}
            fontFamily={'OpenSans-Bold'}
            value={firstName.value}
            error={ErrorFn(firstName.value, firstName.init)}
            activeColor="#8775fc"
            underlineColor="#c4c4c4"
            underlineHeight={2}
            onChangeText={val =>
              setFirstName({
                init: true,
                value: val,
              })
            }
          />

          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: 20,
              marginTop: 0,
            }}>
            Last name
          </Text>
          <Reinput
            // label="Last name"
            // height={50}
            marginTop={20}
            fontSize={16}
            fontFamily={'OpenSans-Bold'}
            error={ErrorFn(lastName.value, lastName.init)}
            activeColor="#8775fc"
            underlineColor="#c4c4c4"
            underlineHeight={2}
            value={lastName.value}
            onChangeText={val =>
              setLastName({
                init: true,
                value: val,
              })
            }
          />
          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: 20,
              marginTop: 0,
            }}>
            Date of birth
          </Text>

          <ReinputButton
            label={String(date) ? '' : 'dd/mm/yy'}
            marginTop={20}
            fontSize={16}
            fontFamily={'OpenSans-Bold'}
            underlineHeight={0}
            value={String(date) == '' ? '' : moment(date).format('DD/MM/YY')}
            onPress={() => setShow(true)}
          />
          <DateTimePicker
            isVisible={show}
            onConfirm={date => handleDatePicked(date)}
            onCancel={() => setShow(false)}
          />
        </View>
        <View style={{marginTop: 0}}>
          <Text
            style={{
              fontFamily: 'OpenSans-ExtraBold',
              fontSize: 22,
              marginTop: 0,
            }}>
            Address
          </Text>

          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: 20,
              marginTop: 20,
            }}>
            Street name
          </Text>
          <Reinput
            // label="Street name"
            // height={50}
            marginTop={20}
            fontSize={16}
            fontFamily={'OpenSans-Bold'}
            error={ErrorFn(streetName.value, streetName.init)}
            activeColor="#8775fc"
            underlineColor="#c4c4c4"
            underlineHeight={2}
            value={streetName.value}
            onChangeText={val =>
              setStreetName({
                init: true,
                value: val,
              })
            }
          />

          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: 20,
              marginTop: 0,
            }}>
            Postcode
          </Text>
          <Reinput
            // label="Postcode"
            // height={50}
            marginTop={20}
            fontSize={16}
            fontFamily={'OpenSans-Bold'}
            error={ErrorFn(postalCode.value, postalCode.init)}
            activeColor="#8775fc"
            underlineColor="#c4c4c4"
            underlineHeight={2}
            value={postalCode.value}
            onChangeText={val =>
              setPostalCode({
                init: true,
                value: val,
              })
            }
          />
        </View>
        <View style={btnContainer}>
          <TouchableOpacity onPress={() => userDetailsSaveFn()}>
            <View style={btn}>
              <Image
                style={{width: 50, height: 50}}
                source={require('../Img/arrow.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 50,
    flex: 1,
    // fontWeight: "bold",
    fontFamily: 'openSans-ExtraBold',
    paddingBottom: 20,
  },
});

export default AboutYou;
