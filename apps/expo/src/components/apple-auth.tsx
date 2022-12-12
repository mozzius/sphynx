import * as Apple from "expo-apple-authentication";
import { CodedError } from "expo-modules-core";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { twMerge } from "tailwind-merge";

import { tokenManager } from "../utils/token-manager";
import { trpc } from "../utils/trpc";

interface Props {
  className?: string;
}

export const AppleAuth = ({ className }: Props) => {
  const [loading, setLoading] = useState(false);
  const utils = trpc.useContext();
  const auth = trpc.auth.apple.useMutation({
    onSettled() {
      setLoading(false);
    },
    onSuccess({ token }) {
      tokenManager.setToken(token);
      utils.auth.session.invalidate();
    },
  });

  if (!loading) {
    return (
      <View
        className={twMerge(
          "h-12 w-full justify-center rounded bg-black",
          className,
        )}
      >
        <ActivityIndicator size="small" color="white" />
      </View>
    );
  }

  return (
    <Apple.AppleAuthenticationButton
      buttonType={Apple.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={Apple.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={4}
      // style={{ width: 200, height: 44 }}
      className={twMerge("h-12 w-full", className)}
      onPress={async () => {
        try {
          const credential = await Apple.signInAsync({
            requestedScopes: [
              Apple.AppleAuthenticationScope.FULL_NAME,
              Apple.AppleAuthenticationScope.EMAIL,
            ],
          });

          if (!credential.identityToken) {
            console.error("No identity token", credential);
            return;
          }

          auth.mutate({
            idToken: credential.identityToken,
            name: credential.fullName?.givenName ?? undefined,
          });
          setLoading(true);
        } catch (e) {
          if (e instanceof CodedError) {
            if (e.code !== "ERR_CANCELED") {
              console.error(e.name, e.message);
            }
          } else {
            console.error(e);
          }
        }
      }}
    />
  );
};
