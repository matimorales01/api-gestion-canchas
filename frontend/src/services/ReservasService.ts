

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import { Reserva } from "@/models/Reserva";
import { useState } from "react";


export function useCrearReserva(options?: {
    onSuccess?: (data: Reserva) => void;
    onError?: (error: unknown) => void;
}) {
const [tokenState] = useToken();

return useMutation({
    mutationFn: async (data: Reserva) => {
    if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado. No se puede crear una reserva.");
    }

    const response = await fetch(BASE_API_URL + "/reservas", {
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

    return await response.json() as Reserva;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
});
}