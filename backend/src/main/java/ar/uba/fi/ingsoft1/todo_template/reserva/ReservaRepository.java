package ar.uba.fi.ingsoft1.todo_template.reserva;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // Verifica si ya existe una reserva para la misma cancha y solapa horaria
    boolean existsByCanchaIdAndFechaAndHoraInicioLessThanAndHoraFinGreaterThan(
        Long canchaId, LocalDate fecha, LocalTime horaFin, LocalTime horaInicio
    );

    // muestra la lista de reservas futuras para una cancha
    List<Reserva> findByCanchaIdAndFechaGreaterThanEqual(Long canchaId, LocalDate fecha);

    
}
