import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Button,
    TextInput,
    Alert,
    ToastAndroid,
    AsyncStorage,
} from 'react-native'
import { TabNavigator } from 'react-navigation';
import Storage from 'react-native-storage';
import TopBar from '../utils/TopBar';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');
import SplashScreen from 'react-native-splash-screen'
import FetchFunc from '../utils/Fetch';

const storage = new Storage({
    size: 1000, //默认1000条  循环存储(超出则循环覆盖)
    storageBackend: AsyncStorage, //不指定，只会保存在内存中
    defaultExpires: null, //null永不过期
    // enableCache: true,
    // sync: func
})
global.storage = storage;

class InputLoginScreen extends Component {
    
    state = {
        ip: '',
        port: '',
        clickState: true,
    }

    // Tab 切换跳转到不同的登录方式页面下
    ChangeLoginWay() {
        this.props.navigation.navigate('ScanLogin')
    }
    CheckIP(ip) {   
        var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;  
        return re.test(ip);   
    }
    CheckPort(port) {   
        var re =  /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;  
        return re.test(port);   
    }
    EnableButton() {
        var ip = this.state.ip;
        var port = this.state.port;
        if (this.CheckPort(port) && this.CheckIP(ip)) {
            this.setState({clickState: false});
        }else{
            this.setState({clickState: true});
        }
    }
    Login() {
        var ip = this.state.ip;
        var port = this.state.port;
        FetchFunc('http://'+ip+':'+port+'/pollen/v1/device_login', {})
        .then((response) => response.json())
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
            this.props.navigation.navigate('Main');
        }).catch((error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        })

    }
    GetIPValue(ipval) {
        // ip验证
        this.setState({ip:ipval});
        this.EnableButton();
    }
    GetPortValue(portval) {
        // 端口验证
        this.setState({port:portval});
        this.EnableButton();
    }

    render() {
        return(
            <View style={styles.container}>
                <TopBar />
                <View style={styles.content}>
                    <View style={{height:200,justifyContent:'space-around',alignItems:'center'}}>
                        <View style={styles.inputcontainer}>
                            <Text style={styles.title}>地址：</Text>
                            <TextInput 
                                style={styles.input}
                                onChangeText={this.GetIPValue.bind(this)}
                                placeholder='IP地址'
                                underlineColorAndroid='transparent'
                                placeholderTextColor='#aaa'
                            />
                        </View> 
                        <View style={styles.inputcontainer}>
                            <Text style={styles.title}>端口：</Text>
                            <TextInput 
                                style={styles.input}
                                onChangeText={this.GetPortValue.bind(this)}
                                placeholder='端口'
                                underlineColorAndroid='transparent'
                                placeholderTextColor='#aaa'
                            />
                        </View>  
                        <View style={{width:190}}>
                            <Button disabled={this.state.clickState} onPress={this.Login.bind(this)} title='登 录' />
                        </View>    
                    </View>
                    <View>
                        <Text style={styles.text} onPress={this.ChangeLoginWay.bind(this)} >扫码登录</Text> 
                    </View>
                </View>
            </View>
        )
    }
}




class ScanLoginScreen extends Component {
    constructor(props) {
        super(props);
    }
    
    state = {
        // 是否存在登录的历史数据绑定的后台服务器IP地址
        host: '',
    }
    // Tab 切换跳转到不同的登录方式页面下
    ChangeLoginWay() {
        this.props.navigation.navigate('InputLogin');
    }
    ScanLogin() {
        this.props.navigation.navigate('ScanForLogin');
    }
    Login() {
        // 需要发送请求 根据返回结果进行跳转
        if (this.state.host) {
            FetchFunc(this.state.host+'/pollen/v1/device_login',{})
            .then((response) => {
                ToastAndroid.show('登录成功', ToastAndroid.SHORT);
                this.props.navigation.navigate('Main');
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            })
        }
    }

    componentDidMount() {
        // 读取本地数据 查看是否存在历史登录数据
        storage.getAllDataForKey('serverIP').then((serverIP) => {
            if (serverIP.length < 1) { return}
            let ip = serverIP[0].ip;
            let port = serverIP[0].port;
            if (ip && port) {
                this.setState({host: 'http://'+ip+':'+port})
            }
        }); 

        // 启动屏设置
        SplashScreen.hide();
    }

    render() {
        if (this.state.host) {
            return(
                <View style={styles.container}>
                    <TopBar />
                    <View style={styles.content}>
                        <View style={{height:200,justifyContent:'space-between'}}>
                            <View style={{alignItems:'center'}}>
                                <Button onPress={this.ScanLogin.bind(this)} title='重新登录' />
                            </View>
                            <View style={{alignItems:'center'}}>
                                <Button onPress={this.Login.bind(this)} title='直接登录' />
                                <Text style={{fontSize:14,marginTop:10}}>登录地址：{this.state.host}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.text} onPress={this.ChangeLoginWay.bind(this)} >手动登录</Text> 
                        </View>
                    </View>
                </View>
            )
        }else{
            return(
                <View style={styles.container}>
                    <TopBar />
                    <View style={styles.content}>
                        <View style={{height:200,justifyContent:'center'}}>
                            <View style={{alignItems:'center'}}>
                                <Button onPress={this.ScanLogin.bind(this)} title='扫码登录' />
                            </View>
                        </View>
                        <View>
                            <Text style={styles.text} onPress={this.ChangeLoginWay.bind(this)} >手动登录</Text> 
                        </View>
                    </View>
                </View>
            )
        }
    }
}





const LoginNavigator = TabNavigator({
    ScanLogin: { 
        screen: ScanLoginScreen,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
    InputLogin: { 
        screen: InputLoginScreen,
        navigationOptions: {
            tabBarVisible: false,
        }
    },
},{
    swipeEnabled: false,
    // animationEnabled: false, 
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        height: height - 50,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        color: '#078ceb',
        textDecorationLine: 'underline',
        padding: 10,
    },
    inputcontainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#9ea1a4',
        paddingBottom: 5,
    },
    title: {
        fontSize: 14,
        color: '#333',
        width: 50,
    },
    input: {
        width: 140,
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
})



export default LoginNavigator