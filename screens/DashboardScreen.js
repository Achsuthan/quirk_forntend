import React, {useState, useEffect} from 'react';
import AndroidBackBtnHandler from '../Hoc/AndroidBackBtnHandler';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Image,
  FlatList,
  ToastAndroid,
  Platform,
  AlertIOS
} from 'react-native';
import axios from 'axios';
import { NavigationActions } from 'react-navigation';
import PlaidLink from 'react-native-plaid-link-sdk';


const Dashboard = ({navigation, onBackPress}) => {
  const [userDetails, setUserDetails] = useState('');
  const [transactionData, setTransaction] = useState('');
  const [public_token, setPublicToken] = useState('');
  const [callCount, setCallCount] = useState(0);
  const [bankCount, setBankCount] = useState(1);

  const [isInvalid, setIsInvalid] = useState(false);
  const [isStrech, setStrech] = useState(true);
  const [isBank, setBank] = useState(false);

  const DATA = [
    // {
    //   id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    //   title: 'Quirk Bank 1',
    // },
    // {
    //   id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    //   title: 'Quirk Bank 2',
    // },
    // {
    //   id: '58694a0f-3da1-471f-bd96-145571e29d72',
    //   title: 'Quirk Bank 3',
    // },
  ];

  var transList = [];
  var totalBalance = 0.0, tmpBalance = 0.0, currencyCode = "";
  const allTransData = [];

    useEffect(() => {
      getData();
      // api();
    }, []);

    async function getData() {
      const value = await AsyncStorage.getItem('@userDetails');
      setUserDetails(JSON.parse(value));
  
      const token = await AsyncStorage.getItem('@publicToken');
      setPublicToken(token);

      const bank = await AsyncStorage.getItem('@bankCount');
      setBankCount(bank);
  
      console.log('user_id : ' + userDetails.userId);
      console.log('user_access : ' + JSON.stringify(userDetails.access_token));  
      console.log('bank_count_0 : '+ bankCount);
          

      // await apiCall();
      // setCallCount(callCount+1)
      
    }
    console.log('user_id 2: ' + userDetails.userId);
    console.log('call count: ' + callCount);
    console.log('bank_count_1 : '+ bankCount);
    if(bankCount == undefined || bankCount == null){
      setBankCount(1);
    }
    storeData(bankCount);

    if(callCount < 2){
      apiCall();
    }

    console.log('bank_count_2 : '+ bankCount);
    if(bankCount > 0){
      for(let i = 1; i < bankCount + 1; i++){
        var bankObj = {};
        bankObj.id = '58694a0f-3da1-471f-bd96-145571e29d72'+i;
        bankObj.title = 'Quirk Bank '+ i;
        DATA.push(bankObj);
        console.log('bank_ubj : '+ JSON.stringify(bankObj));
      }
    }


    async function apiCall(){
      if(userDetails.access_token != undefined && userDetails.access_token != null && userDetails.access_token != 'nan'){
        getTransactions(userDetails.access_token);
        setCallCount(callCount + 1);
      } else {
        if(public_token != undefined && public_token != null && public_token != ''){
          console.log('public_token : ' + public_token);
          console.log('local_user : ' + userDetails.userId);
        
          getAccessToken(public_token , userDetails.userId)
        } 
      }
    }


  function Item({ title, id }) {
    var capName = title.charAt(0);
    return (
      <TouchableOpacity
        onPress={ () => [
          setIsInvalid(false),
          setStrech(true),
          console.log('pressed : '+title)
        ]}>
        <View style = {accountStyle}>
          <View style = {userIcon}>
            <Text style={userStyle}>{capName}</Text>                  
          </View>
          <Text style={userStyle}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function TransactionItem({name, number, currency, value, type}) {
    var tmpValue = (Math.round(value * 100) / 100).toFixed(2);
    var tmpTot = "";
    if(type == 'credit'){
      tmpTot = '('+currency+tmpValue+')';
    }else{
      tmpTot = currency + tmpValue;
    }
    return (
      <View style = {styles.transView}>
        <Text style={styles.transContent}>{name} - {number}</Text>
        <Text style={styles.transContent}>{tmpTot}</Text>
      </View>
    );
  }


  function ShowHideTextComponentView() {
    
    if(isInvalid == false){
      setIsInvalid(true)
      setStrech(false)
      // setBank(true);
    }else{
      setIsInvalid(false)
      setStrech(true)
      // setBank(true);
    }

    console.log('strech '+isStrech);
  }

  async function getAccessToken(publicToken, user){
    let payload = {
      PublicToken: publicToken,
      UserId: user
    };
    axios({
      method: 'post',
      url: 'https://quiz.quirk.money:8083/api/plaid',
      data: payload,
    })
      .then(response => {
        console.log(response.data);
        if (response.data.message == 'failed') {

          var error_message = response.data.details.error_message;
          var error_code = response.data.details.error_code;
          // notifyMessage('local_plaid' + error_message);
          if(error_code == "INVALID_PUBLIC_TOKEN"){
            navigation.navigate('BankAccount');
          }

        } else {

          var access_token = response.data.content.access_token;
          console.log('access_token : '+ access_token);
          getTransactions(access_token)
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async function getTransactions(access_token){
    if(access_token != undefined && access_token != null && access_token != 'nan'){
      let payload = {
        client_id: '5e5624ef448de500125fca94',
        secret: '2a2bbbeb015fdb39f82414de793a1d',
        access_token: access_token
      };
      const headers = {
        'Content-Type': 'application/json'
      }

      axios({
        method: 'post',
        url: 'https://sandbox.plaid.com/auth/get',
        headers,
        data: payload,
      })
        .then(response => {
          console.log(response.data);
          if (response.data.error_code == undefined) {
            //Success
              // console.log('transaction : '+ JSON.stringify(response.data.accounts));
              setTransaction(response.data.accounts);

          } else {
            //Fail
            var error_message = response.data.error_message;
            var error_code = response.data.error_code;

            console.log(error_code);
            // notifyMessage('plaid error : '+ JSON.stringify(error_message))
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {

    }
  }

  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      AlertIOS.alert(msg);
    }
  }

    if(transactionData != undefined && transactionData != null && transactionData != ''){
      // console.log('trans : '+ JSON.stringify(transactionData));
    
      transactionData.map((x) => {
        var transObj = {};
        // console.log('acc_obj : ', x);
        
    
        var balance = x.balances;
        var available = balance.available;
        // var currency = balance.currency;
        var current = balance.current;
        // var meta = x.meta;
        var number = x.mask;
        var name = x.name;
    
    
        transObj.id = x.account_id;
        transObj.type = x.type;
    
        transObj.currency = '£';
        currencyCode = '£';
    
        if(available != null){
          transObj.value = available * 0.923538;
        }else{
          transObj.value = current * 0.923538;
        }
    
        transObj.name = name;
        transObj.number = number;
        
        transList.push(transObj); 
        // console.log('trans_obj' +  JSON.stringify(transObj));
        
    
        // Calculate totalBalance
        if(available != null){
          if(x.type == 'credit'){
            tmpBalance = tmpBalance - available
          }else{
            tmpBalance = tmpBalance + available
          }
        }else{
          if(x.type == 'credit'){
            tmpBalance = tmpBalance - current
          }else{
            tmpBalance = tmpBalance + current
          }
        }
        var tot = (Math.round((tmpBalance  * 0.923538) * 100) / 100).toFixed(2);
        totalBalance = currencyCode + numberWithCommas(tot);
        console.log(tmpBalance);
        
      })
    }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function navigateAfterFinish(screen){
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: screen })
      ]
    });
    navigation.dispatch(resetAction);
  }

  async function storeData (value) {
    try {
      console.log('bank_value : '+ value);
      
      await AsyncStorage.setItem('@bankCount', value)
    } catch (e) {
      // saving error
    }
  }

   //Plaid connection success
   const getBankData = (data) => {
    console.log('full respond : ' + JSON.stringify(data));  
    console.log('account respond : ' + data.link_connection_metadata.raw_data.accounts);

    AsyncStorage.setItem('@publicToken', data.public_token);
    console.log('public_token_4', data.public_token);    
    setPublicToken(data.public_token);
    setBank(false);
    if(bankCount == undefined || bankCount == null){
      setBankCount(1);
    }else{
      setBankCount(bankCount + 1);
    }

    storeData(bankCount);
    notifyMessage("Your account sccessfully connected with Quirk.");
    getAccessToken(public_token , userDetails.userId);

    // AsyncStorage.setItem('@bankCount', bankCount);
    console.log('bank_count_3', bankCount);


  }

  const {headingSty, logoutSty, currencySty, container, container1, appBar, appBarContent, appBarIcon, appBarAccount, accountStyle, userStyle, userIcon} = styles;
  return (
    <AndroidBackBtnHandler>
      {
        !isBank ? 
        <View style = {styles.appLayout}>
          <View style={appBar}>
            <Text style={appBarContent}>Hello {userDetails.firstName}!</Text>
            <TouchableOpacity
              onPress={ () => 
                ShowHideTextComponentView()
              }>
            <Image source={require('../assets/images/round_account_circle_black.png')} style={appBarIcon} />
            </TouchableOpacity>
          </View>

          <View style={isStrech ? container : container1}>
          {
            isInvalid ? 
            <View style= {styles.appBarAccount}> 
                <FlatList
                  data={DATA}
                  renderItem={({ item }) => <Item title={item.title} id = {item.id} />}
                  keyExtractor={item => item.id}
                />
                <TouchableOpacity
                  onPress={ () => [
                    // console.log('log_press')    
                    // navigateAfterFinish('BankAccount'),
                    // navigation.navigate('BankAccount', { isFromAccount: true }),

                    setIsInvalid(false),
                    setStrech(true),
                    setBank(true)
                  ]}>
                  <View style = {accountStyle}>
                    <Image source={require('../assets/images/round_person_add_black.png')} style = {{width: 35, height: 35}}/>
                    <Text style={userStyle}>Add another bank account</Text>
                  </View>

                </TouchableOpacity>
            </View>
          : 
          <View>
            <View style={styles.dashboardStyle}>
              
              <Text style={styles.transHeading}>Account balances returned</Text>
              <FlatList style = {styles.listStyle}
                data={transList}
                renderItem={({ item }) => <TransactionItem name = {item.name} number = {item.number} currency = {item.currency} value = {item.value} type = {item.type} />}
                keyExtractor={item => item.id}
              />
              
              <Text style={{color: '#7f7f7f', fontSize: 10, fontFamily: 'OpenSans-SemiBold', marginTop: 5}}>Total Balance</Text>
                <Text style={currencySty}>{totalBalance}</Text>

            </View>
            <View
              style={{
                flex: 0.5,
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 10,
              }}>
              <TouchableOpacity
                onPress={() => [
                  AsyncStorage.clear(),
                  navigation.navigate('Welcome'),
                ]}>
                <Text style={logoutSty}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
          }
          </View>
      </View>
      : 
      <View style = {styles.bankContainer}>
        <View style = {styles.bankBack}>
              <TouchableOpacity
                onPress={ () => 
                  setBank(false)
                }>
                <Image source={require('../assets/images/round_arrow_left.png')} style={styles.appBarIcon} />
              </TouchableOpacity>
        </View>
        <View style = {styles.bankStyle}>
          <PlaidLink
          // Replace any of the following <#VARIABLE#>s according to your setup,
          // for details see https://plaid.com/docs/quickstart/#client-side-link-configuration
      
            publicKey='70d336b30cdb7031f9bdf0de4e2ada'
            clientName= {userDetails.firstName}
            env='sandbox'  // 'sandbox' or 'development' or 'production'
            product={['auth','transactions']}
            // countryCodes={['GB']}
            onSuccess={data => 
              getBankData(data)
            }
            onExit={data => 
              console.log('exit: ', data)
            }
            onCancelled = {
              (result) => {console.log('Cancelled: ', result)}
            }
            >
            <Text style={styles.btn}>Link your bank account</Text>
        </PlaidLink>
       </View>
      </View>
      }
      
    </AndroidBackBtnHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 6,
    alignSelf: "stretch",
    alignItems: 'center',
    flexDirection: 'column'
  },
  container1: {
    flex: 6,
    alignSelf: "stretch",
    // alignItems: 'center',
    flexDirection: 'column'
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
    fontSize: 30,
    fontFamily: 'OpenSans-Bold',
    // fontWeight: "bold"
  },
  logoutSty: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    color: '#7f7f7f',
    fontSize: 16,
    paddingHorizontal: 15,
    padding: 5,
    fontFamily: 'OpenSans-Bold',
  },
  appLayout: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'flex-start',
    // justifyContent: 'center',
    flexDirection: 'column',
    alignSelf: "stretch",
    flex: 1
  },
  appBar: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
    fontSize: 16,
    // fontWeight: '900',
    // overflow: 'hidden',
    padding: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    // flex: 0.4,
    height: 56,
    marginTop: 5,
    marginStart: 5,
    marginEnd: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: "stretch"
  },
  appBarContent: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'OpenSans-Bold',
    flex: 4,
    textAlign: 'center',
  },
  appBarIcon: {
    flex: 1,
    width: 40, 
    height: 40
  },
  appBarAccount: {
    backgroundColor: '#c7ccc6',
    // borderColor: 'white',
    // borderWidth: 1,
    borderRadius: 8,
    color: 'white',
    margin: 5,
    shadowColor: '#ececee',
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
    // alignSelf: "stretch"
  },
  accountStyle: {
    margin: 5,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: "stretch"
  },
  userStyle: {
    color: 'black',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    padding: 6,
    textAlign: 'center'
  },
  userIcon: {
    width: 35, 
    height: 35,
    borderRadius: 100/2,
    backgroundColor: '#7a7d79'
  },
  dashboardStyle: {
    alignItems: 'center',
    marginTop: 10, 
    flex: 5, 
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  transView: {
    // borderColor: 'black',
    // borderWidth: 1,
    // color: 'white',
    marginTop: 5,
    flexDirection: 'row',
    // alignSelf: 'stretch',
    justifyContent: 'space-between'
  },
  transHeading: {
    // backgroundColor: 'white',
    // borderColor: 'black',
    // borderWidth: 1,
    // borderRadius: 10,
    color: '#7f7f7f',
    fontSize: 16,
    paddingHorizontal: 15,
    padding: 5,
    // fontWeight: "bold",
    // marginBottom: 10,
    fontFamily: 'OpenSans-SemiBold',
  },
  transContent: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    padding: 5,
    // paddingBottom: 6,
    textAlign: 'center'
  },
  listStyle: {
    // alignSelf: "stretch", 
    width: Dimensions.get('window').width, 
    paddingLeft: 5, 
    paddingRight: 5
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
    alignItems: 'center',
    alignContent: 'center',
  },
  bankStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  bankContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,

  },
  bankBack: {
    paddingTop: 12,
    paddingBottom: 12,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignSelf: "stretch"
  },
});

export default Dashboard;
