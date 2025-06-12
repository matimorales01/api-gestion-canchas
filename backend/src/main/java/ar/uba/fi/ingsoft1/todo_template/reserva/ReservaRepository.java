package ar.uba.fi.ingsoft1.todo_template.reserva;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservaRepository extends JpaRepository<Reserva, ReservaId> {

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END "
         + "FROM Reserva r "
         + "WHERE r.id.cancha.id = :canchaId "
         + "  AND r.id.fecha >= :hoy")
    boolean existsReservaFuturaPorCancha(
        @Param("canchaId") Long canchaId,
        @Param("hoy") LocalDate hoy
    );

    @Query("SELECT r FROM Reserva r WHERE r.id.cancha.id = :canchaId")
    List<Reserva> findByCanchaId(Long id);

    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.id.cancha.id = :canchaId")
    boolean existsByCanchaId(Long id);
}
