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
    public ResponseEntity<TorneoDTO> one(@PathVariable Long id_de_torneo) {
        return ResponseEntity.ok(service.getTorneo(id_de_torneo).toDTO());
    }

    @PostMapping
    public ResponseEntity<TorneoDTO> create(@Valid @RequestBody TorneoCreateDTO dto_de_creacion) {
        Torneo creado = service.createTorneo(dto_de_creacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado.toDTO());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TorneoDTO> edit(@PathVariable Long id, @Valid @RequestBody TorneoUpdateDTO dto_de_actualizacion) {
        Torneo actualizado = service.updateTorneo(id, dto_de_actualizacion);
        //le pongo ese success message ya que es lo que se espera en el frontend de postman para ver el resultado bien
        return ResponseEntity.ok().header("X-Success-Message", "Cambios guardados exitosamente").body(actualizado.toDTO());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteTorneo(id);
        return ResponseEntity.noContent().build();
    }
}
