'use strict';

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Vibration,
    Alert,
    TouchableHighlight,
    ToastAndroid,
    Animated,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');
// import QRCodeScanner from 'react-native-qrcode-scanner';
import Camera from 'react-native-camera';
import TopBar from '../utils/TopBar';
import NavBar from '../utils/NavBar';
// import Storage from 'react-native-storage';
import FetchFunc from '../utils/Fetch';

class ScanPointer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            y: new Animated.Value(-400), 
        };
    }
    componentDidMount() {
        this.state.y.setValue(-400)
        Animated.timing( 
            this.state.y, 
            {
                toValue: -200, 
                duration: 2000,
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
        Vibration.vibrate();
        const URL = 'http://'+e.data;
        const ip = e.data.split(':')[0];
        const port = e.data.split(':')[1];

        // 判断无效网址
        if (ip.length < 6 || ip.length > 15 || port.length<3 || port.length>6) {
            ToastAndroid.show("无效条码", ToastAndroid.SHORT);
            this.props.navigation.navigate('ScanLoginFail');
            return ;
        }else{
            if (this.CheckIP(ip) && this.CheckPort(port)){
                FetchFunc('http://'+ip+':'+port+'/pollen/v1/device_login', {
                }).then((response) => response.json())
                .then((responseJson) => {
                    storage.save({
                        key: 'serverIP',
                        id: 1,
                        data: {
                            ip: ip,
                            port: port,
                            device: responseJson.code,
                            device_name: responseJson.name,
                        },
                        expires: null,
                    })
                    ToastAndroid.show('登录成功', ToastAndroid.SHORT);
                    this.props.navigation.navigate('ScanLoginSuccess');
                }).catch((error) => {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    this.props.navigation.navigate('ScanLoginFail');
                })
            }else{
                ToastAndroid.show("无效地址", ToastAndroid.SHORT);
                this.props.navigation.navigate('ScanLoginFail');
            }
        }


    }

    CheckIP(ip) {   
        var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;  
        return re.test(ip);   
    }
    CheckPort(port) {   
        var re =  /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;  
        return re.test(port);   
    }
    state = {
        scanning: false,
    }
    componentDidMount() {
        
    }
    
    _handleBarCodeRead(e) {
        setTimeout(() => {
            if (!this.state.scanning) {
                this.onSuccess(e);
                this.setState({scanning:true})
            }else{
                return
            }
        },300)

    }

    render() {
        if (!this.state.scanning){
            return (
                <View>
                    <TopBar />
                    <View style={{backgroundColor: "transparent"}}>
                        <NavBar onPress={() => {this.props.navigation.navigate('ScanLogin');}} title='扫描登录' NavRight={
                        <Text></Text>
                        } />
                        <View style={{backgroundColor:'rgba(0,0,0,0.1)',flexDirection:'row',justifyContent:'center',height:height-120,}}>
                            <Camera
                                ref={(cam) => {
                                this.camera = cam;
                                }}
                                style={styles.preview}
                                // onBarCodeRead={this.onSuccess.bind(this)}
                                onBarCodeRead={this._handleBarCodeRead.bind(this)}
                            >
                            <View style={styles.rectangleContainer}>
                                <View style={styles.rectangle}>
                                    <Image style={{width:200,height:200,resizeMode:'center'}} source={require('../imgs/scan_corner.png')} />
                                    <ScanPointer />
                                </View>
                            </View>
                            </Camera>
                            
                        </View>
                    </View>
                </View>
            );
        }else{
            return(
                <View>
                    <TopBar />
                    <View style={{backgroundColor: "transparent"}}>
                        <NavBar onPress={() => {this.props.navigation.navigate('ScanLogin');}} title='扫描登录' NavRight={
                        <Text></Text>
                        } />
                        <View style={{backgroundColor:'rgba(0,0,0,0.1)',flexDirection:'row',justifyContent:'center',height:height-120,}}>
                        </View>
                    </View>
                </View>
            )
        }
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
// camera组件样式
  preview: {
    width: 200,
    height: 200,
    marginTop: height/2-190,//居中+向下偏移30
  },
});


export default ScanLoginScreen