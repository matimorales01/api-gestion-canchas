package ar.uba.fi.ingsoft1.todo_template.canchas;

import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.CanchaAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.UserNotFoundException;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaDTO;

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
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User propietario = userRepo.findByUsername(username).orElseThrow(() -> new UserNotFoundException("Usuario '" + username + "' no encontrado."));
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
}
