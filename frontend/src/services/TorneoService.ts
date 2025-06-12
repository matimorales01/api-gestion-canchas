import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import { TorneoRequest, Torneo, TorneoDisponible } from "@/models/Torneo";

export function crearTorneo(options?: {
  onSuccess?: (data: Torneo) => void;
  onError?: (error: unknown) => void;
}) {
  const [tokenState] = useToken();

  return useMutation({
    mutationFn: async (data: TorneoRequest) => {
      const response = await fetch(`${BASE_API_URL}/torneos`, {
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
        options?.onError?.(new Error(`Error al crear torneo: ${errorText}`));
        throw new Error(`Error al crear torneo: ${errorText}`);
      }

      const torneoCreado = await response.json();
      options?.onSuccess?.(torneoCreado);
      return torneoCreado;
    },
  });
}

export function useGetTorneosDisponibles() {
  const [tokenState] = useToken();

  return useQuery<TorneoDisponible[]>({
    queryKey: ["torneosDisponibles"],
    queryFn: async () => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado.");
      }
      const response = await fetch(BASE_API_URL + "/torneos", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los torneos disponibles");
      }
      return (await response.json()) as TorneoDisponible[];
    },
    enabled: tokenState.state === "LOGGED_IN",
  });
}