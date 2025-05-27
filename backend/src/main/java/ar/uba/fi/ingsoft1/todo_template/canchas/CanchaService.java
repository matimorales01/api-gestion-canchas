package ar.uba.fi.ingsoft1.todo_template.canchas;

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.CanchaAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.UserNotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CanchaService {
    private final CanchaRepository canchaRepo;
    private final UserRepository userRepo;

    public CanchaService(CanchaRepository canchaRepo, UserRepository userRepo) {
        this.canchaRepo = canchaRepo;
        this.userRepo   = userRepo;
    }

    public CanchaDTO crearCancha(CanchaCreateDTO dto) {
        if (canchaRepo.existsByNombreAndZonaAndDireccion(
                dto.getNombre(), dto.getZona(), dto.getDireccion())) {
            throw new CanchaAlreadyExistsException(
                dto.getNombre(), dto.getZona(), dto.getDireccion()
            );
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            String p = principal.toString();
            int start = p.indexOf("username=") + "username=".length();
            int end   = p.indexOf(",", start);
            if (start > 0 && end > start) {
                email = p.substring(start, end);
            } else {
                email = auth.getName();
            }
        }

        User propietario = userRepo.findByEmail(email)
            .orElseThrow(() ->
                new UserNotFoundException("Usuario con email: '" + email + "' no encontrado.")
            );


        Cancha cancha = new Cancha();
        cancha.setNombre(dto.getNombre());
        cancha.setTipoCesped(dto.getTipoCesped());
        cancha.setIluminacion(dto.isIluminacion());
        cancha.setZona(dto.getZona());
        cancha.setDireccion(dto.getDireccion());
        cancha.setPropietario(propietario);

        Cancha guardada = canchaRepo.save(cancha);

        CanchaDTO out = new CanchaDTO();
        out.setId(guardada.getId());
        out.setNombre(guardada.getNombre());
        out.setTipoCesped(guardada.getTipoCesped());
        out.setIluminacion(guardada.isIluminacion());
        out.setZona(guardada.getZona());
        out.setDireccion(guardada.getDireccion());
        out.setPropietarioId(propietario.getId());

        return out;
    }

    public List<CanchaDTO> listarCanchas() {
        return canchaRepo.findAll().stream()
            .map(cancha -> {
                CanchaDTO dto = new CanchaDTO();
                dto.setId(cancha.getId());
                dto.setNombre(cancha.getNombre());
                dto.setTipoCesped(cancha.getTipoCesped());
                dto.setIluminacion(cancha.isIluminacion());
                dto.setZona(cancha.getZona());
                dto.setDireccion(cancha.getDireccion());
                dto.setPropietarioId(cancha.getPropietario().getId());
                return dto;
            })
            .collect(Collectors.toList());
    }

    public CanchaDTO obtenerCancha(Long id) {
        Cancha cancha = canchaRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Cancha con id " + id + " no encontrada."));
        CanchaDTO dto = new CanchaDTO();
        dto.setId(cancha.getId());
        dto.setNombre(cancha.getNombre());
        dto.setTipoCesped(cancha.getTipoCesped());
        dto.setIluminacion(cancha.isIluminacion());
        dto.setZona(cancha.getZona());
        dto.setDireccion(cancha.getDireccion());
        dto.setPropietarioId(cancha.getPropietario().getId());
        return dto;
    }
}
