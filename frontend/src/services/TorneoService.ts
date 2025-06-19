import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado. No se puede crear el torneo.");
      }

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

export function userEditarTorneo(options?: {
  onSuccess?: (data: Torneo) => void;
  onError?: (error: unknown) => void;
}) {
  const [tokenState] = useToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nombre, data }: { nombre: string; data: Partial<TorneoRequest> }) => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado. No se puede editar un torneo.");
      }

      const response = await fetch(`${BASE_API_URL}/torneos/${nombre}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al editar el torneo: ${errorText}`);
      }

      return (await response.json()) as Torneo;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["torneos"] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export function useGetMisTorneos() {
  const [tokenState] = useToken();

  return useQuery<Torneo[]>({
    queryKey: ["misTorneos"],
    queryFn: async () => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado.");
      }

      const response = await fetch(`${BASE_API_URL}/torneos/mis-torneos`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los torneos del usuario");
      }

      return (await response.json()) as Torneo[];
    },
    enabled: tokenState.state === "LOGGED_IN",
  });
}
