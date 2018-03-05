'use strict';

import React, {
    Component
} from 'react';

import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    FlatList,
    ToastAndroid,
    TouchableHighlight,
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');
import FetchFunc from '../utils/Fetch';

import TopBar from '../utils/TopBar'
import NavBar from '../utils/NavBar'


var scanAllowed = true;

class BindStation extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
     
    }

    _Press() {
        try
        {
            const { params } = this.props.navigation.state;
            if(!scanAllowed){
                alert('请逐条确认物料情况，再扫码')
                return
            }
            this.props.navigation.navigate('Scan',{info:params.info});
        }
        catch(err) {
            ToastAndroid.show('程序出错', ToastAndroid.SHORT);
        }
    }
    
    render() {
        const { params } = this.props.navigation.state;
        if (params.info.priority) {
            if(params.info.state_name == "配料中"){
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
                            <Image style={{ width:25,height:30,resizeMode:'center'}} source={require('../imgs/flag.png')} />
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
                                <Image style={{ width:30,height:25,resizeMode:'center'}} source={require('../imgs/scanner_btn.png')} />
                                <Text style={{fontSize:11}}>扫码绑定站点</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            }else{
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
                            <Image style={{ width:25,height:30,resizeMode:'center'}} source={require('../imgs/flag.png')} />
                        </View>
                    </View>
                )
            }
        }else{
            if (params.info.state_name == "配料中") {
                return(
                    <View style={{ 
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent: 'space-between',
                    }}>
                        <TouchableHighlight
                            onPress={this._Press.bind(this)}
                            underlayColor='transparent'
                        >
                            <View style={{
                                flexDirection:'column',
                                alignItems:'center',
                                justifyContent: 'space-between',
                            }}>
                                <Image style={{ width:30,height:25,resizeMode:'center'}} source={require('../imgs/scanner_btn.png')} />
                                <Text style={{fontSize:11}}>扫码绑定站点</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                )
            }else{
               return(
                    <View style={{ 
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent: 'space-between',
                    }}>
                    </View>
                ) 
            }
        }
    }
}


export default class Details extends Component {

