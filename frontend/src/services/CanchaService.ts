import { useMutation } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";

export function useCrearCancha() {
  const [tokenState] = useToken();

  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado. No se puede crear una cancha.");
      }

      const response = await fetch(BASE_API_URL + "/canchas", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear cancha: ${errorText}`);
      }

      return await response.json();
    },
  });
}