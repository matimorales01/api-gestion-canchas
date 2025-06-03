import { useEffect, useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import {PartidoCerradoCard, PartidoCerradoHeader} from "@/components/PartidoCard/PartidoCard";
import {PartidoAbiertoCard, PartidoAbiertoHeader} from "@/components/PartidoCard/PartidoCard";
import {useObtenerPartidosAbiertos, useObtenerPartidosCerrados} from "@/services/HistorialService";

export const HistorialScreen = () => {
  const { getPartidosCerrados: getCerrados } = useObtenerPartidosCerrados();
  const { getPartidosAbiertos: getAbiertos } = useObtenerPartidosAbiertos();
  /*
  const [cerrados, setCerrados] = useState<any[]>([]);
  const [abiertos, setAbiertos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        const [c, a] = await Promise.all([getCerrados(), getAbiertos()]);
        setCerrados(c);
        setAbiertos(a);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPartidos();
  }, []);

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
 */

 
  const cerrados = [
  {
    id: 1,
    cancha: "Cancha 1",
    fecha: "2025-06-01",
    hora: "18:00",
    equipo1: "Los Pibes",
    equipo2: "La Vecchia",
  },
  {
    id: 2,
    cancha: "Cancha 2",
    fecha: "2025-06-03",
    hora: "20:30",
    equipo1: "FC Asado",
    equipo2: "Boca Unidos",
  }
];

  const abiertos = [
  {
    id: 3,
    cancha: "Cancha 3",
    fecha: "2025-06-05",
    hora: "19:00",
    minJugadores: 6,
    maxJugadores: 10,
    organizadorEmail: "organizador3@futbol.com"
  },
  {
    id: 4,
    cancha: "Cancha 4",
    fecha: "2025-06-07",
    hora: "21:15",
    minJugadores: 8,
    maxJugadores: 12,
    organizadorEmail: "organizador4@futbol.com"
  }
];

  return (
    <CommonLayout>
      <div style={{ width: "100%", height: "100%"}}>
        <h1>Historial de Partidos</h1>

        <section>
          <h2>Partidos Cerrados</h2>
            {cerrados.length === 0 ? (
            <p>No hay partidos cerrados.</p>
            ) : (
            <ul>
              <PartidoCerradoHeader />
              {cerrados.map(({id, cancha, fecha, hora, equipo1, equipo2}) => (
                <PartidoCerradoCard id={id} cancha={cancha} fecha={fecha} hora={hora} equipoA={equipo1} equipoB={equipo2} key={id} />
              ))}
            </ul>
            )}
        </section>

        <section>
          <h2>Partidos Abiertos</h2>
          {abiertos.length === 0 ? (
            <p>No hay partidos abiertos.</p>
          ) : (
            <ul>
              <PartidoAbiertoHeader />
              {abiertos.map(({id, cancha, fecha, hora, minJugadores, maxJugadores, organizadorEmail}) => (
                <PartidoAbiertoCard id={id} nroCancha={cancha} fecha={fecha} hora={hora} minJugadores={minJugadores} maxJugadores={maxJugadores} organizadorMail={organizadorEmail} key={id} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </CommonLayout>
  );
};
