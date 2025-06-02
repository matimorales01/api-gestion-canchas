
// services/PartidoService.ts

import { useMutation } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import { PartidoRequest, Partido } from "@/models/Partido"; 

export function useCrearPartido(options?: {
    onSuccess?: (data: Partido) => void;
    onError?: (error: unknown) => void;
    }) {
    const [tokenState] = useToken();

    return useMutation({
        mutationFn: async (data: PartidoRequest) => {
        if (tokenState.state !== "LOGGED_IN") {
            throw new Error("No estás logueado. No se puede crear un partido.");
        }

        const response = await fetch(BASE_API_URL + "/partidos/abierto", {
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
            throw new Error(`Error al crear el partido: ${errorText}`);
        }

        return await response.json() as Partido;
        },
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
    }
