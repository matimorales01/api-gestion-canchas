import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import { PartidoRequest, Partido, PartidoCerradoRequest } from "@/models/Partido";

export function useCrearPartidoAbierto(options?: {
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
                throw new Error(`Error al crear el partido abierto: ${errorText}`);
            }

            return (await response.json()) as Partido;
        },
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}

export function useCrearPartidoCerrado(options?: {
    onSuccess?: (data: Partido) => void;
    onError?: (error: unknown) => void;
}) {
    const [tokenState] = useToken();

    return useMutation({
        mutationFn: async (data: PartidoCerradoRequest) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado. No se puede crear un partido.");
            }

            const response = await fetch(BASE_API_URL + "/partidos/cerrado", {
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
                throw new Error(`Error al crear el partido cerrado: ${errorText}`);
            }

            return (await response.json()) as Partido;
        },
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}


export function usePartidosAbiertos() {
    const [tokenState] = useToken();

    return useQuery<Partido[]>({
        queryKey: ["partidosAbiertos"],
        queryFn: async () => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const response = await fetch(`${BASE_API_URL}/partidos/abiertos`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Error al obtener partidos abiertos");
            }
            return (await response.json()) as Partido[];
        },
        enabled: tokenState.state === "LOGGED_IN",
    });
}

export function useInscribirPartido() {
    const [tokenState] = useToken();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (partidoId: number) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const url = `${BASE_API_URL}/partidos/abierto/${partidoId}/inscribir`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
            });
            if (!res.ok) throw new Error("Error al inscribirse");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partidosAbiertos"] }),
    });
}


export function useDesinscribirPartido() {
    const [tokenState] = useToken();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (partidoId: number) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const url = `${BASE_API_URL}/partidos/abierto/${partidoId}/desinscribir`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
            });
            if (!res.ok) throw new Error("Error al desinscribirse");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partidosAbiertos"] }),
    });
}

