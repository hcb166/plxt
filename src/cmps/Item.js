'use strict';

import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');


class Urgent extends Component {
    render() {
        const isTrue = this.props.priority;
        if (isTrue) {
            return(
                <Image 
                    style={{ width:23,height:30,resizeMode:'center'}} 
                    source={require('../imgs/flag.png')} 
                />
            )
        }else{
            return(<Text style={{width:20}}></Text>)
        }
    }
}

class Material extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.specialtype == 2){
            return (
                <View style={{justifyContent:'flex-start'}}>
                    <Text style={{color:'#535353',fontSize: 14}}>{this.props.worklinename}</Text>
                    <Text style={{fontSize:11,color:'#2193f3'}}>SAP</Text>
                </View>
            )
        } else if(this.props.specialtype == 1){
            return (
                <View style={{justifyContent:'flex-start'}}>
                    <Text style={{color:'#535353',fontSize: 14}}>{this.props.worklinename}</Text>
                    <Text style={{fontSize:11,color:'#2193f3'}}>空货架</Text>
                </View>
            )
        }else{
            return (
                <View style={{justifyContent:'flex-start'}}>
                    <Text style={{color:'#535353',fontSize: 14}}>{this.props.worklinename}</Text>
                    <Text style={{fontSize:11}}>{this.props.packagingname}</Text>
                </View>
            )
        }
    }
}

class Sta extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        clr: '#2193f3',  //蓝色
        robot: '',
    }

    componentDidMount() {
    }

    render() {
        if (this.props.status == "已分配车" || this.props.status == "搬运中") {
            return (
                <View>
                    <View 
                    style={{
                        flexDirection:'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}>
                        <Text style={[{fontSize: 14,},{color:this.state.clr}]}>{this.props.status}</Text>
                        <View style={{
                                flexDirection:'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <Text style={{marginLeft:5,marginRight:5}}>
                                <Image style={{width:30,height:20,resizeMode:'center'}} source={require('../imgs/car.png')} />  
                            </Text>  
                            <Text style={[{fontSize: 14,},{color:this.state.clr}]}>
                                {this.props.robot}
                            </Text>
                        </View>
                    </View>
                    <Text style={{fontSize:11}}>{this.props.createstamp}</Text>
                </View>
            )
        }else{
           return (
                <View>
                    <View 
                    style={{
                        flexDirection:'row',
                        alignItems: 'center',
                    }}>
                        <Text style={[{fontSize: 14,},{color: 
                            this.props.status == "正常完成" ? "#1eb852" : 
                            this.props.status == "取消订单" || this.props.status == "异常完成" ? "#f71313" : "#2193f3"
                        }]}>{this.props.status} {this.props.remarks}</Text>
                        <View style={{}}></View>
                    </View>
                    <Text style={{fontSize:11}}>{this.props.createstamp}</Text>
                </View>
            ) 
        }
        

    }
}



class Index extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.readed === 0){
            return(
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:14,width:20,textAlign :'center'}}>
                        {this.props.index}
                    </Text>
                    <View style={styles.circle}></View>
                </View>
            )
        }else{
           return(
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:14,width:20,textAlign :'center'}}>
                        {this.props.index}
                    </Text>
                </View>
            ) 
        }
    }
}

export default class Item extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.data.key !== "nodata"){
            return(
                    <View style={styles.item}>
                        <View style={{flex:1,}}>
                            <Index index={this.props.data.index} readed={this.props.data.readed} />
                        </View>
                        <View  style={{flex:3,}}>
                            <Material 
                                worklinename={this.props.data.workline_name}  
                                packagingname={this.props.data.packaging_name} 
                                specialtype={this.props.data.special_type} 
                            />
                        </View>
                        <View  style={{flex:6,}}>
                            <Sta 
                                status={this.props.data.state_name} 
                                remarks={this.props.data.remarks} 
                                robot={this.props.data.robot_code} 
                                createstamp={this.props.data.create_stamp} 
                            />
                        </View>
                        <View  style={{flex:1,alignItems:'flex-end'}}>
                            <Urgent priority={this.props.data.priority} />
                        </View>
                    </View>
            )
        }else{
            return(
                <View style={{flex:1,alignItems:'center'}}>
                    <Text style={{margin:20}}>暂无数据</Text>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        width: width - 30,
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    circle: {
        width: 10,
        height: 10,
        backgroundColor: '#f00',
        borderRadius: 5,
        marginLeft: -5,
    }
})