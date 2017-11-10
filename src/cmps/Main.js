import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ToastAndroid,
    FlatList,
    TouchableHighlight,
} from 'react-native';
import Axios from 'axios';
import Item from './Item';
import TopBar from '../utils/TopBar';

import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');

class MainScree extends Component {
    state = {
        text: '',
        data: [],
    };
    address = '';
    componentDidMount() {
        // 读取本地数据 查看是否存在历史登录数据
        storage.getAllDataForKey('serverIP').then((serverIP) => {
            if (serverIP.length < 1) { return}
            let ip = serverIP[0].ip;
            let port = serverIP[0].port;
            if (ip && port) {
                this.address = 'http://'+ip+':'+port;
                this.getData();
            }
        });
        this.timer = setInterval(() => this.getData(), 1000);

    }

    componentWillUnmount() {
        // 需要调用
        this.timer && clearInterval(this.timer);
    }
    
    getData() {
        // 已读信息只在页面初始时获取一次 避免过多的storage读操作  必须先读取
        storage.getAllDataForKey('readedNews').then((readedNews) => {
            let readedList = [];
            if (readedNews.length > 0 && readedNews[0].length>0) {
                readedList = readedNews[0];
            }
            Axios.get(this.address+'/hello')
            .then((response) => {
                // 添加数据过滤功能
                let filterCondition = this.state.text;
                let arr = [];
                if (filterCondition) {
                    response.data.data.forEach(function(val){
                        if (val.index == filterCondition) {
                            arr.push(val)
                        }
                    })
                }else{
                    arr = response.data.data;
                }

                // 添加已读和未读功能
                // 基本逻辑：
                // 已读信息缓存到本地
                // 获取最新数据后需要更新本地已读信息数据(子集)，保证缓存数据不会越来越大
                // 每条需要根据key的唯一性进行匹配
                // if(readedList.length>0) {
                    let dataKeys = [];
                    arr.forEach(function(value,index){
                        dataKeys.push(value["key"]);
                        if(readedList.indexOf(value["key"]) >= 0) {
                            arr[index]['readed'] = 1;
                        }else{
                            arr[index]['readed'] = 0;
                        }
                    })

                    readedList.forEach(function(val,index){
                        if(dataKeys.indexOf(val) < 0) {
                            readedList.splice(index, 1);
                        }
                    })
                    // 同时更新本地readNews信息 如果readNews中的信息不再当前数据中则清除
                    // storage.clearMapForKey('readedNews');
                    storage.save({
                        key: 'readedNews',
                        id: 2,
                        data: readedList,
                        expires: null,
                    })
                // }
                this.setState({data:arr})
            }).catch((error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT);
            })
        });
    }

    
    _onPressItem(item) {
        this.props.navigation.navigate('Detail',{info:item});
        this.componentWillUnmount();
    }

    _renderItem = ({item}) => ( 
        <TouchableHighlight activeOpacity={0.5}  underlayColor='transparent'  onPress={() => this._onPressItem(item)}>
            <View>
                <Item data={item} />
            </View>
        </TouchableHighlight>
    )
    _itemSeparator = () => {
        return <View style={{borderTopWidth:1,borderColor:'#cdcdcd'}}></View>
    } 
    _onRefresh() {
        Axios.get(this.address+'/hello')
        .then((response) => {
            this.setState({data:response.data.data})
            ToastAndroid.show('刷新成功', ToastAndroid.SHORT);
        }).catch((error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        })
    }

    render() {
        return(
            <View style={{backgroundColor:'#e3e3e3'}}>
                <TopBar />
                <View style={styles.container}>
                    <View style={{
                        height:50,
                        borderBottomWidth:1,
                        borderColor:'#cdcdcd',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize:15,color:'#535353',fontWeight:'500'}}>物料需求</Text>
                        <TextInput 
                            style={styles.input}
                            underlineColorAndroid='transparent'
                            inlineImageLeft='search_icon'
                            inlineImagePadding={20}
                            placeholder='搜索'
                            placeholderTextColor='#939393'
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                        />
                    </View>
                    
                    <View style={styles.content}>
                        <FlatList
                            style={{
                                backgroundColor: "#fff",
                                height: height - 145,
                            }}
                            onPress={this._onPressItem.bind(this)}
                            onRefresh={this._onRefresh.bind(this)}
                            refreshing={false}
                            data={this.state.data}
                            renderItem={this._renderItem.bind(this)}
                            ItemSeparatorComponent={this._itemSeparator.bind(this)}
                        />
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
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },
    content: {
        // marginTop: 60,
        // alignItems: 'center',
        // backgroundColor: '#fff',
    },
    text: {
        color: '#42a91c',
        fontSize: 20, 
        marginTop: 10,
    },
    input: {
        minWidth:200, 
        height: 35,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        borderColor: "transparent", 
        borderRadius: 3,
        backgroundColor: "#e5e5e5",
        color: '#333',
        fontSize: 14,
    }
})

export default MainScree