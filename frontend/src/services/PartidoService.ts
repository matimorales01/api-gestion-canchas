
import { useMutation, useQuery } from "@tanstack/react-query";

import { BASE_API_URL } from "@/config/app-query-client";
import { LoginRequest, LoginResponseSchema } from "@/models/Login";
import { useToken } from "@/services/TokenContext";

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
        return response.json(); // Espera un array de canchas
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

        return response.json(); // puedes retornar el partido creado o lo que tu backend devuelva
        },
    });
    }

 