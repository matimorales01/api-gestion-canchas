package ar.uba.fi.ingsoft1.todo_template.partido;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
public interface PartidoRepository extends JpaRepository<Partido, PartidoId> {
    //obetener partidos abiertos o cerrados por organizador
    List<Partido> findByTipoPartidoAndOrganizadorUsername(TipoPartido tipoPartido, String organizadorId);
    
    //verificar si existen partidos abiertos o cerrados futuros por cancha
    boolean existsByTipoPartidoAndCanchaIdAndIdPartido_FechaPartidoGreaterThanEqual(
            TipoPartido tipoPartido,
            Long canchaId,
            LocalDate fechaPartido
    );
}