    constructor(props) {
        super(props);
    }
    _onPress() {
        try {
            resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName:'Main'})//要跳转到的页面名字
                ]
            });
            this.props.navigation.dispatch(resetAction);
        }
        catch(err){
            this.props.navigation.navigate('Main');
            // ToastAndroid.show("程序出错", ToastAndroid.SHORT);
        }
    }
    
    state = {
        materialInfo : {},
    }

    componentDidMount() {
        // 从扫描页面返回时 避免undefined造成的闪退
        try {
            const { params } = this.props.navigation.state;
            if ( params && typeof params.info === 'object') {
                this.setState({materialInfo:params.info});
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
        const { params } = this.props.navigation.state;
        return(
            <View style={{backgroundColor:'#e3e3e3'}}>
                <TopBar navigation={this.props.navigation} />
                <View style={styles.container}>
                    <View style={{borderRadius:6}}>
                        <NavBar 
                            onPress={this._onPress.bind(this)}
                            title="请配置物料"
                            NavRight={<BindStation navigation={this.props.navigation} />}
                        />
                    </View>
                    <View style={{padding:10,paddingRight: 0,}}>
                        <MaInfo data={params.info} navigation={this.props.navigation}/>
                    </View>
                </View>
            </View>
        )
    }
}

class MaInfo extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            data: [],
            clr: '#2193f3',
        }
    }

    address = '';
    devicecode= '';
    componentDidMount() {
        // 传递过来的数据进行格式化
        storage.getAllDataForKey('serverIP').then((serverIP) => {
            if (serverIP.length < 1) { 
                this.props.navigation.navigate('Login');
                ToastAndroid.show("请先输入服务器地址", ToastAndroid.SHORT);
                return 
            }
            let ip = serverIP[0].ip;
            let port = serverIP[0].port;
            let device_code = serverIP[0].device;
            if (ip && port) {
                this.address = 'http://'+ip+':'+port;
                this.devicecode = device_code;
                this.getData();
            }
        });
        switch(this.props.data.state_name) {
            case "正常完成": 
                this.setState({clr:'#1eb852'});
                break;
            case "取消订单":
                this.setState({clr:'#f71313'});
                break;
            case "异常完成":
                this.setState({clr:'#f71313'});
                break;
            default:
                break;
        }
    }
    
    checkScan = ()=>{
        var returnValue = true;
        this.state.data.forEach(function(val){
            if(val.col4 == '待配料'){
                // 存在带配料 需要逐条确认原材料
                returnValue = false;
                return
            }
        })
        scanAllowed = returnValue;
    }

    getData() {
        FetchFunc(this.address+'/pollen/v1/update_material_bill', {
            "user": this.devicecode,
            "flag": 3,
            "bill": {
                "code": this.props.data.code,
            }
        }).then((response) => response.json())
        .then((responseJson) => {
            if(!responseJson.text){
                var arr = [];
                try{
                    if(!responseJson.bills[0].special_type){
                        var mtn = responseJson.bills[0].material_type_name.split(',');
                        var mn = responseJson.bills[0].material_names.split(',');
                        var nr = responseJson.bills[0].num_remarks.split(',');
                        var mun = responseJson.bills[0].material_unit_name.split(',');
                        var mrn = responseJson.bills[0].material_rack_name.split(',');
                        var ms = responseJson.bills[0].material_status.split(',');
                        mtn.forEach(function(val,index){
                            arr.push({
                                key: index,
                                col1: mtn[index]+'/'+mn[index],
                                col2: nr[index]+mun[index],
                                col3: mrn[index],
                                col4: ms[index],
                            });
                        })
                    }
                }
                catch(err){
                    ToastAndroid.show(err.message, ToastAndroid.SHORT);
                }
                this.setState({data:arr});
                this.checkScan();
            }else{
                ToastAndroid(responseJson.text,1000)
            }
        })
    }

    _cancel = () => {
        Alert.alert(
            '取消配料',
            "取消配料~~~",
            [
              {text: '取消', onPress: () => {}},
              {text: '提交', onPress: () => {
                    var bill_code = this.props.data.code;
                    FetchFunc(this.address+'/pollen/v1/update_material_bill', {
                        "user": this.devicecode,
                        "flag": 2,
                        "bill": {
                            "code": this.props.data.code,
                            "state_id": 0,
                        }
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        if(!responseJson.text){
                            ToastAndroid.show("成功", 1000);
                            try{
                                const { params } = this.props.navigation.state;
                                this.props.navigation.navigate('Main',{info:params.info});
                            }
                            catch(err){
                                ToastAndroid.show(err.message, 1000);
                            }
                        }else{
                            ToastAndroid.show(responseJson.text, 1000);
                        }
                    }).catch((error) => {
                        ToastAndroid.show(error.message, 1000);
                    })
                }},
            ]
        )
    }
    _none = (item) => {
        Alert.alert(
            '无料',
            `上报 ${item.col1} 无料 信息`,
            [
              {text: '取消', onPress: () => console.log('Cancel Pressed!')},
              {text: '提交', onPress: () => {
                var bill_code = this.props.data.code,
                packaging_code = this.props.data.packaging_code,
                material_code = item.col1.split('/')[1];
                FetchFunc(this.address+'/pollen/v1/update_bill_material_status', {
                        "bill_code": bill_code,
                        "packaging_code": packaging_code,
                        "material_code": material_code,
                        "status": -1,
                        "status_remarks": '库存为0',
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        if(!responseJson.text){
                            ToastAndroid.show("成功", 1000);
                            this.getData();
                        }else{
                            ToastAndroid.show(responseJson.text, 1000);
                        }
                    }).catch((error) => {
                        ToastAndroid.show(error.message, 1000);
                    })
                }},
            ]
          )
    }
    _lack = (item) => {
        Alert.alert(
            '少料',
            `上报 ${item.col1} 少料 信息`,
            [
              {text: '取消', onPress: () => console.log('Cancel Pressed!')},
              {text: '提交', onPress: () => {
                var bill_code = this.props.data.code,
                packaging_code = this.props.data.packaging_code,
                material_code = item.col1.split('/')[1];
                FetchFunc(this.address+'/pollen/v1/update_bill_material_status', {
                        "bill_code": bill_code,
                        "packaging_code": packaging_code,
                        "material_code": material_code,
                        "status": 2,
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        if(!responseJson.text){
                            ToastAndroid.show("成功", 1000);
                            this.getData();
                        }else{
                            ToastAndroid.show(responseJson.text, 1000);
                        }
                    }).catch((error) => {
                        ToastAndroid.show(error.message, 1000);
                    })
                }},
            ]
          )
    }
    _finish = (item) => {
        var bill_code = this.props.data.code,
        packaging_code = this.props.data.packaging_code,
        material_code = item.col1.split('/')[1];
        FetchFunc(this.address+'/pollen/v1/update_bill_material_status', {
                "bill_code": bill_code,
                "packaging_code": packaging_code,
                "material_code": material_code,
                "status": 1,
            }).then((response) => response.json())
            .then((responseJson) => {
                if(!responseJson.text){
                    ToastAndroid.show("成功", 1000);
                        this.getData();
                }else{
                    ToastAndroid.show(responseJson.text, 1000);
                }
            }).catch((error) => {
                ToastAndroid.show(error.message, 1000);
            })
           
    }

    write = (item) => {
        if(item.col4 == '待配料'){
            return (
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',}}>
                    <View style={[styles.none]}>
                        <Text 
                            onPress={() => {this._none(item)}} 
                            style={styles.txt}>无料</Text>
                    </View>
                    <View style={[styles.lack]}>
                        <Text 
                            onPress={() => {this._lack(item)}} 
                            style={styles.txt}>少料</Text>
                    </View>
                    <View style={[styles.finish]}>
                        <Text 
                            onPress={() => {this._finish(item)}} 
                            style={[styles.txt,{color:'#429e6c'}]}>完成</Text>
                    </View>
                </View>
            )
        }else{
            return(
                <View style={[styles.finish,styles.clicked,{flex:1,flexDirection:'row',justifyContent:'center'}]}>
                    <Text 
                        style={[styles.txt,{color: item.col4 !== '配料完成' ? '#f00' : '#1eb852'}]}>
                                {item.col4} 
                    </Text>
                </View>
            )
        }
    }
  
    _renderItem = ({item}) => {
        if(this.props.data.state_name == "配料中"){
            return( 
                <View style={{
                    width: width - 30,
                    flexDirection:'row',
                    justifyContent:'space-between',
                    paddingTop: 6,
                    paddingBottom: 6,
                }}>
                    <View style={{flex:2,}}>
                        <Text style={{fontSize: 10,color:'#535353',}}>{item.col1}</Text>
                    </View>
                    <View style={{flex:2,}}>
                        <Text style={{fontSize: 10,color:'#535353',}}>{item.col2}</Text>
                    </View>
                    <View style={{flex:2,}}>
                        <Text style={{fontSize: 10,color:'#535353',}}>{item.col3}</Text>
                    </View>
                    <View style={{flex:4}}>
                        { this.write(item) }    
                    </View>
                </View>
            )
        }else{
           return( 
                <View style={{
                    width: width - 30,
                    flexDirection:'row',
                    justifyContent:'space-between',
                    paddingTop: 6,
                    paddingBottom: 6,
                }}>
                    <View style={{flex:2,}}>
                        <Text style={{fontSize: 10,color:'#535353',}}>{item.col1}</Text>
                    </View>
                    <View style={{flex:2,}}>
                        <Text style={{fontSize: 10,color:'#535353',}}>{item.col2}</Text>
                    </View>
                    <View style={{flex:2,}}>
                        <Text style={{fontSize: 10,color:'#535353',}}>{item.col3}</Text>
                    </View>
                    <View style={{flex:4,flexDirection:'row',justifyContent:'center'}}>
                        <Text style={[{fontSize: 12},{color: item.col4 !== '配料完成' ? '#f00' : '#1eb852'}]}>{item.col4}</Text>
                    </View>
                </View>
            ) 
        }
    }

    render() {

        if(this.state.data.special_type == 1){
            return (
                <View>
                    <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
                        <Text style={{fontSize: 12,color: '#535353',}}>呼叫位置：{this.props.data.workline_name} </Text>
                        <Text style={[{fontSize: 12,}]}>状态：<Text style={[{color:this.state.clr}]}>{this.props.data.state_name}</Text></Text>
                    </View>
                    <View style={{ 
                        width: width - 30,
                        justifyContent:'center',
                        padding: 15,
                    }}>
                        <Text style={{lineHeight: 30,fontSize:13,textAlign:'center'}}>该任务为呼叫空货架请求，请将空货架放置于上料站点，并扫码确认！</Text>
                    </View>
                </View>
                )
        }else if(!this.props.data.special_type){
            if(this.props.data.state_name == "配料中"){
                return(
                    <View>
                        <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
                            <Text style={{fontSize: 12,color: '#535353',}}>呼叫位置：{this.props.data.workline_name} </Text>
                            <Text style={[{fontSize: 12,}]}>状态：<Text style={[{color:this.state.clr}]}>{this.props.data.state_name}</Text></Text>
                        </View>
                        <View style={{ 
                            width: width - 30,
                            flexDirection:'row',
                            justifyContent:'space-between',
                            paddingBottom: 15,
                            borderBottomWidth:1,
                            borderColor:'#cdcdcd',
                            marginBottom: 10,
                        }}>
                            <Text style={{flex:2,fontSize: 12,color: '#535353',}}>物料</Text>
                            <Text style={{flex:2,fontSize: 12,color: '#535353',}}>数量</Text>
                            <Text style={{flex:2,fontSize: 12,color: '#535353',}}>存储位置</Text>
                            <Text style={{flex:4,fontSize: 12,color: '#535353',textAlign:'center'}}>操作</Text>
                        </View>
                        <FlatList
                                style={{
                                    height: height - 300,
                                }}
                                data={this.state.data}
                                renderItem={this._renderItem.bind(this)}
                            />
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
                            <View style={{width:100,borderWidth:1,borderColor:'#ddd',height:25,}}>
                                <Text 
                                onPress={()=>{this._cancel()}} 
                                style={{fontSize:14,color:'#f00',textAlign:'center',paddingTop:1}}>取消配料</Text>
                            </View>
                        </View>
                    </View>
                )
            }else{
               return(
                    <View>
                        <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
                            <Text style={{fontSize: 12,color: '#535353',}}>呼叫位置：{this.props.data.workline_name} </Text>
                            <Text style={[{fontSize: 12,}]}>状态：<Text style={[{color:this.state.clr}]}>{this.props.data.state_name}</Text></Text>
                        </View>
                        <View style={{ 
                            width: width - 30,
                            flexDirection:'row',
                            justifyContent:'space-between',
                            paddingBottom: 15,
                            borderBottomWidth:1,
                            borderColor:'#cdcdcd',
                            marginBottom: 10,
                        }}>
                            <Text style={{flex:2,fontSize: 12,color: '#535353',}}>物料</Text>
                            <Text style={{flex:2,fontSize: 12,color: '#535353',}}>数量</Text>
                            <Text style={{flex:2,fontSize: 12,color: '#535353',}}>存储位置</Text>
                            <Text style={{flex:4,fontSize: 12,color: '#535353',textAlign:'center'}}>操作</Text>
                        </View>
                        <FlatList
                                style={{
                                    height: height - 270,
                                }}
                                data={this.state.data}
                                renderItem={this._renderItem.bind(this)}
                            />
                    </View>
                )
            }
        }else if(this.props.data.special_type == 2){
            return (
                <View>
                    <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
                        <Text style={{fontSize: 12,color: '#535353',}}>呼叫位置：{this.props.data.workline_name} </Text>
                        <Text style={[{fontSize: 12,}]}>状态：<Text style={[{color:this.state.clr}]}>{this.props.data.state_name}</Text></Text>
                    </View>
                    <View style={{ 
                        width: width - 30,
                        justifyContent:'center',
                        padding: 15,
                    }}>
                        <Text style={{lineHeight: 30,fontSize:13,textAlign:'center'}}>3S标签-SAP</Text>
                    </View>
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        height: height-90,
        backgroundColor: '#fff',
        borderRadius: 6,
        margin: 6,
        padding: 6,
    },
    clicked: {
        borderColor:'#fff',
    },
    none: {
        height: 20,
        borderWidth: 1,
        borderColor:'#ddd',
        paddingLeft: 2,
        paddingRight: 2,
    },
    lack: {
        height: 20,
        borderWidth: 1,
        borderColor:'#ddd',
        paddingLeft: 2,
        paddingRight: 2,
        marginLeft: 10,
        marginRight: 10,
    },
    finish: {
        height: 20,
        borderWidth: 1,
        paddingLeft: 2,
        paddingRight: 2,
        borderColor:'#ddd',
    },
    txt: {
        padding: 2,
        fontSize: 10,
        color:'#f00',
    }
})