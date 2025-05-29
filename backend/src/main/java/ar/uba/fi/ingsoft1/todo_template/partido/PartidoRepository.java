package ar.uba.fi.ingsoft1.todo_template.partido;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;;

@Repository
public interface PartidoRepository extends JpaRepository<Partido, Long> {

    @Query("SELECT p FROM PartidoAbierto p WHERE p.organizador.id = :userId")
    List<PartidoAbierto> findPartidosAbiertosByOrganizadorId(Long userId);

    @Query("SELECT p FROM PartidoCerrado p WHERE p.organizador.id = :userId")
    List<PartidoCerrado> findPartidosCerradosByOrganizadorId(Long userId);
    
}
