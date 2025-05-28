import { useEffect, useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import {useObtenerPartidosAbiertos, useObtenerPartidosCerrados} from "@/services/HistorialService";

export const HistorialScreen = () => {
  const { getPartidosCerrados: getCerrados } = useObtenerPartidosCerrados();
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

  return (
    <CommonLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Historial de Partidos</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Partidos Cerrados</h2>
          {cerrados.length === 0 ? (
            <p>No hay partidos cerrados.</p>
          ) : (
            <ul className="space-y-2">
              {cerrados.map((p) => (
                <li key={p.id} className="border rounded p-3 shadow-sm">
                    {p.cancha} - {new Date(p.fecha).toLocaleString()} - {p.equipo1} vs {p.equipo2}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Partidos Abiertos</h2>
          {abiertos.length === 0 ? (
            <p>No hay partidos abiertos.</p>
          ) : (
            <ul className="space-y-2">
              {abiertos.map((p) => (
                <li key={p.id} className="border rounded p-3 shadow-sm">
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
