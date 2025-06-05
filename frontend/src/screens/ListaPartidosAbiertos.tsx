import React, { useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import {
    usePartidosAbiertos,
    useInscribirPartido,
    useDesinscribirPartido,
} from "@/services/PartidoService";
import { Partido } from "@/models/Partido";

function partidoYaEmpezo(fecha: string, hora: string): boolean {
    try {
        if (!fecha || !hora) return false;
        const fechaHora = new Date(`${fecha}T${hora}`);
        return fechaHora.getTime() <= Date.now();
    } catch {
        return false;
    }
}

function formatearFecha(fechaIso: string): string {
    if (!fechaIso) return "";
    const [yyyy, mm, dd] = fechaIso.split("-");
    return `${dd}/${mm}/${yyyy}`;
}

const PartidosAbiertos = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data: partidos = [], isLoading, isError } = usePartidosAbiertos();
    const inscribir = useInscribirPartido();
    const desinscribir = useDesinscribirPartido();

    return (
        <CommonLayout>
            <div
                style={{
                    maxWidth: 900,
                    margin: "20px auto",
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#181818",
                    padding: "20px",
                    borderRadius: "10px",
                }}
            >
                <h2 style={{ color: "white", textAlign: "center" }}>
                    Lista de partidos abiertos
                </h2>

                {(isLoading) && <p style={{ color: "#ccc" }}>Cargando partidos...</p>}
                {isError && (
                    <p style={{ color: "#ff6060" }}>
                        Error al cargar los partidos. Intentá recargar.
                    </p>
                )}

                {!isLoading && partidos.length === 0 && (
                    <p style={{ color: "#ccc" }}>No hay partidos abiertos disponibles.</p>
                )}

                {partidos.length > 0 && (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #333",
                            backgroundColor: "#202020",
                            color: "white",
                            marginTop: "18px",
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={thStyle}>Cancha</th>
                            <th style={thStyle}>Dirección</th>
                            <th style={thStyle}>Fecha</th>
                            <th style={thStyle}>Hora</th>
                            <th style={thStyle}>Cupos</th>
                            <th style={thStyle}>Mail Organizador</th>
                            <th style={thStyle}>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {partidos.map((partido: Partido) => {
                            const nombreCancha = partido.canchaNombre;
                            const direccionCancha = partido.canchaDireccion;

                            const yaEmpezo = partido.fechaPartido && partido.horaPartido
                                ? partidoYaEmpezo(partido.fechaPartido, partido.horaPartido)
                                : false;

                            let accion: React.ReactNode = null;
                            if (yaEmpezo) {
                                accion = <span style={{ color: "#ffb300", fontWeight: 600 }}>Partido en curso</span>;
                            } else if (partido.partidoConfirmado) {
                                accion = <span style={{ color: "#1c8a3e", fontWeight: 600 }}>Partido confirmado</span>;
                            } else if (!partido.inscripto && partido.cuposDisponibles === 0) {
                                accion = <span style={{ color: "#d32f2f", fontWeight: 600 }}>Partido lleno</span>;
                            } else if (!partido.inscripto && partido.cuposDisponibles > 0) {
                                accion = (
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            inscribir.mutate(partido.idPartido, {
                                                onSuccess: () => alert("¡Inscripción exitosa!"),
                                                onError: (error) =>
                                                    alert(
                                                        "No se pudo inscribir: " +
                                                        (error instanceof Error ? error.message : "Error desconocido")
                                                    ),
                                            });
                                        }}
                                        disabled={inscribir.isPending}
                                        style={btnGreen}
                                    >
                                        Inscribirse
                                    </button>
                                );
                            } else if (
                                partido.inscripto &&
                                !partido.partidoConfirmado &&
                                !yaEmpezo
                            ) {
                                accion = (
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            desinscribir.mutate(partido.idPartido, {
                                                onSuccess: () => alert("Desinscripción exitosa"),
                                                onError: (error) =>
                                                    alert(
                                                        "No se pudo desinscribir: " +
                                                        (error instanceof Error ? error.message : "Error desconocido")
                                                    ),
                                            });
                                        }}
                                        disabled={desinscribir.isPending}
                                        style={btnRed}
                                    >
                                        Desinscribirse
                                    </button>
                                );
                            }

                            return (
                                <tr
                                    key={partido.idPartido}
                                    onClick={() => setSelectedId(partido.idPartido)}
                                    style={{
                                        backgroundColor: selectedId === partido.idPartido ? "#353535" : "#202020",
                                        transition: "background-color 0.3s",
                                        cursor: "pointer",
                                    }}
                                >
                                    <td style={tdStyle}>{nombreCancha}</td>
                                    <td style={tdStyle}>{direccionCancha}</td>
                                    <td style={tdStyle}>{formatearFecha(partido.fechaPartido)}</td>
                                    <td style={tdStyle}>{partido.horaPartido}</td>
                                    <td style={tdStyle}>{partido.cuposDisponibles}</td>
                                    <td style={tdStyle}>{partido.emailOrganizador}</td>
                                    <td style={tdStyle}>{accion}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </CommonLayout>
    );
};

const thStyle = {
    padding: "12px 14px",
    textAlign: "left" as const,
    borderBottom: "2px solid #222",
    fontWeight: 700,
    backgroundColor: "#181818",
};
const tdStyle = {
    padding: "12px 14px",
    borderBottom: "1px solid #222",
};
const btnGreen = {
    background: "#198754",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "7px 16px",
    cursor: "pointer",
    fontWeight: 600,
};
const btnRed = {
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "7px 16px",
    cursor: "pointer",
    fontWeight: 600,
};

export default PartidosAbiertos;
