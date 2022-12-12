import React from "react";
import { Button, SafeAreaView, Text } from "react-native";
import { tokenManager } from "../utils/token-manager";

import { trpc } from "../utils/trpc";

export const HomeScreen = () => {
  const user = trpc.auth.user.useQuery();
  const utils = trpc.useContext();
  return (
    <SafeAreaView className="mx-4 flex-1">
      <Text className="mt-32 text-6xl font-bold">Sphynx</Text>
      <Text className="mt-32 text-xl">Hello, {user.data?.name}</Text>
      <Button
        onPress={() => {
          tokenManager.setToken(null);
          utils.auth.session.invalidate();
        }}
        title="Logout"
      />
    </SafeAreaView>
  );
};
