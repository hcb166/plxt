package com.dose;

import android.widget.Toast;
import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import android.app.Activity;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import java.util.ArrayList;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;
import android.widget.ScrollView;
import android.widget.Button;
import com.symbol.scanning.Scanner;
import com.symbol.scanning.Scanner.DataListener;
import com.symbol.scanning.ScannerException;
import com.symbol.scanning.ScanDataCollection;
import com.symbol.scanning.ScanDataCollection.ScanData;
//test for BarcodeManager
import com.symbol.scanning.BarcodeManager;
import java.util.List;
import com.symbol.scanning.ScannerInfo;


/**
 * Created by Administrator on 2016/10/18. 
 */

public class AScanModule extends ReactContextBaseJavaModule {


    private Context mContext;

    public AScanModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mContext = reactContext;
    }

    @Override
    public String getName() {

        //返回的这个名字是必须的，在rn代码中需要这个名字来调用该类的方法。
        return "AScanModule";
    }

    
    private String TAG = "ScanApp";

    private BarcodeManager mBarcodeManager = new BarcodeManager();


    private ScannerInfo mInfo = new ScannerInfo("se4710_cam_builtin", "DECODER_2D");
    private Scanner mScanner = mBarcodeManager.getDevice(mInfo);
    private List<ScannerInfo> scanInfoList = mBarcodeManager.getSupportedDevicesInfo();

    private DataListener mDataListener;
    private TextView mScanResult = null;
    private ScrollView mScrollView = null;
    private boolean canDecode = true;

    



    //函数不能有返回值，因为被调用的原生代码是异步的，原生代码执行结束之后只能通过回调函数或者发送信息给rn那边。
    @ReactMethod
    public void rnCallNative(String msg){


        
        // intent = packageManager.getLaunchIntentForPackage("com.symbol.scanapp");
        // intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        // intent.putExtra("data", "在此处添加数据信息");
        // startActivity(intent);

        Toast.makeText(mContext,msg,Toast.LENGTH_SHORT).show();
    }



}  