import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetTorneosDisponibles, userEditarTorneo } from "@/services/TorneoService";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";

const UserEditarTorneoScreen = () => {
    const params = useParams();
    const id = Number(params.id);
    const { data: torneos } = useGetTorneosDisponibles();
    const torneo: Torneo | undefined = (torneos as Torneo[] | undefined)?.find((t) => t.id == id);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [formato, setFormato] = useState("ELIMINACION_DIRECTA");
    const [maxEquipos, setMaxEquipos] = useState(2);
    const [costoInscripcion, setCostoInscripcion] = useState(0);
    const [premios, setPremios] = useState("");

    const [, navigate] = useLocation();

    useEffect(() => {
      console.log("Torneos disponibles:", torneos);
        if (torneo) {
            setNombre(torneo.nombre || "");
            setDescripcion(torneo.descripcion || "");
            setFechaInicio(torneo.fechaInicio || "");
            setFormato(torneo.formato || "ELIMINACION_DIRECTA");
            setMaxEquipos(torneo.cantidadMaximaEquipos || 2);
            setCostoInscripcion(torneo.costoInscripcion || 0);
            setPremios(torneo.premios || "");
        }
    }, [torneo]);

    const editarTorneo = userEditarTorneo({
        onSuccess: () => {
            alert("Torneo editado correctamente");
            navigate("/listar-torneos");
        },
        onError: (error: unknown) => {
            if (error && typeof error === "object" && "message" in error) {
                alert("Error al editar torneo: " + (error as { message: string }).message);
            } else {
                alert("Error al editar torneo");
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editarTorneo.mutate({
            id,
            data: {
                nombre,
                descripcion,
                fechaInicio,
                fechaFin,
                formato,
                cantidadMaximaEquipos: maxEquipos,
                costoInscripcion,
                premios,
            },
        });
    };

    if (!torneo) return (
        <div>
            <h1>Cargando datos del torneo...</h1>
        </div>
    );

    return (
        <CommonLayout>
            <div className="container mt-4">
                <h1 className="text-xl font-bold mb-4">Editar Torneo</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Nombre:</label>
                        <input
                            className="form-control"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Descripción:</label>
                        <input
                            className="form-control"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Fecha de Inicio:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaInicio}
                            onChange={e => setFechaInicio(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Fecha de Fin (opcional):</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaFin}
                            onChange={e => setFechaFin(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Formato:</label>
                        <select
                            className="form-control"
                            value={formato}
                            onChange={e => setFormato(e.target.value)}
                        >
                            <option value="ELIMINACION_DIRECTA">Eliminación Directa</option>
                            <option value="LIGA">Liga</option>
                            <option value="GRUPOS">Grupos</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Máximo de Equipos:</label>
                        <input
                            type="number"
                            min={2}
                            className="form-control"
                            value={maxEquipos}
                            onChange={e => setMaxEquipos(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Costo de Inscripción:</label>
                        <input
                            type="number"
                            min={0}
                            step={0.01}
                            className="form-control"
                            value={costoInscripcion}
                            onChange={e => setCostoInscripcion(Number(e.target.value))}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Premios:</label>
                        <input
                            className="form-control"
                            value={premios}
                            onChange={e => setPremios(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </form>
            </div>
        </CommonLayout>
    );
}

export default UserEditarTorneoScreen;
