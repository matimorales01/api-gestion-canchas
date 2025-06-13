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
    private final TorneoRepository torneoRepo;
    private final UserRepository userRepo;
    private final PartidoRepository partidoRepo;

    public TorneoService(
        TorneoRepository torneoRepo,
        UserRepository userRepo,
        PartidoRepository partidoRepo
    ) {
        this.torneoRepo = torneoRepo;
        this.userRepo = userRepo;
        this.partidoRepo = partidoRepo;
    }

    @Transactional
    public Torneo createTorneo(TorneoCreateDTO dto_de_creacion) {
        if (torneoRepo.existsByNombre(dto_de_creacion.nombre())) {
            throw new TorneoAlreadyExistsException(dto_de_creacion.nombre());
        }
        JwtUserDetails user_details = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        User organizador = userRepo.findByEmail(user_details.email())
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado."));
        Torneo torneo = dto_de_creacion.asTorneo();
        torneo.setOrganizador(organizador);
        return torneoRepo.save(torneo);
    }

    @Transactional(readOnly = true)
    public List<Torneo> listTorneos() {
        return torneoRepo.findAll();
    }

    @Transactional(readOnly = true)
    public Torneo getTorneo(Long id_de_torneo) {
        return torneoRepo.findById(id_de_torneo)
            .orElseThrow(() -> new NotFoundException("Torneo con id_de_torneo " + id_de_torneo + " no encontrado."));
    }

    @Transactional
    public Torneo updateTorneo(Long id_de_torneo, TorneoUpdateDTO dto) {
        Torneo torneo = getTorneo(id_de_torneo);
        JwtUserDetails user_details = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        if (!torneo.getOrganizador().getEmail().equals(user_details.email())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el organizador puede editar este torneo.");
        }
        LocalDate inicio = dto.getFechaInicio() != null ? dto.getFechaInicio() : torneo.getFechaInicio();
        LocalDate fin    = dto.getFechaFin()    != null ? dto.getFechaFin()    : torneo.getFechaFin();
        if (fin != null && fin.isBefore(inicio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de fin debe ser posterior a la de inicio.");
        }
        if (dto.getNombre() != null && !dto.getNombre().equals(torneo.getNombre())) {
            if (torneoRepo.existsByNombre(dto.getNombre())) {
                throw new TorneoAlreadyExistsException(dto.getNombre());
            }
            torneo.setNombre(dto.getNombre());
        }
        if (dto.getFormato() != null && dto.getFormato() != torneo.getFormato()) {
            if (torneo.getEstado() != EstadoTorneo.ABIERTO) {
                throw new TorneoNotEditableException(id_de_torneo);
            }
            torneo.setFormato(dto.getFormato());
        }
        if (dto.getFechaInicio() != null)           torneo.setFechaInicio(dto.getFechaInicio());
        if (dto.getFechaFin() != null)              torneo.setFechaFin(dto.getFechaFin());
        if (dto.getCantidadMaximaEquipos() != null) torneo.setCantidadMaximaEquipos(dto.getCantidadMaximaEquipos());
        if (dto.getDescripcion() != null)           torneo.setDescripcion(dto.getDescripcion());
        if (dto.getPremios() != null)               torneo.setPremios(dto.getPremios());
        if (dto.getCostoInscripcion() != null)      torneo.setCostoInscripcion(dto.getCostoInscripcion());
        if (dto.getEstado() != null)                torneo.setEstado(dto.getEstado());
        return torneoRepo.save(torneo);
    }

    @Transactional
    public void deleteTorneo(Long id_a_eliminar, boolean confirm) {
        if (!confirm) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe confirmar la eliminación del torneo.");
        }
        Torneo torneo = getTorneo(id_a_eliminar);
        JwtUserDetails user_details = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        if (!torneo.getOrganizador().getEmail().equals(user_details.email())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el organizador puede eliminar este torneo.");
        }
        if (torneo.getEstado() != EstadoTorneo.ABIERTO) {
            throw new TorneoNotEditableException(id_a_eliminar);
        }
        if (partidoRepo.existsByTorneoAndResultadoIsNotNull(torneo)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "No se puede eliminar un torneo con partidos con resultados registrados."
            );
        }
        torneoRepo.delete(torneo);
    }
}
