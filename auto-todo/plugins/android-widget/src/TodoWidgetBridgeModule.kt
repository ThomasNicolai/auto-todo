package {{PACKAGE_NAME}}

import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TodoWidgetBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "TodoWidgetBridge"

    @ReactMethod
    fun saveCredentials(url: String, apiKey: String, accessToken: String) {
        val prefs = reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit()
            .putString(KEY_URL, url)
            .putString(KEY_API_KEY, apiKey)
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .apply()
        val intent = Intent(reactApplicationContext, TodoWidgetProvider::class.java).apply {
            action = TodoWidgetProvider.ACTION_REFRESH
        }
        reactApplicationContext.sendBroadcast(intent)
    }

    @ReactMethod
    fun clearCredentials() {
        val prefs = reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().clear().apply()
    }

    companion object {
        const val PREFS_NAME = "TodoWidgetPrefs"
        const val KEY_URL = "supabase_url"
        const val KEY_API_KEY = "supabase_api_key"
        const val KEY_ACCESS_TOKEN = "access_token"
    }
}
