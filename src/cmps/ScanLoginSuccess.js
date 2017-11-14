import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Button,
    ToastAndroid,
    Image,
} from 'react-native';
import Dimensions from 'Dimensions';
const {width,height} = Dimensions.get('window');
import TopBar from '../utils/TopBar';
import NavBar from '../utils/NavBar';


export default class LoginSucess extends Component {

    state = {
        address: '',
    }

    componentDidMount() {
        try {
            // 读取本地数据 查看是否存在历史登录数据
            storage.getAllDataForKey('serverIP').then((serverIP) => {
                if (serverIP.length < 1) { return}
                let ip = serverIP[0].ip;
                let port = serverIP[0].port;
                if (ip && port) {
                    this.setState({address: 'http://'+ip+':'+port})
                }
            }); 
        }
        catch(err) {
            ToastAndroid.show('程序出错', ToastAndroid.SHORT);
        }
    }

    render(){
        return(
            <View style={{backgroundColor:'#e3e3e3'}}>
                <TopBar />
                <View style={styles.container}>
                    <NavBar onPress={() => {this.props.navigation.navigate('Login');}} title='扫码成功' NavRight={
                        <Text></Text>
                    } />
                    <View style={styles.content}>
                        <Text style={styles.text}>扫码登录成功</Text>
                        <Text style={styles.text}>{this.state.address}</Text>
                        <View style={{marginTop: 50}}>
                            <Button color='#42a91c' onPress={() => {this.props.navigation.navigate('Main');}} title=' 登 录 ' />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
} 

const styles = StyleSheet.create({
    container: {
        height: height-85,
        backgroundColor: '#fff',
        borderRadius: 6,
        margin: 6,
        padding: 10,
    },
    content: {
        marginTop: 60,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        color: '#42a91c',
        fontSize: 20, 
        marginTop: 10,
    }
})
