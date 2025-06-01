package ar.uba.fi.ingsoft1.todo_template.equipo;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoDTO;

@RestController
@RequestMapping("/equipos")
public class EquipoRestController {

    private final EquipoService equipoService;

    public EquipoRestController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    @PostMapping(produces = "application/json")
    @Operation(summary = "Crear un nuevo equipo")
    public ResponseEntity<EquipoDTO> crearEquipo(
            @Valid @NonNull @RequestBody EquipoCreateDTO equipoDTO
    ) {
        EquipoDTO equipoCreado = equipoService.crearEquipo(equipoDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
            .header("Message", "Equipo creado exitosamente")
            .body(equipoCreado);
    }
}
