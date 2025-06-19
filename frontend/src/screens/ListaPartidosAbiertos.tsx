import  { useState, useEffect } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import {
    usePartidosAbiertos,
    useInscribirPartido,
    useDesinscribirPartido,
} from "@/services/PartidoService";
import styles from "./PartidosAbiertos.module.css";

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
    const { data: partidos = [], isLoading, isError } = usePartidosAbiertos();
    const inscribir = useInscribirPartido();
    const desinscribir = useDesinscribirPartido();

    const [partidosState, setPartidosState] = useState(partidos);

    useEffect(() => {
        setPartidosState(partidos);
    }, [partidos]);

    const handleInscribir = (partido: any) => {
        inscribir.mutate(
            {
                canchaId: partido.canchaId,
                fechaPartido: partido.fechaPartido,
                horaPartido: partido.horaPartido,
            },
            {
                onSuccess: () => {
                    setPartidosState((prev) =>
                        prev.map((p) =>
                            p.canchaId === partido.canchaId &&
                            p.fechaPartido === partido.fechaPartido &&
                            p.horaPartido === partido.horaPartido
                                ? { ...p, inscripto: true, cuposDisponibles: p.cuposDisponibles - 1 }
                                : p
                        )
                    );
                },
                onError: (error) =>
                    alert("No se pudo inscribir: " +
                        (error instanceof Error ? error.message : "Error desconocido")),
            }
        );
    };

    const handleDesinscribir = (partido: any) => {
        desinscribir.mutate(
            {
                canchaId: partido.canchaId,
                fechaPartido: partido.fechaPartido,
                horaPartido: partido.horaPartido,
            },
            {
                onSuccess: () => {
                    setPartidosState((prev) =>
                        prev.map((p) =>
                            p.canchaId === partido.canchaId &&
                            p.fechaPartido === partido.fechaPartido &&
                            p.horaPartido === partido.horaPartido
                                ? { ...p, inscripto: false, cuposDisponibles: p.cuposDisponibles + 1 }
                                : p
                        )
                    );
                },
                onError: (error) =>
                    alert("No se pudo desinscribir: " +
                        (error instanceof Error ? error.message : "Error desconocido")),
            }
        );
    };

    return (
        <CommonLayout>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>Partidos Abiertos</h2>

                {isLoading && <p className={styles.msg}>Cargando partidos...</p>}
                {isError && (
                    <p className={styles.msgError}>
                        Error al cargar los partidos. Intentá recargar.
                    </p>
                )}
                {!isLoading && partidosState.length === 0 && (
                    <p className={styles.msg}>No hay partidos abiertos disponibles.</p>
                )}

                <div className={styles.cardGrid}>
                    {partidosState.map((partido) => {
                        const yaEmpezo = partido.fechaPartido && partido.horaPartido
                            ? partidoYaEmpezo(partido.fechaPartido, partido.horaPartido)
                            : false;

                        let accion = null;
                        if (yaEmpezo) {
                            accion = <span className={styles.badgeEnCurso}>En curso</span>;
                        } else if (partido.partidoConfirmado) {
                            accion = <span className={styles.badgeConfirmado}>Confirmado</span>;
                        } else if (!partido.inscripto && partido.cuposDisponibles === 0) {
                            accion = <span className={styles.badgeLleno}>Lleno</span>;
                        } else if (!partido.inscripto && partido.cuposDisponibles > 0) {
                            accion = (
                                <button
                                    className={styles.btnGreen}
                                    disabled={inscribir.isPending}
                                    onClick={() => handleInscribir(partido)}
                                >
                                    {inscribir.isPending ? "Inscribiendo..." : "Inscribirse"}
                                </button>
                            );
                        } else if (
                            partido.inscripto &&
                            !partido.partidoConfirmado &&
                            !yaEmpezo
                        ) {
                            accion = (
                                <button
                                    className={styles.btnRed}
                                    disabled={desinscribir.isPending}
                                    onClick={() => handleDesinscribir(partido)}
                                >
                                    {desinscribir.isPending ? "Desinscribiendo..." : "Desinscribirse"}
                                </button>
                            );
                        }

                        return (
                            <div className={styles.card} key={partido.canchaId + partido.fechaPartido + partido.horaPartido}>
                                <div className={styles.cardTitle}>
                                    {partido.canchaNombre}
                                </div>
                                <div className={styles.infoRow}><b>Dirección:</b> {partido.canchaDireccion}</div>
                                <div className={styles.infoRow}>
                                    <span><b>Fecha:</b> {formatearFecha(partido.fechaPartido)}</span>
                                    <span><b>Hora:</b> {partido.horaPartido}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span><b>Cupos:</b> {partido.cuposDisponibles}</span>
                                    <span><b>Mail organizador:</b> {partido.emailOrganizador}</span>
                                </div>
                                <div className={styles.acciones}>
                                    {accion}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </CommonLayout>
    );
};

export default PartidosAbiertos;
