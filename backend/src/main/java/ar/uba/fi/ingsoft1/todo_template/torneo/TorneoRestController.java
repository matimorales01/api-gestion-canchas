package ar.uba.fi.ingsoft1.todo_template.torneo;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
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
        List<TorneoDTO> torneos = service.listTorneos()
            .stream()
            .map(Torneo::toDTO)
            .toList();
        return ResponseEntity.ok(torneos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TorneoDTO> one(@PathVariable Long id) {
        Torneo torneo = service.getTorneo(id);
        return ResponseEntity.ok(torneo.toDTO());
    }

    @PostMapping
    public ResponseEntity<TorneoDTO> create(
        @Valid @RequestBody TorneoCreateDTO dto
    ) {
        Torneo creado = service.createTorneo(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(creado.toDTO());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TorneoDTO> update(
        @PathVariable Long id,
        @Valid @RequestBody TorneoUpdateDTO dto
    ) {
        Torneo actualizado = service.updateTorneo(id, dto);
        return ResponseEntity.ok(actualizado.toDTO());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteTorneo(id);
        return ResponseEntity.noContent().build();
    }
}
