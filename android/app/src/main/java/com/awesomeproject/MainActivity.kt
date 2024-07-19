package com.awesomeproject

import android.content.Intent
import android.os.Build
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.clevertap.android.sdk.CleverTapAPI // Make sure to import CleverTapAPI

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "AwesomeProject"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)

    // On Android 12 and onwards, raise notification clicked event and get the click callback
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val cleverTapDefaultInstance = CleverTapAPI.getDefaultInstance(applicationContext)
        cleverTapDefaultInstance?.pushNotificationClickedEvent(intent!!.extras)
    }
  }
}