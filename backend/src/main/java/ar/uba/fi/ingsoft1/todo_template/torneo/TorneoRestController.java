package ar.uba.fi.ingsoft1.todo_template.torneo;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.apache.catalina.connector.Response;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import ar.uba.fi.ingsoft1.todo_template.config.security.JwtUserDetails;
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

    @PatchMapping("/iniciar/{nombreTorneo}")
    public ResponseEntity<String> iniciarTorneo(
        @PathVariable String nombreTorneo
    ) {
        service.iniciarTorneo(nombreTorneo);
        return ResponseEntity.ok("Torneo iniciado exitosamente");
    }

    @PatchMapping("/finalizar/{nombreTorneo}")
    public ResponseEntity<String> finalizarTorneo(
        @PathVariable String nombreTorneo
    ) {
        service.finalizarTorneo(nombreTorneo);
        return ResponseEntity.ok("Torneo finalizado exitosamente");
    }

    @GetMapping
    public ResponseEntity<List<TorneoDTO>> all() {
        List<TorneoDTO> lista = service.listTorneos().stream().map(Torneo::toDTO).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/mis-torneos")
    public ResponseEntity<List<TorneoDTO>> misTorneos() {
        
        JwtUserDetails userDetails = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();
        
        List<TorneoDTO> lista = service.listTorneosPorOrganizador(userDetails.email());
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<TorneoDTO> create(@Valid @RequestBody TorneoCreateDTO dto) {
        JwtUserDetails userDetails = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();

        Torneo creado = service.createTorneo(dto, userDetails.email());
        return ResponseEntity.status(HttpStatus.CREATED).body(creado.toDTO());
    }

    @PutMapping("/{nombreTorneo}")
    public ResponseEntity<TorneoDTO> edit(
        @PathVariable String nombreTorneo,
        @Valid @RequestBody TorneoUpdateDTO dto
    ) {
        JwtUserDetails user = (JwtUserDetails) SecurityContextHolder
            .getContext().getAuthentication().getPrincipal();

        Torneo actualizado = service.updateTorneo(nombreTorneo, dto, user.email());

        return ResponseEntity.ok()
            .header("X-Success-Message", "Cambios guardados exitosamente")
            .body(actualizado.toDTO());
    }

    @DeleteMapping("/{nombreTorneo}")
    public ResponseEntity<Void> delete(
        @PathVariable String nombreTorneo
    ) {
        service.deleteTorneo(nombreTorneo);

        return ResponseEntity.noContent().build();
    }
}
