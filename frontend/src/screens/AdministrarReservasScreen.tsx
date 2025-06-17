import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import styles from "../styles/AdminReservas.module.css";
import { useGetMisReservas, useCancelarReserva} from "@/services/ReservasService";

export const AdministrarReservasScreen = () => {
  const { data: reservas, isLoading, isError } = useGetMisReservas();
  const { mutate: cancelarReserva } = useCancelarReserva();

  const handleCancelarReserva = (reserva: any) => {
  if (confirm("¿Estás seguro de que querés cancelar esta reserva?")) {
    const reservaCancelada = {
      canchaName: reserva.canchaName,
      fecha: reserva.fecha,
      horaInicio: reserva.inicioTurno,
      horaFin: reserva.finTurno,
      state: "DISPONIBLE",
    };
    cancelarReserva(reservaCancelada);
  }
};
  
  return (
    <CommonLayout>
            <div className={styles.pageWrapper}>
                <div className={styles.titleRow}>
                    <span className={styles.trophyIcon}>📋</span>
                    <span className={styles.title}>Administracion de mis Reservas</span>
                </div>
            </div>
            {!reservas || reservas.length === 0 ? (
              <p>No tenés reservas aún.</p>
            ) : (
              <div className={styles.gridReservas}>
                {reservas.map((reserva, idx) => (
                  <div key={idx} className={styles.reservaCard}>
                    <div className={styles.reservaHeader}>
                      <span className={styles.reservaNombre}>{reserva.canchaName}</span>
                      <span className={styles.reservaEstado}>{reserva.state}</span>
                    </div>
                    <p className={styles.reservaDetalle}>📅 {reserva.fecha}</p>
                    <p className={styles.reservaDetalle}>⏰ {reserva.inicioTurno} - {reserva.finTurno}</p>
                    <p className={styles.reservaDetalle}>📍 {reserva.direccion}, {reserva.zona}</p>
                    {reserva.state === "OCUPADA" && (
                      <button className={styles.cancelButton} onClick={() => handleCancelarReserva(reserva)}>
                        Cancelar
                      </button>
                    )}
                  </div>
                ))}
              </div>
  )}
    </CommonLayout>
  );
};
export default AdministrarReservasScreen;