import { useMutation } from "@tanstack/react-query";

import { BASE_API_URL } from "@/config/app-query-client";
import { LoginRequest, LoginResponseSchema } from "@/models/Login";
import { useToken } from "@/services/TokenContext";

export function useLogin() {
  const [, setToken] = useToken();

  return useMutation({
    mutationFn: async (req: LoginRequest) => {
      const tokenData = await auth("/sessions", req);
      setToken({ state: "LOGGED_IN", ...tokenData });
    },
  });
}
export function useSignup() {
  const [, setToken] = useToken();

  return useMutation({
    mutationFn: async (req: FormData) => {
      const response = await fetch(BASE_API_URL + "/users", {
        method: "POST",
        body: req, // formData aquí
        // NO debes poner headers Content-Type aquí, fetch lo maneja solo para FormData
      });

      if (!response.ok) throw new Error("Error al registrar usuario");

      const tokenData = await response.json();
      setToken({ state: "LOGGED_IN", ...tokenData });
      return tokenData;
    },
  });
}


async function auth(endpoint: string, data: LoginRequest) {
  const response = await fetch(BASE_API_URL + endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return LoginResponseSchema.parse(await response.json());
  } else {
    throw new Error(`Failed with status ${response.status}: ${await response.text()}`);
  }
}
