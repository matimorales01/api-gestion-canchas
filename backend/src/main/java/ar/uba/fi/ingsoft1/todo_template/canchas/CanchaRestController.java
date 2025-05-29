package ar.uba.fi.ingsoft1.todo_template.canchas;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaDTO;
import ar.uba.fi.ingsoft1.todo_template.canchas.dto.CanchaEditDTO;

@RestController
@RequestMapping("/canchas")
public class CanchaRestController {

    private final CanchaService canchaService;

    public CanchaRestController(CanchaService canchaService) {
        this.canchaService = canchaService;
    }

    @PostMapping
    public ResponseEntity<CanchaDTO> crearCancha(@Valid @RequestBody CanchaCreateDTO dto) {
        CanchaDTO creada = canchaService.crearCancha(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @GetMapping
    public ResponseEntity<List<CanchaDTO>> listarCanchas() {
        List<CanchaDTO> listado = canchaService.listarCanchas();
        return ResponseEntity.ok(listado);
    }

    @GetMapping("/todas")
    public ResponseEntity<List<CanchaDTO>> listarTodasCanchas(){
        List<CanchaDTO> listado = canchaService.listarTodasLasCanchas();
        return ResponseEntity.ok(listado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CanchaDTO> obtenerCancha(@PathVariable Long id) {
        CanchaDTO cancha = canchaService.obtenerCancha(id);
        return ResponseEntity.ok(cancha);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CanchaDTO> editarCancha(@PathVariable Long id, @RequestBody CanchaEditDTO dto) {
        CanchaDTO editada = canchaService.editarCancha(id, dto);
        return ResponseEntity.ok(editada);
    }
}