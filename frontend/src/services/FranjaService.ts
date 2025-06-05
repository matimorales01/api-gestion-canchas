import { useQuery } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import type { Franja } from "@/models/Franja";

export function useFranjasPorCancha(canchaId: number, fecha: string) {
  const [tokenState] = useToken();

  return useQuery<Franja[]>({
    queryKey: ["franjas", canchaId, fecha],
    queryFn: async () => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado.");
      }

      const response = await fetch(`${BASE_API_URL}/franjas?canchaId=${canchaId}&fecha=${fecha}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener franjas: ${errorText}`);
      }

      return await response.json() as Franja[];
    },
    enabled: tokenState.state === "LOGGED_IN" && !!canchaId && !!fecha,
  });
}