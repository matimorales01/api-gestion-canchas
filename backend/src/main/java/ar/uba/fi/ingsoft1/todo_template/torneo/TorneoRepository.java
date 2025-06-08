package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TorneoRepository extends JpaRepository<Torneo, Long> {
    Optional<Torneo> findByName(String name);
    boolean existsByName(String name);
}
