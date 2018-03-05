'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    Vibration,
    View,
    Image,
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
            y: new Animated.Value(-600), 
        };
    }
    componentDidMount() {
        this.state.y.setValue(-600)
        Animated.timing( 
            this.state.y, 
            {
                toValue: -300, 
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
                <Image style={{width:300,height:300,resizeMode:'cover'}} source={require('../imgs/grid.png')} />
            </Animated.View>
        )
    }
}



class ScanScreen extends Component {
    constructor(props) {
        super(props);
    }
    address = '';
    devicecode = '';

    onSuccess(e) {
        // 读取到数据后需要发送请求到后台判断能否成功
        Vibration.vibrate();
        
        // 读取本地数据 查看是否存在历史登录数据
        storage.getAllDataForKey('serverIP').then((serverIP) => {
            if (serverIP.length < 1) { return}
            let ip = serverIP[0].ip;
            let port = serverIP[0].port;
            let device_code = serverIP[0].device;
            if (ip && port && device_code) {
                this.address = 'http://'+ip+':'+port;
                this.devicecode = device_code;
                // 请求交互 
                this.bindStation(e.data);
            }else{
                ToastAndroid.show('获取地址失败，请退出重新扫描', ToastAndroid.SHORT);
                // const { params } = this.props.navigation.state;
                // this.props.navigation.navigate('Detail',{info:params.info})
            }
        });
    }
    state = {
        scanning: false,
    }
    
    bindStation(code) {

        // const {params} = this.props.navigation.state;
        FetchFunc(this.address+'/pollen/v1/get_code3s_info', {
            "user": this.devicecode,
            "code3s": code,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.text) {
                ToastAndroid.show(responseJson.text, ToastAndroid.SHORT);
                ToastAndroid.show('扫码失败，请验证条码信息', ToastAndroid.SHORT);
                // setTimeout(() => {this.props.navigation.navigate('ScanFail',{info:params.info})},300);
            }else{
                ToastAndroid.show('扫描成功', ToastAndroid.SHORT);
                setTimeout(() => {this.props.navigation.navigate('Main',{})},300);
            }
        }).catch((error) => {
            ToastAndroid.show(error.message+"请求失败，请退出重新扫码", ToastAndroid.SHORT);
            // setTimeout(() => {this.props.navigation.navigate('ScanFail',{info:params.info})},300);
        })
    }

    _handleBarCodeRead(e) {
        // setTimeout(() => {
            if (!this.state.scanning) {
                this.onSuccess(e);
                this.setState({scanning:true})
            }else{
                return
            }
        // },300)

    }



    // <TopBar navigation={this.props.navigation} />
    render() {
        const { params } = this.props.navigation.state;
        if (!this.state.scanning) {
            return (
                <View>
                    <View style={{backgroundColor: "#6a737a"}}>
                        <NavBar onPress={() => {this.setState({scanning:true});this.props.navigation.navigate('Main',{});}} title='扫描3S标签' NavRight={
                        <Text></Text>
                        } />
                        <View style={{backgroundColor:'#6a737a',flexDirection:'row',justifyContent:'center',height:height-60,}}>
                            <Camera
                                ref={(cam) => {
                                this.camera = cam;
                                }}
                                style={styles.preview}
                                onBarCodeRead={this._handleBarCodeRead.bind(this)}
                            >
                            <View style={styles.rectangleContainer}>
                                <View style={styles.rectangle}>
                                    <Image style={{width:300,height:300,resizeMode:'center'}} source={require('../imgs/scan_corner.png')} />
                                </View>
                            </View>
                            </Camera>
                        </View>
                    </View>
                </View>
            );
        }else{
            return (
                <View>
                    <TopBar navigation={this.props.navigation} />
                    <View style={{backgroundColor: "transparent"}}>
                        <NavBar onPress={() => {this.props.navigation.navigate('Main',{})}} title='扫描3S标签' NavRight={
                        <Text></Text>
                        } />
                        <View style={{backgroundColor:'transparent',flexDirection:'row',justifyContent:'center',height:height-120,}}>
                        </View>
                    </View>
                </View>
            );
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
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0791f4',
  },
  rectangle: {
    height: 300,
    width: 300,
    backgroundColor: 'transparent',
  },
  // camera组件样式
  preview: {
    width: 300,
    height: 300,
    marginTop: height/2-190,//居中+向下偏移30
  },
});


export default ScanScreen