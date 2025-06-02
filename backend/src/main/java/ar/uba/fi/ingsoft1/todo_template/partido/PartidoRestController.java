package ar.uba.fi.ingsoft1.todo_template.partido;

import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoAbiertoCreateDTO;
import ar.uba.fi.ingsoft1.todo_template.partido.dtos.PartidoCerradoCreateDTO;

@RestController
@RequestMapping("/partidos")

public class PartidoRestController {

    private final PartidoService partidoService;

    public PartidoRestController(PartidoService partidoService) {
        this.partidoService = partidoService;
    }

    @Operation(summary = "Crear un partido abierto")
    @PostMapping("/abierto")    
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PartidoResponseDTO>crearAbierto(@Valid @RequestBody PartidoAbiertoCreateDTO dto) {
        Partido partido=partidoService.crearPartidoAbierto(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location","/partidos/" +partido.getIdPartido())
                .body(PartidoResponseDTO.fromEntity(partido));
    }

    @Operation(summary = "Crear un partido cerrado")
    @PostMapping("/cerrado")    
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PartidoResponseDTO>crearCerrado(@Valid @RequestBody PartidoCerradoCreateDTO dto) {
        Partido partido=partidoService.crearPartidoCerrado(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location","/partidos/" +partido.getIdPartido())
                .body(PartidoResponseDTO.fromEntity(partido));
    }
    

    @Operation(summary = "Listar todos los partidos abiertos")
    @GetMapping("/abiertos")
    public ResponseEntity<List<PartidoAbiertoResponseDTO>> listarPartidosAbiertos(){
        List<PartidoAbiertoResponseDTO> lista = partidoService
                                                .obtenerPartidoAbiertos()
                                                .stream()
                                                .map(PartidoAbiertoResponseDTO :: fromEntity)
                                                .toList();
        return ResponseEntity.ok(lista);
    } 

    @Operation(summary = "Listar todos los partidos cerrados")
    @GetMapping("/cerrados")
    public ResponseEntity<List<PartidoCerradoResponseDTO>> listarPartidosCerrados(){
        List<PartidoCerradoResponseDTO> lista = partidoService
                                                .obtenerPartidoCerrados()
                                                .stream()
                                                .map(PartidoCerradoResponseDTO :: fromEntity)
                                                .toList();
        return ResponseEntity.ok(lista);
    } 

    @Operation(summary = "Listar todo los partidos por idUser")
    @GetMapping("/historial/{userId}")
    public ResponseEntity<Map<String, List<?>>> historialUsuario(@PathVariable Long userId){
        List<PartidoAbiertoResponseDTO>abiertosPartidos=partidoService.historialPartidosAbiertosPorUsuario(userId)
            .stream()
            .map(PartidoAbiertoResponseDTO :: fromEntity)
            .toList();
        
        List<PartidoCerradoResponseDTO>cerradosPartidos=partidoService.historialPartidosCerradosPorUsuario(userId)
            .stream()
            .map(PartidoCerradoResponseDTO :: fromEntity)
            .toList();

        return ResponseEntity.ok(Map.of(
            "Partidos_Cerrados" , cerradosPartidos,
            "Partidos_Abriertos", abiertosPartidos
        ));
    }
}
