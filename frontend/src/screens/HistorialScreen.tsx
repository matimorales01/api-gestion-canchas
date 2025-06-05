import { useEffect, useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { PartidoCerradoCard, PartidoCerradoHeader } from "@/components/PartidoCard/PartidoCard";
import { PartidoAbiertoCard, PartidoAbiertoHeader } from "@/components/PartidoCard/PartidoCard";
import { useObtenerHistorialPartidos } from "@/services/HistorialService";
import type { PartidoAbiertoResponseDTO, PartidoCerradoResponseDTO } from "@/models/Historial";

export const HistorialScreen = () => {
  const { getHistorial } = useObtenerHistorialPartidos();

  const [cerrados, setCerrados] = useState<PartidoCerradoResponseDTO[]>([]);
  const [abiertos, setAbiertos] = useState<PartidoAbiertoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getHistorial();
        setAbiertos(data.partidos_abiertos || []);
        setCerrados(data.partidos_cerrados || []);
      } catch (e) {
        alert("Error al obtener historial: " + (e instanceof Error ? e.message : e));
      } finally {
        setLoading(false);
      }
    })();
  }, [getHistorial]);

  return (
      <CommonLayout>
        <div style={{ width: "100%", height: "100%" }}>
          <h1>Historial de Partidos</h1>

          <section>
            <h2>Partidos Cerrados</h2>
            {loading ? (
                <p>Cargando...</p>
            ) : cerrados.length === 0 ? (
                <p>No hay partidos cerrados.</p>
            ) : (
                <ul>
                  <PartidoCerradoHeader />
                  {cerrados.map((pc) => (
                      <li key={pc.idPartido}>
                        <PartidoCerradoCard
                            canchaNombre={pc.canchaNombre}
                            canchaDireccion={pc.canchaDireccion}
                            fecha={pc.fechaPartido}
                            hora={pc.horaPartido}
                            equipoA={pc.equipo1}
                            equipoB={pc.equipo2}
                        />
                      </li>
                  ))}
                </ul>
            )}
          </section>

          <section>
            <h2>Partidos Abiertos</h2>
            {loading ? (
                <p>Cargando...</p>
            ) : abiertos.length === 0 ? (
                <p>No hay partidos abiertos.</p>
            ) : (
                <ul>
                  <PartidoAbiertoHeader />
                  {abiertos.map((pa) => (
                      <li key={pa.idPartido}>
                        <PartidoAbiertoCard
                            canchaNombre={pa.canchaNombre}
                            canchaDireccion={pa.canchaDireccion}
                            fecha={pa.fechaPartido}
                            hora={pa.horaPartido}
                            minJugadores={pa.minJugador}
                            maxJugadores={pa.maxJugador}
                            organizadorMail={pa.emailOrganizador}
                        />
                        <div>
                          <strong>Jugadores:</strong>
                          {pa.jugadores && pa.jugadores.length > 0 ? (
                              <ul>
                                {pa.jugadores.map(j => (
                                    <li key={j.id}>
                                      {j.nombre} ({j.email})
                                    </li>
                                ))}
                              </ul>
                          ) : (
                              <span>Sin jugadores inscriptos.</span>
                          )}
                        </div>
                      </li>
                  ))}
                </ul>
            )}
          </section>
        </div>
      </CommonLayout>
  );
};
