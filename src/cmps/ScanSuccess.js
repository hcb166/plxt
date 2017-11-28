import React, {
    Component
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Button,
    Image,
} from 'react-native';
import Dimensions from 'Dimensions';
const {width,height} = Dimensions.get('window');
import TopBar from '../utils/TopBar';
import NavBar from '../utils/NavBar';
import { NavigationActions } from 'react-navigation'


export default class LoginSucess extends Component {

    componentDidMount() {
    }
    _onPress() {
        resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName:'Main'})//要跳转到的页面名字
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }


    render(){
        const { params } = this.props.navigation.state;
        return(
            <View style={{backgroundColor:'#e3e3e3'}}>
                <TopBar navigation={this.props.navigation} />
                <View style={styles.container}>
                    <NavBar onPress={() => {this.props.navigation.navigate('Detail',{info:params.info});}} title='扫码成功' NavRight={
                        <Text></Text>
                    } />
                    <View style={styles.content}>
                        <Text style={styles.text}>扫码绑定站点成功</Text>
                        <Text style={styles.text}>{params.code}</Text>
                        <View style={{marginTop: 50}}>
                            <Button color='#42a91c' onPress={this._onPress.bind(this)} title='返 回 首 页 ' />
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
