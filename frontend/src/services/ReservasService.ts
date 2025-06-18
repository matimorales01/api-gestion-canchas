import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";

import { Reserva, ReservaResponse, ReservaIdDTO} from "@/models/Reserva";

export interface ReservaDisponibleDTO {
    canchaId:     number;
    canchaName:   string;
    zona:    string;
    direccion:    string;
    fecha:        string;
    inicioTurno:  string;
    finTurno:     string;
    state:        string;
}


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

            const response = await fetch(`${BASE_API_URL}/reservas`, {
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
                throw new Error(`Error al crear reserva: ${errorText}`);
            }

            return (await response.json()) as Reserva;
        },
        onSuccess: options?.onSuccess,
        onError:   options?.onError,
    });
}

export function useReservasDisponibles(params: {
    fecha: string;
    zona?: string | null;
}) {
    const [tokenState] = useToken();

    return useQuery<ReservaDisponibleDTO[]>({
        queryKey: ["reservasDisponibles", params],
        enabled:  tokenState.state === "LOGGED_IN",
        queryFn: async () => {
            const qs = new URLSearchParams();
            qs.append("fecha", params.fecha);
            if (params.zona) qs.append("zona", params.zona);
            if (tokenState.state !== "LOGGED_IN") throw new Error("No estás logueado.");
            const res = await fetch(
                `${BASE_API_URL}/reservas/disponibles?${qs.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${tokenState.accessToken}`,
                    },
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error ${res.status}: ${text}`);
            }
            return res.json();
        },
    });
}


export interface ReservaIdCommand {
    canchaId:    number;
    fecha:       string;
    horaInicio:  string;
    horaFin:     string;
}

export function useTomarReserva() {
    const [tokenState] = useToken();
    const queryClient  = useQueryClient();

    return useMutation({
        mutationFn: async (cmd: ReservaIdCommand) => {
            if (tokenState.state !== "LOGGED_IN") throw new Error("No estás logueado.");

            const res = await fetch(`${BASE_API_URL}/reservas/reservar`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
                body: JSON.stringify(cmd),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error al reservar turno: ${text}`);
            }
            return res.json() as Promise<Reserva>;
        },

        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["reservasDisponibles"] }),
    });
}

export function useGetMisReservas() {
    const [tokenState] = useToken();

    return useQuery<ReservaResponse[]>({
        queryKey: ["misReservas"],
        queryFn: async () => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const response = await fetch(BASE_API_URL + "/reservas", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al obtener reservas:`);
            }
            return (await response.json()) as ReservaResponse[];
        },
    });
}

export function useCancelarReserva() {
    const [tokenState] = useToken();
    const queryClient  = useQueryClient();

    return useMutation({
        mutationFn: async (reserva: ReservaIdDTO) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }

            const response = await fetch(BASE_API_URL + "/reservas", {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
                body: JSON.stringify(reserva),
            });

            if (!response.ok) {
                throw new Error(`Error al liberar reserva`);
            }

            return (await response.json()) as Reserva;
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["misReservas"] }),
    });
}