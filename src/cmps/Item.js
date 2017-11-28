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
        
        return (
            <View style={{justifyContent:'flex-start'}}>
                <Text style={{color:'#535353',fontSize: 14}}>{this.props.worklinename}</Text>
                <Text style={{fontSize:11}}>{this.props.packagingname}</Text>
            </View>
        )
    }
}

class Sta extends Component {
    state = {
        clr: '#2193f3',
        robot: '',
    }
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // "已分配车"  "搬运中"  的状态下才显示小车
        switch(this.props.status) {
            case "正常完成": 
                this.setState({clr:'#1eb852'});
                break;
            case "取消订单":
                this.setState({clr:'#f71313'});
                break;
            case "异常完成":
                this.setState({clr:'#f71313'});
                break;
            case "已分配车":
                this.setState({robot:this.props.robot});
                break;
            case "搬运中":
                this.setState({robot:this.props.robot});
                break;
            default:
                this.setState({robot:''});
                break;
        }



    }

    render() {
        if (this.state.robot) {
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
                        <Text style={[{fontSize: 14,},{color:this.state.clr}]}>{this.props.status}</Text>
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
                            />
                        </View>
                        <View  style={{flex:6,}}>
                            <Sta 
                                status={this.props.data.state_name} 
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
        width: 5,
        height: 5,
        backgroundColor: '#f00',
        borderRadius: 5,
        // marginLeft: 5,
    }
})