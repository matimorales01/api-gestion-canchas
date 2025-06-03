import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";

export function useObtenerPartidosCerrados() {
    const [tokenState] = useToken();
    
    const getPartidosCerrados = async (): Promise<any[]> => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado.");
      }
    
      const response = await fetch(BASE_API_URL + "/partidos/cerrados", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
      });
    
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener partidos cerrados: ${errorText}`);
      }
    
      return await response.json();
    };
    
    return { getPartidosCerrados };
}

export function useObtenerPartidosAbiertos() {
  const [tokenState] = useToken();

  const getPartidosAbiertos = async (): Promise<any[]> => {
    if (tokenState.state !== "LOGGED_IN") {
      throw new Error("No estás logueado. No se puede obtener el historial.");
    }

    const response = await fetch(BASE_API_URL + "/partidos/abiertos", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tokenState.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener partidos abiertos: ${errorText}`);
    }

    return await response.json();
  };

  return { getPartidosAbiertos };
}