package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.*;

@Service
public class TorneoService {
    private final TorneoRepository repo;

    public TorneoService(TorneoRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public Torneo createTorneo(TorneoCreateDTO dto) {
        if (repo.existsByNombre(dto.nombre())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Ya existe un torneo con ese nombre"
            );
        }
        return repo.save(dto.asTorneo());
    }

    @Transactional(readOnly = true)
    public List<Torneo> listTorneos() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Torneo getTorneo(Long id) {
        return repo.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Torneo no encontrado"
                )
            );
    }

    @Transactional
    public Torneo updateTorneo(Long id, TorneoUpdateDTO dto) {
        Torneo t = getTorneo(id);
        if (dto.getNombre() != null && !dto.getNombre().equals(t.getNombre())) {
            if (repo.existsByNombre(dto.getNombre())) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ya existe un torneo con ese nombre"
                );
            }
            t.setNombre(dto.getNombre());
        }
        if (dto.getFechaInicio() != null) {
            t.setFechaInicio(dto.getFechaInicio());
        }
        if (dto.getFormato() != null) {
            t.setFormato(dto.getFormato());
        }
        if (dto.getCantidadMaximaEquipos() != null) {
            t.setCantidadMaximaEquipos(dto.getCantidadMaximaEquipos());
        }
        return repo.save(t);
    }

    @Transactional
    public void deleteTorneo(Long id) {
        Torneo t = getTorneo(id);
        repo.delete(t);
    }
}
