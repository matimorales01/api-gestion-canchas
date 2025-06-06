package ar.uba.fi.ingsoft1.todo_template.reserva;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaDTO;


@RestController
@RequestMapping("/reservas")
public class ReservaRestController {

    private final ReservaService reservaService;

    public ReservaRestController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<String> crearReserva(@Valid @RequestBody ReservaCreateDTO dto) {
        return reservaService.crearReservas(dto);
    }

    @GetMapping
    public ResponseEntity<List<ReservaDTO>> obtenerReserva() {
        return ResponseEntity.ok(reservaService.obtenerReserva());
    }
}
