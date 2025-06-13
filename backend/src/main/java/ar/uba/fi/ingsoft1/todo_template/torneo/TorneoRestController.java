package ar.uba.fi.ingsoft1.todo_template.torneo;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoDTO;
import ar.uba.fi.ingsoft1.todo_template.torneo.dto.TorneoUpdateDTO;

@RestController
@RequestMapping("/torneos")
public class TorneoRestController {
    private final TorneoService service;

    public TorneoRestController(TorneoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TorneoDTO>> all() {
        List<TorneoDTO> lista = service.listTorneos().stream().map(Torneo::toDTO).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TorneoDTO> one(@PathVariable Long id) {
        return ResponseEntity.ok(service.getTorneo(id).toDTO());
    }

    @PostMapping
    public ResponseEntity<TorneoDTO> create(@Valid @RequestBody TorneoCreateDTO dto) {
        Torneo creado = service.createTorneo(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado.toDTO());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TorneoDTO> edit(
        @PathVariable Long id,
        @Valid @RequestBody TorneoUpdateDTO dto
    ) {
        Torneo actualizado = service.updateTorneo(id, dto);
        return ResponseEntity.ok()
            .header("X-Success-Message", "Cambios guardados exitosamente")
            .body(actualizado.toDTO());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Long id,
        @RequestParam(name = "confirm", defaultValue = "false") boolean confirm
    ) {
        service.deleteTorneo(id, confirm);
        return ResponseEntity.noContent().build();
    }
}
