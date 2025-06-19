import { useState, useEffect } from "react";
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

    const [mensaje, setMensaje] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [jugadoresActual, setJugadoresActual] = useState<any[]>([]);
    const [nombrePartidoActual, setNombrePartidoActual] = useState<string>("");

    const [loadingInscribirId, setLoadingInscribirId] = useState<string | null>(null);
    const [loadingDesinscribirId, setLoadingDesinscribirId] = useState<string | null>(null);

    useEffect(() => {
        setPartidosState(partidos);
    }, [partidos]);

    const handleInscribir = (partido: any) => {
        const key =
            partido.canchaId + partido.fechaPartido + partido.horaPartido;
        setLoadingInscribirId(key);

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
                                ? {
                                    ...p,
                                    inscripto: true,
                                    cuposDisponibles: p.cuposDisponibles - 1,
                                    // jugadores: [...(p.jugadores ?? []), usuarioActual], // si lo tenés de contexto
                                }
                                : p
                        )
                    );
                    setMensaje("¡Inscripción exitosa!");
                },
                onError: (error) =>
                    alert(
                        "No se pudo inscribir: " +
                        (error instanceof Error ? error.message : "Error desconocido")
                    ),
                onSettled: () => {
                    setLoadingInscribirId(null);
                },
            }
        );
    };

    const handleDesinscribir = (partido: any) => {
        const key =
            partido.canchaId + partido.fechaPartido + partido.horaPartido;
        setLoadingDesinscribirId(key);

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
                                ? {
                                    ...p,
                                    inscripto: false,
                                    cuposDisponibles: p.cuposDisponibles + 1,
                                    // jugadores: (p.jugadores ?? []).filter(j => j.email !== usuarioActual.email)
                                }
                                : p
                        )
                    );
                    setMensaje("Te diste de baja del partido.");
                },
                onError: (error) =>
                    alert(
                        "No se pudo desinscribir: " +
                        (error instanceof Error ? error.message : "Error desconocido")
                    ),
                onSettled: () => {
                    setLoadingDesinscribirId(null);
                },
            }
        );
    };

    const handleVerJugadores = (partido: any) => {
        setJugadoresActual(partido.jugadores ?? []);
        setNombrePartidoActual(
            `${partido.canchaNombre} - ${formatearFecha(partido.fechaPartido)} ${partido.horaPartido}`
        );
        setShowModal(true);
    };

    return (
        <CommonLayout>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>Partidos Abiertos</h2>
                {mensaje && (
                    <div className={styles.alertBox}>
                        <span>{mensaje}</span>
                        <button className={styles.btnAlertOk} onClick={() => setMensaje(null)}>
                            Aceptar
                        </button>
                    </div>
                )}

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
                        const key =
                            partido.canchaId + partido.fechaPartido + partido.horaPartido;
                        const yaEmpezo =
                            partido.fechaPartido && partido.horaPartido
                                ? partidoYaEmpezo(partido.fechaPartido, partido.horaPartido)
                                : false;

                        let badge = null;
                        if (yaEmpezo) {
                            badge = <span className={styles.badgeEnCurso}>En curso</span>;
                        } else if (partido.partidoConfirmado) {
                            badge = <span className={styles.badgeConfirmado}>Partido confirmado</span>;
                        }

                        let accion = null;
                        if (yaEmpezo) {
                            accion = <span className={styles.badgeEnCurso}>En curso</span>;
                        } else if (partido.partidoConfirmado) {
                            accion = <span className={styles.badgeConfirmado}>Partido confirmado</span>;
                        } else if (!partido.inscripto && partido.cuposDisponibles === 0) {
                            accion = <span className={styles.badgeLleno}>Partido lleno</span>;
                        } else if (!partido.inscripto && partido.cuposDisponibles > 0) {
                            accion = (
                                <button
                                    className={styles.btnGreen}
                                    disabled={loadingInscribirId === key}
                                    onClick={() => handleInscribir(partido)}
                                >
                                    {loadingInscribirId === key ? "Inscribiendo..." : "Inscribirse"}
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
                                    disabled={loadingDesinscribirId === key}
                                    onClick={() => handleDesinscribir(partido)}
                                >
                                    {loadingDesinscribirId === key
                                        ? "Desinscribiendo..."
                                        : "Desinscribirse"}
                                </button>
                            );
                        }

                        return (
                            <div className={styles.card} key={key}>
                                <div className={styles.cardTitle}>
                                    {partido.canchaNombre}
                                </div>
                                <div className={styles.infoRow}>
                                    <b>Dirección:</b> {partido.canchaDireccion}
                                </div>
                                <div className={styles.infoRow}>
                                    <span>
                                        <b>Fecha:</b>{" "}
                                        {formatearFecha(partido.fechaPartido)}
                                    </span>
                                    <span>
                                        <b>Hora:</b> {partido.horaPartido}
                                    </span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span>
                                        <b>Cupos:</b> {partido.cuposDisponibles}
                                    </span>
                                    <span>
                                        <b>Mail organizador:</b>{" "}
                                        {partido.emailOrganizador}
                                    </span>
                                </div>

                                <div className={styles.infoRow}>
                                    <button
                                        className={styles.btnSecundario}
                                        onClick={() => handleVerJugadores(partido)}
                                    >
                                        Ver jugadores inscriptos
                                    </button>
                                </div>

                                <div className={styles.acciones}>{accion}</div>
                            </div>
                        );
                    })}
                </div>

                {showModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                        <div
                            className={styles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className={styles.modalTitle}>{nombrePartidoActual}</h3>
                            <ul className={styles.jugadoresList}>
                                {jugadoresActual.length === 0 ? (
                                    <li>No hay jugadores inscriptos aún.</li>
                                ) : (
                                    jugadoresActual.map((j) => (
                                        <li key={j.id}>
                                            {j.firstName} {j.lastName}{" "}
                                            <span className={styles.jugadorEmail}>
                                                ({j.email})
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>
                            <button
                                className={styles.btnCerrarModal}
                                onClick={() => setShowModal(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </CommonLayout>
    );
};

export default PartidosAbiertos;
