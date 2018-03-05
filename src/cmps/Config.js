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
    TouchableHighlight,
} from 'react-native'
import { TabNavigator } from 'react-navigation';
import Storage from 'react-native-storage';
import TopBar from '../utils/TopBar';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');
import SplashScreen from 'react-native-splash-screen'
import FetchFunc from '../utils/Fetch';
import NavBar from '../utils/NavBar';
import { NavigationActions } from 'react-navigation'


const storage = new Storage({
    size: 1000, //默认1000条  循环存储(超出则循环覆盖)
    storageBackend: AsyncStorage, //不指定，只会保存在内存中
    defaultExpires: null, //null永不过期
    // enableCache: true,
    // sync: func
})
global.storage = storage;

class InputLoginScreen extends Component {
    constructor(props){
        super(props);
    }
    
    state = {
        ip: '',
        port: '',
        code: '',
    }
    componentWillMount(){
        
        // 读取本地数据 查看是否存在历史登录数据
        storage.getAllDataForKey('serverIP').then((serverIP) => {
            if (serverIP.length < 1) { return }
            let ip = serverIP[0].ip;
            let port = serverIP[0].port;
            let device = serverIP[0].device;
            if (ip && port && device) {
                this.setState({ip:ip,port:port,code:device})
            }
        });
        try {
            const { params } = this.props.navigation.state;
            console.log(params.ip)
            this.setState({ip:params.ip,port:params.port})
            return
        }
        catch(err){
            
        }
    }



    // Tab 切换跳转到不同的登录方式页面下
    Login() {
        var ip = this.state.ip;
        var port = this.state.port;
        var code = this.state.code;
        if(!ip || !port || !code) {return}
        try {
            FetchFunc('http://'+ip+':'+port+'/pollen/v1/device_login', {code:code})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.text){
                    ToastAndroid.show(responseJson.text, ToastAndroid.SHORT);
                    return
                }
                storage.save({
                    key: 'serverIP',
                    id: 1,
                    data: {
                        ip: ip,
                        port: port,
                        device: responseJson.code, //相同的code
                        device_name: responseJson.name,
                    },
                    expires: null,
                })
                ToastAndroid.show('保存成功', ToastAndroid.SHORT);
                // this.props.navigation.navigate('Main');
                resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName:'Main'})//要跳转到的页面名字
                    ]
                });
                this.props.navigation.dispatch(resetAction);
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            })
        }
        catch(err){
            ToastAndroid.show(err, ToastAndroid.SHORT);
        }

    }
    _goBack() {
        // 只需要退出当前路由即可 '取消'操作
        // this.props.navigation.navigate('Main');
        // if(!this.state.port || !this.state.ip || !this.state.code){return}
        
        resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName:'Main'})//要跳转到的页面名字
            ]
        });
        this.props.navigation.dispatch(resetAction);

    }
    GetIPValue(ipval) {
        // ip验证
        this.setState({ip:ipval});
    }
    GetCodeValue(codeval) {
        // ip验证
        this.setState({code:codeval});
    }
    GetPortValue(portval) {
        // 端口验证
        this.setState({port:portval});
    }

    _onPress() {
        this.props.navigation.navigate('ScanForLogin');
    }




    render() {
        return(
            <View style={styles.container}>
                <NavBar 
                    title="服务器配置"
                    onPress={this._goBack.bind(this)}
                    NavRight={

                        <Text onPress={this._onPress.bind(this)} style={{marginRight:10,color:'#ff8800'}}>扫描配置</Text>
                    }
                />
                <View style={styles.content}>
                    <View style={{height:200,justifyContent:'space-around',alignItems:'center'}}>
                        <View style={styles.inputcontainer}>
                            <Text style={styles.title}>PDA编码：</Text>
                            <TextInput 
                                style={styles.input}
                                onChangeText={this.GetCodeValue.bind(this)}
                                underlineColorAndroid='transparent'
                                defaultValue={this.state.code}
                                placeholder='如 : pl_pda_01'
                            />
                        </View> 
                        <View style={styles.inputcontainer}>
                            <Text style={styles.title}>服务器IP：</Text>
                            <TextInput 
                                style={styles.input}
                                onChangeText={this.GetIPValue.bind(this)}
                                underlineColorAndroid='transparent'
                                defaultValue={this.state.ip}
                                placeholder='如 : 192.168.1.129'
                                // keyboardType="email-address"
                                // placeholderTextColor='#aaa'
                            />
                        </View> 
                        <View style={styles.inputcontainer}>
                            <Text style={styles.title}>服务器端口：</Text>
                            <TextInput 
                                style={styles.input}
                                onChangeText={this.GetPortValue.bind(this)}
                                underlineColorAndroid='transparent'
                                defaultValue={this.state.port}
                                placeholder='如 : 8009'
                                // placeholderTextColor='#aaa'
                            />
                        </View>  
                        <View style={{width:200,marginTop:50,flexDirection:'row',justifyContent:'space-between'}}>
                            <Button  color="#ff8800" disabled={this.state.clickState} onPress={this.Login.bind(this)} title=' 保 存 ' />
                            <Button color="#ff8800" onPress={this._goBack.bind(this)} title=' 取  消 ' />
                        </View>    
                    </View>
                    <View></View>
                </View>
            </View>
        )
    }
}


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
        // alignItems: 'center',
        // borderBottomWidth: 1,
        // borderColor: '#9ea1a4',
        // paddingBottom: 5,
    },
    title: {
        fontSize: 15,
        color: '#333',
        width: 100,
        alignItems: 'center',
        textAlign: 'right',
        marginRight: 5,
        marginTop: 10,
    },
    input: {
        width: 140,
        paddingLeft: 10,
        paddingRight: 10,
        height: 35,
        fontSize: 14,
        color: '#333',
        // backgroundColor: '#ddd',
        // borderRadius: 5,
        borderBottomWidth: 1,
        borderColor: '#9ea1a4',
        paddingBottom: 5,
    },
})


export default InputLoginScreen