import { useLocation } from "wouter";
import { useGetMisTorneos } from "@/services/TorneoService";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";

const MisTorneos = () => {
  const [, navigate] = useLocation();
  const { data: torneos, isLoading, error } = useGetMisTorneos();

  if (isLoading) return <div>Cargando torneos...</div>;
  if (error) return <div>Error al cargar torneos</div>;

  return (
    <CommonLayout>
      <div className="container mt-4">
        <h1 className="text-xl font-bold mb-4" style={{ color: "black" }}>
          Mis Torneos
        </h1>
        <ul className="list-group">
          {torneos?.map((torneo) => (
            <li
              key={torneo.nombre}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ color: "black" }}
            >
              <div>
                <div><strong>Nombre:</strong> {torneo.nombre}</div>
                <div><strong>Inicio:</strong> {torneo.fechaInicio}</div>
                <div><strong>Formato:</strong> {torneo.formato}</div>
                <div><strong>Máx Equipos:</strong> {torneo.cantidadMaximaEquipos}</div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/admin/torneos/${torneo.nombre}`)}
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </CommonLayout>
  );
};

export default MisTorneos;