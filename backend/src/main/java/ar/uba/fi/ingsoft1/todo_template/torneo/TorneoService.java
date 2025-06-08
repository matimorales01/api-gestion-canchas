package ar.uba.fi.ingsoft1.todo_template.torneo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.TorneoAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.TorneoNotEditableException;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoUpdateDTO;
import java.util.List;

@Service
public class TorneoService {
    private final TorneoRepository torneoRepo;
    private final UserRepository userRepo;

    public TorneoService(TorneoRepository torneoRepo, UserRepository userRepo) {
        this.torneoRepo = torneoRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public Torneo createTorneo(TorneoCreateDTO dto) {
        Torneo torneoACrear = dto.asTorneo();
        if (torneoRepo.existsByName(torneoACrear.getName())) {
            throw new TorneoAlreadyExistsException(torneoACrear.getName());
        }

        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
        String email = userInfo.email();
        User organizer = userRepo.findByEmail(email)
            .orElseThrow(() ->
                new NotFoundException("Usuario con email '" + email + "' no encontrado.")
            );
        torneoACrear.setOrganizer(organizer);

        return torneoRepo.save(torneoACrear);
    }

    @Transactional(readOnly = true)
    public List<Torneo> listTorneos() {
        return torneoRepo.findAll();
    }

    @Transactional(readOnly = true)
    public Torneo getTorneo(Long id) {
        return torneoRepo.findById(id)
            .orElseThrow(() ->
                new NotFoundException("Torneo con id " + id + " no encontrado.")
            );
    }

    @Transactional
    public Torneo updateTorneo(Long id, TorneoUpdateDTO dto) {
        Torneo t = getTorneo(id);
        if (t.getState() != EstadoTorneo.ABIERTO) {
            throw new TorneoNotEditableException(id);
        }
        if (dto.getName() != null && !dto.getName().equals(t.getName())) {
            if (torneoRepo.existsByName(dto.getName())) {
                throw new TorneoAlreadyExistsException(dto.getName());
            }
            t.setName(dto.getName());
        }
        if (dto.getStartDate() != null)       t.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null)         t.setEndDate(dto.getEndDate());
        if (dto.getFormat() != null)          t.setFormat(dto.getFormat());
        if (dto.getMaxTeams() != null)        t.setMaxTeams(dto.getMaxTeams());
        if (dto.getDescription() != null)     t.setDescription(dto.getDescription());
        if (dto.getPrizes() != null)          t.setPrizes(dto.getPrizes());
        if (dto.getRegistrationFee() != null) t.setRegistrationFee(dto.getRegistrationFee());
        if (dto.getState() != null)           t.setState(dto.getState());

        return torneoRepo.save(t);
    }

    @Transactional
    public void deleteTorneo(Long id) {
        Torneo t = getTorneo(id);
        if (t.getState() != EstadoTorneo.ABIERTO) {
            throw new TorneoNotEditableException(id);
        }
        torneoRepo.delete(t);
    }
}
