import { useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import {
    usePartidosAbiertos,
    useInscribirPartido,
    useDesinscribirPartido,
} from "@/services/PartidoService";
import { useCanchas } from "@/services/CanchaService";
import { Partido } from "@/models/Partido";
import { Cancha } from "@/models/Cancha";

const PartidosAbiertos = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { data: partidos = [], isLoading, isError } = usePartidosAbiertos();
    const inscribir = useInscribirPartido();
    const desinscribir = useDesinscribirPartido();
    const { data: canchas = [], isLoading: isLoadingCanchas } = useCanchas();

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

                {(isLoading || isLoadingCanchas) && <p style={{ color: "#ccc" }}>Cargando partidos...</p>}
                {isError && (
                    <p style={{ color: "#ff6060" }}>
                        Error al cargar los partidos. Intentá recargar.
                    </p>
                )}

                {!isLoading && !isLoadingCanchas && partidos.length === 0 && (
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
                            <th style={thStyle}>Hora</th>
                            <th style={thStyle}>Cupos</th>
                            <th style={thStyle}>Mail Organizador</th>
                            <th style={thStyle}>Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {partidos.map((partido: Partido) => {
                            const cancha = (canchas as Cancha[]).find(c => c.id === partido.nroCancha);
                            const nombreCancha = cancha?.nombre ?? partido.nroCancha;
                            const direccionCancha = cancha?.direccion ?? "-";
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
                                    <td style={tdStyle}>{partido.horaPartido}</td>
                                    <td style={tdStyle}>{partido.cuposDisponibles}</td>
                                    <td style={tdStyle}>{partido.emailOrganizador}</td>
                                    <td style={tdStyle}>
                                        {!partido.inscripto ? (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    inscribir.mutate(partido.idPartido);
                                                }}
                                                disabled={inscribir.isPending}
                                                style={btnGreen}
                                            >
                                                Inscribirse
                                            </button>
                                        ) : (
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    desinscribir.mutate(partido.idPartido);
                                                }}
                                                disabled={desinscribir.isPending}
                                                style={btnRed}
                                            >
                                                Desinscribirse
                                            </button>
                                        )}
                                    </td>
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
