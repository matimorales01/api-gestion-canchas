package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.stereotype.Service;

import ar.uba.fi.ingsoft1.todo_template.common.exception.EquipoAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.equipo.Equipo;

@Service
public class InscripcionService {
    private final InscripcionRepository repository;

    public InscripcionService(InscripcionRepository repository) {
        this.repository = repository;
    }

    public String inscribirEquipo(Torneo torneo, Equipo equipo) {
        InscripcionesId id = new InscripcionesId(torneo, equipo);

        if (repository.existsById(id)) {
            throw new EquipoAlreadyExistsException("El equipo ya está inscripto en el torneo.");
        }

        Inscripciones inscripcion = new Inscripciones(id);
        repository.save(inscripcion);

        return "Equipo " + equipo.getId() + " inscrito en el torneo " + torneo.getNombre() + ".";
    }
}
