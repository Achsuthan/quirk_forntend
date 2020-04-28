import React , {
  useState,
  useEffect
} from 'react';
import AndroidBackBtnHandler from '../Hoc/AndroidBackBtnHandler';
import ConnectionCheck from '../Components/ConnectionChecker';

import {StyleSheet, View, Text, ToastAndroid,
  Platform,
  AlertIOS, TouchableOpacity, Image, AsyncStorage } from 'react-native';

import PlaidLink from 'react-native-plaid-link-sdk';


const Welcome = (props) => {
  const { navigate } = props.navigation;
  const {state} = props.navigation;
  console.log("Props " + props);
  console.log("State " + state.params);

  var isFromAccount = false;
  if(state.params == undefined || state.params == null){
    isFromAccount = false;
  }else{
    isFromAccount = state.params.isFromAccount;
  }
  

  const {container, welcomeText, btn, btnContainer} = styles;

  const [UserDetails, setUserDetails] = useState('');
  const [bankCount, setBankCount] = useState(0);

  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    const value = await AsyncStorage.getItem('@userDetails');
    setUserDetails(JSON.parse(value));
    const bank = await AsyncStorage.getItem('@bankCount');
    setBankCount(bank);
    console.log('bank_count_1', bankCount);
  
    console.log('bank_count_2', bankCount);
  if(bankCount == undefined || bankCount == null){
    setBankCount(1);
  }else{
    setBankCount(bankCount + 1);
  }
  console.log('bank_count_3', bankCount);
  }
  

  //Plaid connection success
  const getBankData = (data) => {
    console.log('full respond : ' + JSON.stringify(data));  
    // console.log('conncetion respond : ' + data.link_connection_metadata);
    console.log('account respond : ' + data.link_connection_metadata.raw_data.accounts);


    // navigation.navigate('PlaidAuthenticator')
    AsyncStorage.setItem('@bankCount', bankCount);
    console.log('public_token_1', data.public_token);
    AsyncStorage.setItem(
      '@publicToken',data.public_token,
      () => {
        navigate('Dashboard')
        notifyMessage("Your account sccessfully connected with Quirk.")
      },
    );
    console.log('public_token_2', data.public_token);
    
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
        <View style = {styles.appBar}>
          {
            !isFromAccount ? null : 
              <TouchableOpacity
                onPress={ () => 
                  navigate('Dashboard')
                }>
                <Image source={require('../assets/images/round_arrow_left.png')} style={styles.appBarIcon} />
              </TouchableOpacity>
          }
        </View>
        <View style={styles.bankStyle}>
        
        {/* Plaid SDK integration */}
        <PlaidLink
        // Replace any of the following <#VARIABLE#>s according to your setup,
        // for details see https://plaid.com/docs/quickstart/#client-side-link-configuration
    
          publicKey='70d336b30cdb7031f9bdf0de4e2ada'
          clientName= {UserDetails.firstName}
          env='sandbox'  // 'sandbox' or 'development' or 'production'
          product={['auth','transactions']}
          // countryCodes={['GB']}
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
       </PlaidLink>

        {/* plaid WebView integration */}
        {/* <TouchableOpacity onPress={() => navigation.navigate('PlaidAuthenticator')}>
          <Text style={btn}>Link your bank account</Text>
        </TouchableOpacity> */}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  btn: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    overflow: 'hidden',
    padding: 12,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  bankStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  appBar: {
    paddingTop: 12,
    paddingBottom: 12,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignSelf: "stretch"
  },
  appBarIcon: {
    flex: 1,
    width: 40, 
    height: 40
  },
  appBarContent: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'OpenSans-Bold',
    flex: 4,
    textAlign: 'center'
  },
});

export default Welcome;
