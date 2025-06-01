package ar.uba.fi.ingsoft1.todo_template.reserva;

import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END "
         + "FROM Reserva r "
         + "WHERE r.cancha.id = :canchaId "
         + "  AND r.fecha >= :hoy")
    boolean existsReservaFuturaPorCancha(
        @Param("canchaId") Long canchaId,
        @Param("hoy") LocalDate hoy
    );
}
