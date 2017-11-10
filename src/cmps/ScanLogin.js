'use strict';

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableHighlight,
    ToastAndroid,
    Animated,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');
import QRCodeScanner from 'react-native-qrcode-scanner';
import TopBar from '../utils/TopBar';
import NavBar from '../utils/NavBar';
// import Storage from 'react-native-storage';
import Axios from 'axios';

class ScanPointer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            y: new Animated.Value(-300), 
        };
    }
    componentDidMount() {
        this.state.y.setValue(-300)
        Animated.timing( 
            this.state.y, 
            {
                toValue: -100, 
                duration: 2500,
            }
        ).start(() => this.componentDidMount()); 
    }

    render() {
        return(
            <Animated.View                            
                style={{
                  top: this.state.y,        
              }}>
                <Image style={{width:200,height:200,resizeMode:'cover'}} source={require('../imgs/grid.png')} />
            </Animated.View>
        )
    }
}



class ScanLoginScreen extends Component {
    onSuccess(e) {
        // 读取到数据后需要发送请求到后台判断能否成功
        const URL = 'http://'+e.data;
        const ip = e.data.split(':')[0];
        const port = e.data.split(':')[1];

        // 判断无效网址
        if (ip.length < 6 || ip.length > 15 || port.length<3 || port.length>6) {
            ToastAndroid.show("无效条码", ToastAndroid.SHORT);
            this.props.navigation.navigate('ScanLoginFail');
            return ;
        }else{
            Axios.get(URL+'/Name')
            .then((response) => {
                storage.save({
                    key: 'serverIP',
                    id: 1,
                    data: {
                        ip: ip,
                        port: port,
                        device: response.data,
                    },
                    expires: null,
                })
                ToastAndroid.show('登录成功', ToastAndroid.SHORT);
                this.props.navigation.navigate('ScanLoginSuccess');
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
                this.props.navigation.navigate('ScanLoginFail');
            })
        }


    }

    componentDidMount() {
        
    }

    render() {
        return (
            <View>
                <TopBar />
                <View style={{backgroundColor: "#666f76"}}>
                    <NavBar onPress={() => {this.props.navigation.navigate('ScanLogin');}} title='扫描登录' NavRight={
                    <Text></Text>
                    } />
                    <View style={{backgroundColor:"#fff",height:height-120,}}>

                        <QRCodeScanner
                            onRead={this.onSuccess.bind(this)}
                            containerStyle={{
                                backgroundColor: '#666f76',
                                alignItems: 'center',
                            }}
                            cameraStyle={{
                                width: 200,
                                height: 200,
                            }}
                            fadeIn={true}
                            reactivateTimeout={200}
                            showMarker={true}
                            customMarker={
                                <View style={styles.rectangleContainer}>
                                    <Image style={{top:100,width:200,height:200}} source={require('../imgs/scan_corner.png')} />
                                    <ScanPointer style={{top:0}} />
                                </View>
                            }
                            topContent={(
                                <Text style={styles.centerText}>扫码连接服务器</Text>
                            )}
                            topViewStyle={{flex: 1}}
                            bottomViewStyle={{}}
                            bottomContent={(
                                <Text style={{color:'#fff',fontSize:13}}>请对准二维码/条码，耐心等待</Text>
                            )}
                        />
                    </View>
                </View>
            </View>
        );
  }
}

            
const styles = StyleSheet.create({
  centerText: {
    fontSize: 18,
    alignItems: 'center',
    color: '#fff',
  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  rectangleContainer: {
    flex: 1,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0791f4',
  },
  rectangle: {
    height: 200,
    width: 200,
    backgroundColor: 'transparent',
  },
});


export default ScanLoginScreen