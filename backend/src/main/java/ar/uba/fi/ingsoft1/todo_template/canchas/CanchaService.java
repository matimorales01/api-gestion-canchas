package ar.uba.fi.ingsoft1.todo_template.canchas;

import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.CanchaAlreadyExistsException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.UserNotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import ar.uba.fi.ingsoft1.todo_template.common.exception.CanchaConReservasFuturasException;

import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaEditDTO;

import ar.uba.fi.ingsoft1.todo_template.partido.PartidoRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CanchaService {
    private final CanchaRepository canchaRepo;
    private final UserRepository userRepo;
    private final PartidoRepository partidoRepo;

    public CanchaService(
        CanchaRepository canchaRepo,
        UserRepository userRepo,
        PartidoRepository partidoRepo
    ) {
        this.canchaRepo = canchaRepo;
        this.userRepo   = userRepo;
        this.partidoRepo = partidoRepo;
    }

    public CanchaDTO crearCancha(CanchaCreateDTO dto) {
        if (canchaRepo.existsByNombreAndZonaAndDireccion(
                dto.nombre(), dto.zona(), dto.direccion())) {
            throw new CanchaAlreadyExistsException(
                dto.nombre(), dto.zona(), dto.direccion()
            );
        }
        
        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
        String email = userInfo.email();

        User propietario = userRepo.findByEmail(email)
            .orElseThrow(() ->
                new UserNotFoundException("Usuario con email: '" + email + "' no encontrado.")
            );

        Cancha cancha = dto.asCancha(propietario);
        canchaRepo.save(cancha);

        return cancha.toDTO();
    }

    public List<CanchaDTO> listarCanchas() {
        return canchaRepo.findAll().stream()
                .filter(Cancha::getActiva)
                .map(Cancha::toDTO)
                .collect(Collectors.toList());
    }

    public List<CanchaDTO> listarTodasLasCanchas() {
        return canchaRepo.findAll().stream()
                .map(Cancha::toDTO)
                .collect(Collectors.toList());
    }

    public CanchaDTO obtenerCancha(Long id) {
        Cancha cancha = canchaRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Cancha con id " + id + " no encontrada."));
        return cancha.toDTO();
    }

    public CanchaDTO editarCancha(Long id, CanchaEditDTO dto) {
        Cancha cancha = canchaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cancha no encontrada"));

        if (dto.getNombre() != null) cancha.setNombre(dto.getNombre());
        if (dto.getDireccion() != null) cancha.setDireccion(dto.getDireccion());
        if (dto.getTipoCesped() != null) cancha.setTipoCesped(dto.getTipoCesped());
        if (dto.getIluminacion() != null) cancha.setIluminacion(dto.getIluminacion());
        if (dto.getZona() != null) cancha.setZona(dto.getZona());
        if (dto.getActiva() != null) cancha.setActiva(dto.getActiva());

        canchaRepo.save(cancha);

        return cancha.toDTO();
    }

    public void eliminarCancha(Long id) {
        Cancha cancha = canchaRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Cancha con id " + id + " no encontrada."));

        String hoyStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        boolean abiertoFuturo = partidoRepo.existsPartidoAbiertoFuturoPorCancha(id, hoyStr);
        boolean cerradoFuturo = partidoRepo.existsPartidoCerradoFuturoPorCancha(id, hoyStr);
        if (abiertoFuturo || cerradoFuturo) {
            throw new CanchaConReservasFuturasException(id);
        }

        cancha.setActiva(false);
        canchaRepo.save(cancha);

        // No se a que se refiere si liberar franjas es algo relacionado con la cancha
        // Si se refiere a eliminar las reservas de la cancha o que
    }
}
