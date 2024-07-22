package com.arc

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.telephony.SmsManager

class MySendSmsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Required by React Native
    init {
        // Initialization if needed
    }

    // getName is required to define the name of the module
    override fun getName(): String {
        return "DirectSms"
    }

    @ReactMethod
    fun sendDirectSms(phoneNumber: String, msg: String) {
        try {
            val smsManager = SmsManager.getDefault()
            smsManager.sendTextMessage(phoneNumber, null, msg, null, null)
        } catch (ex: Exception) {
            println("couldn't send message.")
        }
    }
}
