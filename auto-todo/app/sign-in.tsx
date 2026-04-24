import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "@/utils/supabase";
import { Colors, Typography } from "@/constants/theme";

export default function SignInScreen() {
  async function handleGoogleSignIn() {
    try {
      const redirectUrl = Linking.createURL("auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });
      if (error || !data.url) throw error ?? new Error("No OAuth URL returned");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
      );

      if (result.type !== "success") return;

      const fragment = result.url.split("#")[1] ?? "";
      const params = new URLSearchParams(fragment);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        throw new Error("Missing tokens in redirect URL");
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (sessionError) throw sessionError;
    } catch (e) {
      Alert.alert("Sign in failed", (e as Error).message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>auto-todo</Text>
      <Text style={styles.subtitle}>Your simple todo list</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        activeOpacity={0.8}
      >
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
  },
  title: {
    ...(Typography.title as object),
    marginBottom: 4,
  },
  subtitle: {
    ...(Typography.caption as object),
    marginBottom: 48,
  },
  googleButton: {
    backgroundColor: Colors.black,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignSelf: "stretch",
    alignItems: "center",
  },
  googleButtonText: {
    ...(Typography.body as object),
    color: Colors.white,
    fontWeight: "600",
  },
});
