/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import LoginScreen from './src/cmps/Login';
import MainScreen from './src/cmps/Main';
import DetailScreen from './src/cmps/Details';
import ScanLoginScreen from './src/cmps/ScanLogin';
import ScanLoginFailScreen from './src/cmps/ScanLoginFail';
import ScanLoginSuccessScreen from './src/cmps/ScanLoginSuccess';

import ScanScreen from './src/cmps/Scan';
import ScanFailScreen from './src/cmps/ScanFail';
import ScanSuccessScreen from './src/cmps/ScanSuccess';






const RootNavigator = StackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            header: null,
        } 
    },
    ScanForLogin: {
        screen: ScanLoginScreen,
        navigationOptions: {
            header: null,
        }
    },
    ScanLoginFail: {
        screen: ScanLoginFailScreen,
        navigationOptions: {
            header: null,
        }
    },
    ScanLoginSuccess: {
        screen: ScanLoginSuccessScreen,
        navigationOptions: {
            header: null,
        }
    },
    Main: {
        screen: MainScreen,
        navigationOptions: {
            header: null,
        }
    },
    Detail: {
        screen: DetailScreen,
        navigationOptions: {
            header: null,
        }
    },
    Scan: {
        screen: ScanScreen,
        navigationOptions: {
            header: null,
        }
    },
    ScanFail: {
        screen: ScanFailScreen,
        navigationOptions: {
            header: null,
        }
    },
    ScanSuccess: {
        screen: ScanSuccessScreen,
        navigationOptions: {
            header: null,
        }
    },


})


export default RootNavigator