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
        const isTrue = this.props.ergent;
        if (isTrue) {
            return(
                <Image 
                    style={{ width:25,height:30,resizeMode:'center'}} 
                    source={require('../imgs/flag.png')} 
                />
            )
        }else{
            return(<Text style={{width:20}}></Text>)
        }
    }
}

class Material extends Component {

    render() {
        return (
            <View style={{justifyContent:'flex-start'}}>
                <Text style={{color:'#535353',fontSize: 14}}>{this.props.product}</Text>
                <Text style={{fontSize:11}}>{this.props.code}</Text>
            </View>
        )
    }
}

class Sta extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.robot) {
            return (
                <View>
                    <View 
                    style={{
                        flexDirection:'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}>
                        <Text style={{color:'#ff8800',fontSize: 14,}}>{this.props.status}</Text>
                        <View style={{
                                flexDirection:'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <Text style={{marginLeft:5,marginRight:5}}>
                                <Image style={{width:30,height:20,resizeMode:'center'}} source={require('../imgs/car.png')} />  
                            </Text>  
                            <Text style={{color:'#535353',fontSize: 14}}>
                                {this.props.robot}
                            </Text>
                        </View>
                    </View>
                    <Text style={{fontSize:11}}>2017-08-31 13:28:41</Text>
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
                        <Text style={{color:'#ff8800',fontSize: 14}}>{this.props.status}</Text>
                        <View style={{}}></View>
                    </View>
                    <Text style={{fontSize:11}}>2017-08-31 13:28:41</Text>
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
        return(
                <View style={styles.item}>
                    <View style={{flex:1,}}>
                        <Index index={this.props.data.index} readed={this.props.data.readed} />
                    </View>
                    <View  style={{flex:4,}}>
                        <Material 
                            product={this.props.data.product}  
                            code={this.props.data.code}  
                        />
                    </View>
                    <View  style={{flex:5,}}>
                        <Sta 
                            status={this.props.data.status} 
                            robot={this.props.data.robot} 
                        />
                    </View>
                    <View  style={{flex:1,alignItems:'flex-end'}}>
                        <Urgent ergent={this.props.data.ergent} />
                    </View>
                </View>

            
        )
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