import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Splashscreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";

import { trpc, TRPCProvider } from "./utils/trpc";
import { HomeScreen } from "./screens/home";
import { AuthScreen } from "./screens/auth";
import { ActivityIndicator, Button, View } from "react-native";

Splashscreen.preventAutoHideAsync();

export const App = () => {
  return (
    <TRPCProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <StatusBar />
          <Screens />
        </SafeAreaProvider>
      </NavigationContainer>
    </TRPCProvider>
  );
};

const Screens = () => {
  const utils = trpc.useContext();
  const session = trpc.auth.user.useQuery(undefined, {
    onSettled() {
      Splashscreen.hideAsync();
    },
  });

  switch (session.status) {
    case "success":
      if (session.data) {
        return <HomeScreen />;
      } else {
        return <AuthScreen />;
      }
    case "loading":
      return (
        <View className="flex-1 justify-center">
          <ActivityIndicator size="large" />
        </View>
      );
    case "error":
      return (
        <View className="flex-1 justify-center">
          <Button
            title="Retry connection"
            onPress={() => utils.auth.user.invalidate()}
          />
        </View>
      );
  }
};
