import React, {Component} from 'react';
import {Animated, View, Text, TouchableOpacity , BackHandler} from 'react-native';

class AndroidBackBtnHandler extends Component {

  // componentWillMount() {
  //   this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //     // this.goBack(); // works best when the goBack is async
  //     return true;
  //   });
  // }
  // componentWillUnmount() {
  //   this.backHandler.remove();
  // }

  // render() {
  //   return <>{this.props.children}</>;
  // }

  state = {
    backClickCount: 0
};

constructor(props) {
    super(props);

    this.springValue = new Animated.Value(100) ;

}

componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
}

_spring() {

    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
            Animated.spring(
                this.springValue,
                {
                    toValue: -30,
                    friction: 5,
                    duration: 300,
                    useNativeDriver: true,
                }
            ),
            Animated.timing(
                this.springValue,
                {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                }
            ),

        ]).start(() => {
            this.setState({backClickCount: 0});
        });
    });

}


handleBackButton = () => {
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();

    return true;
};


render() {

    return (
        <View style={styles.container}>
            {this.props.children}

            <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}]}]}>
                <Text style={styles.exitTitleText}>Press back again to exit the app.</Text>

                {/* <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => BackHandler.exitApp()}
                >
                    <Text style={styles.exitText}>Exit</Text>
                </TouchableOpacity> */}

            </Animated.View>
        </View>
    );
}
}

const styles = {
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
  },
  animatedView: {
      backgroundColor: "#fff",
      elevation: 2,
      position: "absolute",
      bottom: 0,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
  },
  exitTitleText: {
      textAlign: "center",
      color: "#000",
      marginRight: 10,
  },
  exitText: {
      color: "#e5933a",
      paddingHorizontal: 5,
      paddingVertical: 3
  }
};

export default AndroidBackBtnHandler;
