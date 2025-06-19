import { useMutation, useQuery} from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import { EquipoRequestSchema, EquipoResponse } from "@/models/Equipo";

export function crearEquipo(options?: {
  onSuccess?: (data: typeof EquipoRequestSchema) => void;
  onError?: (error: unknown) => void;
}) {

    const [tokenState] = useToken();

    return useMutation({
        mutationFn: async (data: typeof EquipoRequestSchema) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }

            const response = await fetch(`${BASE_API_URL}/equipos`, {
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
                options?.onError?.(new Error(`Error al crear equipo: ${errorText}`));
                throw new Error(`Error al crear equipo: ${errorText}`);
            }

            const equipoCreado = await response.json();
            options?.onSuccess?.(equipoCreado);
            return equipoCreado;
        },
    });
}

export function useGetMisEquipos() {
  const [tokenState] = useToken();

  return useQuery<EquipoResponse[]>({
    queryKey: ["misEquipos"],
    queryFn: async () => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado.");
      }

      const response = await fetch(BASE_API_URL + "/equipos", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al mis quipos");
      }
      return (await response.json()) as EquipoResponse[];
    },
    enabled: tokenState.state === "LOGGED_IN",
  });
}