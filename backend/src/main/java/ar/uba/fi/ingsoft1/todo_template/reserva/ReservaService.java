package ar.uba.fi.ingsoft1.todo_template.reserva;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.ReservacionHorarioCanchaCoincideException;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepo;
    private final FranjaDisponibleRepository franjaRepo;
    private final CanchaRepository canchaRepo;

    public ReservaService(
        ReservaRepository reservaRepo,
        FranjaDisponibleRepository franjaRepo,
        CanchaRepository canchaRepo
    ) {
        this.reservaRepo = reservaRepo;
        this.franjaRepo = franjaRepo;
        this.canchaRepo = canchaRepo;
    }

    @Transactional
    public Reserva crearReserva(ReservaCreateDTO dto) throws ReservacionHorarioCanchaCoincideException {
        canchaRepo.findById(dto.canchaId())
            .orElseThrow(() -> new NotFoundException("Cancha con id " + dto.canchaId() + " no encontrada."));

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
        reservaRepo.save(r);

        return r;
    }
}
