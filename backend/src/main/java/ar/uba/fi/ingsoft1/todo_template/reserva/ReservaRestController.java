package ar.uba.fi.ingsoft1.todo_template.reserva;

import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import ar.uba.fi.ingsoft1.todo_template.reserva.dto.ReservaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.common.exception.ReservacionHorarioCanchaCoincideException;
import ar.uba.fi.ingsoft1.todo_template.common.exception.NotFoundException;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/reservas")
public class ReservaRestController {

    private final ReservaService reservaService;

    public ReservaRestController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    public ResponseEntity<String> crearReserva(@Valid @RequestBody ReservaCreateDTO dto, Authentication authentication) {
        try {
            JwtUserDetails userDetails = (JwtUserDetails) authentication.getPrincipal();
            Long userId = userDetails.id().longValue();
            reservaService.crearReserva(userId, dto);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (ReservacionHorarioCanchaCoincideException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
