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
import { NavigationActions } from 'react-navigation'
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
        try
        {
            const { params } = this.props.navigation.state;
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
            ToastAndroid.show("程序出错", ToastAndroid.SHORT);
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
                        <MaInfo data={params.info} />
                    </View>
                </View>
            </View>
        )
    }
}

class MaInfo extends Component {
    
    constructor(props){
        super(props);
    }

    state = {
        data: [],
        clr: '#2193f3',
    }


    componentDidMount() {
        // 传递过来的数据进行格式化
        try{
            var mtn = this.props.data.material_type_name.split(',');
            var mn = this.props.data.material_names.split(',');
            var nr = this.props.data.num_remarks.split(',');
            var mun = this.props.data.material_unit_name.split(',');
            var mrn = this.props.data.material_rack_name.split(',');
        }
        catch(err){
            var mtn = [];
            ToastAndroid.show('程序出错', ToastAndroid.SHORT);
        }
        
        var arr = [];
        mtn.forEach(function(val,index){
            arr.push({
                key: index,
                col1: mtn[index]+'/'+mn[index],
                // col2: n[index]+'+'+nr[index]+mun[index],
                col2: nr[index]+mun[index],
                col3: mrn[index],
            })
        })
        this.setState({data:arr});

        switch(this.props.data.state_name) {
            case "正常完成": 
                this.setState({clr:'#1eb852'});
                break;
            case "取消订单":
                this.setState({clr:'#f71313'});
                break;
            default:
                break;
        }
    }


    _renderItem = ({item}) => ( 
        <View style={{
            width: width - 30,
            flexDirection:'row',
            justifyContent:'space-between',
            paddingTop: 6,
            paddingBottom: 6,
        }}>
            <Text style={{flex:4,fontSize: 13,color:'#535353',}}>{item.col1}</Text>
            <Text style={{flex:2,fontSize: 13,color:'#535353',}}>{item.col2}</Text>
            <Text style={{flex:2,fontSize: 13,color:'#535353',}}>{item.col3}</Text>
        </View>
    )


    render() {

        if(!this.props.data.packaging_code){
            return (
                <View>
                    <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
                        <Text style={{fontSize: 14,color: '#535353',}}>呼叫位置：{this.props.data.workline_name} </Text>
                        <Text style={[{fontSize: 14,}]}>状态：<Text style={[{color:this.state.clr}]}>{this.props.data.state_name}</Text></Text>
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
        }else{
            return(
                <View>
                    <View style={{ flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:10}}>
                        <Text style={{fontSize: 14,color: '#535353',}}>呼叫位置：{this.props.data.workline_name} </Text>
                        <Text style={[{fontSize: 14,}]}>状态：<Text style={[{color:this.state.clr}]}>{this.props.data.state_name}</Text></Text>
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
                        <Text style={{flex:4,fontSize: 14,color: '#535353',}}>物料</Text>
                        <Text style={{flex:2,fontSize: 14,color: '#535353',}}>数量</Text>
                        <Text style={{flex:2,fontSize: 14,color: '#535353',}}>存储位置</Text>
                    </View>
                    <FlatList
                            style={{
                                height: height - 255,
                            }}
                            data={this.state.data}
                            renderItem={this._renderItem.bind(this)}
                        />
                    
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
})