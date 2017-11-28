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
import SplashScreen from 'react-native-splash-screen'
import Item from './Item';
import TopBar from '../utils/TopBar';
import FetchFunc from '../utils/Fetch';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');

class MainScree extends Component {
    state = {
        text: '',
        data: [],
    };
    address = '';
    devicecode: '';
    componentWillMount() {
        var _this = this;
        // 启动屏设置
        SplashScreen.hide();

        // 读取本地数据 查看是否存在历史登录数据
        storage.getAllDataForKey('serverIP').then((serverIP) => {
            if (serverIP.length < 1) { 
                this.props.navigation.navigate('Login');
                _this.componentWillUnmount();
                ToastAndroid.show("请先输入服务器地址", ToastAndroid.SHORT);
                return 
            }
            let ip = serverIP[0].ip;
            let port = serverIP[0].port;
            let device_code = serverIP[0].device;
            if (ip && port && device_code) {
                this.address = 'http://'+ip+':'+port;
                this.devicecode = device_code;
                this.getData();
            }
            this.timer = setInterval(() => this.getData(), 1000);
        });
    }

    componentWillUnmount() {
        // 需要调用
        this.timer && clearInterval(this.timer);
    }
    getData() {
        var _this = this;
        // 已读信息必须实时更新 且必须先读取
        storage.getAllDataForKey('readedNews').then((readedNews) => {
            let readedList = [];
            if (readedNews.length > 0 && readedNews[0].length>0) {
                readedList = readedNews[0];
            }
            if(!this.address) {
                this.props.navigation.navigate('Login');
                _this.componentWillUnmount();
                return
            }
            try {
                FetchFunc(this.address+'/pollen/v1/update_material_bill', {
                    "user": this.devicecode,
                    "flag": 3,
                    "item_per_page": -1,
                }).then((response) => response.json())
                .then((responseJson) => {
                    
                    if(responseJson.text) {
                        ToastAndroid.show(responseJson.text, 1000);
                        return
                    }
                    // 添加数据过滤功能
                    // console.log(responseJson.bills)
                    if(responseJson.bills){

                        // 添加已读和未读功能
                        // 基本逻辑：
                        // 已读信息缓存到本地
                        // 获取最新数据后需要更新本地已读信息数据(子集)，保证缓存数据不会越来越大
                        // 每条需要根据key的唯一性进行匹配
                        // if(readedList.length>0) {
                            let dataKeys = [];
                            let res_arr = responseJson.bills;
                            res_arr.forEach(function(value,index){
                                dataKeys.push(value["code"]);
                                if(readedList.indexOf(value["code"]) >= 0) {
                                    res_arr[index]['readed'] = 1;
                                }else{
                                    res_arr[index]['readed'] = 0;
                                }
                                res_arr[index]["key"] = value["code"];
                                res_arr[index]["index"] = index+1;
                            })

                            // 同时更新本地readNews信息 如果readNews中的信息不再当前数据中则清除
                            readedList.forEach(function(val,index){
                                if(dataKeys.indexOf(val) < 0) {
                                    readedList.splice(index, 1);
                                }
                            })
                            storage.save({
                                key: 'readedNews',
                                id: 2,
                                data: readedList,
                                expires: null,
                            })

                        let filterCondition = this.state.text;
                        let arr = [];
                        if (filterCondition) {
                            responseJson.bills.forEach(function(val){
                                // 查询条件
                                if (val.workline_name.toLowerCase().indexOf(filterCondition.toLowerCase())>=0) {
                                    arr.push(val)
                                }
                            })
                        }else{
                            arr = responseJson.bills;
                        }
                        // }
                        this.setState({data:arr})
                        // 销毁 清除内存缓存数据
                        arr = null;
                    }else{
                        this.setState({data:[{key:'nodata'}]})
                    }
                }).catch((error) => {
                    ToastAndroid.show(error.message, 1000);
                })
            }
            catch(err){
                ToastAndroid.show(err, 1000);
            }
        });
    }

    
    _onPressItem(item) {
        if(item.key !== "nodata"){
            this.props.navigation.navigate('Detail',{info:item});
            this.componentWillUnmount();
        }
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
        //如果使用 this.getData() 如何判断刷新成功？？？？？
        this.getData();
        ToastAndroid.show("刷新成功", ToastAndroid.SHORT);
    }

    render() {
        return(
            <View style={{backgroundColor:'#e3e3e3'}}>
                <TopBar navigation={this.props.navigation} />
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
        height: height-90,
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