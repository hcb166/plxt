'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    FlatList,
    ToastAndroid,
    TouchableHighlight,
} from 'react-native';

import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');


import TopBar from '../utils/TopBar'
import NavBar from '../utils/NavBar'


class BindStation extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
     
    }


    _Press() {
        this.props.navigation.navigate('Scan');
    }
    
    render() {
        return(
            <View style={{ 
                flexDirection:'row',
                alignItems:'center',
                justifyContent: 'space-between',
            }}>
                <View style={{
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent: 'flex-end',
                    marginRight: 20,
                }}>
                    <Text style={{fontSize:15,fontWeight:'500',color:'#535353',marginRight:10,}}>加急</Text>
                    <Image style={{ width:25,resizeMode:'center'}} source={require('../imgs/flag.png')} />
                </View>
                <TouchableHighlight
                    onPress={this._Press.bind(this)}
                    underlayColor='transparent'
                >
                    <View style={{
                        flexDirection:'column',
                        alignItems:'center',
                        justifyContent: 'space-between',
                    }}>
                        <Image style={{ width:40,height:25,resizeMode:'center'}} source={require('../imgs/scanner_btn.png')} />
                        <Text style={{fontSize:11}}>扫码绑定站点</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}





export default class Details extends Component {

    constructor(props) {
        super(props);
    }
    
    _onPress() {
        this.props.navigation.navigate('Main');
    }
    
    componentDidMount() {
        // 从扫描页面返回时 避免undefined造成的闪退
        try {
            const { params } = this.props.navigation.state;
            if ( params && typeof params.info === 'object') {
                storage.getAllDataForKey('readedNews').then((readedNews) => {
                    let readedList = [];
                    if (readedNews.length > 0 && readedNews[0].length>0) {
                        readedList = readedNews[0];
                    }
                    if(readedList.indexOf(params.info.key)<0){
                        readedList.push(params.info.key)
                        storage.save({
                            key: 'readedNews',
                            id: 2,
                            data: readedList,
                            expires: null,
                        })
                    }
                    
                });
            }
        }
        catch(err){
            ToastAndroid.show('程序出错', ToastAndroid.SHORT);
        }

    }

    render() {
        return(
            <View style={{backgroundColor:'#e3e3e3'}}>
                <TopBar />
                <View style={styles.container}>
                    <View style={{borderRadius:6}}>
                        <NavBar 
                            onPress={this._onPress.bind(this)}
                            title="请配置物料"
                            NavRight={<BindStation navigation={this.props.navigation} />}
                        />
                    </View>
                    <View style={{padding:10}}>
                        <MaInfo />
                    </View>
                </View>
            </View>
        )
    }
}

class MaInfo extends Component {
    
    state = {
        data: [
            {key: 1, ss: '半成品/1-23232-1',na: '5包', dd:'S1-A-1'},
            {key: 2, ss: '半成品/1-23232-1',na: '5+3包', dd:'S1-A-1'},
            {key: 5, ss: '半成品/1-23232-1',na: '5+3包', dd:'S1-A-1'},
            {key: 6, ss: '半成品/1-23232-1',na: '5包', dd:'S1-A-1'},
            {key: 16, ss: '半成品/1-23232-1',na: '3包', dd:'S1-A-1-S1'},
            {key: 15, ss: '半成品/1-23232-1',na: '5+3包', dd:'S1-A-1-2-2'},
        ],
    }


    _renderItem = ({item}) => ( 
        <View style={{
            width: width - 50,
            flexDirection:'row',
            justifyContent:'space-between',
            paddingTop: 6,
            paddingBottom: 6,
        }}>
            <Text style={{flex:4,fontSize: 13,color:'#535353',}}>{item.ss}</Text>
            <Text style={{flex:2,fontSize: 13,color:'#535353',}}>{item.na}</Text>
            <Text style={{flex:2,fontSize: 13,color:'#535353',}}>{item.dd}</Text>
        </View>
    )


    render() {
        return(
            <View>
                <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
                    <Text style={{fontSize: 14,color: '#535353',}}>呼叫位置：MCON 1P/A15 </Text>
                    <Text style={{fontSize: 14,color: '#535353',}}>状态：配料中 </Text>
                </View>
                <View style={{ 
                    width: width - 30,
                    flexDirection:'row',
                    justifyContent:'space-between',
                    paddingBottom: 15,
                    borderBottomWidth:1,
                    borderColor:'#cdcdcd',
                }}>
                    <Text style={{flex:4,fontSize: 14,color: '#535353',}}>物料</Text>
                    <Text style={{flex:2,fontSize: 14,color: '#535353',}}>数量</Text>
                    <Text style={{flex:2,fontSize: 14,color: '#535353',}}>存储位置</Text>
                </View>
                <FlatList
                        style={{
                            height: height - 225,
                        }}
                        data={this.state.data}
                        renderItem={this._renderItem.bind(this)}
                    />
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: height-80,
        backgroundColor: '#fff',
        borderRadius: 6,
        margin: 6,
        padding: 6,
    },
})