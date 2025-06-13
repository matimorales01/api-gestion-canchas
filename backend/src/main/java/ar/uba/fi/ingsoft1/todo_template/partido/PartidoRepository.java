package ar.uba.fi.ingsoft1.todo_template.partido;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;

public interface PartidoRepository extends JpaRepository<Partido, PartidoId> {
    //obetener partidos abiertos o cerrados por organizador
    List<Partido> findByTipoPartidoAndOrganizadorId(TipoPartido tipoPartido, Long organizadorId);
    
    //verificar si existen partidos abiertos o cerrados futuros por cancha
    boolean existsByTipoPartidoAndCanchaIdAndIdPartido_FechaPartidoGreaterThanEqual(
            TipoPartido tipoPartido,
            Long canchaId,
            LocalDate fechaPartido
    );
}
