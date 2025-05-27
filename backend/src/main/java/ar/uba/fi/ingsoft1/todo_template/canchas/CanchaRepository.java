package ar.uba.fi.ingsoft1.todo_template.canchas;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CanchaRepository extends JpaRepository<Cancha,Long> {
    boolean existsByNombreAndZonaAndDireccion(String nombre, String zona, String direccion);
}
