package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.equipo.Equipo;
import ar.uba.fi.ingsoft1.todo_template.equipo.EquipoRepository;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.TorneoAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.TorneoNotEditableException;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.InscripcionDTO;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoUpdateDTO;
import java.time.LocalDate;
import java.util.List;

@Service
public class TorneoService {
    private final TorneoRepository repo;
    private final UserRepository userRepo;
    private final EquipoRepository equipoRepo;
    private final InscripcionService inscripcionService;

    public TorneoService(TorneoRepository repo, UserRepository userRepo, EquipoRepository equipoRepo, InscripcionService inscripcionService) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.equipoRepo = equipoRepo;
        this.inscripcionService = inscripcionService;
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
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado."));
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
            .orElseThrow(() -> new NotFoundException("Torneo con id " + id + " no encontrado."));
    }

    @Transactional
    public Torneo updateTorneo(Long id, TorneoUpdateDTO dto) {
        Torneo torneo_a_actualizar = getTorneo(id);
        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
        if (!torneo_a_actualizar.getOrganizador().getEmail().equals(userInfo.email())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el organizador puede editar este torneo.");
        }
        LocalDate inicio = dto.getFechaInicio() != null ? dto.getFechaInicio() : torneo_a_actualizar.getFechaInicio();
        LocalDate fin    = dto.getFechaFin()    != null ? dto.getFechaFin()    : torneo_a_actualizar.getFechaFin();
        if (fin != null && fin.isBefore(inicio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de fin debe ser posterior a la fecha de inicio.");
        }
        if (dto.getNombre() != null && !dto.getNombre().equals(torneo_a_actualizar.getNombre())) {
            if (repo.existsByNombre(dto.getNombre())) {
                throw new TorneoAlreadyExistsException(dto.getNombre());
            }
            torneo_a_actualizar.setNombre(dto.getNombre());
        }
        if (dto.getFormato() != null && dto.getFormato() != torneo_a_actualizar.getFormato()) {
            if (torneo_a_actualizar.getEstado() != EstadoTorneo.ABIERTO) {
                throw new TorneoNotEditableException(id);
            }
            torneo_a_actualizar.setFormato(dto.getFormato());
        }
        if (dto.getFechaInicio() != null)           torneo_a_actualizar.setFechaInicio(dto.getFechaInicio());
        if (dto.getFechaFin() != null)              torneo_a_actualizar.setFechaFin(dto.getFechaFin());
        if (dto.getCantidadMaximaEquipos() != null) torneo_a_actualizar.setCantidadMaximaEquipos(dto.getCantidadMaximaEquipos());
        if (dto.getDescripcion() != null)           torneo_a_actualizar.setDescripcion(dto.getDescripcion());
        if (dto.getPremios() != null)               torneo_a_actualizar.setPremios(dto.getPremios());
        if (dto.getCostoInscripcion() != null)      torneo_a_actualizar.setCostoInscripcion(dto.getCostoInscripcion());
        if (dto.getEstado() != null)                torneo_a_actualizar.setEstado(dto.getEstado());
        return repo.save(torneo_a_actualizar);
    }

    public String inscribirEquipo(Long idTorneo, InscripcionDTO dto) {
        Torneo torneo = getTorneo(idTorneo);
        Equipo equipo = equipoRepo.findById(dto.teamName())
            .orElseThrow(() -> new NotFoundException("Equipo con ID " + dto.teamName() + " no encontrado."));

        return inscripcionService.inscribirEquipo(torneo, equipo);
    }

    @Transactional
    public void deleteTorneo(Long id) {
        Torneo torneo_a_eliminar = getTorneo(id);
        if (torneo_a_eliminar.getEstado() != EstadoTorneo.ABIERTO) {
            throw new TorneoNotEditableException(id);
        }
        repo.delete(torneo_a_eliminar);
    }
}
