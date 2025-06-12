package ar.uba.fi.ingsoft1.todo_template.equipo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long>  {
    Optional<Equipo> findByTeamName(String teamName);
    boolean existsByTeamName(String teamName);
    Optional<List<Equipo>> findByCaptainId(Integer id);
}
