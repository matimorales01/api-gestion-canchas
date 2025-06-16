import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import {
    Partido,
    PartidoRequest,
    PartidoCerradoRequest,
} from "@/models/Partido";

export function useCrearPartidoAbierto(options?: {
    onSuccess?: (data: Partido) => void;
    onError?: (error: unknown) => void;
}) {
    const [tokenState] = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (dto: PartidoRequest) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado. No se puede crear un partido.");
            }
            const res = await fetch(`${BASE_API_URL}/partidos/abierto`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error(await res.text());
            return (await res.json()) as unknown as Partido;
        },
        onSuccess: (data) => {
            void qc.invalidateQueries({ queryKey: ["reservasDisponibles"] });
            options?.onSuccess?.(data);
        },
        onError: options?.onError,
    });
}

export function useCrearPartidoCerrado(options?: {
    onSuccess?: (data: Partido) => void;
    onError?: (error: unknown) => void;
}) {
    const [tokenState] = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (dto: PartidoCerradoRequest) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado. No se puede crear un partido.");
            }
            const res = await fetch(`${BASE_API_URL}/partidos/cerrado`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error(await res.text());
            return (await res.json()) as unknown as Partido;
        },
        onSuccess: (data) => {
            void qc.invalidateQueries({ queryKey: ["reservasDisponibles"] });
            options?.onSuccess?.(data);
        },
        onError: options?.onError,
    });
}

export function usePartidosAbiertos() {
    const [tokenState] = useToken();

    return useQuery<Partido[]>({
        queryKey: ["partidosAbiertos"],
        enabled: tokenState.state === "LOGGED_IN",
        queryFn: async () => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const res = await fetch(`${BASE_API_URL}/partidos/abiertos`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
            });
            if (!res.ok) throw new Error(await res.text());
            return (await res.json()) as unknown as Partido[];
        },
    });
}

export function useInscribirPartido() {
    const [tokenState] = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (partidoId: number) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const res = await fetch(
                `${BASE_API_URL}/partidos/abierto/${partidoId}/inscribir`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenState.accessToken}`,
                    },
                }
            );
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["partidosAbiertos"] });
            void qc.invalidateQueries({ queryKey: ["reservasDisponibles"] });
        },
    });
}

export function useDesinscribirPartido() {
    const [tokenState] = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (partidoId: number) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const res = await fetch(
                `${BASE_API_URL}/partidos/abierto/${partidoId}/desinscribir`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenState.accessToken}`,
                    },
                }
            );
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["partidosAbiertos"] });
            void qc.invalidateQueries({ queryKey: ["reservasDisponibles"] });
        },
    });
}
