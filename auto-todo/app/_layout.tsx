import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { NativeModules, Platform, Text, TouchableOpacity } from "react-native";
import { supabase, supabaseUrl, supabasePublishableKey } from "@/utils/supabase";

function saveWidgetCredentials(accessToken: string): void {
  if (Platform.OS === "android") {
    NativeModules.TodoWidgetBridge?.saveCredentials(
      supabaseUrl,
      supabasePublishableKey,
      accessToken,
    );
  }
}

function clearWidgetCredentials(): void {
  if (Platform.OS === "android") {
    NativeModules.TodoWidgetBridge?.clearCredentials();
  }
}

function SignOutButton() {
  return (
    <TouchableOpacity onPress={() => supabase.auth.signOut()} hitSlop={8}>
      <Text style={{ fontSize: 16, color: "#000000" }}>Sign out</Text>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const isAuthCallback = (url: string) => url.includes("auth/callback");

    const handleCallbackUrl = async (url: string) => {
      if (!isAuthCallback(url)) return false;
      const fragment = url.split("#")[1] ?? "";
      const params = new URLSearchParams(fragment);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
      } else {
        router.replace("/auth/callback");
      }
      return true;
    };

    const init = async () => {
      const url = await Linking.getInitialURL();
      if (url && (await handleCallbackUrl(url))) return;
      const { data: { session } } = await supabase.auth.getSession();
      router.replace(session ? "/" : "/sign-in");
    };

    init();

    const linkSub = Linking.addEventListener("url", ({ url }) =>
      handleCallbackUrl(url),
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        saveWidgetCredentials(session.access_token);
        router.replace("/");
      } else if (event === "INITIAL_SESSION" && session) {
        saveWidgetCredentials(session.access_token);
      } else if (event === "TOKEN_REFRESHED" && session) {
        saveWidgetCredentials(session.access_token);
      } else if (event === "SIGNED_OUT") {
        clearWidgetCredentials();
        router.replace("/sign-in");
      }
    });

    return () => {
      subscription.unsubscribe();
      linkSub.remove();
    };
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
        <Stack.Screen
          name="index"
          options={{
            title: "My Todos",
            headerLargeTitle: true,
            headerStyle: { backgroundColor: "#FFFFFF" },
            headerTintColor: "#000000",
            headerRight: () => <SignOutButton />,
          }}
        />
        <Stack.Screen
          name="todo-modal"
          options={{
            presentation: "modal",
            headerStyle: { backgroundColor: "#FFFFFF" },
            headerTintColor: "#000000",
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
