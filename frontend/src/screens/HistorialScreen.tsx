import { useEffect, useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { PartidoCerradoCard, PartidoCerradoHeader } from "@/components/PartidoCard/PartidoCard";
import { PartidoAbiertoCard, PartidoAbiertoHeader } from "@/components/PartidoCard/PartidoCard";
import { useObtenerHistorialPartidos } from "@/services/HistorialService";
import type { PartidoAbiertoResponseDTO, PartidoCerradoResponseDTO } from "@/models/Historial";

import styles from "../styles/HistorialScreen.module.css";

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
        <div className={styles.container}>
          <h1 className={styles.title}>Historial de Partidos</h1>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Partidos Cerrados</h2>
            {loading ? (
                <p className={styles.loadingText}>Cargando...</p>
            ) : cerrados.length === 0 ? (
                <p className={styles.emptyText}>No hay partidos cerrados.</p>
            ) : (
                <ul className={styles.list}>
                  <PartidoCerradoHeader />
                  {cerrados.map((pc) => (
                      <li key={pc.idPartido} className={styles.listItem}>
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

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Partidos Abiertos</h2>
            {loading ? (
                <p className={styles.loadingText}>Cargando...</p>
            ) : abiertos.length === 0 ? (
                <p className={styles.emptyText}>No hay partidos abiertos.</p>
            ) : (
                <ul className={styles.list}>
                  <PartidoAbiertoHeader />
                  {abiertos.map((pa) => (
                      <li key={pa.idPartido} className={styles.listItem}>
                        <PartidoAbiertoCard
                            canchaNombre={pa.canchaNombre}
                            canchaDireccion={pa.canchaDireccion}
                            fecha={pa.fechaPartido}
                            hora={pa.horaPartido}
                            minJugadores={pa.minJugador}
                            maxJugadores={pa.maxJugador}
                            organizadorMail={pa.emailOrganizador}
                        />
                        <div className={styles.players}>
                          <strong>Jugadores:</strong>
                          {pa.jugadores && pa.jugadores.length > 0 ? (
                              <ul className={styles.playersList}>
                                {pa.jugadores.map((j) => (
                                    <li key={j.id} className={styles.playerItem}>
                                      {j.nombre} ({j.email})
                                    </li>
                                ))}
                              </ul>
                          ) : (
                              <span className={styles.noPlayers}>Sin jugadores inscriptos.</span>
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
