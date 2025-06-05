import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import { Equipo } from "@/models/Equipo";

export function crearEquipo(options?: {
  onSuccess?: (data: typeof Equipo) => void;
  onError?: (error: unknown) => void;
}) {

    const [tokenState] = useToken();

    return useMutation({
        mutationFn: async (data: typeof Equipo) => {
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