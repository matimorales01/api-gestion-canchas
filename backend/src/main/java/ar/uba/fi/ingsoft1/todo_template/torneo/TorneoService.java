package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.LocalDate;
import java.util.List;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.TorneoAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.TorneoNotEditableException;
import ar.uba.fi.ingsoft1.todo_template.partido.PartidoRepository;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoUpdateDTO;

@Service
public class TorneoService {
    private final TorneoRepository repo;
    private final UserRepository userRepo;
    private final PartidoRepository partidoRepo;

    public TorneoService(
        TorneoRepository repo,
        UserRepository userRepo,
        PartidoRepository partidoRepo
    ) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.partidoRepo = partidoRepo;
    }

    @Transactional
    public Torneo createTorneo(TorneoCreateDTO dto) {
        if (repo.existsByNombre(dto.nombre())) {
            throw new TorneoAlreadyExistsException(dto.nombre());
        }
        JwtUserDetails ud = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        User organizador = userRepo.findByEmail(ud.email())
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
        Torneo t = getTorneo(id);
        JwtUserDetails ud = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        if (!t.getOrganizador().getEmail().equals(ud.email())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el organizador puede editar este torneo.");
        }
        LocalDate inicio = dto.getFechaInicio() != null ? dto.getFechaInicio() : t.getFechaInicio();
        LocalDate fin    = dto.getFechaFin()    != null ? dto.getFechaFin()    : t.getFechaFin();
        if (fin != null && fin.isBefore(inicio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de fin debe ser posterior a la de inicio.");
        }
        if (dto.getNombre() != null && !dto.getNombre().equals(t.getNombre())) {
            if (repo.existsByNombre(dto.getNombre())) {
                throw new TorneoAlreadyExistsException(dto.getNombre());
            }
            t.setNombre(dto.getNombre());
        }
        if (dto.getFormato() != null && dto.getFormato() != t.getFormato()) {
            if (t.getEstado() != EstadoTorneo.ABIERTO) {
                throw new TorneoNotEditableException(id);
            }
            t.setFormato(dto.getFormato());
        }
        if (dto.getFechaInicio() != null)           t.setFechaInicio(dto.getFechaInicio());
        if (dto.getFechaFin() != null)              t.setFechaFin(dto.getFechaFin());
        if (dto.getCantidadMaximaEquipos() != null) t.setCantidadMaximaEquipos(dto.getCantidadMaximaEquipos());
        if (dto.getDescripcion() != null)           t.setDescripcion(dto.getDescripcion());
        if (dto.getPremios() != null)               t.setPremios(dto.getPremios());
        if (dto.getCostoInscripcion() != null)      t.setCostoInscripcion(dto.getCostoInscripcion());
        if (dto.getEstado() != null)                t.setEstado(dto.getEstado());
        return repo.save(t);
    }

    @Transactional
    public void deleteTorneo(Long id, boolean confirm) {
        if (!confirm) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe confirmar la eliminación del torneo.");
        }
        Torneo t = getTorneo(id);
        JwtUserDetails ud = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        if (!t.getOrganizador().getEmail().equals(ud.email())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el organizador puede eliminar este torneo.");
        }
        if (t.getEstado() != EstadoTorneo.ABIERTO) {
            throw new TorneoNotEditableException(id);
        }
        if (partidoRepo.existsByTorneoAndResultadoIsNotNull(t)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "No se puede eliminar un torneo con partidos con resultados registrados."
            );
        }
        repo.delete(t);
    }
}
