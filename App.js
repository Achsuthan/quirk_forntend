import React from 'react';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import WelcomeScreen from './screens/WelcomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import DashboardScreen from './screens/DashboardScreen';
import AboutYouScreen from './screens/AboutYouScreen';
import BankAccountScreen from './screens/BankAccountScreen';
import PlaidAuthenticatorScreen from './screens/PlaidAuthenticatorScreen';
// Add Waseem - Start
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerificartionCodeScreen from './screens/VerificationCodeScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

const App = () => {
  return <AppContainer />;
};

const AuthenticationNavigator = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    SignUp: SignUpScreen,
    SignIn: SignInScreen,
    Dashboard: DashboardScreen,
    AboutYou: AboutYouScreen,
    BankAccount: BankAccountScreen,
    PlaidAuthenticator: PlaidAuthenticatorScreen,
    ForgotPassword: ForgotPasswordScreen, 
    VerificartionCode: VerificartionCodeScreen,
    ResetPassword: ResetPasswordScreen,
  },
  {
    // unmountInactiveRoutes: true,
    initialRouteName: 'Welcome',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const AppContainer = createAppContainer(AuthenticationNavigator);

export default App;
