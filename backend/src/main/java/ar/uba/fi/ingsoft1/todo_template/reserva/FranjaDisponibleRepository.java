package ar.uba.fi.ingsoft1.todo_template.reserva;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FranjaDisponibleRepository extends JpaRepository<FranjaDisponible, Long> {

    List<FranjaDisponible> findByCanchaIdAndFechaAndEstado(
        Long canchaId, LocalDate fecha, EstadoFranja estado
    );

    FranjaDisponible findByCanchaIdAndFechaAndHoraInicioAndHoraFin(
        Long canchaId, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin
    );

    void deleteAllByCanchaId(Long canchaId);
}
