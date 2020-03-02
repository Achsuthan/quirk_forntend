import React , {
  useState,
  useEffect
} from 'react';
import {StyleSheet, View, Text, ToastAndroid,
  Platform,
  AlertIOS, TouchableOpacity } from 'react-native';

import PlaidLink from 'react-native-plaid-link-sdk';

const Welcome = ({navigation}) => {
  const {container, welcomeText, btn, btnContainer} = styles;

  const [UserDetails, setUserDetails] = useState('');
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    const value = await AsyncStorage.getItem('@userDetails');
    setUserDetails(JSON.parse(value));
  }


  //Plaid connection success
  const getBankData = (data) => {
      console.log(data.link_connection_metadata.raw_data.accounts);

      navigation.navigate('PlaidAuthenticator')
      notifyMessage("Your account sccessfully connected with Quirk.")
  }

  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      AlertIOS.alert(msg);
    }
  }

  return (
    <>
      <View style={container}>
        <View style={btnContainer}>
        
        {/* Plaid SDK integration */}
        {/* <PlaidLink
        // Replace any of the following <#VARIABLE#>s according to your setup,
        // for details see https://plaid.com/docs/quickstart/#client-side-link-configuration
    
          publicKey='70d336b30cdb7031f9bdf0de4e2ada'
          clientName= {'UserDetails.firstName'}
          env='sandbox'  // 'sandbox' or 'development' or 'production'
          product={['auth','transactions']}
          countryCodes={['GB']}
          onSuccess={data => 
            getBankData(data)
          }
          onExit={data => 
            console.log('exit: ', data)
          }
          onCancelled = {(result) => {console.log('Cancelled: ', result)}}
    
          // // Optional props
          // countryCodes={['<# Country Code #>']}
          // language='<# Language #>'
          // userEmailAddress='<# User Email #>'
          // userLegalName='<# User Legal Name #>'
          // userPhoneNumber='<# User Phone Number #>'
          // webhook='<# Webhook URL #>'
        >
        <Text style={btn}>Link your bank account</Text>
      </PlaidLink> */}

        {/* plaid WebView integration */}
        <TouchableOpacity onPress={() => navigation.navigate('PlaidAuthenticator')}>
          <Text style={btn}>Link your bank account</Text>
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
    fontWeight: '900',
    overflow: 'hidden',
    padding: 12,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  btnContainer: {
    paddingTop: 20,
  },
});

export default Welcome;
