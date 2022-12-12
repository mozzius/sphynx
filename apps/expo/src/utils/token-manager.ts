import * as SecureStore from "expo-secure-store";

class TokenManager {
  #token: string | null = null;

  constructor() {
    this.#token = null;
    SecureStore.getItemAsync("token")
      .then((token) => {
        if (token) this.#token = token;
      })
      .catch((error) => {
        console.error("Error getting token from secure store", error);
      });
  }

  getToken() {
    return this.#token;
  }

  async setToken(token: string | null) {
    this.#token = token;
    if (token) await SecureStore.setItemAsync("token", token);
  }
}

export const tokenManager = new TokenManager();
