import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import type { Cancha, CanchaRequest } from "@/models/Cancha";

export function usePoblarFranjas() {
  const [tokenState] = useToken();
  return async ({
                  canchaId,
                  desde,
                  hasta,
                  horaInicio,
                  horaFin,
                  duracionMinutos,
                }: {
    canchaId: number;
    desde: string;
    hasta: string;
    horaInicio: string;
    horaFin: string;
    duracionMinutos: number;
  }) => {
    if (tokenState.state !== "LOGGED_IN") {
      throw new Error("No estás logueado. No se pueden poblar franjas.");
    }
    const params = new URLSearchParams({
      canchaId: canchaId.toString(),
      desde,
      hasta,
      horaInicio,
      horaFin,
      duracionMinutos: duracionMinutos.toString(),
    });
    const response = await fetch(
        BASE_API_URL + "/franjas/poblar?" + params.toString(),
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${tokenState.accessToken}`,
          },
        }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al poblar franjas: ${errorText}`);
    }
    return await response.text();
  };
}

export function useCrearCancha(options?: {
  onSuccess?: (data: Cancha) => void;
  onError?: (error: unknown) => void;
}) {
  const [tokenState] = useToken();

  return useMutation({
    mutationFn: async (data: CanchaRequest) => {
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

      return (await response.json()) as Cancha;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}


export function useCanchas() {
  const [tokenState] = useToken();

  return useQuery<Cancha[]>({
    queryKey: ["canchas"],
    queryFn: async () => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado.");
      }
      const response = await fetch(`${BASE_API_URL}/canchas/todas`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener canchas");
      }
      return (await response.json()) as Cancha[];
    },
    enabled: tokenState.state === "LOGGED_IN",
  });
}

export function useEliminarCancha(options?: {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
}) {
  const [tokenState] = useToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado. No se puede eliminar la cancha.");
      }

      const response = await fetch(`${BASE_API_URL}/canchas/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar cancha: ${errorText}`);
      }

      return await response.text();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["canchas"] });
      if (options?.onSuccess) options.onSuccess(data);
    },
    onError: options?.onError,
  });
}

export function useEditarCancha(options?: {
  onSuccess?: (data: Cancha) => void;
  onError?: (error: unknown) => void;
}) {
  const [tokenState] = useToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CanchaRequest> }) => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado. No se puede editar la cancha.");
      }

      const response = await fetch(`${BASE_API_URL}/canchas/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al editar cancha: ${errorText}`);
      }

      return (await response.json()) as Cancha;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["canchas"] });
      if (options?.onSuccess) options.onSuccess(data);
    },
    onError: options?.onError,
  });
}
