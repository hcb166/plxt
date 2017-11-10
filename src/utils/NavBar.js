import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
} from 'react-native';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
    }
    _onPress() {
        this.props.onPress();
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.content}>
                    <TouchableHighlight underlayColor='transparent' onPress={this._onPress.bind(this)}>
                        <Image style={{width:20,marginRight:10,resizeMode:'center'}} source={require('../imgs/back_btn.png')} />
                    </TouchableHighlight>
                    <Text style={{fontSize: 15,color: '#535353',fontWeight:'500'}}>{this.props.title}</Text>
                </View>
                <View>
                    {this.props.NavRight}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#cdcdcd',
    },
    content: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 10,
        paddingRight: 10,
    },
})