import React, {
  useState,
  useEffect
} from 'react';
import {
  AsyncStorage
} from 'react-native';
import PlaidAuthenticator from '../Components/PlaidAuthenticator';

const PlaidAuthenticatorScreen = ({
  navigation
}) => {
  const [data, setData] = useState('');
  const [UserDetails, setUserDetails] = useState('');

  const onMessage = val => {
    setData(val);
  };

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const value = await AsyncStorage.getItem('@userDetails');
    setUserDetails(JSON.parse(value));
  }

  useEffect(() => {
    let tmpData = {
      ...data
    };
    console.log('success: ', tmpData)
    if (tmpData.action === 'plaid_link-undefined::event' && tmpData.eventName === "SUBMIT_CREDENTIALS") {
      setTimeout(() => {
        // AsyncStorage.clear();
        navigation.navigate('Dashboard');
      }, 200);
    }
  });

  return ( <
    PlaidAuthenticator onMessage = {
      onMessage
    }
    publicKey = "d287f06585ad643733acd46aac9c43"
    env = "sandbox"
    product = "auth,transactions"
    clientName={UserDetails.firstName}
    selectAccount = {
      false
    }
    />


  );
};

export default PlaidAuthenticatorScreen;