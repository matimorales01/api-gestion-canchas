package ar.uba.fi.ingsoft1.todo_template.reserva;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserRepository;
import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepo;
    private final CanchaRepository canchaRepo;
    private final UserRepository userRepo;

    public ReservaService(
        ReservaRepository reservaRepo,
        CanchaRepository canchaRepo,
        UserRepository userRepo
    ) {
        this.reservaRepo = reservaRepo;
        this.canchaRepo = canchaRepo;
        this.userRepo = userRepo;
    }

    public ResponseEntity<String> crearReservas(ReservaCreateDTO dto) {
        Cancha cancha = canchaRepo.findById(dto.canchaId())
            .orElseThrow(() -> new NotFoundException("Cancha con ID: '" + dto.canchaId() + "' no encontrada."));
        
        List<Reserva> reservas = new ArrayList<Reserva>();
        
        for (LocalDate fecha = dto.fechaInicial(); fecha.isAfter(dto.fechaFinal()); fecha = fecha.plusDays(1)) {
            for (LocalTime hr = dto.horarioInicio(); hr.isAfter(dto.horarioFin()); hr = hr.plusMinutes(dto.minutos())) {
                reservas.add(new Reserva(cancha, State.DISPONIBLE, Optional.empty(), Optional.empty(), fecha, hr, hr.plusMinutes(dto.minutos())));
            }
        }

        reservaRepo.saveAll(reservas);

        return ResponseEntity.status(HttpStatus.CREATED).body("Reservas creadas exitosamente.");
    }

    public List<ReservaDTO> obtenerReserva() {
        JwtUserDetails userInfo = (JwtUserDetails) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();

        User user = userRepo.findByEmail(userInfo.email())
            .orElseThrow(() -> new NotFoundException("Usuario con email: '" + userInfo.email() + "' no encontrado."));
            
        List<Cancha> canchas = canchaRepo.findByPropietarioId(user.getId());
        List<Reserva> reservas = new ArrayList<Reserva>();

        canchas.forEach(cancha -> {
            reservas.addAll(reservaRepo.findByCanchaId(cancha.getId()));
        });

        return reservas.stream().map(
            (Reserva reserva) -> new ReservaDTO(
                reserva.getId(),
                reserva.getCancha().getId(),
                reserva.getState(),
                reserva.getUsuarioCancha().map(User::getId),
                reserva.getPartido(),
                reserva.getFecha(),
                reserva.getInicioTurno(),
                reserva.getFinTurno()
            )
        ).toList();
    }
}

