import React from "react";
import { SafeAreaView, Text } from "react-native";

import { AppleAuth } from "../components/apple-auth";

export const AuthScreen = () => {
  return (
    <SafeAreaView className="mx-4 flex-1 justify-between">
      <Text className="mt-32 text-6xl font-bold">Sphynx</Text>
      <AppleAuth />
    </SafeAreaView>
  );
};
