package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.*;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.*;
import java.util.List;

@Service
public class TorneoService {
    private final TorneoRepository repo;
    private final UserRepository userRepo;

    public TorneoService(TorneoRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    @Transactional
    public Torneo createTorneo(TorneoCreateDTO dto) {
        if (repo.existsByNombre(dto.nombre())) {
            throw new TorneoAlreadyExistsException(dto.nombre());
        }
        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
        User organizador = userRepo.findByEmail(userInfo.email())
            .orElseThrow(() ->
                new NotFoundException("Usuario con email '" + userInfo.email() + "' no encontrado.")
            );
        Torneo t = dto.asTorneo();
        t.setOrganizador(organizador);
        return repo.save(t);
    }

    @Transactional(readOnly = true)
    public List<Torneo> listTorneos() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Torneo getTorneo(Long id) {
        return repo.findById(id)
            .orElseThrow(() ->
                new NotFoundException("Torneo con id " + id + " no encontrado.")
            );
    }

    @Transactional
    public Torneo updateTorneo(Long id, TorneoUpdateDTO dto) {
        Torneo t = getTorneo(id);
        if (t.getEstado() != EstadoTorneo.ABIERTO) {
            throw new TorneoNotEditableException(id);
        }
        if (dto.getNombre() != null && !dto.getNombre().equals(t.getNombre())) {
            if (repo.existsByNombre(dto.getNombre())) {
                throw new TorneoAlreadyExistsException(dto.getNombre());
            }
            t.setNombre(dto.getNombre());
        }
        if (dto.getFechaInicio() != null)       t.setFechaInicio(dto.getFechaInicio());
        if (dto.getFechaFin() != null)          t.setFechaFin(dto.getFechaFin());
        if (dto.getFormato() != null)           t.setFormato(dto.getFormato());
        if (dto.getCantidadMaximaEquipos() != null) t.setCantidadMaximaEquipos(dto.getCantidadMaximaEquipos());
        if (dto.getDescripcion() != null)       t.setDescripcion(dto.getDescripcion());
        if (dto.getPremios() != null)           t.setPremios(dto.getPremios());
        if (dto.getCostoInscripcion() != null)  t.setCostoInscripcion(dto.getCostoInscripcion());
        if (dto.getEstado() != null)            t.setEstado(dto.getEstado());
        return repo.save(t);
    }

    @Transactional
    public void deleteTorneo(Long id) {
        Torneo t = getTorneo(id);
        if (t.getEstado() != EstadoTorneo.ABIERTO) {
            throw new TorneoNotEditableException(id);
        }
        repo.delete(t);
    }
}
