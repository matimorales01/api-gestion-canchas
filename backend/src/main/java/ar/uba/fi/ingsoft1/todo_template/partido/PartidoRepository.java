package ar.uba.fi.ingsoft1.todo_template.partido;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PartidoRepository extends JpaRepository<Partido, Long> {

    @Query("SELECT p FROM PartidoAbierto p WHERE p.organizador.id = :userId")
    List<PartidoAbierto> findPartidosAbiertosByOrganizadorId(@Param("userId") Long userId);

    @Query("SELECT p FROM PartidoCerrado p WHERE p.organizador.id = :userId")
    List<PartidoCerrado> findPartidosCerradosByOrganizadorId(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END "
         + "FROM PartidoAbierto p "
         + "WHERE p.nroCancha = :canchaId "
         + "  AND p.fechaPartido >= :fechaHoy")
    boolean existsPartidoAbiertoFuturoPorCancha(
        @Param("canchaId") Long canchaId,
        @Param("fechaHoy") String fechaHoy
    );

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN TRUE ELSE FALSE END "
         + "FROM PartidoCerrado p "
         + "WHERE p.nroCancha = :canchaId "
         + "  AND p.fechaPartido >= :fechaHoy")
    boolean existsPartidoCerradoFuturoPorCancha(
        @Param("canchaId") Long canchaId,
        @Param("fechaHoy") String fechaHoy
    );
}
