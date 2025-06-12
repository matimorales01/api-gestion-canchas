import React, {useState} from "react";
import { useGetTorneosDisponibles } from "@/services/TorneoService";
import type { TorneoDisponible } from "@/models/Torneo";
import { useLocation } from "wouter";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";

type EstadoTorneo = 'ABIERTO' | 'EN_CURSO' | 'FINALIZADO' | '';

export const UserListaTorneo: React.FC = () => {
    const [, navigate] = useLocation();

    const { data: torneos, isLoading, error } = useGetTorneosDisponibles();
    console.log("Torneos disponibles:", torneos);
    const [filtros, setFiltros] = useState<{ estado: EstadoTorneo; nombre: string }>({
        estado: '',
        nombre: '',
    });

    const torneosFiltrados = (torneos || []).filter((t) =>
        (!filtros.estado || t.estado === filtros.estado) &&
        t.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
    );

    const formatearEstado = (estado: EstadoTorneo): string => {
        switch (estado) {
        case "ABIERTO":
            return "Abierto para inscripción";
        case "EN_CURSO":
            return "En curso";
        case "FINALIZADO":
            return "Finalizado";
        default:
            return estado;
        }
    };

    const formatoFecha = (fecha: string): string =>
        new Date(fecha).toLocaleDateString("es-AR");

    return (
        <CommonLayout>
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Torneos Disponibles</h1>

            {/* Filtros */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                placeholder="Buscar por nombre"
                className="border p-2 rounded w-full sm:w-1/2"
                value={filtros.nombre}
                onChange={(e) =>
                setFiltros({ ...filtros, nombre: e.target.value })
                }
            />
            <select
                className="border p-2 rounded w-full sm:w-1/2"
                value={filtros.estado}
                onChange={(e) =>
                setFiltros({ ...filtros, estado: e.target.value as EstadoTorneo })
                }
            >
                <option value="">Todos los estados</option>
                <option value="ABIERTO">Abierto para inscripción</option>
                <option value="EN_CURSO">En curso</option>
                <option value="FINALIZADO">Finalizado</option>
            </select>
            </div>

            {/* Estado de carga */}
            {isLoading && <p>Cargando torneos...</p>}
            {error && <p className="text-red-500">Error al cargar torneos.</p>}

            {/* Lista de torneos */}
            {!isLoading && torneosFiltrados.length === 0 ? (
            <p className="text-gray-500">
                No hay torneos disponibles con los filtros aplicados.
            </p>
            ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {torneosFiltrados.map((torneo: TorneoDisponible) => (
                <div
                    key={torneo.id}
                    className="border p-4 rounded shadow hover:shadow-md cursor-pointer transition"
                    onClick={() => navigate(`/torneos/${torneo.id}`)}
                >
                    <h2 className="text-lg font-semibold">{torneo.nombre}</h2>
                    <p>
                    <strong>Inicio:</strong> {formatoFecha(torneo.fechaInicio)}
                    </p>
                    <p>
                    <strong>Formato:</strong> {torneo.formato}
                    </p>
                    <p>
                    <strong>Estado:</strong> {formatearEstado(torneo.estado)}
                    </p>
                    <p>
                    <strong>Descripción:</strong>{" "}
                    {torneo.descripcion || "Sin descripción"}
                    </p>
                    <p>
                    <strong>Premios:</strong>{" "}
                    {torneo.premios || "Sin premios definidos"}
                    </p>
                    <p>
                    <strong>Costo de inscripción:</strong> $
                    {torneo.costoInscripcion?.toFixed(2) || "0.00"}
                    </p>
                </div>
                ))}
            </div>
            )}
        </div>
        </CommonLayout>
    );
};

/*
    export const UserListaTorneo: React.FC = () => {
    const { data: torneos} = useGetTorneosDisponibles();
    const [filtros, setFiltros] = useState({estado: '', nombre: ''});
    const navigate = useNavigate();

    const torneosFiltrados = torneos?.filter((torneo: TorneoDisponible) => {
        const coincideEstado = filtros.estado === '' || torneo.estado === filtros.estado;
        const coincideNombre = torneo.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
        return coincideEstado && coincideNombre;
    });

    const formatoFecha = (fecha: string): string => new Date(fecha).toLocaleDateString();

    const formatearEstado = (estado: EstadoTorneo): string => {
    switch (estado) {
      case 'ABIERTO':
        return 'Abierto para inscripción';
      case 'EN_CURSO':
        return 'En curso';
      case 'FINALIZADO':
        return 'Finalizado';
      default:
        return estado;
    }};


    return (
        <CommonLayout>

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Torneos Disponibles</h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <input
            type="text"
            placeholder="Buscar por nombre"
            className="border p-2 rounded"
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
            />
            <select
            className="border p-2 rounded"
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            >
            <option value="">Todos los estados</option>
            <option value="ABIERTO">Abierto para inscripción</option>
            <option value="EN_CURSO">En curso</option>
            <option value="FINALIZADO">Finalizado</option>
            </select>
      </div>

      {(torneosFiltrados ?? []).length === 0 ? (
        <p className="text-gray-500">
          No hay torneos disponibles con los filtros aplicados.
        </p>
      ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(torneosFiltrados ?? []).map((torneo: TorneoDisponible) => (
              <div
              key={torneo.id}
              className="border p-4 rounded shadow hover:shadow-md cursor-pointer transition"
              onClick={() => navigate(`/torneo/${torneo.id}`)}
              >
              <h2 className="text-lg font-semibold">{torneo.nombre}</h2>
              <p><strong>Inicio:</strong> {formatoFecha(torneo.fechaInicio)}</p>
              <p><strong>Formato:</strong> {torneo.formato}</p>
              <p><strong>Estado:</strong> {formatearEstado(torneo.estado)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </CommonLayout>
    );
};
*/