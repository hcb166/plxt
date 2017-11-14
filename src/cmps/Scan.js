'use strict';

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    Vibration,
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
// import QRCodeScanner from 'react-native-qrcode-scanner';
import Camera from 'react-native-camera';
import TopBar from '../utils/TopBar';
import NavBar from '../utils/NavBar';
// import Storage from 'react-native-storage';
import Axios from 'axios';

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



class ScanScreen extends Component {
    onSuccess(e) {
        // 读取到数据后需要发送请求到后台判断能否成功
        Vibration.vibrate();
        const URL = 'http://'+e.data;
        const ip = e.data.split(':')[0];
        const port = e.data.split(':')[1];
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
            ToastAndroid.show('扫描成功', ToastAndroid.SHORT);
            setTimeout(() => {this.props.navigation.navigate('ScanSuccess')},300);
        }).catch((error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            setTimeout(() => {this.props.navigation.navigate('ScanFail')},300);
        })

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

    // render() {
    //     return (
    //         <View>
    //             <TopBar />
    //             <View style={{backgroundColor: "#666f76"}}>
    //                 <NavBar onPress={() => {this.props.navigation.navigate('Detail',{info:'scan'});}} title='扫描站点条码' NavRight={
    //                 <Text></Text>
    //                 } />
    //                 <View style={{backgroundColor:"#fff",height:height-120,}}>

    //                     <QRCodeScanner
    //                         onRead={this.onSuccess.bind(this)}
    //                         containerStyle={{
    //                             backgroundColor: '#666f76',
    //                             alignItems: 'center',
    //                         }}
    //                         cameraStyle={{
    //                             width: 200,
    //                             height: 200,
    //                         }}
    //                         // fadeIn={true}
    //                         showMarker={true}
    //                         customMarker={
    //                             <View style={styles.rectangleContainer}>
    //                                 <Image style={{top:100,width:200,height:200}} source={require('../imgs/scan_corner.png')} />
    //                                 <ScanPointer style={{top:0}} />
    //                             </View>
    //                         }
    //                         topContent={(
    //                             <Text style={styles.centerText}>扫码绑定站点</Text>
    //                         )}
    //                         topViewStyle={{flex: 1}}
    //                         bottomContent={(
    //                             <Text style={{color:'#fff',fontSize:13}}>请对准二维码/条码，耐心等待</Text>
    //                         )}
    //                     />
    //                 </View>
    //             </View>
    //         </View>
    //     );
    // }
    render() {
        return (
            <View>
                <TopBar />
                <View style={{backgroundColor: "#666f76"}}>
                    <NavBar onPress={() => {this.props.navigation.navigate('Detail',{info:'scan'});}} title='扫描站点条码' NavRight={
                    <Text></Text>
                    } />
                    <View style={{flexDirection:'row',justifyContent:'center',height:height-120,}}>
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


export default ScanScreen