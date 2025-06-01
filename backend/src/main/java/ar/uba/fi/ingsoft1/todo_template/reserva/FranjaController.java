package ar.uba.fi.ingsoft1.todo_template.reserva;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import ar.uba.fi.ingsoft1.todo_template.canchas.CanchaRepository;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;

@RestController
@RequestMapping("/franjas")
public class FranjaController {

    private final FranjaDisponibleRepository franjaRepo;
    private final CanchaRepository canchaRepo;

    public FranjaController(
        FranjaDisponibleRepository franjaRepo,
        CanchaRepository canchaRepo
    ) {
        this.franjaRepo = franjaRepo;
        this.canchaRepo = canchaRepo;
    }

    @GetMapping
    public ResponseEntity<List<FranjaDisponible>> listarFranjas(
            @RequestParam Long canchaId,
            @RequestParam String fecha
    ) {
        LocalDate f = LocalDate.parse(fecha);
        List<FranjaDisponible> franjas = franjaRepo.findByCanchaIdAndFechaAndEstado(
            canchaId, f, EstadoFranja.DISPONIBLE
        );
        return ResponseEntity.ok(franjas);
    }

    @PostMapping("/poblar")
    public ResponseEntity<String> poblarFranjas(
            @RequestParam Long canchaId,
            @RequestParam String desde,
            @RequestParam String hasta,
            @RequestParam String horaInicio,
            @RequestParam String horaFin,
            @RequestParam Integer duracionMinutos
    ) {
        ar.uba.fi.ingsoft1.todo_template.canchas.Cancha cancha = canchaRepo.findById(canchaId)
            .orElseThrow(() -> new NotFoundException("Cancha no encontrada"));

        LocalDate fechaDesde = LocalDate.parse(desde);
        LocalDate fechaHasta = LocalDate.parse(hasta);
        LocalTime hi = LocalTime.parse(horaInicio);
        LocalTime hf = LocalTime.parse(horaFin);

        for (LocalDate dia = fechaDesde; !dia.isAfter(fechaHasta); dia = dia.plusDays(1)) {
            LocalTime actual = hi;
            while (!actual.plusMinutes(duracionMinutos).isAfter(hf)) {
                FranjaDisponible franja = new FranjaDisponible();
                franja.setCancha(cancha);
                franja.setFecha(dia);
                franja.setHoraInicio(actual);
                franja.setHoraFin(actual.plusMinutes(duracionMinutos));
                franja.setEstado(EstadoFranja.DISPONIBLE);
                franjaRepo.save(franja);
                actual = actual.plusMinutes(duracionMinutos);
            }
        }
        return ResponseEntity.ok("Franjas generadas");
    }
}
