package {{PACKAGE_NAME}}

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.util.Log
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import org.json.JSONArray
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class TodoWidgetService : RemoteViewsService() {
    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory =
        TodoRemoteViewsFactory(applicationContext)
}

class TodoRemoteViewsFactory(private val context: Context) : RemoteViewsService.RemoteViewsFactory {

    private data class Row(val text: String, val isStatus: Boolean)

    private var rows: List<Row> = listOf(Row("Loading…", isStatus = true))

    override fun onCreate() {}

    override fun onDataSetChanged() {
        try {
            val prefs = context.getSharedPreferences(
                TodoWidgetBridgeModule.PREFS_NAME,
                Context.MODE_PRIVATE,
            )
            val supabaseUrl = prefs.getString(TodoWidgetBridgeModule.KEY_URL, null)
            val apiKey = prefs.getString(TodoWidgetBridgeModule.KEY_API_KEY, null)
            val accessToken = prefs.getString(TodoWidgetBridgeModule.KEY_ACCESS_TOKEN, null)

            if (supabaseUrl == null || apiKey == null || accessToken == null) {
                rows = listOf(Row("Open app to sign in", isStatus = true))
                return
            }

            val result = fetchTodos(supabaseUrl, apiKey, accessToken)
            rows = when {
                result == null -> listOf(Row("Error: tap ↻ to retry", isStatus = true))
                result.isEmpty() -> emptyList()
                else -> result.map { Row(it, isStatus = false) }
            }
        } catch (e: Exception) {
            Log.e("TodoWidget", "onDataSetChanged failed", e)
            rows = listOf(Row("auto todo widget", isStatus = true))
        }
    }

    override fun onDestroy() {}

    override fun getCount(): Int = rows.size

    override fun getViewAt(position: Int): RemoteViews {
        val row = rows.getOrNull(position)
            ?: return RemoteViews(context.packageName, R.layout.widget_todo_item)
        val views = RemoteViews(context.packageName, R.layout.widget_todo_item)
        views.setTextViewText(R.id.widget_todo_title, row.text)
        val textColor = if (row.isStatus) Color.parseColor("#9E9E9E") else Color.parseColor("#000000")
        views.setTextColor(R.id.widget_todo_title, textColor)
        return views
    }

    override fun getLoadingView(): RemoteViews? = null

    override fun getViewTypeCount(): Int = 1

    override fun getItemId(position: Int): Long = position.toLong()

    override fun hasStableIds(): Boolean = false

    private fun fetchTodos(supabaseUrl: String, apiKey: String, accessToken: String): List<String>? {
        return try {
            val url = URL(
                "$supabaseUrl/rest/v1/todos" +
                    "?select=id,title&completed=eq.false&order=created_at.asc"
            )
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.setRequestProperty("apikey", apiKey)
            connection.setRequestProperty("Authorization", "Bearer $accessToken")
            connection.connectTimeout = 10_000
            connection.readTimeout = 10_000

            if (connection.responseCode != HttpURLConnection.HTTP_OK) {
                Log.e("TodoWidget", "HTTP error: ${connection.responseCode}")
                connection.disconnect()
                return null
            }

            val response = BufferedReader(InputStreamReader(connection.inputStream)).use {
                it.readText()
            }
            connection.disconnect()

            val jsonArray = JSONArray(response)
            (0 until jsonArray.length()).map { i ->
                jsonArray.getJSONObject(i).getString("title")
            }
        } catch (e: Exception) {
            Log.e("TodoWidget", "Exception fetching todos", e)
            null
        }
    }
}
