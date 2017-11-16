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


export default class LoginFail extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render(){
        const { params } = this.props.navigation.state;
        return(
            <View style={{backgroundColor:'#e3e3e3'}}>
                <TopBar />
                <View style={styles.container}>
                    <NavBar onPress={() => {this.props.navigation.navigate('Detail',{info:params.info});}} title='扫码错误' NavRight={
                        <Text></Text>
                    } />
                    <View style={styles.content}>
                        <Image style={{height:150,resizeMode: 'center',marginTop: 50}} source={require('../imgs/error_code.png')}  />
                        <Text style={styles.text}> 扫 描 出 错 ! </Text>
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
        marginTop: 30,
        alignItems: 'center',
        backgroundColor: '#fff',

    },
    text: {
        color: 'red',
        fontSize: 20, 
        marginTop: 10,
        marginBottom: 30,   
    }
})
