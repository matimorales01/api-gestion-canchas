package ar.uba.fi.ingsoft1.todo_template.reserva;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;

import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;
import ar.uba.fi.ingsoft1.todo_template.canchas.Cancha;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.ReservacionHorarioCanchaCoincideException;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepo;
    private final CanchaRepository canchaRepo;

    public ReservaService(ReservaRepository reservaRepo, CanchaRepository canchaRepo) {
        this.reservaRepo = reservaRepo;
        this.canchaRepo = canchaRepo;
    }

    @Transactional
    public Reserva crearReserva(ReservaCreateDTO dto) throws ReservacionHorarioCanchaCoincideException {
        Cancha cancha = canchaRepo.findById(dto.canchaId())
            .orElseThrow(() -> new NotFoundException("Cancha con id " + dto.canchaId() + " no encontrada."));

        LocalDate fecha = dto.fecha();
        LocalTime inicio = dto.horaInicio();
        LocalTime fin = dto.horaFin();

        boolean solapa = reservaRepo.existsByCanchaIdAndFechaAndHoraInicioLessThanAndHoraFinGreaterThan(
            dto.canchaId(), fecha, fin, inicio
        );
        if (solapa) {
            throw new ReservacionHorarioCanchaCoincideException("Ya existe reserva en ese horario para cancha " + dto.canchaId());
        }

        Reserva r = new Reserva();
        r.setCancha(cancha);
        r.setFecha(fecha);
        r.setHoraInicio(inicio);
        r.setHoraFin(fin);
        reservaRepo.save(r);

        return r;
    }
}
