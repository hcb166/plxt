import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
} from 'react-native';
import { StackNavigator } from 'react-navigation';


class TopBarScreen extends Component {
    constructor(props){
        super(props);
        // console.log(this.props)
    }

    _onPress(){
        this.props.navigation.navigate('Login')
    }

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
                <TouchableHighlight
                    onPress={this._onPress.bind(this)}
                    underlayColor='transparent'
                >
                    <Image style={{ width: 25,resizeMode:'center',marginRight:10}} source={require('../imgs/config.png')} />
                </TouchableHighlight>
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

export default TopBarScreen