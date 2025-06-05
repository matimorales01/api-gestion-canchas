package ar.uba.fi.ingsoft1.todo_template.reserva;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.ReservacionHorarioCanchaCoincideException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepo;
    private final FranjaDisponibleRepository franjaRepo;
    private final CanchaRepository canchaRepo;
    private final UserRepository userRepo;

    public ReservaService(
        ReservaRepository reservaRepo,
        FranjaDisponibleRepository franjaRepo,
        CanchaRepository canchaRepo,
        UserRepository userRepo
    ) {
        this.reservaRepo = reservaRepo;
        this.franjaRepo = franjaRepo;
        this.canchaRepo = canchaRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public Reserva crearReserva(Long userId, ReservaCreateDTO dto) throws ReservacionHorarioCanchaCoincideException {
        canchaRepo.findById(dto.canchaId())
                .orElseThrow(() -> new NotFoundException("Cancha con id " + dto.canchaId() + " no encontrada."));


        User usuario = userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario con id " + userId + " no encontrado."));

        LocalDate fecha = dto.fecha();
        LocalTime inicio = dto.horaInicio();
        LocalTime fin = dto.horaFin();

        FranjaDisponible franja = franjaRepo.findByCanchaIdAndFechaAndHoraInicioAndHoraFin(
                dto.canchaId(), fecha, inicio, fin
        );
        if (franja == null) {
            throw new NotFoundException("No existe franja para cancha " + dto.canchaId() +
                    " en " + fecha + " " + inicio + "-" + fin);
        }
        if (franja.getEstado() == EstadoFranja.OCUPADA) {
            throw new ReservacionHorarioCanchaCoincideException("Franja ya ocupada");
        }

        franja.setEstado(EstadoFranja.OCUPADA);
        franjaRepo.save(franja);

        Reserva r = new Reserva();
        r.setCancha(franja.getCancha());
        r.setFecha(franja.getFecha());
        r.setHoraInicio(franja.getHoraInicio());
        r.setHoraFin(franja.getHoraFin());
        r.setUsuario(usuario);
        reservaRepo.save(r);

        return r;
    }

    public ReservaDTO obtenerReserva() {
        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();

        User user = userRepo.findByEmail(userInfo.email())
            .orElseThrow(() -> new NotFoundException("Usuario con email: '" + userInfo.email() + "' no encontrado."));
            
        return reservaRepo.findByUserId(user.getId())
            .map(Reserva::toReservaDTO)
            .orElseThrow(() -> new NotFoundException("No se encontraron reservas para el usuario con email: '" + userInfo.email() + "'."));    }
}
