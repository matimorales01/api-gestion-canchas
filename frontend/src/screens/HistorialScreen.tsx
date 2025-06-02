//import { useEffect, useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
//import {useObtenerPartidosAbiertos, useObtenerPartidosCerrados} from "@/services/HistorialService";
import {PartidoCard, PartidoAbiertoHeader} from "@/components/PartidoCard/PartidoCard";

export const HistorialScreen = () => {
  /*const { getPartidosCerrados: getCerrados } = useObtenerPartidosCerrados();
  const { getPartidosAbiertos: getAbiertos } = useObtenerPartidosAbiertos();

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
      fecha: "2025-05-28T18:00:00Z",
      equipo1: "Los Pibes",
      equipo2: "La Vecchia",
    },
    {
      id: 2,
      cancha: "Cancha 2",
      fecha: "2025-05-27T20:30:00Z",
      equipo1: "FC Asado",
      equipo2: "Boca Unidos",
    },
  ];

  const abiertos: any[] = [];
  return (
    <CommonLayout>
      <div style={{ width: "100%" }}>
        <h1>Historial de Partidos</h1>

        <section>
          <h2>Partidos Cerrados</h2>
            {cerrados.length === 0 ? (
            <p>No hay partidos cerrados.</p>
            ) : (
            <ul>
              <PartidoAbiertoHeader />
              {cerrados.map(({id, cancha, fecha, equipo1, equipo2}) => (
                <PartidoCard id={id} cancha={cancha} fecha={fecha} equipo1={equipo1} equipo2={equipo2} key={id} />
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
              {abiertos.map((p) => (
                <li>
                  {p.cancha} - {new Date(p.fecha).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </CommonLayout>
  );
};
