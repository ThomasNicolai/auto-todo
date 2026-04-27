import "expo-sqlite/localStorage/install";
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://jijtpnvssvfcxlqyximt.supabase.co";
export const supabasePublishableKey = "sb_publishable_sCktmXBjfNqeQ5R5yj50Pg_qLL5fBSG";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: "implicit",
  },
});
