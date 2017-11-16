import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';


export default class TopBar extends Component {
    state = {
        device: '未连接',
    }

    componentDidMount() {
        // 读取本地数据 查看是否存在历史登录数据
        storage.getAllDataForKey('serverIP').then((serverIP) => {
            if (serverIP.length < 1) { return}
            let device = serverIP[0].device_name;
            if (device) {
                this.setState({device: device})
            }
        }); 
    }

    render() {
        return(
            <View style={styles.header}>
                <Image style={{ width: 100,height:50}} source={require('../imgs/te_logo.png')} />
                <Text style={styles.text}> {this.state.device} </Text>   
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#ff8800',
    },
    text: {
        color: '#fff',
        fontSize: 17.5,
        fontWeight: '500',
    }
})