"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Invisible component that bridges Supabase auth state to the Chrome extension.
 * On every auth state change (sign in, token refresh, sign out), it broadcasts
 * a postMessage that the extension's content script picks up.
 */
export default function ExtensionAuthBridge() {
  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          window.postMessage(
            {
              type: "POKEBROWSE_AUTH_SUCCESS",
              payload: {
                access_token: session.access_token,
                refresh_token: session.refresh_token,
              },
            },
            "*"
          );
        } else {
          window.postMessage({ type: "POKEBROWSE_AUTH_SIGNOUT" }, "*");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
