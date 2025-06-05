import { useMutation, useQuery } from "@tanstack/react-query";

import { BASE_API_URL } from "@/config/app-query-client";
import { LoginRequest, LoginResponseSchema } from "@/models/Login";
import { useToken } from "@/services/TokenContext";

export function useLogin() {
  const [token, setToken] = useToken();

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
    mutationFn: async (data: Record<string, any>) => {
      const response = await fetch(BASE_API_URL + "/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json", // Importante para JSON
        },
        body: JSON.stringify(data),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al registrar usuario: ${errorText}`);
      }

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

export function useGetCanchas() {
  return useQuery({
    queryKey: ["canchas"],
    queryFn: async () => {
      const response = await fetch(BASE_API_URL + "/canchas", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las canchas");
      }
      return response.json();
    },
  });
}

export function useCrearPartido() {
  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await fetch(BASE_API_URL + "/partidos", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear partido: ${errorText}`);
      }

      return response.json();
    },
  });
}